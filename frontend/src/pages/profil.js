import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Header from '../components/header';
import '../styles/profile.css';
import '..styles/form.css';

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Contenu principal du profil */}
      <div className="profile-container">
        <h1>Profil de {user.firstname} {user.name}</h1>

        {/* Informations utilisateur */}
        <section className="profile-info">
          <h2>Informations Personnelles</h2>
          <p><strong>Nom complet:</strong> {user.firstname} {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Date de naissance:</strong> {user.dob}</p>
          <p><strong>Rôle:</strong> {user.role}</p>
          <p><strong>Niveau scolaire:</strong> {user.level}</p>
        </section>

        {/* Section Paramètres */}
        <section className="settings">
          <h2>Paramètres</h2>
          <button className="btn">Modifier le profil</button>
          <button className="btn">Changer le mot de passe</button>
          <button className="btn">Se déconnecter</button>
        </section>
      </div>

      {/* Footer */}
      <footer className='footer-general'>
        <p className="slogan">LEARN & PLAY</p>
      </footer>
    </div>
  );
}

export default Profile;
