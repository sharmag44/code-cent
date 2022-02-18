exports.algoData = {
     levelRelationWithExp: {
          1: 10,
          2: 20,
          3: 30,
          4: 40,
          5: 50,
          6: 60,
          7: 70,
          8: 80,
          9: 90,
          10: 100,
     },
     baseAmountOfEXP: 100,
     completingAnswerWithNowWrongAnswer: 50,
     twentyFourHourEXPBooster: 1.5,
     refresherOrBaseExcericeAward: 200,
     streakRepairsCents: 200,
     lifeReplenishmentCents: 50,
     twentyFourHourEXPBoosterCents: 350,
     lessonCompletionCents: 15,
     bundles: [
          {
               price: 199,
               cents: 200,
          },
          {
               price: 499,
               cents: 600,
          },
     ],
     streakEXPMultipliers: {
          1: 1,
          2: 1.2,
          3: 1.3,
          4: 1.4,
          5: 1.5,
          6: 1.6,
     },
     streakEXPMultipliersDefault: 2,
     badgeProgress: 0,
     leagues: {
          1: 'diamond',
          2: 'platinum',
          3: 'gold',
          4: 'silver',
          5: 'bronze',
     },
};

exports.lessonComplete = async ({userId,lessonId}) => {
     try {
          const point = await db.point.findOne({
               where: {
                    userId,
               },
          });
          const wrongAnswer =  await db.userBecomeMasterLesson.create({
               userId,
               isCorrectOption: false,
          });
          const baseAmountOfEXP = this.algoData.baseAmountOfEXP;

     } catch (error) {
          throw error;
     }
};
