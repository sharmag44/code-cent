"use strict";

module.exports = () =>
{
    var teacher =
    {
        id:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        name:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        imgURL:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        email: 
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        password:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        isEmailVerified:
        {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        status:
        {
            type: Sequelize.ENUM,
            values: ['pending', 'active', 'inactive', 'blocked', 'deleted'],
            default: "pending",
        }
    };
    return sequelize.define("teacher", teacher);
};