import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './pages/welcome.js';
import Login from './pages/login.js';
import Register from './pages/register.js'
import './styles/welcome.css';
import './styles/login.css';
import './styles/general.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<Welcome />} />

          {/* Route pour la page de connexion */}
          <Route path="/Login" element={<Login />} />

          {/* Route pour la page de connexion */}
          <Route path="/register" element={<Register />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
