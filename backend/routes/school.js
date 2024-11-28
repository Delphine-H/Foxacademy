const express = require('express');
const axios = require('axios');
const School = require('../models/school');
const Cohort = require('../models/cohort');

const router = express.Router();

// Route to get schools by department code
router.get('/department/:departmentCode', async (req, res) => {
  try {
    const { departmentCode } = req.params;

    // Vérification du code du département
    if (!departmentCode || departmentCode.length !== 5) {
      return res.status(400).json({ error: 'Invalid department code' });
    }

    const apiUrl = `https://data.education.gouv.fr/api/records/1.0/search?dataset=fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre` +
               `&q=&facet=code_postal_uai&refine.code_postal_uai=${departmentCode}&rows=100`;
               
    const response = await axios.get(apiUrl);

    if (response.data.nhits === 0) {
      return res.status(404).json({ error: 'No schools found for the given department code' });
    }

    const externalSchools = response.data.records.map((record) => {
      const { fields } = record;
      return {
        SchoolID: fields.numero_uai,
        SchoolName: fields.appellation_officielle,
        DepartmentCode: fields.code_postal_uai,
        City: fields.libelle_commune,
      };
    });

    return res.status(200).json(externalSchools);
  } catch (error) {
    console.error(`Error: ${error.message}`); // Log the error message
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({ 
        error: error.response.data, 
        status: error.response.status 
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(500).json({ 
        error: 'No response received from API', 
        status: 500 
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ 
        error: 'Error setting up request', 
        status: 500 
      });
    }
  }
});

// Route to add a selected school to the database
router.post('/addSchool', async (req, res) => {
  try {
    const {
      SchoolID, SchoolName, DepartmentCode, City,
    } = req.body;

    // Check required fields
    if (!SchoolID || !SchoolName || !DepartmentCode) {
      return res.status(400).json({ error: 'SchoolID, SchoolName, and DepartmentCode are required' });
    }

    // Check if the school already exists
    const existingSchool = await School.findOne({ where: { SchoolID } });
    if (existingSchool) {
      return res.status(400).json({ error: 'School already exists' });
    }

    // Create the school
    const newSchool = await School.create({
      SchoolID,
      SchoolName,
      DepartmentCode,
      City,
    });

    return res.status(201).json(newSchool);
  } catch (error) {
    console.error('Error adding school:', error);
    return res.status(500).json({ error: 'Failed to add school', details: error.message });
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
