const { baseServices } = require('../services');
const mapper = require('../mappers/song');
const updationScheme = require('../helpers/updateEntities');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
     try {
          const model = req.body;
          const { name, singer, genre } = model;

          baseServices.IfEmpty(name, 'Song Name');
          baseServices.IfEmpty(singer, 'Singer Name');
          baseServices.IfEmpty(genre, 'Genre');

          let song = await db.song.findOne({
               where: { name: name, singer: singer },
          });

          if (song) throw 'This song already exists!!';

          song = await db.song.create();
          song = updationScheme.update(model, song);
          await song.save();
          res.data(mapper.toModel(song));
     } catch (error) {
          res.failure(error);
     }
};

exports.get = async (req, res) => {
     try {
          let song = await db.song.findOne({
               where: {
                    id: req.params.id,
               },
          });
          if (!song) throw 'song not available';
          return res.data(mapper.toModel(song));
     } catch (err) {
          res.failure(err);
     }
};
exports.search = async (req, res) => {
     try {
          let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
          let serverPaging = req.query.serverPaging == 'false' ? false : true;
          let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
          let offset = pageSize * (pageNo - 1);
          let totalRecords = 0;

          let query = {
               include: [],
               distinct: true,
          };

          if (serverPaging) {
               query.limit = pageSize;
               query.offset = offset;
          }

          let where = {};

          if (req.query.status) {
               where.status = req.query.status;
          }

          if (req.user) {
               where.id = { [Op.ne]: [req.user.id] };
          }

          if (req.query.search) {
               where = {
                    [Op.or]: [
                         {
                              name: {
                                   [Op.like]: '%' + req.query.search + '%',
                              },
                         },
                         {
                              email: {
                                   [Op.like]: '%' + req.query.search + '%',
                              },
                         },
                    ],
               };
          }

          if (req.query.status) {
               where.status = req.query.status;
          }

          if (req.query.sortOrderWithProperty) {
               query.order = [req.query.sortOrderWithProperty.split(',')];
          } else {
               query.order = [['id', 'DESC']];
          }
          query.where = where;
          const result = await db.user.findAndCountAll(query);
          return res.page(
               mapper.toSearchModel(result.rows),
               pageNo,
               pageSize,
               result.count
          );
     } catch (error) {
          res.failure(error);
     }
};
exports.update = async (req, res) => {
     const id = req.params.id;
     let song = await db.song.findByPk({
          where: {
               id,
          },
     });
     if (!song) throw 'Song not found';
     song = updationScheme.update(req.body, song);
     song = await song.save();
     return res.data(mapper.toModel(song));
};

exports.delete = async (req, res) => {
     try {
          const id = req.params.id;
          let song = await db.song.destroy({
               where: {
                    id,
               },
          });
          if (!song) throw 'song is not available';
          song = await song.save();
     } catch (err) {
          res.failure(err);
     }
};
