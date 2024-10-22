import React from 'react';
import '../styles/welcome.css';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo_Fox.png';

const Welcome = () => {
  return (
      <>
        {/* Header */}
        <header>
          <div className="header-buttons">
            <Link className='btn-cta' to="/login"> Connexion </Link>
          </div>
        </header>

        {/* Bannière principale */}
        <section className="banner">
          <div className="banner-content">
            <img src={logo} alt="Fox Logo" className="logo-home" />
            <h1>Bienvenue à <span className="title-fox">Fox</span><span className="title-academy">Academy</span></h1>
    <p>Où l’apprentissage devient un jeu d’enfant ! Explorez, apprenez et jouez avec nous.</p>
    <Link className="btn-cta" to="/login">Commencez à apprendre</Link>
  </div>
</section>

        {/* À propos */}
        <section className="about">
          <h2>À propos de FoxAcademy</h2>
          <p>FoxAcademy est un site dédié à rendre l'apprentissage amusant et interactif pour les enfants. Nous croyons que chaque enfant peut apprendre tout en jouant, et notre plateforme propose des jeux éducatifs, des activités interactives et des ressources pédagogiques adaptées à tous les âges.</p>
        </section>
        {/* Fonctionnalités principales */}
        <section className="features">
          <h2>Fonctionnalités principales</h2>
          <div className="feature">
            <h3>Jeux éducatifs</h3>
            <p>Des jeux conçus pour stimuler la créativité et développer les compétences cognitives de vos enfants.</p>
          </div>
          <div className="feature">
            <h3>Activités interactives</h3>
            <p>Des activités amusantes qui encouragent l'apprentissage pratique et collaboratif.</p>
          </div>
          <div className="feature">
            <h3>Ressources pédagogiques</h3>
            <p>Des supports d’apprentissage pour aider vos enfants à réussir à l’école.</p>
          </div>
        </section>
        {/* Témoignages */}
        <section className="testimonials">
          <h2>Témoignages</h2>
          <blockquote>
            “Mon enfant adore les jeux sur FoxAcademy et a énormément progressé à l’école. Merci !” - Parent
          </blockquote>
          <blockquote>
            “J'apprends plein de choses tout en m'amusant avec mes amis !” - Enfant de 8 ans
          </blockquote>
        </section>
        {/* Bouton d'appel à l'action */}
        <section className="cta-section">
          <h2>Prêt à commencer ?</h2>
          <p>Inscrivez-vous dès maintenant et rejoignez des milliers d'enfants qui apprennent tout en s'amusant !</p>
          <Link className="btn-cta" to="/register">C'est parti !</Link>
        </section>
        {/* Footer */}
        <footer>
          <p className="slogan">LEARN & PLAY</p>
        </footer>
      </>
  );
}
export default Welcome;
