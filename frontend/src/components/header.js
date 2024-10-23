import React from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/Logo_Fox.png';

const Header = () => {
  return (

    <header className="header-container">
      <div className="header-title">
        <Link to="/">
          <div>
            <img src={logo} alt="Logo Fox" className="logo" />
          </div>
        </Link>
      </div>
      <div className="header-buttons">
        <button className="btn-cta" onClick={() => window.location.href = '/login'}>
          Connexion
        </button>
      </div>
    </header>
  );
};

export default Header;
