import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Pour rediriger après la déconnexion
  // Charger les informations utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (loggedUser && token) {
        try {
            const parsedUser = JSON.parse(loggedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Erreur lors du parsing des données utilisateur:", error);
            localStorage.removeItem("user");
        }
    }
  }, []);
  const Signup = async (signupData) => {
    try {
        const response = await axios.post("http://localhost:5000/register", signupData);
        const userData = response.data.user;
        if (!userData.id || !userData.token) {
            console.error("Erreur lors de l'inscription : informations utilisateur incomplètes", userData);
            throw new Error("Informations utilisateur incomplètes");
        }
        login(userData);
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
    }
  };
  const login = (userData) => {
    console.log('Utilisateur connecté:', userData);
    // Stocker le token d'authentification
    localStorage.setItem("token", userData.token);
    // Stocker les données utilisateur
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // Mettre à jour l'état utilisateur directement avec userData
    console.log('Utilisateur stocké dans le contexte');
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // Redirection après la déconnexion
  };
  return (
    <AuthContext.Provider value={{ user, setUser, Signup, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
