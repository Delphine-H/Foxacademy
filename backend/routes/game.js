const express = require('express');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = express.Router();

// POST: Decrease the user's total score
router.post('/consume', authenticateJWT, async (req, res) => {
  const { UserID } = req.user;
  const { ScoreConsumed } = req.body; // Extraire ScoreConsumed du corps de la requête

  try {
    // Validate input
    if (ScoreConsumed === undefined || ScoreConsumed === null) {
      return res.status(400).json({ error: 'ScoreConsumed is required' });
    }

    const scoreToConsume = parseInt(ScoreConsumed, 10);
    if (isNaN(scoreToConsume) || scoreToConsume <= 0) {
      return res.status(400).json({ error: 'ScoreConsumed must be a positive integer' });
    }

    // Find the user
    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Decrease the user's total score (Ensure TotalScore doesn't go below 0)
    user.TotalScore = Math.max(0, user.TotalScore - scoreToConsume);
    await user.save();

    return res.status(200).json({ message: 'TotalScore updated successfully', newTotalScore: user.TotalScore });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update TotalScore', details: err.message });
  }
});

// GET: Retrieve the user's total score
router.get('/score', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.UserID);
    if (user) {
      res.json({ score: user.TotalScore });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user score' });
  }
});

module.exports = router;