const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config();

// POST: Login and generate token
router.post('/', async (req, res) => {
  const { Email, Password } = req.body;
  console.log('Login request:', Email, Password);
  try {
    const user = await User.findOne({ where: { Email } });
    if (!user || !bcrypt.compareSync(Password, user.Password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { UserID: user.UserID, role: user.Role, cohortID: user.CohortID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    console.log('Token generated:', token);
    return res.json({ token, role: user.Role });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
