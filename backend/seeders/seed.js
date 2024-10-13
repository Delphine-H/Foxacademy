const sequelize = require('../config/database');
const School = require('../models/school');
const Cohort = require('../models/cohort');
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Result = require('../models/result');
const bcrypt = require('bcryptjs');

const user1ID = '9c78d8fc-84fe-445b-8c75-92c59e0422b5';
const user2ID = '45c017b3-ba3a-4f9b-90e7-532f28b2a7f3';
const user3ID = '75df964a-c580-470b-839c-08435fca205a';
const newStudentID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // Nouvel ID pour l'élève

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
    const hashedPassword1 = await bcrypt.hash('password1', 10);
    const hashedPassword2 = await bcrypt.hash('password2', 10);
    const hashedPassword3 = await bcrypt.hash('password3', 10);
    const hashedPasswordNewStudent = await bcrypt.hash('password4', 10);

    // Création des utilisateurs avec des UserID fixes
    const user1 = await User.create({
      UserID: user1ID,
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
      UserID: user2ID,
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
      UserID: user3ID,
      Name: 'User3',
      Firstname: 'Firstname3',
      Email: 'user3@example.com',
      Level: 'CE1',
      Role: 'Elève',
      Password: hashedPassword3,
      SchoolID: school3.SchoolID,
      CohortID: cohort3.CohortID
    }, { transaction });

    // Création du nouvel élève dans la cohorte B
    const newStudent = await User.create({
      UserID: newStudentID,
      Name: 'User4',
      Firstname: 'Firstname4',
      Email: 'newstudent@example.com',
      Level: 'CP',
      Role: 'Elève',
      Password: hashedPasswordNewStudent,
      SchoolID: school2.SchoolID,
      CohortID: cohort2.CohortID
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

    // Création des résultats pour les utilisateurs existants
    await Result.create({
      UserID: user1ID,
      QuestionID: question1.QuestionID,
      Score: 1,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    }, { transaction });

    await Result.create({
      UserID: user1ID,
      QuestionID: question2.QuestionID,
      Score: 0,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    }, { transaction });

    await Result.create({
      UserID: user3ID,
      QuestionID: question3.QuestionID,
      Score: 1,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    }, { transaction });

    // Création des résultats pour le nouvel élève
    const questions = [question1, question2, question3];
    for (const question of questions) {
      for (let i = 1; i <= 3; i++) {
        await Result.create({
          UserID: newStudentID,
          QuestionID: question.QuestionID,
          Score: i % 2, // Alternance des scores 0 et 1
          LastEvaluated: new Date(),
          Subject: 'Géographie'
        }, { transaction });
      }
    }

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