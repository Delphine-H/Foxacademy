import React from 'react';
import './styles/menu.css';
import 'Foxacademy-logo.png';

const Menu = () => {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          {/* Assure-toi d'importer l'image du logo correctement si nécessaire */}
          <img src="Foxacademy-logo.png" alt="Foxacademy Logo" className="logo" />
        </div>
        <nav className="top-nav">
          <a href="#quizz">Quizz</a>
          <a href="#progression">Progression</a>
          <a href="#jeux">Jeux</a>
          <button className="menu-button">Menu</button>
        </nav>
      </header>

      {/* Section principale du menu */}
      <div className="main-content">
        <h1>Menu</h1>
        <div className="card-grid">
          <div className="card">
            <img src="fox-profil.png" alt="Profil" className="card-icon" />
            <p>Profil</p>
          </div>
          <div className="card">
            <img src="progress-icon.png" alt="Progression" className="card-icon" />
            <p>Progression</p>
          </div>
          <div className="card">
            <img src="quiz-icon.png" alt="Quizz" className="card-icon" />
            <p>Quizz</p>
          </div>
          <div className="card">
            <img src="game-icon.png" alt="Jeux" className="card-icon" />
            <p>Jeux</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-text">LEARN & PLAY</div>
      </footer>
    </div>
  );
};

export default Menu;
