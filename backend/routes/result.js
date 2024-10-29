const express = require('express');
const Result = require('../models/result');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authenticateJWT'); // Importer le middleware

const router = express.Router();

// POST: Create a new result for a user
router.post('/', authenticateJWT, async (req, res) => {
  const {
    QuestionID, Score, LastEvaluated, Subject,
  } = req.body;
  const { UserID } = req.user; // Extraire l'ID de l'utilisateur du token décodé

  try {
    // Validate input
    if (!QuestionID || Score === undefined || !LastEvaluated || !Subject) {
      return res.status(400).json({ error: 'All fields (QuestionID, Score, LastEvaluated, Subject) are required' });
    }

    // Create the result
    const newResult = await Result.create({
      UserID,
      QuestionID,
      Score,
      LastEvaluated,
      Subject,
    });

    // Update the user's total score
    const user = await User.findByPk(UserID);
    if (user) {
      user.TotalScore += Score;
      await user.save();
    }

    return res.status(201).json({ message: 'Result created successfully', newResult, newTotalScore: user.TotalScore });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create result', details: err.message });
  }
});

module.exports = router;
