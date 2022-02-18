const { Op } = require("sequelize");

exports.markTrueOrFalse = async (knowledgeLessons, userId) => {
     try {
          const knowledgeLessonIds = knowledgeLessons.map(kl => kl.id);
          const userKnowledgeLessons = await db.userKnowledgeLesson.findAll({
               where: {
                    knowledgeLessonId: {
                         [Op.in]: knowledgeLessonIds,
                    },
                    userId
               }
          });
          knowledgeLessons.forEach(knowledgeLesson => {
               const userKnowledgeLesson = userKnowledgeLessons.find(ukl => ukl.knowledgeLessonId === knowledgeLesson.id);
               if (userKnowledgeLesson) {
                    knowledgeLesson.checked = true;
               } else {
                    knowledgeLesson.checked = false;
               }
          })
     } catch (error) {
          throw error
     }
}