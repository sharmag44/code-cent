'use strict';
const _ = require('underscore');

exports.toModel = (entity) => {
     const model = {
          id: entity.id,
          name: entity.name,
          dontShowBecomeMasterPopUp: entity.dontShowBecomeMasterPopUp,
          imgUrl: entity.imgUrl,
          email: entity.email,
          status: entity.status,
          role: entity.role,
          isEmailVerified: entity.isEmailVerified,
          deviceId: entity.deviceId,
          deviceType: entity.deviceType,
          createdAt: entity.createdAt,
     };
     return model;
};
exports.toAuthModel = (entity) => {
     let model = exports.toModel(entity);
     model.token = entity.token;
     return model;
};

exports.toSmallModel = (entity) => {
     const model = {
          id: entity.id,
          name: entity.name,
          email: entity.email,
          imgUrl: entity.imgUrl,
     };
     return model;
};
exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};
