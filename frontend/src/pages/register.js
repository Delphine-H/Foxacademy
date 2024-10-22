import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import '../styles/register.css';
import logo from '../assets/Logo_Fox.png';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    schoolYear: "",
    schoolLevel: "",
    school: "",
    className: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe

  const navigate = useNavigate(); // Pour la redirection après succès

  // Fonction pour mettre à jour les valeurs des champs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

// Fonction pour gérer la soumission du formulaire
const handleSubmit = async (e) => {
  e.preventDefault();


    // Vérifier si les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }
    setErrorMessage('');
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        {
          Name: formData.name,
          Email: formData.email,
          Password: formData.password,
          Firstname: formData.firstname,
          Dob: formData.dob,
          Level: formData.schoolLevel,
          Role: formData.role,
        }
      );

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
      <header className="header-container">
        <div className="header-title">
        <Link to="/">
          <div>
        <img src={logo} alt="Logo Fox" className="logo" />
        </div>
          </Link>
          </div>
        <div className="header-buttons">
          <button className="btn-cta" onClick={() => window.location.href = '/login'}>
            Connexion
          </button>
        </div>
      </header>

      {/* Formulaire d'inscription */}
      <div className="register-form">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
        <p>
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="link">
              Connectez-vous ici
            </Link>
            .
          </p>

          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Name"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="E-mail"
              autoComplete="email"
            />
          </div>
          {/* Champ pour le mot de passe avec icône d'affichage */}
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                autoComplete="new-password"
              />
              <i
                onClick={() => setShowPassword(!showPassword)} // Toggle pour afficher/masquer
                className={
                  showPassword
                    ? "fa-solid fa-eye eye-iconOpen"
                    : "fa-solid fa-eye-slash eye-iconClose"
                }
              ></i>
            </div>
          </div>
          {/* Champ pour confirmer le mot de passe avec icône d'affichage */}
          <div className="form-group ">
            <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repeat your Password"
              autoComplete="new-password"
            />
            <i
              onClick={() => setShowPassword(!showPassword)} // Toggle pour afficher/masquer
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "20px",
                top: "220px",
              }} // Style pour bien positionner l'icône
            ></i>
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

          {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          <button type="submit" className="btn-cta">S'inscrire</button>
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
