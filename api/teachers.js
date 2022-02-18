'use strict';
const { baseServices } = require('../services');
const { Op } = require('sequelize');
const updationScheme = require('../helpers/updateEntities');
const mapper = require('../mappers/teacher');
const teacher = require('../models/teacher');

exports.signup = async (req, res) => {
     try {
          var model = req.body;
          var { name, imgURL, email, password } = model;

          baseServices.IfEmpty(name, 'Name');
          baseServices.IfEmpty(email, 'Email');
          baseServices.IfEmpty(password, 'Password');
          baseServices.IfEmpty(imgURL, 'Image URL');

          let teacher = await db.teacher.findOne({
               where: {
                    email,
                    status: {
                         [Op.ne]: 'deleted',
                    },
               },
          });

          if (!teacher) {
               teacher = await db.teacher.create();
          }

          if (teacher.status == 'blocked') throw 'Your account is blocked';
          if (teacher.status == 'inactive') throw 'Your account is inactive';
          if (teacher.status == 'active' && teacher.isEmailVerified == true)
               throw 'Your already have an account. Please login.';

          teacher = updationScheme.update(model, teacher);
          teacher.status = 'pending';
          teacher.password = baseServices.setPassword(password);
          teacher = await teacher.save();
          return res.data(mapper.toModel(teacher));
     } catch (error) {
          res.failure(error);
     }
};

exports.verify = async (req, res) => {
     try {
          const model = req.params;
          const { teacherId } = model;

          baseServices.IfEmpty(teacherId, 'Teacher ID');

          let teacher = await baseServices.IfExists('teacher', {
               id: teacherId,
               status: { [Op.ne]: 'deleted' },
          });

          if (teacher.status === 'active') throw 'Account is already active';
          teacher.status = 'active';
          teacher.isEmailVerified = true;
          await teacher.save();
          res.data('Account Verified successfully!!');
     } catch (error) {
          res.failure(error);
     }
};

exports.delete = async (req, res) => {
     try {
          const model = req.params;
          const { id } = model;

          baseServices.IfEmpty(id, 'ID');

          let teacher = await baseServices.IfExists('teacher', { id: id });
          if (!teacher) throw "Teacher ID doesn't exist";

          teacher.status = 'deleted';
          teacher = await teacher.save();
          return res.data(mapper.toModel(teacher));
     } catch (error) {
          res.failure(error);
     }
};

exports.searchOne = async (req, res) => {
     try {
          const model = req.body;
          const { email } = model;

          baseServices.IfEmpty(email, 'Email');

          let teacher = await baseServices.IfExists('teacher', {
               email: email,
          });

          if (!teacher) throw 'Teacher not found';

          return res.data(mapper.toModel(teacher));
     } catch (error) {
          res.failure(error);
     }
};

exports.signin = async (req, res) => {
     try {
          const model = req.body;
          const { email, password } = model;

          baseServices.IfEmpty(email, 'Email');
          baseServices.IfEmpty(password, 'Password');

          let teacher = await baseServices.IfExists('teacher', {
               status: { [Op.ne]: 'deleted' },
               email,
          });

          if (!teacher) throw 'Wrong Credentials!!';

          if (teacher.status == 'pending')
               throw 'Your account is not verified yet!!';
          if (teacher.status == 'blocked') throw 'Your account is blocked!!';
          if (teacher.status == 'inactive') throw 'Your account is inactive!!';

          let comparepass = baseServices.comparePassword(
               password,
               teacher.password
          );

          if (!comparepass) throw 'You have entered invalid password!!';

          res.data('Logged in successfully!!');
     } catch (error) {
          res.failure(error);
     }
};

exports.forgotpassword = async (req, res) => {
     try {
          const model = req.body;
          const { id, email, newpass } = model;

          baseServices.IfEmpty(id, 'ID');
          baseServices.IfEmpty(email, 'Email');
          baseServices.IfEmpty(newpass, 'New Password');

          let teacher = await baseServices.IfExists('teacher', {
               id: id,
               email: email,
          });

          if (!teacher) throw 'Cannot find teacher with this credentials';
          if (teacher.status === 'pending')
               throw 'Please activate your account first!!';
          let encryptpass = baseServices.setPassword(newpass);
          teacher.password = encryptpass;
          res.data(mapper.toModel(teacher));
     } catch (error) {
          res.failure(error);
     }
};

exports.findmyid = async (req, res) => {
     try {
          const model = req.body;
          const { email, password } = model;
          baseServices.IfEmpty(email, 'Email');
          baseServices.IfEmpty(password, 'Password');

          let teacher = await baseServices.IfExists('teacher', {
               email: email,
               status: { [Op.ne]: 'deleted' },
          });
          var check = baseServices.comparePassword(password, teacher.password);
          if (!teacher) throw 'Cannot find teacher with this credentials!!';
          if (!check) throw 'You have entered invalid password!!';
          res.data(mapper.toModel(teacher));
     } catch (error) {
          res.failure(error);
     }
};

exports.findAll = async (req, res) => {
     try {
          let query = {
               include: [],
               distinct: true,
          };
          query.where = { email: { [Op.ne]: null } };
          const result = await db.teacher.findAndCountAll(query);
          res.data(mapper.toSearchModel(result.rows));
     } catch (error) {
          res.failure(error);
     }
};
