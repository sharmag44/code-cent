'use strict';
module.exports = () => {
     var user = {
          id: {
               type: Sequelize.INTEGER,
               primaryKey: true,
               autoIncrement: true,
               unique: true,
          },
          name: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          imgUrl: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          email: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          dontShowBecomeMasterPopUp: {
               type: Sequelize.BOOLEAN,
               defaultValue: false,
          },
          password: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          token: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          isEmailVerified: {
               type: Sequelize.BOOLEAN,
               defaultValue: false,
          },
          status: {
               type: Sequelize.ENUM,
               values: ['pending', 'active', 'inactive', 'blocked', 'deleted'],
               defaultValue: 'pending',
          },
          role: {
               type: Sequelize.ENUM,
               values: ['user', 'admin'],
               defaultValue: 'user',
          },
          deviceType: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          deviceId: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
     };
     return sequelize.define('user', user);
};
