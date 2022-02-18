"use strict";

module.exports = () =>
{
    const like =
    {
        id:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        user_email:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        song_name:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        singer:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
    };
    return sequelize.define("like", like);
};