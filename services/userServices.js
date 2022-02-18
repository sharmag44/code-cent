'use strict';
const { Op } = require('sequelize');

exports.checkUserFromEmail = async (email) => {
     var where = {
          [Op.or]: [],
     };
     if (email) {
          where[Op.or].push({ email: email });
     }
     return new Promise(async (resolve, reject) => {
          try {
               where.status = {
                    [Op.ne]: 'deleted',
               };
               let user = await db.user.findOne({ where: where });
               return resolve(user);
          } catch (err) {
               return resolve(null);
          }
     });
};

exports.checkUserExceptOne = async (user, email) => {
     var where = {
          email: email,
          id: { [Op.ne]: user.id },
     };
     return new Promise(async (resolve, reject) => {
          try {
               let user = await db.user.findOne({ where: where });
               if (user) {
                    return resolve(user);
               } else {
                    return resolve(null);
               }
          } catch (err) {
               return resolve(null);
          }
     });
};