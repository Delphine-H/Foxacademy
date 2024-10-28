import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // état de chargement
  const navigate = useNavigate();

  // Fonction pour se connecter
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        Email: email,
        Password: password,
      });

      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem('token', token); // Stocker le token dans le localStorage
        setUser({ token, role });
        setLoading(false); // Arrêter le chargement après connexion réussie
        navigate('/menu');
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error; // Propager l'erreur pour qu'elle soit capturée dans Login.js
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Vérifier si un utilisateur est connecté au chargement de l’application
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  // Ne rendre l'application visible que lorsque la vérification est terminée
  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
