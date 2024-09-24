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

// GET: Retrieve a random question based on user level, subject, and date of validity
router.get('/', async (req, res) => {
  const { UserID, Subject, Level } = req.query; // Assuming these are passed as query params

  try {
    // Retrieve the recent questions the user has answered successfully (today or yesterday)
    const recentResults = await Result.findAll({
      where: {
        UserID,
        Score: { [Op.gt]: 0 }, // Score greater than 0
        LastEvaluated: {
          [Op.between]: [
            new Date(Date.now() - 24 * 60 * 60 * 1000),
            new Date(),
          ], // Yesterday and today
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
      },
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

module.exports = router;
