const sequelize = require('../config/database');
const School = require('../models/school');
const Cohort = require('../models/cohort');
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const bcrypt = require('bcryptjs'); // Importer bcryptjs

async function seedDatabase() {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.sync({ force: true, transaction }); // Réinitialise la base de données

    // Création d'une école
    const schoolData = {
      SchoolName: 'École Primaire Exemple',
      DepartmentCode: '75000',
      City: 'Paris'
    };
    const school = await School.create(schoolData, { transaction });
    console.log('École créée avec succès :', school);

    // Création d'une cohorte
    const cohortData = {
      Name: 'Cohorte 1',
      Year: 2023,
      Level: 'CE1',
      SchoolID: school.SchoolID
    };
    const cohort = await Cohort.create(cohortData, { transaction });
    console.log('Cohorte créée avec succès :', cohort);

    // Cryptage du mot de passe
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Création d'un utilisateur
    const userData = {
      Name: 'John',
      Firstname: 'Doe',
      Email: 'john.doe@example.com',
      Level: 'CE1',
      Role: 'Elève',
      Password: hashedPassword, // Utiliser le mot de passe crypté
      SchoolID: school.SchoolID,
      CohortID: cohort.CohortID
    };
    const user = await User.create(userData, { transaction });
    console.log('Utilisateur créé avec succès', user);

    // Création d'une question
    const questionData = {
      Text: 'Quelle est la capitale de la France ?',
      Subject: 'Géographie',
      Type: 'QCM',
      Level: 'CE1',
      AuthorID: user.UserID
    };
    const question = await Question.create(questionData, { transaction });
    console.log('Question créée avec succès :', question);

    // Création d'une réponse
    const answerData = {
      text: 'Paris',
      QuestionID: question.QuestionID,
      isCorrect: true
    };
    await Answer.create(answerData, { transaction });
    console.log('Réponse créée avec succès');

    await transaction.commit();
    console.log('Base de données préremplie avec succès');
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors du préremplissage de la base de données :', error);
    process.exit(1); 
  } finally {
    await sequelize.close();
  }
}

seedDatabase();