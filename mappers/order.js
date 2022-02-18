"use strict";

const _ = require("underscore");

exports.toOrderModel = (entity) =>
{
    const model =
    {
        order_id: entity.order_id,
        description: entity.description,
        teacherId: entity.teacherId,
        quantity: entity.quantity,
        order_status: entity.order_status,
    };
    return model;
};

exports.toFindModel = (entities) => {
    return _.map(entities, exports.toOrderModel);
};