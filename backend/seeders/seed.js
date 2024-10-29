const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const School = require('../models/school');
const Cohort = require('../models/cohort');
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Result = require('../models/result');

async function seedDatabase() {
  try {
    // Synchroniser les modèles avec la base de données sans supprimer les tables existantes
    await sequelize.sync();

    // Vérifier si les tables sont vides avant d'insérer les données
    const schoolCount = await School.count();
    const cohortCount = await Cohort.count();
    const userCount = await User.count();
    const questionCount = await Question.count();
    const answerCount = await Answer.count();
    const resultCount = await Result.count();

    if (schoolCount > 0 || cohortCount > 0 || userCount > 0 || questionCount > 0 || answerCount > 0 || resultCount > 0) {
      console.log('Les tables ne sont pas vides. Le script de peuplement ne sera pas exécuté.');
      return;
    }

    // Fonction pour vérifier et créer une école
    async function findOrCreateSchool(data) {
      let school = await School.findOne({ where: { SchoolID: data.SchoolID } });
      if (!school) {
        school = await School.create(data);
      }
      return school;
    }

    // Fonction pour vérifier et créer une cohorte
    async function findOrCreateCohort(data) {
      let cohort = await Cohort.findOne({ where: { Name: data.Name, Year: data.Year, SchoolID: data.SchoolID } });
      if (!cohort) {
        cohort = await Cohort.create(data);
      }
      return cohort;
    }

    // Fonction pour vérifier et créer un utilisateur
    async function findOrCreateUser(data) {
      let user = await User.findOne({ where: { Email: data.Email } });
      if (!user) {
        user = await User.create(data);
      }
      return user;
    }

    // Fonction pour vérifier et créer une question
    async function findOrCreateQuestion(data) {
      let question = await Question.findOne({ where: { Text: data.Text } });
      if (!question) {
        question = await Question.create(data);
      }
      return question;
    }

    // Fonction pour vérifier et créer une réponse
    async function findOrCreateAnswer(data) {
      let answer = await Answer.findOne({ where: { text: data.text, QuestionID: data.QuestionID } });
      if (!answer) {
        answer = await Answer.create(data);
      }
      return answer;
    }

    // Fonction pour vérifier et créer un résultat
    async function findOrCreateResult(data) {
      let result = await Result.findOne({ where: { UserID: data.UserID, QuestionID: data.QuestionID } });
      if (!result) {
        result = await Result.create(data);
      }
      return result;
    }

    // Création des écoles
    const school1 = await findOrCreateSchool({
      SchoolID: "SCHOOL1",
      SchoolName: 'École Alpha',
      DepartmentCode: '75000',
      City: 'Paris'
    });

    const school2 = await findOrCreateSchool({
      SchoolID: "SCHOOL2",
      SchoolName: 'École Beta',
      DepartmentCode: '59000',
      City: 'Lille'
    });

    const school3 = await findOrCreateSchool({
      SchoolID: "SCHOOL3",
      SchoolName: 'École Gamma',
      DepartmentCode: '62000',
      City: 'Lens'
    });

    // Création des cohortes
    const cohort1 = await findOrCreateCohort({
      Name: 'Cohorte A',
      Year: 2023,
      Level: 'CE1',
      SchoolID: school1.SchoolID
    });

    const cohort2 = await findOrCreateCohort({
      Name: 'Cohorte B',
      Year: 2023,
      Level: 'CP',
      SchoolID: school2.SchoolID
    });

    const cohort3 = await findOrCreateCohort({
      Name: 'Cohorte C',
      Year: 2023,
      Level: 'CE2',
      SchoolID: school3.SchoolID
    });

    // Cryptage des mots de passe
    const hashedPassword1 = await bcrypt.hash('password1', 10);
    const hashedPassword2 = await bcrypt.hash('password2', 10);
    const hashedPassword3 = await bcrypt.hash('password3', 10);

    // Création des utilisateurs
    const user1 = await findOrCreateUser({
      Name: 'User1',
      Firstname: 'Firstname1',
      Dob: new Date('2010-01-01'),
      Email: 'user1@example.com',
      Level: 'CE1',
      Role: 'Elève',
      Password: hashedPassword1,
      SchoolID: school1.SchoolID,
      CohortID: cohort1.CohortID
    });

    const user2 = await findOrCreateUser({
      Name: 'User2',
      Firstname: 'Firstname2',
      Email: 'user2@example.com',
      Dob: new Date('2010-01-01'),
      Level: 'CE1',
      Role: 'Professeur',
      Password: hashedPassword2,
      SchoolID: school2.SchoolID,
      CohortID: cohort2.CohortID
    });

    const user3 = await findOrCreateUser({
      Name: 'User3',
      Firstname: 'Firstname3',
      Email: 'user3@example.com',
      Dob: new Date('2010-01-01'),
      Level: 'CE1',
      Role: 'Elève',
      Password: hashedPassword3,
      SchoolID: school3.SchoolID,
      CohortID: cohort3.CohortID
    });

    // Création des questions
    const question1 = await findOrCreateQuestion({
      Text: 'Quelle est la capitale de la France?',
      Subject: 'Géographie',
      Type: 'QCM',
      Level: 'CE1',
      AuthorID: user1.UserID,
      ValidityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours à partir de maintenant
    });

    const question2 = await findOrCreateQuestion({
      Text: 'Quelle est la capitale de l\'Italie?',
      Subject: 'Géographie',
      Type: 'QCM',
      Level: 'CE1',
      AuthorID: user2.UserID,
      ValidityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours à partir de maintenant
    });

    const question3 = await findOrCreateQuestion({
      Text: 'Quelle est la capitale de l\'Espagne?',
      Subject: 'Géographie',
      Type: 'QCM',
      Level: 'CE1',
      AuthorID: user3.UserID,
      ValidityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours à partir de maintenant
    });

    // Création des réponses pour chaque question
    await findOrCreateAnswer({
      text: 'Paris',
      QuestionID: question1.QuestionID,
      isCorrect: true
    });

    await findOrCreateAnswer({
      text: 'Lyon',
      QuestionID: question1.QuestionID,
      isCorrect: false
    });

    await findOrCreateAnswer({
      text: 'Marseille',
      QuestionID: question1.QuestionID,
      isCorrect: false
    });

    await findOrCreateAnswer({
      text: 'Rome',
      QuestionID: question2.QuestionID,
      isCorrect: true
    });

    await findOrCreateAnswer({
      text: 'Milan',
      QuestionID: question2.QuestionID,
      isCorrect: false
    });

    await findOrCreateAnswer({
      text: 'Naples',
      QuestionID: question2.QuestionID,
      isCorrect: false
    });

    await findOrCreateAnswer({
      text: 'Madrid',
      QuestionID: question3.QuestionID,
      isCorrect: true
    });

    await findOrCreateAnswer({
      text: 'Barcelone',
      QuestionID: question3.QuestionID,
      isCorrect: false
    });

    await findOrCreateAnswer({
      text: 'Valence',
      QuestionID: question3.QuestionID,
      isCorrect: false
    });

    // Création des résultats pour les utilisateurs existants
    await findOrCreateResult({
      UserID: user1.UserID,
      QuestionID: question1.QuestionID,
      Score: 1,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    });

    await findOrCreateResult({
      UserID: user1.UserID,
      QuestionID: question2.QuestionID,
      Score: 0,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    });

    await findOrCreateResult({
      UserID: user3.UserID,
      QuestionID: question3.QuestionID,
      Score: 1,
      LastEvaluated: new Date(),
      Subject: 'Géographie'
    });

    console.log('Base de données préremplie avec succès');
  } catch (error) {
    console.error('Erreur lors du préremplissage de la base de données :', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();