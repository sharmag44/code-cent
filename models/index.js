'use strict';
const fs = require('fs');
const path = require('path');
// @ts-ignore
const basename = path.basename(module.filename);

let initModels = () => {
     let db = {};
     fs.readdirSync(__dirname)
          .filter((file) => {
               return file.indexOf('.') !== 0 && file !== basename;
          })
          .forEach((file) => {
               const model = require(path.join(__dirname, file))(
                    sequelize,
                    Sequelize
               );
               db[model.name] = model;
               // model.sync({ alter: true });
          });

     db.teacher.hasMany(db.order);
     db.teacher.hasMany(db.student);
     db.order.belongsTo(db.teacher);

     db.person.hasMany(db.like);
     db.like.belongsTo(db.person);

     db.song.hasMany(db.like);
     db.like.belongsTo(db.song);

     Object.keys(db).forEach((modelName) => {
          if (db[modelName].associate) {
               db[modelName].associate(db);
          }
     });
     return db;
};
module.exports = initModels();
