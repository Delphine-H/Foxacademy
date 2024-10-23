import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../styles/form.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialisation du hook useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const { token, role } = data;
        // Stocker le token et le rôle
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        // Rediriger vers la page /menu
        navigate('/menu'); // Redirection après succès
        setErrorMessage(''); // Réinitialiser les messages d'erreur
      } else {
        setErrorMessage('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Something went wrong, please try again later.');
    }
  };

  return (
    <div>
      {/* Header */}
  <Header />

      {/* Formulaire de connexion */}
      <div className="form-container">
        <h2>Connexion</h2>
        <p>
            Vous n'êtes pas encore inscrits ?{" "}
            <Link to="/register" className="link">
              Inscrivez-vous ici
            </Link>
            .
          </p>
        <form onSubmit={handleLogin}>
          <div style={{ paddingTop: '30px' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ paddingTop: '30px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Link to="/menu">
          <button style={{ marginTop: '50px' }} type="submit" className="btn-cta">Se connecter</button>
        </Link>
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
