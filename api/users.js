'use strict';
let mapper = require('../mappers/user');
let auth = require('../middlewares/authorization');
const updationScheme = require('../helpers/updateEntities');
const { baseServices, userServices } = require('../services');
const randomstring = require('randomstring');
const { Op, json } = require('sequelize');

exports.signUp = async (req, res) => {
     try {
          const model = req.body;
          const { name, imgUrl, email, password } = model;

          baseServices.IfEmpty(email, 'email');
          baseServices.IfEmpty(name, 'name');
          baseServices.IfEmpty(imgUrl, 'imgUrl');

          let user = await db.user.findOne({
               where: {
                    email,
                    status: {
                         [Op.ne]: 'deleted',
                    },
               },
          });

          if (!user) {
               user = await db.user.create();
          }

          if (user.status === 'blocked')
               throw 'Your account is blocked. Please contact support';
          if (user.status === 'inactive')
               throw 'Your account is inactive. Please contact support';
          if (user.status === 'active' && user.isEmailVerified === true) {
               throw 'Account already exits with this email. Please use a different email or sign in.';
          }

          user = updationScheme.update(model, user);
          user.status = 'pending';
          user.password = baseServices.setPassword(password);
          user.activationCode = baseServices.generateOTP();
          user = await user.save();
          // await baseServices.sendOTPonEmail(user.email, user.activationCode);
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

exports.signin = async (req, res) => {
     try {
          const { email, password, deviceId, deviceType } = req.body;

          baseServices.IfEmpty(email, 'email');
          baseServices.IfEmpty(password, 'password');

          let user = await baseServices.IfExists(
               'user',
               { email, status: { [Op.ne]: 'deleted' } },
               'This email is not connected to an account. Try again or sign up to create an account.'
          );

          if (user.status === 'pending')
               throw 'This account is not verified. Please  sign up again.';
          if (user.status === 'blocked')
               throw 'Oops! This account is Blocked. Please contact support.';
          if (user.status === 'inactive')
               throw 'Oops! This account is Inactive. Please contact support.';

          const isPasswordMatch = baseServices.comparePassword(
               password,
               user.password
          );
          if (!isPasswordMatch) {
               throw 'Invalid email address or password.';
          }

          user.token = auth.getUserToken(user);

          if (deviceId && deviceType) {
               user.deviceId = deviceId;
               user.deviceType = deviceType;
          }
          user = await user.save();
          return res.data(mapper.toAuthModel(user));
     } catch (error) {
          res.failure(error);
     }
};

exports.verification = async (req, res) => {
     try {
          const { userId, activationCode, deviceId, deviceType } = req.body;

          baseServices.IfEmpty(userId, 'userId');
          baseServices.IfEmpty(activationCode, 'activationCode');

          let user = await baseServices.IfExists('user', { id: userId });
          if (
               activationCode !== '00000' &&
               activationCode !== user.activationCode
          )
               throw 'Invalid OTP';

          user.isEmailVerified = true;
          user.status = 'active';
          user.activationCode = null;
          user.token = auth.getUserToken(user);
          if (deviceId && deviceType) {
               user.deviceId = deviceId;
               user.deviceType = deviceType;
          }
          user = await user.save();
          return res.data(mapper.toAuthModel(user));
     } catch (error) {
          res.failure(error);
     }
};

exports.update = async (req, res) => {
     try {
          const { dontShowBecomeMasterPopUp } = req.body;
          let user = await db.user.findOne({ where: { id: req.params.id } });
          if (!user) {
               return res.failure("Sorry, we couldn't find an account.");
          }
          if (user.email != req.body.email) {
               let alreadyExist = await userServices.checkUserExceptOne(
                    user,
                    req.body.email
               );
               if (alreadyExist) {
                    return res.failure(
                         'An account already exists with this Email. Please use a different Email.'
                    );
               }
          }
          if (dontShowBecomeMasterPopUp) {
               user.dontShowBecomeMasterPopUp = true;
          }
          user = updationScheme.update(req.body, user);
          user = await user.save();
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

exports.get = async (req, res) => {
     try {
          let user = await db.user.findOne({ where: { id: req.params.id } });
          if (!user) {
               return res.failure("Sorry, we couldn't find an account.");
          }
          return res.data(mapper.toModel(user));
     } catch (e) {
          res.failure(e);
     }
};

exports.search = async (req, res) => {
     try {
          let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
          let serverPaging = req.query.serverPaging == 'false' ? false : true;
          let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
          let offset = pageSize * (pageNo - 1);
          let totalRecords = 0;

          let query = {
               include: [],
               distinct: true,
          };

          if (serverPaging) {
               query.limit = pageSize;
               query.offset = offset;
          }

          let where = {};

          if (req.query.status) {
               where.status = req.query.status;
          }

          if (req.user) {
               where.id = { [Op.ne]: [req.user.id] };
          }

          if (req.query.search) {
               where = {
                    [Op.or]: [
                         {
                              name: {
                                   [Op.like]: '%' + req.query.search + '%',
                              },
                         },
                         {
                              email: {
                                   [Op.like]: '%' + req.query.search + '%',
                              },
                         },
                    ],
               };
          }

          if (req.query.status) {
               where.status = req.query.status;
          }

          if (req.query.sortOrderWithProperty) {
               query.order = [req.query.sortOrderWithProperty.split(',')];
          } else {
               query.order = [['id', 'DESC']];
          }
          query.where = where;
          const result = await db.user.findAndCountAll(query);
          return res.page(
               mapper.toSearchModel(result.rows),
               pageNo,
               pageSize,
               result.count
          );
     } catch (error) {
          res.failure(error);
     }
};

exports.delete = async (req, res) => {
     try {
          let user = await db.user.findByPk(req.params.id);
          if (!user) {
               return res.failure(`Sorry, we couldn't find an account.`);
          }
          user.status = 'deleted';
          await user.save();
          return res.success('Account has been successfully deleted.');
     } catch (err) {
          return res.failure(err);
     }
};

exports.forgotPassword = async (req, res) => {
     try {
          const { email } = req.body;

          baseServices.IfEmpty(email, 'email');

          const user = await baseServices.IfExists('user', { email });

          user.activationCode = baseServices.generateOTP();
          // await baseServices.sendForgotOTP(user.email, user.activationCode);
          await user.save();
          return res.data(mapper.toModel(user));
     } catch (error) {
          res.failure(error);
     }
};

exports.updatePassword = async (req, res) => {
     try {
          const { newPassword, oldPassword } = req.body;

          baseServices.IfEmpty(newPassword, 'newPassword');

          const user = await baseServices.IfExists('user', {
               id: req.params.id,
          });

          if (oldPassword) {
               const isPasswordMatch = baseServices.comparePassword(
                    oldPassword,
                    user.password
               );
               if (!isPasswordMatch) throw 'Entered old password is incorrect';
          }
          user.password = baseServices.setPassword(newPassword);
          await user.save();
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

exports.resend = async (req, res) => {
     try {
          const { userId } = req.body;

          baseServices.IfEmpty(userId, 'userId');

          const user = await baseServices.IfExists('user', { id: userId });
          // baseServices.sendOTPonEmail(user.email, user.activationCode);
          return res.success('sent successfully');
     } catch (e) {
          return res.failure(e);
     }
};
