import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/questionForm.css'; // Importez le fichier CSS
import Header from '../components/header';
import Footer from '../components/footer';

const QuestionForm = () => {
  const { id } = useParams(); // paramètre id de l'URL
  const navigate = useNavigate(); // Hook pour la navigation
  const [formData, setFormData] = useState({
    Text: '',
    Subject: '',
    Type: '',
    Level: '',
    ValidityDate: '',
    Answers: [{ text: '', isCorrect: false }],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      // Fetch the question data for editing
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5000/question/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          const question = response.data;
          setFormData({
            Text: question.Text,
            Subject: question.Subject,
            Type: question.Type,
            Level: question.Level,
            ValidityDate: question.ValidityDate ? question.ValidityDate.slice(0, 10) : '', // Formater la date
            Answers: question.Answers.map(answer => ({
              text: answer.text,
              isCorrect: answer.isCorrect,
              id: answer.id, // Assurez-vous que chaque réponse a un identifiant unique
            })),
          });
        })
        .catch(error => {
          console.error('Error fetching question data:', error);
        });
    }
  }, [id]);

  const fetchUserQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/question/author', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserQuestions(response.data);
    } catch (error) {
      console.error('Error fetching user questions:', error);
    }
  };

  useEffect(() => {
    fetchUserQuestions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAnswerChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newAnswers = formData.Answers.map((answer, i) => {
      if (i === index) {
        return {
          ...answer,
          [name]: type === 'checkbox' ? checked : value,
        };
      }
      return answer;
    });
    setFormData({
      ...formData,
      Answers: newAnswers,
    });
  };

  const addAnswer = () => {
    setFormData({
      ...formData,
      Answers: [...formData.Answers, { text: '', isCorrect: false }],
    });
  };

  const removeAnswer = (index) => {
    setFormData({
      ...formData,
      Answers: formData.Answers.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = isEditMode ? `http://localhost:5000/question/${id}` : 'http://localhost:5000/question';
    const method = isEditMode ? 'put' : 'post';

    try {
      // Mettre à jour la question
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Question sauvegardée');
      // Reset form
      setFormData({
        Text: '',
        Subject: '',
        Type: '',
        Level: '',
        ValidityDate: '',
        Answers: [{ text: '', isCorrect: false }],
      });
      // Mettre à jour la liste des questions
      fetchUserQuestions();
      // Rediriger vers la page de création de question
      navigate('/create_question');
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
    }
  };

  const handleEditQuestion = (id) => {
    // Navigate to the edit question form with the selected question ID
    window.location.href = `/edit_questions/${id}`;
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Texte de la question :</label>
              <input type="text" name="Text" value={formData.Text} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Matière :</label>
              <select name="Subject" value={formData.Subject} onChange={handleChange} required>
                <option value="">Choix de la Matière</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Français">Français</option>
                <option value="Histoire">Histoire</option>
                <option value="Géographie">Géographie</option>
                <option value="Sciences">Sciences</option>
                <option value="Anglais">Anglais</option>
              </select>
            </div>
            <div className="form-group">
              <label>Type :</label>
              <select name="Type" value={formData.Type} onChange={handleChange} required>
                <option value="">Choix du type</option>
                <option value="QCM">QCM</option>
                <option value="Texte à trous">Texte à trous</option>
                <option value="Dictée">Dictée</option>
              </select>
            </div>
            <div className="form-group">
              <label>Niveau :</label>
              <select name="Level" value={formData.Level} onChange={handleChange} required>
                <option value="">Choix du niveau</option>
                <option value="CP">CP</option>
                <option value="CE1">CE1</option>
                <option value="CE2">CE2</option>
                <option value="CM1">CM1</option>
                <option value="CM2">CM2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date d'aquisition souhaitée :</label>
              <input type="date" name="ValidityDate" value={formData.ValidityDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Réponses :</label>
              {formData.Answers.map((answer, index) => (
                <div key={index} className="answer-group">
                  <input
                    type="text"
                    name="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, e)}
                    required
                  />
                  <label>
                    <input
                      type="checkbox"
                      name="isCorrect"
                      checked={answer.isCorrect}
                      onChange={(e) => handleAnswerChange(index, e)}
                    />
                    Correct
                  </label>
                  <button type="button" onClick={() => removeAnswer(index)}>Supprimer</button>
                </div>
              ))}
              <button type="button" onClick={addAnswer}>Ajouter une réponse</button>
            </div>
            <button type="submit">{isEditMode ? 'Mise à jour' : 'Création'} de la question</button>
          </form>
        </div>

        <div className="questions-section">
          <h2>Mes questions :</h2>
          <ul>
            {userQuestions.map((question) => (
              <li key={question.QuestionID}>
                {question.Text}
                <button onClick={() => handleEditQuestion(question.QuestionID)}>Editer</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuestionForm;
