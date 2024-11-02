
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Welcome from './pages/welcome.js';
import Login from './pages/login.js';
import Register from './pages/register.js';
import Menu from './pages/menu.js';
import QuizForm from './pages/quiz.js';
import Profil from './pages/profil.js';
import Game from './pages/jeux.js';
import Progression from './pages/progression.js';
import QuestionForm from './pages/questions.js';
import './styles/welcome.css';
import './styles/general.css';
import './styles/menu.css';
import './styles/header.css';
import './styles/footer.css';
import { AuthProvider, AuthContext } from './context/authContext.js';

// Composant pour protéger les routes
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="App">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<Welcome />} />

          {/* Route pour la page de connexion */}
          <Route path="/Login" element={<Login />} />

          {/* Route pour la page d'enregistrement */}
          <Route path="/register" element={<Register />} />

          {/* Route pour la page du menu' */}
          <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />

          {/* Route pour la page du quizz */}
          <Route path="/quizz" element={<PrivateRoute><QuizForm /></PrivateRoute>} />

          {/* Route pour la page profil */}
          <Route path="/profil" element={<PrivateRoute><Profil /></PrivateRoute>} />

          {/* Route pour la page de jeux */}
          <Route path="/jeux" element={<PrivateRoute><Game /></PrivateRoute>} />

          {/* Route pour la page progression */}
          <Route path="/progression" element={<PrivateRoute><Progression /></PrivateRoute>} />

          {/* Route pour la page de création des questions */ }
          <Route path="/create_question" element={<PrivateRoute><QuestionForm/></PrivateRoute>} />

          {/* Route pour l'edition des questions */ }
          <Route path="/edit_questions/:id" element={<PrivateRoute><QuestionForm/></PrivateRoute>} />

        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
