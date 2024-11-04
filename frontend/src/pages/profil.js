import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/form.css';
import '../styles/general.css';
import '../styles/header.css';
import '../styles/profil.css';
import axios from 'axios';

// Import des images disponibles dans le répertoire src/assets/photos_profil
import avatar0 from '../assets/photos_profil/renard_profil0.jpeg';
import avatar1 from '../assets/photos_profil/renard_profil1.jpeg';
import avatar2 from '../assets/photos_profil/renard_profil2.jpeg';
import avatar3 from '../assets/photos_profil/renard_profil3.jpeg';
import avatar4 from '../assets/photos_profil/renard_profil4.jpeg';
import avatar5 from '../assets/photos_profil/renard_profil5.jpeg';
import avatar6 from '../assets/photos_profil/renard_profil6.jpeg';
import avatar7 from '../assets/photos_profil/renard_profil7.jpeg';
import avatar8 from '../assets/photos_profil/renard_profil8.jpeg';
import avatar9 from '../assets/photos_profil/renard_profil9.jpeg';
import avatar10 from '../assets/photos_profil/renard_profil10.jpeg';
import avatar11 from '../assets/photos_profil/renard_profil11.jpeg';
import avatar12 from '../assets/photos_profil/renard_profil12.jpeg';

// Mappage des noms de fichiers aux chemins des images importées
const avatarMap = {
  avatar0: avatar0,
  avatar1: avatar1,
  avatar2: avatar2,
  avatar3: avatar3,
  avatar4: avatar4,
  avatar5: avatar5,
  avatar6: avatar6,
  avatar7: avatar7,
  avatar8: avatar8,
  avatar9: avatar9,
  avatar10: avatar10,
  avatar11: avatar11,
  avatar12: avatar12,
};

const availableAvatars = Object.keys(avatarMap);

function Profil() {
  const { user, setUser, logout } = useContext(AuthContext);

  // États locaux pour les valeurs des champs d'entrée
  const [firstname, setFirstname] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [avatar, setAvatar] = useState('');
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        setFirstname(userData.Firstname);
        setName(userData.Name);
        setEmail(userData.Email);
        setDob(new Date(userData.Dob).toISOString().split('T')[0]); // Formater la date de naissance
        setRole(userData.Role);
        setLevel(userData.Level);
        setAvatar(userData.Avatar);
        const avatarIndex = availableAvatars.indexOf(userData.Avatar);
        setCurrentAvatarIndex(avatarIndex !== -1 ? avatarIndex : 0);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [setUser]);

  const handleAvatarChange = (index) => {
    setCurrentAvatarIndex(index);
    setAvatar(availableAvatars[index]); // Mettre à jour l'avatar avec le nom du fichier sélectionné
  };

  const handleNextAvatar = () => {
    const nextIndex = (currentAvatarIndex + 1) % availableAvatars.length;
    handleAvatarChange(nextIndex);
  };

  const handlePrevAvatar = () => {
    const prevIndex = (currentAvatarIndex - 1 + availableAvatars.length) % availableAvatars.length;
    handleAvatarChange(prevIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const updatedProfile = {
      Firstname: firstname,
      Name: name,
      Email: email,
      Dob: dob,
      Role: role,
      Level: level,
      Avatar: avatar, // Nom du fichier de l'avatar
    };

    try {
      await axios.put('http://localhost:5000/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Échec de la mise à jour du profil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      await axios.put('http://localhost:5000/profile/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Mot de passe mis à jour avec succès');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Échec de la mise à jour du mot de passe');
    }
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
            <div className="avatar-carousel">
              <button onClick={handlePrevAvatar}>◀</button>
              <img
                src={avatarMap[availableAvatars[currentAvatarIndex]]}
                alt={`Avatar ${currentAvatarIndex}`}
                className="avatar-thumbnail"
              />
              <button onClick={handleNextAvatar}>▶</button>
            </div>
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
              readOnly
            />
          </label>
          <label>
            Niveau scolaire:
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
            </select>
          </label>
          <button className="btn" onClick={handleSubmit}>Modifier le profil</button>
          <form onSubmit={handleChangePassword}>
            <label>
              Ancien mot de passe:
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>
            <label>
              Nouveau mot de passe:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <button className="btn" type="submit">Changer le mot de passe</button>
          </form>
          <button className="btn" onClick={logout}>Se déconnecter</button>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Profil;
