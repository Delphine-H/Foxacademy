import axios from 'axios';

export const fetchUserScore = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/profile/score`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.score;
  } catch (error) {
    console.error('Erreur lors de la récupération du score de l\'utilisateur:', error);
  }
};

