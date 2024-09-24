const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// POST: Register a new user
router.post('/', async (req, res) => {
  const {
    Name, Firstname, Email, Password, Level, Role, SchoolID, CohortID,
  } = req.body;

  try {
    // Check that all required fields are present
    if (!Name || !Firstname || !Email || !Password || !Level || !Role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(Password, 10); // Using await
    } catch (hashError) {
      console.error('Error during password hashing:', hashError);
      return res.status(500).json({ error: 'Server error during password hashing' });
    }

    // Create a new user
    const newUser = await User.create({
      Name,
      Firstname,
      Email,
      Password: hashedPassword,
      Level,
      Role,
      SchoolID,
      CohortID,
    });

    // Respond with a success message and user data
    return res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (err) {
    // Handle other errors, such as duplicate emails
    console.error('Error during user creation:', err);
    return res.status(400).json({ error: 'Failed to register user', details: err.message });
  }
});

module.exports = router;
