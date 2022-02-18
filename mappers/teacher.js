'use strict';
const _ = require('underscore');

exports.toModel = (entity) => {
     const model = {
          id: entity.id,
          name: entity.name,
          imgUrl: entity.imgUrl,
          email: entity.email,
          // password: entity.password,
          status: entity.status,
          isEmailVerified: entity.isEmailVerified,
     };
     return model;
};

exports.toIdModel = (entity) => {
     const IdModel = {
          id: entity.id,
     };
     return IdModel;
};

exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};
