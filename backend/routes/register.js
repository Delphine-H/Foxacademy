const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// POST: Register a new user
router.post('/', async (req, res) => {
  const {
    Name, Firstname, Email, Dob, Password, Level, Role, SchoolID, CohortID,
  } = req.body;

  try {
    // Check that all required fields are present
    if (!Name || !Firstname || !Dob || !Email || !Password || !Level || !Role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      console.log('Email already in use:', Email);
      return res.status(400).json({ error: 'Email already in use' });
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
      Dob,
      Password: hashedPassword,
      Level,
      Role,
      SchoolID,
      CohortID,
    });

    console.log('User registered successfully', newUser);
    // Respond with a success message and user data
    return res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (err) {
    // Handle other errors, such as duplicate emails
    console.error('Error during user creation:', err);
    return res.status(400).json({ error: 'Failed to register user', details: err.message });
  }
});

module.exports = router;
