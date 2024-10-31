const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authenticateJWT'); // JWT authentication middleware

// GET: Retrieve user profile
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.UserID);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT: Edit profile
router.put('/', authenticateJWT, async (req, res) => {
  const updates = req.body;

  try {
    // Hash the password if it's being updated
    if (updates.Password) {
      updates.Password = bcrypt.hashSync(updates.Password, 10);
    }

    // Update the user with the provided fields
    const [updated] = await User.update(
      updates,
      { where: { UserID: req.user.UserID } },
    );

    if (updated) {
      const updatedUser = await User.findByPk(req.user.UserID);
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
