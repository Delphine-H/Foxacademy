import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Header from '../components/header';
import '../styles/form.css';
import '../styles/footer.css';
import axios from 'axios';
import Footer from '../components/footer';

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
  const [showPassword, setShowPassword] = useState(false);

  const { login, user } = useContext(AuthContext); // Récupérer login depuis le contexte
  const navigate = useNavigate();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/menu');
    }
  }, [user, navigate]);

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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }
    setErrorMessage('');

    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
    if (emptyFields.length) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        Name: formData.name,
        Firstname: formData.firstname,
        Email: formData.email,
        Dob: formData.dob,
        Password: formData.password,
        Level: formData.level,
        Role: formData.role,
      });

      if (response.status === 201) {
        console.log('Inscription réussie!', response.data);

        // Se connecter automatiquement après l'enregistrement
        await login(formData.email, formData.password);
      } else {
        setErrorMessage('Erreur lors de l’inscription. Veuillez réessayer.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Erreur lors de l’inscription:', error.response.data);
      } else if (error.request) {
        console.error('Erreur lors de l’inscription: La requête n’a pas reçu de réponse.', error.request);
      } else {
        console.error('Erreur lors de l’inscription:', error.message);
      }
      setErrorMessage('Une erreur est survenue, veuillez réessayer plus tard.');
    }
  };

  return (

    <div>
      {/* Header */}
      <Header />

      {/* Formulaire d'inscription */}
      <div className="form-container">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
          <p>
            Vous avez déjà un compte ?<br />
            <Link to="/login" className="link">
              Connectez-vous ici
            </Link>
            .
          </p>

          {/* Nom & Prénom */}
          <div className="container-row">
            <div className="form-group">
            <div className='label'>
              <label htmlFor="name">Nom:</label>
              </div>
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
            <div className='label'>
              <label htmlFor="firstname">Prénom:</label>
              </div>
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
          </div>

          {/* Mail & date de naissance */}
          <div className="container-row">
            <div className="form-group">
            <div className='label'>
              <label htmlFor="dob">Date de naissance:</label>
              </div>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
            <div className='label'>
              <label htmlFor="email">Email:</label>
              </div>
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
          </div>

          {/* Rôle & Niveau */}
          <div className="container-row">
            <div className="form-group">
            <div className='label'>
              <label htmlFor="role">Rôle:</label>
              </div>
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
            <div className="form-group">
            <div className='label'>
              <label htmlFor="level">Niveau scolaire:</label>
              </div>
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
          </div>

          {/* Les mots de passes */}
          <div className="container-row">
            <div className="form-group">
            <div className='label'>
              <label htmlFor="password">Mot de passe:</label>
              </div>
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
                  onClick={() => setShowPassword(!showPassword)}
                  className={
                    showPassword
                      ? "fa-solid fa-eye eye-iconOpen"
                      : "fa-solid fa-eye-slash eye-iconClose"
                  }
                ></i>
              </div>
            </div>

            <div className="form-group ">
            <div className='label'>
              <label htmlFor="confirmPassword">Confirmez le mot de passe:</label>
              </div>
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
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "20px",
                  top: "220px",
                }}
              ></i>
            </div>
          </div>

          {/* Les erreurs */}
          {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          <button type="submit" className="submit">S'inscrire</button>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div >
  );
};

export default Register;
