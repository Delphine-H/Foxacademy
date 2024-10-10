import React, { useState } from 'react';
import '../styles/register.css';
import logo from '../assets/Foxacademy-logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    schoolYear: '',
    schoolLevel: '',
    school: '',
    className: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setErrorMessage('');

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inscription réussie!', data);
        // Redirection ou message de succès ici
      } else {
        setErrorMessage('Erreur lors de l’inscription. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l’inscription:', error);
      setErrorMessage('Une erreur est survenue, veuillez réessayer plus tard.');
    }
  };

  const addClass = () => {
    const newClass = prompt("Entrez le nom de la nouvelle classe:");
    if (newClass) {
      setFormData({
        ...formData,
        className: newClass.toLowerCase().replace(/\s+/g, ''),
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <header className='header-general' style={{ marginBottom: '100px' }}>
        <div className="header-buttons">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>
            Connexion
          </button>
        </div>
      </header>

      {/* Logo principal */}
      <div className="logo-container">
        <img src={logo} alt="Foxacademy Logo" className="logo" />
      </div>

      {/* Formulaire d'inscription */}
      <div className="register-form">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Nom:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date de naissance */}
          <div>
            <label htmlFor="dob">Date de naissance:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          {/*role de l'utilisateur */}
          <div>
            <label htmlFor="role">Rôle:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              ><option value="">Sélectionner votre rôle</option>
              <option value="eleve">Eleve</option>
              <option value="professeur">Professeur</option>
              </select>
          </div>

          {/* Année scolaire */}
          <div>
            <label htmlFor="schoolYear">Année scolaire:</label>
            <input
              type="text"
              id="schoolYear"
              name="schoolYear"
              value={formData.schoolYear}
              onChange={handleChange}
              placeholder="Ex: 2023-2024"
              required
            />
          </div>

          {/* Niveau scolaire */}
          <div>
            <label htmlFor="schoolLevel">Niveau scolaire:</label>
            <select
              id="schoolLevel"
              name="schoolLevel"
              value={formData.schoolLevel}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un niveau</option>
              <option value="primaire">CP</option>
              <option value="college">CE1</option>
              <option value="lycee">CE2</option>
              <option value="universite">CM1</option>
              <option value="universite">CM2</option>
            </select>
          </div>

          {/* École */}
          <div>
            <label htmlFor="school">École:</label>
            <select
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une école</option>
              <option value="ecole1">École Saint-Exupéry</option>
              <option value="ecole2">École Jeanne-d'Arc</option>
              <option value="ecole3">École Marie Curie</option>
            </select>
          </div>

          {/* Classe */}
          <div>
            <label htmlFor="class">Classe:</label>
            <select
              id="class"
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une classe</option>
              <option value="classe1">Classe 1</option>
              <option value="classe2">Classe 2</option>
              <option value="classe3">Classe 3</option>
            </select>
            <div>
              <button type="button" id="addClassBtn" onClick={addClass}>
                Ajouter une nouvelle classe
              </button>
            </div>
          </div>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit" className="btn-submit">S'inscrire</button>
        </form>
      </div>

      {/* Footer */}
      <footer className='footer-general'>
        <p className="slogan">LEARN & PLAY</p>
      </footer>
    </div>
  );
};

export default Register;
