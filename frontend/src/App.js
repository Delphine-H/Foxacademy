import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './pages/welcome';
import Login from './pages/login';
import './styles/welcome.css';
import './styles/login.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<Welcome />} />

          {/* Route pour la page de connexion */}
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
