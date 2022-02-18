'use strict';
const _ = require('underscore');

exports.toModel = (entity) => {
     const song = {
          id: entity.id,
          name: entity.name,
          singer: entity.singer,
          genre: entity.genre,
     };

     return song;
};
exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};
