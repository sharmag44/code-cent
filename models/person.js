"use strict";

module.exports = () =>
{
    const person =
    {
        id: {
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
        email:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        state:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        status:
        {
            type: Sequelize.ENUM,
            values: ["registered", "notRegistered"],
            defaultValue: "notRegistered",
        },
    }
    return sequelize.define("person", person);
};