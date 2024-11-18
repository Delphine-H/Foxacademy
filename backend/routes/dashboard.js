const express = require('express');
const { Sequelize } = require('sequelize');
const Result = require('../models/result');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

const getUserResultsSummary = async (userId) => {
  try {
    const results = await Result.findAll({
      where: { UserID: userId },
      order: [['LastEvaluated', 'DESC']],
    });

    const latestResults = new Map();

    // Iterate over results to keep only the latest for each questionID
    results.forEach(result => {
      // Check if we already have a record for this questionID
      if (!latestResults.has(result.QuestionID) || 
          new Date(result.LastEvaluated) > 
          new Date(latestResults.get(result.QuestionID).LastEvaluated)) {
        latestResults.set(result.QuestionID, result);
      }
    });

    // Now we have the latest results by questionID, let's summarize them
    const summary = Array.from(latestResults.values()).reduce((acc, result) => {
      if (!acc[result.Subject]) {
        acc[result.Subject] = {
          totalScore: 0,
          questionCount: 0,
        };
      }
      acc[result.Subject].totalScore += result.Score;
      acc[result.Subject].questionCount += 1;
      return acc;
    }, {});

    return summary;
  } catch (err) {
    console.error('Error in getUserResultsSummary:', err); // Log the error
    throw err; // Rethrow the error to handle it in the caller
  }
};


// GET: Retrieve total scores and questions by subject for a student
router.get('/student', authenticateJWT, async (req, res) => {
  const { UserID } = req.user; // Extract the authenticated user's ID

  try {
    console.log(`Executing query for UserID: ${UserID}`);
    
    // Call the function to get the results summary
    const summary = await getUserResultsSummary(UserID);

    if (!summary || Object.keys(summary).length === 0) {
      return res.status(404).json({ message: 'No results found for this user' });
    }
    
    return res.status(200).json(summary); // Send the summary back as JSON
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve student results' });
  }
});

module.exports = router;