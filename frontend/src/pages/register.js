import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../styles/form.css';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      firstname: "",
      confirmPassword: "",
      dob: "",
      level: "",
      role: "",
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

       // Vérifier si tous les champs sont remplis
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
    if (emptyFields.length) {
        setErrorMessage("Tous les champs sont obligatoires.");
        return;
    }

    try {
      console.log(formData); // Vérifie que tous les champs sont bien remplis
      const response = await axios.post("http://localhost:5000/register", {
        Name: formData.name,
        Firstname: formData.firstname,
        Email: formData.email,
        Dob: formData.dob,
        Password: formData.password,
        Level: formData.level,
        Role: formData.role,
      });


      if (response.status === 201) { // Le code 201 indique une création réussie
        console.log('Inscription réussie!', response.data);
        navigate("/menu"); // Redirection après succès
      } else {
        setErrorMessage('Erreur lors de l’inscription. Veuillez réessayer.');
      }
    }catch (error) {
      if (error.response) {
        console.error('Erreur lors de l’inscription:', error.response.data); // La réponse du serveur
      } else if (error.request) {
        console.error('Erreur lors de l’inscription: La requête n’a pas reçu de réponse.', error.request); // La requête a été envoyée mais aucune réponse reçue
      } else {
        console.error('Erreur lors de l’inscription:', error.message); // Une autre erreur est survenue
      }
      setErrorMessage('Une erreur est survenue, veuillez réessayer plus tard.');
    }
  };

  // Fonction pour ajouter une nouvelle classe
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
      <Header />

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
            <label htmlFor="firstname">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              placeholder="Firstname"
              autoComplete="Firstname"
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
              required>
                <option value="">Sélectionner votre rôle</option>
              <option value="Elève">Elève</option>
              <option value="Professeur">Professeur</option>
              </select>
          </div>

          {/* Niveau scolaire */}
          <div>
            <label htmlFor="level">Niveau scolaire:</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required>
                <option value="">Sélectionner votre Niveau</option>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
            </select>
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
