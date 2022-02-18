const { Op } = require('sequelize');
exports.lessonIsCompletedIsWatching = async (course, userId) => {
     try {
          const userLessons = await db.userLesson.findAll({
               where: {
                    courseId: course.id,
                    userId,
               },
          });
          course.sections.forEach((section) => {
               section.lessons.forEach((lesson) => {
                    const userLesson = userLessons.find(
                         (ul) => ul.lessonId === lesson.id
                    );
                    if (userLesson) {
                         lesson.isCompleted = userLesson.isCompleted;
                         lesson.isWatching = userLesson.isWatching;
                    }
               });
          });
     } catch (error) {
          throw error;
     }
};

exports.hasUserSeenCourse = async (courses, userId) => {
     try {
          const userCourses = await db.userCourse.findAll({
               where: {
                    userId,
               },
          });
          const courseIds = userCourses.map(({ courseId }) => courseId);
          courses.forEach((course) => {
               if (courseIds.includes(course.id)) {
                    course.hasSeen = true;
               } else {
                    course.hasSeen = false;
               }
          });
     } catch (error) {
          throw error;
     }
};

exports.checkSeenCount = async (courses, userId) => {
     try {
          const userCourses = await db.userCourse.findAndCountAll({
               where: {
                    userId,
                    courseId: {
                         [Op.in]: courses.map(({ id }) => id),
                    },
               },
          });
          courses.forEach((course) => {
               course.isWatchingCount = userCourses.rows.filter(
                    (userCourse) => {
                         if (
                              userCourse.courseId === course.id &&
                              userCourse.isCompleted === false
                         )
                              return true;
                    }
               ).length;
               course.isCompletedCount = userCourses.rows.filter(
                    (userCourse) => {
                         if (
                              userCourse.courseId === course.id &&
                              userCourse.isCompleted === true
                         )
                              return true;
                    }
               ).length;
          });
     } catch (error) {
          throw error;
     }
};
