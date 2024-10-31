import axios from 'axios';

export const fetchUserScore = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/game/score`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const score = parseInt(response.data.score);
    console.log('Score de l\'utilisateur:', score);
    return score;
  } catch (error) {
    console.error('Erreur lors de la récupération du score de l\'utilisateur:', error);
  }
};

