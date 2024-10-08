const express = require('express');
const { Op } = require('sequelize');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Result = require('../models/result');

const router = express.Router();

// POST: Create a new question with answers
router.post('/', async (req, res) => {
  const {
    Text, Subject, Type, Level, AuthorID, Answers,
  } = req.body;
  try {
    // Validate input
    if (!Text || !Subject || !Type || !Level || !AuthorID) {
      return res.status(400).json({ error: 'All fields (text, subject, type, level, authorID) are required' });
    }

    // Validate answers
    if (!Answers || !Array.isArray(Answers) || Answers.length === 0) {
      return res.status(400).json({ error: 'At least one answer is required' });
    }

    // Create the question
    const newQuestion = await Question.create({
      Text, Subject, Type, Level, AuthorID,
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
    Text, Subject, Type, Level, ValidatorID, Answers,
  } = req.body;
  try {
    // Validate input
    if (!Text || !Subject || !Type || !Level) {
      return res.status(400).json({ error: 'All fields (text, subject, type, level) are required' });
    }

    // Validate answers
    if (!Answers || !Array.isArray(Answers) || Answers.length === 0) {
      return res.status(400).json({ error: 'At least one answer is required' });
    }

    // Update the question
    const updatedQuestion = await Question.update({
      Text, Subject, Type, Level, ValidatorID: ValidatorID || null,
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
router.get('/', async (req, res) => {
  const { UserID, Subject, Level } = req.query; // Assuming these are passed as query params

  try {
    // Retrieve the recent questions the user has answered successfully (today or yesterday)
    const recentResults = await Result.findAll({
      where: {
        UserID,
        Score: { [Op.gt]: 1 }, // Score greater than 1
        LastEvaluated: {
          [Op.gt]: new Date(Date.now() - 30 * 60 * 1000), // Within the last 30 minutes
        },
      },
      attributes: ['QuestionID'],
    });

    const recentQuestionIds = recentResults.map((result) => result.QuestionID);

    // Find the 50 closest valid questions in terms of validity date
    const questions = await Question.findAll({
      where: {
        Subject,
        Level,
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
      order: [['validityDate', 'ASC']], // Order by closest validity date
      limit: 50, // Limit to 50 closest questions
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions available' });
    }

    // Select a random question from the 50 closest
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    return res.status(200).json(selectedQuestion);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve question', details: err.message });
  }
});

// GET: Retrieve all questions created by an author or all questions of a cohort for professors
router.get('/author', async (req, res) => {
  const { UserID, Role, CohortID } = req.query; // Assuming these are passed as query params

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
        order: [['createdAt', 'DESC']], // Order by creation date
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
        order: [['createdAt', 'DESC']], // Order by creation date
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

module.exports = router;
