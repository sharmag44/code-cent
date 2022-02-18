const { Op } = require('sequelize');

exports.checkIfAnswered = async (becomeMasterLessons, userId) => {
     try {
          const userBecomeMasterLessons =
               await db.userBecomeMasterLesson.findAll({
                    where: {
                         becomeMasterLessonId: {
                              [Op.in]: becomeMasterLessons.map((tl) => tl.id),
                         },
                         userId,
                    },
               });
          becomeMasterLessons.forEach((becomeMasterLesson) => {
               const userBecomeMasterLesson = userBecomeMasterLessons.filter(
                    (utl) => utl.becomeMasterLessonId === becomeMasterLesson.id
               );
               if (userBecomeMasterLesson) {
                    becomeMasterLesson.userBecomeMasterLessons =
                         userBecomeMasterLesson;
               }
          });
     } catch (error) {
          throw error;
     }
};
