const express = require('express');
const School = require('../models/school');

const router = express.Router();

// Route to add a school
router.post('/', async (req, res) => {
  try {
    const { SchoolName, DepartmentCode, City } = req.body;
    console.log('SchoolName:', SchoolName, 'DepartmentCode:', DepartmentCode, 'City:', City);

    // Check required fields
    if (!SchoolName || !DepartmentCode) {
      return res.status(400).json({ error: 'SchoolName and DepartmentCode are required' });
    }

    // Create the school
    const school = await School.create({
      SchoolName,
      DepartmentCode,
      City,
    });

    return res.status(201).json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    return res.status(500).json({ error: 'Failed to create school', details: error.message });
  }
});

// Route to get all schools
router.get('/', async (req, res) => {
  try {
    const schools = await School.findAll();
    return res.status(200).json(schools);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve schools' });
  }
});

module.exports = router;
