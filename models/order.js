"use strict";

module.exports = () => {
    var order =
    {
        order_id:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        description:
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        quantity:
        {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        order_status: {
            type: Sequelize.ENUM,
            values: ['pending', 'placed', 'cancelled'],
            defaultValue: 'pending',
       },
    };
    return sequelize.define("order", order);
};
