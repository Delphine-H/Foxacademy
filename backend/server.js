const express = require('express');
const port = process.env.PORT || 5000;
const db = require("./db");
const cors = require('cors'); 
const sequelize = require('./config/database');

const app = express(); // Initialize the Express application
app.use(cors()); // Middleware to handle CORS requests
app.use(express.json()); // Middleware to parse JSON

// Import all models
const School = require('./models/school');
const Cohort = require('./models/cohort');
const User = require('./models/user');
const Question = require('./models/question');
const Answer = require('./models/answer');
const Result = require('./models/result');

// Import routes
const schoolRoutes = require('./routes/school');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const questionRoutes = require('./routes/question');
const resultRoutes = require('./routes/result');
const dashboardRoutes = require('./routes/dashboard');

// Redirect to the route file
app.use('/school', schoolRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/question', questionRoutes);
app.use('/result', resultRoutes);
app.use('/dashboard', dashboardRoutes);

// Define associations
// School & Cohort
Cohort.belongsTo(School, { foreignKey: 'SchoolID' });
School.hasMany(Cohort, { foreignKey: 'SchoolID' });

// Cohort & User
Cohort.hasMany(User, { foreignKey: 'CohortID' });
User.belongsTo(Cohort, { foreignKey: 'CohortID' });

// User & Result
User.hasMany(Result, { foreignKey: 'UserID' });
Result.belongsTo(User, { foreignKey: 'UserID' });

// Question & Answer
Question.hasMany(Answer, { foreignKey: 'QuestionID', onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: 'QuestionID' });

// Result & Question
Result.belongsTo(Question, { foreignKey: 'QuestionID' });
Question.hasMany(Result, { foreignKey: 'QuestionID' });

// User as Author and Validator for Question
Question.belongsTo(User, { as: 'Author', foreignKey: 'AuthorID' });
Question.belongsTo(User, { as: 'Validator', foreignKey: 'ValidatorID' });

// Synchronize the database
sequelize.sync().then(() => {
  console.log('Database synchronized.');
}).catch((err) => {
  console.error('Error synchronizing database: ', err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
