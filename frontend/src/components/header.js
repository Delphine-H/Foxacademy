import React, { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import logo from '../assets/Logo_Fox.png';

const Header = () => {
  const { user, logout } = useContext(AuthContext); // Utilisation du contexte
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (user) {
      logout(); // Déconnecte l'utilisateur
    } else {
      navigate('/login'); // Redirige vers la page de connexion
    }
  };

  return (
<header className="header-container">
      <div className="header-title">
        <Link to="/">
          <h1>FoxAcademy</h1> {/* Remplacer le logo par le nom du site */}
        </Link>
      </div>

      {/* Si l'utilisateur est connecter */}
      {user && (
        <nav className="top-nav">
        <Link to="/quizz" className="menu-buttons">Quizz</Link>
        <Link to="/progression" className="menu-buttons">Progression</Link>
        <Link to="/jeux" className="menu-buttons">Jeux</Link>
        <button className="menu-button" onClick={() => navigate('/menu')}>Menu</button>
      </nav>
      )}
      <div className="header-buttons">
        <button className="btn-cta" onClick={handleLoginLogout}>
          {user ? "Déconnexion" : "Connexion"}
        </button>
      </div>
    </header>
  );
};

export default Header;
