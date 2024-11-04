import React, { useEffect, useState } from 'react';
import '../styles/footer.css';

// Composant Footer
const Footer = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    // Vérifie si la page est plus petite que la fenêtre
    const checkHeight = () => {
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;

      if (bodyHeight > windowHeight) {
        setIsAtBottom(false); // Footer en position relative
      } else {
        setIsAtBottom(true); // Footer en position fixed
      }
    };

    // Ajoute les événements de redimensionnement et de chargement
    window.addEventListener('resize', checkHeight);
    window.addEventListener('load', checkHeight);
    checkHeight(); // Appel initial

    // Nettoyage des événements
    return () => {
      window.removeEventListener('resize', checkHeight);
      window.removeEventListener('load', checkHeight);
    };
  }, []);

  // Rend le footer avec une classe conditionnelle
  return (
    <footer className={`footer-general ${isAtBottom ? 'fixed-footer' : ''}`}>
      <p>© 2024 FoxAcademy - Learn & Play. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
