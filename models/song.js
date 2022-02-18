"use strict";

module.exports = () =>
{
    const song =
    {
        id:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        name:
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
        genre:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
    };
    return sequelize.define("song", song);
}