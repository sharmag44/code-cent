const { Op } = require("sequelize")

exports.checkIfAnswered = async (triviaLessons, userId) => {
     try {
          const userTriviaLessons = await db.userTriviaLesson.findAll({
               where: {
                    triviaLessonId: {
                         [Op.in]: triviaLessons.map(tl => tl.id)
                    },
                    userId
               }
          });
          triviaLessons.forEach(triviaLesson => {
               const userTriviaLesson = userTriviaLessons.find(utl => utl.triviaLessonId === triviaLesson.id)
               if (userTriviaLesson) {
                    triviaLesson.userTriviaLesson = userTriviaLesson;
               }
          })
     } catch (error) {
          throw error
     }
}