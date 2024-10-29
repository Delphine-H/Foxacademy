import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Header from '../components/header';
import '../styles/form.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/menu');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      setErrorMessage('Invalid credentials');
    }
  };
return (
    <div>
      {/* Header */}
      <Header />

      {/* Formulaire de connexion */}
      <div className='form-connexion'>
        <h1>Connexion</h1>
        <p>
          Vous n'êtes pas encore inscrits ? <br />
          <Link to="/register" className="link">
            Inscrivez-vous ici
          </Link>
          .
        </p>

        {/* Email */}
        <form onSubmit={handleLogin}>

          <div className='label'>
            <label>Email:</label>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Mot de passe */}
          <div className='label'>
            <label>Password:</label>
          </div>
          <div className="password-container" >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
            <i
              onClick={() => setShowPassword(!showPassword)} // Toggle pour afficher/masquer
              className={
                showPassword ? "fa-solid fa-eye eye-iconOpen" : "fa-solid fa-eye-slash eye-iconClose" }
            ></i>
          </div>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit" className="submit">Se connecter</button>
        </form>
      </div>
      {/* Footer */}
      <footer className='footer-general'>
        <p className="slogan">LEARN & PLAY</p>
      </footer>
    </div>
  );
};

export default Login;
