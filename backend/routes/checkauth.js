const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// POST : check if the user is authenticated
router.post('/', authenticateJWT, async (req, res) => {
  return res.status(200).json({ message: 'Authenticated' });
});

module.exports = router;
