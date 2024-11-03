const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authenticateJWT'); // JWT authentication middleware

// GET: Retrieve user profile
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.UserID, {
      attributes: ['Firstname', 'Name', 'Email', 'Dob', 'Role', 'Level', 'Avatar']
    });
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

// PUT: Change password
router.put('/change-password', authenticateJWT, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.UserID);
    if (bcrypt.compareSync(oldPassword, user.Password)) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await User.update({ Password: hashedPassword }, { where: { UserID: req.user.UserID } });
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Invalid password' });
    }
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
