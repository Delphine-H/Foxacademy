import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import Header from '../components/header';
import '../styles/form.css';
import '../styles/general.css';
import '../styles/header.css';
import '../styles/profil.css';

function Profil() {
  const { user } = useContext(AuthContext);

  // États locaux pour les valeurs des champs d'entrée
  const [firstname, setFirstname] = useState(user?.firstname || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [role, setRole] = useState(user?.role || '');
  const [level, setLevel] = useState(user?.level || '');
  const [avatar, setAvatar] = useState(user?.avatar || ''); // État pour l'avatar

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]); // Récupérer le fichier
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour envoyer les données du profil, y compris l'avatar
    // Exemple : envoyer les données à votre API
  };

  if (!user) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Contenu principal du profil */}
      <div className="form-container">
        {/* Section Paramètres */}
        <section className="settings">
          <h1>Profil</h1>
          <label>
            Photo de profil:
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>
          <label>
            Prénom:
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </label>
          <label>
            Nom:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Date de naissance:
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </label>
          <label>
            Rôle:
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
          <label>
            Niveau scolaire:
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </label>
          <button className="btn" onClick={handleSubmit}>Modifier le profil</button>
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

export default Profil;
