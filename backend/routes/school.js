const express = require('express');
const School = require('../models/school');
const Cohort = require('../models/cohort');

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

// Route to get a list of schools by department code
router.get('/department/:departmentCode', async (req, res) => {
  try {
    const { departmentCode } = req.params;
    const schools = await School.findAll({ where: { DepartmentCode: departmentCode } });
    console.log('Schools:', schools);
    return res.status(200).json(schools);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve schools' });
  }
});

// Route to get cohorts by school ID
router.get('/:schoolId/cohorts', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const cohorts = await Cohort.findAll({ where: { SchoolID: schoolId } });
    console.log('Cohorts:', cohorts);
    return res.status(200).json(cohorts);
  } catch (error) {
    console.error(error);
    console.error('Failed to retrieve cohorts');
    return res.status(500).json({ error: 'Failed to retrieve cohorts' });
  }
});

// Route to create a new cohort
router.post('/:schoolId/cohorts', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { Name, Year, Level } = req.body;

    const newCohort = await Cohort.create({
      Name,
      Year,
      Level,
      SchoolID: schoolId,
    });

    return res.status(201).json(newCohort);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create cohort' });
  }
});

module.exports = router;
