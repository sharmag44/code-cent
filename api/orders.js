'use strict';
const { baseServices } = require('../services');
const { Op } = require('sequelize');
const mapper = require('../mappers/order');
const updationScheme = require('../helpers/updateEntities');

exports.create = async (req, res) => {
     try {
          const model = req.body;
          const { teacherId, description, quantity } = model;

          baseServices.IfEmpty(teacherId, 'Teacher ID');
          baseServices.IfEmpty(description, 'Description');
          baseServices.IfEmpty(quantity, 'Quantity');

          await baseServices.IfExists('teacher', {
               id: teacherId,
               status: { [Op.ne]: 'deleted' },
          });

          let order = await db.order.create(req.body);

          res.data(mapper.toOrderModel(order));
     } catch (error) {
          res.failure(error);
     }
};

exports.delete = async (req, res) => {
     try {
          var { order_id } = req.params;
          baseServices.IfEmpty(order_id, 'Order ID');
          let order = await baseServices.IfExists('order', {
               order_id: order_id,
          });
          order.order_status = 'cancelled';
          order = await order.save();
          res.success(mapper.toOrderModel(order));
     } catch (error) {
          res.failure(error);
     }
};

exports.findAll = async (req, res) => {
     try {
          const query = {};
          query.where = { description: { [Op.ne]: null } };
          const result = await db.order.findAndCountAll(query);
          res.data(mapper.toFindModel(result.rows));
     } catch (error) {
          console.log(error);
     }
};

exports.find = async (req, res) => {
     try {
          const model = req.params;
          const { order_id } = model;

          baseServices.IfEmpty(order_id, 'Order ID');
          let order = await baseServices.IfExists('order', {
               order_id: order_id,
          });
          res.data(mapper.toOrderModel(order));
     } catch (error) {
          res.failure(error);
     }
};
