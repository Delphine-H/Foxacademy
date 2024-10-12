const sequelize = require('../config/database');
const School = require('../models/school');
const Cohort = require('../models/cohort');
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Result = require('../models/result');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.sync({ force: true, transaction }); // Réinitialise la base de données
  
    // Synchroniser les modèles dans le bon ordre
    await School.sync({ transaction });
    await Cohort.sync({ transaction });
    await User.sync({ transaction });
    await Question.sync({ transaction });
    await Answer.sync({ transaction });
    await Result.sync({ transaction });

    // Création des écoles
    const school1 = await School.create({
      SchoolID: "SCHOOL1",
      SchoolName: 'École Alpha',
      DepartmentCode: '75000',
      City: 'Paris'
    }, { transaction });

    const school2 = await School.create({
      SchoolID: "SCHOOL2",
      SchoolName: 'École Beta',
      DepartmentCode: '59000',
      City: 'Lille'
    }, { transaction });

    const school3 = await School.create({
      SchoolID: "SCHOOL3",
      SchoolName: 'École Gamma',
      DepartmentCode: '62000',
      City: 'Arras'
    }, { transaction });

    // Création des cohortes
    const cohort1 = await Cohort.create({
      Name: 'Cohorte A',
      Year: 2023,
      Level: 'CE1',
      SchoolID: school1.SchoolID
    }, { transaction });

    const cohort2 = await Cohort.create({
      Name: 'Cohorte B',
      Year: 2023,
      Level: 'CP',
      SchoolID: school2.SchoolID
    }, { transaction });

    const cohort3 = await Cohort.create({
      Name: 'Cohorte C',
      Year: 2023,
      Level: 'CE2',
      SchoolID: school3.SchoolID
    }, { transaction });

    // Cryptage des mots de passe
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password2', 10);
    const hashedPassword3 = await bcrypt.hash('password3', 10);

    // Création des utilisateurs
    const user1 = await User.create({
      Name: 'User1',
      Firstname: 'Firstname1',
      Email: 'user1@example.com',
      Level: 'CE1',
      Role: 'Elève',
      Password: hashedPassword1,
      SchoolID: school1.SchoolID,
      CohortID: cohort1.CohortID
    }, { transaction });

    const user2 = await User.create({
      Name: 'User2',
      Firstname: 'Firstname2',
      Email: 'user2@example.com',
      Level: 'CE1',
      Role: 'Professeur',
      Password: hashedPassword2,
      SchoolID: school2.SchoolID,
      CohortID: cohort2.CohortID
    }, { transaction });

    const user3 = await User.create({
      Name: 'User3',
      Firstname: 'Firstname3',
      Email: 'user3@example.com',
      Level: 'CE1',
      Role: 'Elève',
      Password: hashedPassword3,
      SchoolID: school3.SchoolID,
      CohortID: cohort3.CohortID
    }, { transaction });

    // Création des questions
    const question1 = await Question.create({
      Text: 'Quelle est la capitale de la France?',
      Subject: 'Géographie',
      Type: 'QCM',
      Level: 'CE1',
      AuthorID: user1.UserID
    }, { transaction });

    const question2 = await Question.create({
      Text: 'Quelle est la capitale de l\'Italie?',
      Subject: 'Géographie',
      Type: 'QCM',
      Level: 'CE1',
      AuthorID: user2.UserID
    }, { transaction });

    const question3 = await Question.create({
      Text: 'Quelle est la capitale de l\'Espagne?',
      Subject: 'Géographie',
      Type: 'QCM',
      Level: 'CE1',
      AuthorID: user3.UserID
    }, { transaction });

    // Création des réponses pour chaque question
    await Answer.create({
      text: 'Paris',
      QuestionID: question1.QuestionID,
      isCorrect: true
    }, { transaction });

    await Answer.create({
      text: 'Lyon',
      QuestionID: question1.QuestionID,
      isCorrect: false
    }, { transaction });

    await Answer.create({
      text: 'Marseille',
      QuestionID: question1.QuestionID,
      isCorrect: false
    }, { transaction });

    await Answer.create({
      text: 'Rome',
      QuestionID: question2.QuestionID,
      isCorrect: true
    }, { transaction });

    await Answer.create({
      text: 'Milan',
      QuestionID: question2.QuestionID,
      isCorrect: false
    }, { transaction });

    await Answer.create({
      text: 'Naples',
      QuestionID: question2.QuestionID,
      isCorrect: false
    }, { transaction });

    await Answer.create({
      text: 'Madrid',
      QuestionID: question3.QuestionID,
      isCorrect: true
    }, { transaction });

    await Answer.create({
      text: 'Barcelone',
      QuestionID: question3.QuestionID,
      isCorrect: false
    }, { transaction });

    await Answer.create({
      text: 'Valence',
      QuestionID: question3.QuestionID,
      isCorrect: false
    }, { transaction });

    // Création des résultats
    await Result.create({
      UserID: user1.UserID,
      QuestionID: question1.QuestionID,
      Score: 1,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    }, { transaction });

    await Result.create({
      UserID: user1.UserID,
      QuestionID: question2.QuestionID,
      Score: 0,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    }, { transaction });

    await Result.create({
      UserID: user3.UserID,
      QuestionID: question3.QuestionID,
      Score: 1,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    }, { transaction });

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