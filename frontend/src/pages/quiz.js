import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header';
import '../styles/form.css';
import { fetchUserScore } from '../utils/appUtils';
import Footer from '../components/footer';

const QuizForm = () => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [message, setMessage] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [subject, setSubject] = useState('Mathématiques');
  const [formSubmitted, setFormSubmitted] = useState(false); // état pour suivre si le formulaire a été soumis
  const [userScore, setUserScore] = useState(0); // état pour stocker le score de l'utilisateur

  useEffect(() => {
    const fetchScore = async () => {
      const score = await fetchUserScore();
      setUserScore(score);
    };

    fetchScore(); // Récupérer le score de l'utilisateur lors du chargement du composant

    const fetchQuestion = async () => {
      try {
        const response = await axios.get('http://localhost:5000/question', {
          params: {
            Subject: subject,
            Type: 'QCM', // Filtrer pour obtenir uniquement les questions de type QCM
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // transmettre l'ID de l'utilisateur
          },
        });
        console.log('Question récupérée:', response.data);
        setQuestion(response.data);
        setFormSubmitted(false); // Réinitialiser l'état du formulaire
        setSelectedAnswers([]); // Réinitialiser les réponses sélectionnées
        setMessage(''); // Réinitialiser le message
        setCorrectAnswers([]); // Réinitialiser les réponses correctes
      } catch (error) {
        console.error('Erreur lors de la récupération de la question:', error);
      }
    };

    fetchQuestion();
  }, [subject]); // tableau des dépendances

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedAnswers(prev =>
      prev.includes(value) ? prev.filter(ans => ans !== value) : [...prev, value]
    );
  };

  const submitResult = async (score) => {
    try {
      const response = await axios.post('http://localhost:5000/result', {
        QuestionID: question.QuestionID,
        Score: score,
        LastEvaluated: new Date(),
        Subject: subject,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // transmettre l'ID de l'utilisateur
        },
      });
      setUserScore(response.data.newTotalScore); // Mettre à jour le score de l'utilisateur après soumission du résultat
    } catch (error) {
      console.error('Erreur lors de la soumission du résultat:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique pour vérifier les réponses
    const correctAnswers = question.Answers.filter(answer => answer.isCorrect).map(answer => answer.text);
    const incorrectAnswers = question.Answers.filter(answer => !answer.isCorrect).map(answer => answer.text);

    const allCorrectSelected = correctAnswers.every(answer => selectedAnswers.includes(answer));
    const noIncorrectSelected = incorrectAnswers.every(answer => !selectedAnswers.includes(answer));

    let score = 0;
    if (allCorrectSelected && noIncorrectSelected) {
      setMessage('Bonne réponse !');
      setCorrectAnswers([]);
      score = 1; // Score de 1 pour une bonne réponse
    } else {
      setMessage('Mauvaise réponse. Essaie encore.');
      setCorrectAnswers(correctAnswers);
      score = 0; // Score de 0 pour une mauvaise réponse
    }

    setFormSubmitted(true); // Marquer le formulaire comme soumis

    // Soumettre le résultat
    await submitResult(score);
  };

  const handleNextQuestion = () => {
    // Recharger une nouvelle question
    axios.get('http://localhost:5000/question', {
      params: {
        Subject: subject,
        Type: 'QCM', // Filtrer pour obtenir uniquement les questions de type QCM
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // transmettre l'ID de l'utilisateur
      },
    })
    .then(response => {
      console.log('Question suivante récupérée:', response.data);
      setQuestion(response.data);
      setFormSubmitted(false); // Réinitialiser l'état du formulaire soumis
      setSelectedAnswers([]); // Réinitialiser les réponses sélectionnées
      setMessage(''); // Réinitialiser le message
      setCorrectAnswers([]); // Réinitialiser les réponses correctes
    })
    .catch(error => {
      console.error('Erreur lors de la récupération de la question suivante:', error);
    });
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <h1>Questions à choix multiple</h1>
        <div className="score-display">Score: {userScore}</div> {/* Afficher le score de l'utilisateur */}
        <div>
          <label htmlFor="subject-select">Choisis une matière :</label>
          <select
            id="subject-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="Mathématiques">Mathématiques</option>
            <option value="Français">Français</option>
            <option value="Histoire">Histoire</option>
            <option value="Géographie">Géographie</option>
            <option value="Sciences">Sciences</option>
            <option value="Anglais">Anglais</option>
          </select>
        </div>
        {question ? (
          <form onSubmit={handleSubmit}>
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{question.Text}</label>
            </div>
            <div className="checkbox-container">
              {question.Answers.map((ans, index) => (
                <div key={index} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`réponse-${index}`}
                    name="réponse"
                    value={ans.text}
                    checked={selectedAnswers.includes(ans.text)}
                    onChange={handleCheckboxChange}
                    disabled={formSubmitted} // Désactiver les cases à cocher après soumission
                  />
                  <label
                    htmlFor={`réponse-${index}`}
                    style={{ color: correctAnswers.includes(ans.text) ? 'green' : 'black' }}
                  >
                    {ans.text}
                  </label>
                </div>
              ))}
            </div>
            {formSubmitted ? (
              <button style={{ marginTop: '50px' }} type="button"
              className="btn-cta" onClick={handleNextQuestion}>Question suivante</button>
            ) : (
              <button style={{ marginTop: '50px' }} type="submit" className="btn-cta">Répondre</button>
            )}
          </form>
        ) : (
          <div>Bravo ! Tu as bien travaillé dans cette matière aujourd'hui ! Change de discipline ou reviens demain.</div>
        )}

        {message && <p>{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default QuizForm;
