const express = require('express');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = express.Router();

// POST: Decrease the user's total score
router.post('/consume', authenticateJWT, async (req, res) => {
  const { UserID, ScoreConsumed } = req.body;
  try {
    // Validate input
    if (!UserID || !ScoreConsumed) {
      return res.status(400).json({ error: 'UserID and ScoreConsumed are required' });
    }

    // Find the user
    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Decrease the user's total score (Ensure TotalScore doesn't go below 0)
    user.TotalScore = Math.max(0, user.TotalScore - ScoreConsumed);
    await user.save();

    return res.status(200).json({ message: 'TotalScore updated successfully', user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update TotalScore', details: err.message });
  }
});

// GET: Retrieve the user's total score
router.get('/total/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ TotalScore: user.TotalScore });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve TotalScore', details: err.message });
  }
});

module.exports = router;