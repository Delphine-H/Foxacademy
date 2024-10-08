const express = require('express');
const { Op, Sequelize } = require('sequelize');
const Result = require('../models/result');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// GET: Retrieve total scores and questions by subject
router.get('/', authenticateJWT, async (req, res) => {
  // Extract role, userID, and cohortID from authenticated user
  const { role, userID, cohortID } = req.user;

  try {
    let results;
    if (role === 'Elève') { // If the user is a student
      // Retrieve the latest results for each question for the user
      results = await Result.findAll({
        where: { UserID: userID },
        attributes: [
          'Subject',
          [Sequelize.fn('SUM', Sequelize.col('Score')), 'totalScore'], // Sum of scores
          [Sequelize.fn('COUNT', Sequelize.col('QuestionID')), 'totalQuestions'], // Count of questions
        ],
        group: ['Subject'],
        include: [{
          model: Result,
          as: 'LatestResult',
          attributes: [],
          where: {
            LastEvaluated: {
              [Op.eq]: Sequelize.literal(`
                (SELECT MAX("r"."LastEvaluated")
                FROM "Results" AS "r"
                WHERE "r"."QuestionID" = "Result"."QuestionID"
                AND "r"."UserID" = :userID
                AND "r"."Subject" = "Result"."Subject")
              `), // Only include the latest evaluation for each question
            },
          },
        }],
        replacements: { userID }, // Replace :userID with the actual userID
      });
    } else if (role === 'Professeur') { // If the user is a teacher
      // Retrieve the results for all students in the cohort
      results = await User.findAll({
        where: { CohortID: cohortID },
        attributes: ['UserID', 'Name', 'Firstname'], // Include user details
        include: [{
          model: Result,
          attributes: [
            'Subject',
            [Sequelize.fn('SUM', Sequelize.col('Score')), 'totalScore'], // Sum of scores
            [Sequelize.fn('COUNT', Sequelize.col('QuestionID')), 'totalQuestions'], // Count of questions
          ],
          group: ['Subject', 'Result.UserID'],
          where: {
            LastEvaluated: {
              [Op.eq]: Sequelize.literal(`
                (SELECT MAX("r"."LastEvaluated")
                FROM "Results" AS "r"
                WHERE "r"."QuestionID" = "Result"."QuestionID"
                AND "r"."UserID" = "Result"."UserID"
                AND "r"."Subject" = "Result"."Subject"
                AND "r"."CohortID" = :cohortID)
              `), // Only include the latest evaluation for each question within the cohort
            },
          },
        }],
        replacements: { cohortID }, // Replace :cohortID with the actual cohortID
      });
    } else {
      return res.status(403).json({ error: 'Access denied' }); // If the user role is not recognized, deny access
    }

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve totals', details: err.message });
  }
});

module.exports = router;
