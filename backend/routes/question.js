const express = require('express');
const { Op } = require('sequelize');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Result = require('../models/result');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// POST: Create a new question with answers
router.post('/', authenticateJWT, async (req, res) => {
  const {
    Text, Subject, Type, Level, Answers, ValidityDate,
  } = req.body;
  const { UserID, Role, CohortID } = req.user; // Extracted from the token

  try {
    // Validate input
    if (!Text || !Subject || !Type || !Level || !ValidityDate) {
      return res.status(400).json({ error: 'All fields (text, subject, type, level, validityDate) are required' });
    }

    // Validate answers
    if (!Answers || !Array.isArray(Answers) || Answers.length === 0) {
      return res.status(400).json({ error: 'At least one answer is required' });
    }

    // Create the question
    const newQuestion = await Question.create({
      Text, Subject, Type, Level, AuthorID: UserID, ValidityDate,
    });

    // Create the answers
    const answerPromises = Answers.map((answer) => Answer.create({
      text: answer.text,
      isCorrect: answer.isCorrect,
      order: answer.order || null,
      QuestionID: newQuestion.QuestionID,
    }));
    await Promise.all(answerPromises);

    return res.status(201).json({ message: 'Question and answers created successfully', newQuestion });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create question', details: err.message });
  }
});

// PUT: Update a question and its answers
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    Text, Subject, Type, Level, ValidatorID, Answers, ValidityDate,
  } = req.body;
  try {
    // Validate input
    if (!Text || !Subject || !Type || !Level || !ValidityDate) {
      return res.status(400).json({ error: 'All fields (text, subject, type, level, validityDate) are required' });
    }

    // Validate answers
    if (!Answers || !Array.isArray(Answers) || Answers.length === 0) {
      return res.status(400).json({ error: 'At least one answer is required' });
    }

    // Update the question
    const updatedQuestion = await Question.update({
      Text, Subject, Type, Level, ValidatorID: ValidatorID || null, ValidityDate,
    }, {
      where: { QuestionID: id },
      returning: true,
      plain: true,
    });

    // Delete existing answers
    await Answer.destroy({
      where: { QuestionID: id },
    });

    // Create new answers
    const answerPromises = Answers.map((answer) => Answer.create({
      text: answer.text,
      isCorrect: answer.isCorrect,
      order: answer.order || null,
      QuestionID: id,
    }));
    await Promise.all(answerPromises);

    return res.status(200).json({ message: 'Question and answers updated successfully', updatedQuestion });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update question', details: err.message });
  }
});


// GET: Retrieve a random question based on user level, subject, and date of validity
router.get('/', authenticateJWT, async (req, res) => {
  const { Subject, Type } = req.query; // Assuming these are passed as query params
  const UserID = req.user.UserID; // Extracted from the token

  console.log('Requête reçue avec les paramètres:', { UserID, Subject, Type });

  try {
    // Retrieve the user's level from the database
    const user = await User.findOne({
      where: { UserID },
      attributes: ['Level'],
    });

    if (!user) {
      console.log('Utilisateur non trouvé:', UserID);
      return res.status(404).json({ message: 'User not found' });
    }

    const { Level } = user;
    console.log('Niveau de l\'utilisateur:', Level);

    // Retrieve the recent questions the user has answered successfully
    const recentResults = await Result.findAll({
      where: {
        UserID,
        Score: { [Op.gt]: 0 }, // Score greater than 1 (will be passed to 0 when database will be completed)
        LastEvaluated: {
          [Op.gt]: new Date(Date.now() - 30 * 60 * 1000), // Within the last 30 minutes
        },
      },
      attributes: ['QuestionID'],
    });

    const recentQuestionIds = recentResults.map((result) => result.QuestionID);
    console.log('ID des questions récentes:', recentQuestionIds);

    // Find the 50 closest valid questions in terms of validity date
    const questions = await Question.findAll({
      where: {
        Subject,
        Level,
        Type,
        QuestionID: { [Op.notIn]: recentQuestionIds }, // Exclude recent questions
        [Op.or]: [
          { ValidatorID: { [Op.ne]: null } }, // Questions that have been validated
          { AuthorID: UserID }, // Questions authored by the user
        ],
      },
      include: [
        {
          model: Answer,
          as: 'Answers',
        },
      ],
      order: [['ValidityDate', 'ASC']], // Order by closest validity date
      limit: 50, // Limit to 50 closest questions
    });

    if (questions.length === 0) {
      return res.status(204).json({ message: 'No questions available' });
    }

    // Select a random question from the 50 closest
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    console.log('Question sélectionnée:', selectedQuestion);

    return res.status(200).json(selectedQuestion);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve question', details: err.message });
  }
});

// GET: Retrieve all questions created by an author or all questions of a cohort for professors
router.get('/author', authenticateJWT, async (req, res) => {
  const { Role, CohortID, UserID } = req.user; // Extracted from the token

  try {
    let questions;
    if (Role === 'Professeur') {
      // Retrieve all questions of the cohort
      questions = await Question.findAll({
        where: {
          CohortID,
        },
        include: [
          {
            model: Answer,
            as: 'Answers',
          },
        ],
        order: [['CreatedAt', 'DESC']], // Order by creation date
      });
    } else {
      // Retrieve all questions created by the author
      questions = await Question.findAll({
        where: {
          AuthorID: UserID,
        },
        include: [
          {
            model: Answer,
            as: 'Answers',
          },
        ],
        order: [['CreatedAt', 'DESC']], // Order by creation date
      });
    }

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions available' });
    }

    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve questions', details: err.message });
  }
});

// GET: Retrieve a question by its ID
router.get('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findOne({
      where: { QuestionID: id },
      include: [
        {
          model: Answer,
          as: 'Answers',
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    return res.status(200).json(question);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve question', details: err.message });
  }
});

module.exports = router;
