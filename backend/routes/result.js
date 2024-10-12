const express = require('express');
const Result = require('../models/result');
const User = require('../models/user');

const router = express.Router();

// POST: Create a new result for a user
router.post('/', async (req, res) => {
  const {
    UserID, QuestionID, Score, LastEvaluated, Subject,
  } = req.body;
  try {
    // Validate input
    if (!UserID || !QuestionID || !Score || !LastEvaluated || !Subject) {
      return res.status(400).json({ error: 'All fields (UserID, QuestionID, Score, LastEvaluated, Subject) are required' });
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

    return res.status(201).json({ message: 'Result created successfully', newResult });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create result', details: err.message });
  }
});

module.exports = router;
