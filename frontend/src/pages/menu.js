import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/menu.css';
import logoFox from '../assets/Logo_Fox.png';
import Header from '../components/header';
import '../styles/footer.css';

const Menu = () => {
  const navigate = useNavigate();

  const handleQuizNavigation = () => {
    navigate('/quizz');
  };

  const handleProfilNavigation = () => {
    navigate('/profil');
  };

  const handleGameNavigation = () => {
    navigate('/jeux');
  };

  return (
    <div>
      <Header />

      {/* Section principale du menu */}
      <div className="main-content">
        <h1>Menu</h1>
        <div className="card-grid">
         <div className="card" onClick={handleProfilNavigation}>
            <img src="fox-profil.png" alt="Profil" className="card-icon" />
            <p>Profil</p>
          </div>
          <div className="card">
            <img src="progress-icon.png" alt="Progression" className="card-icon" />
            <p>Progression</p>
          </div>
          <div className="card" onClick={handleQuizNavigation}>
            <img src="quiz-icon.png" alt="Quizz" className="card-icon" />
            <p>Quizz</p>
          </div>
          <div className="card" onClick={handleGameNavigation}>
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
