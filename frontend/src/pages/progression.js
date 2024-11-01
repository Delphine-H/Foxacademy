import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/progression.css';
import Header from '../components/header';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressionChart = () => {
  const [chartData, setChartData] = useState({});

  // Liste de toutes les matières possibles
  const allSubjects = ['Mathématiques', 'Français', 'Histoire', 'Géographie', 'Sciences', 'Anglais'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/dashboard/student', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Data:', response.data);

        // Initialiser les données pour chaque matière
        const subjectsData = {};

        allSubjects.forEach((subject) => {
          subjectsData[subject] = {
            goodAnswers: 0,
            badAnswers: 0,
          };
        });

        // Mettre à jour les données avec les valeurs récupérées
        const subject = response.data.Subject;
        const score = parseInt(response.data.totalscore, 10);
        const totalQuestions = parseInt(response.data.totalquestions, 10);

        if (subjectsData[subject]) {
          subjectsData[subject].goodAnswers = score;
          subjectsData[subject].badAnswers = totalQuestions - score;
        }

        // Créer les données pour chaque graphique
        const charts = {};
        Object.keys(subjectsData).forEach((subject) => {
          charts[subject] = {
            labels: ['Bonnes Réponses', 'Mauvaises Réponses'],
            datasets: [
              {
                label: subject,
                data: [subjectsData[subject].goodAnswers, subjectsData[subject].badAnswers],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)', // Couleur pour les bonnes réponses
                  'rgba(255, 99, 132, 0.6)',  // Couleur pour les mauvaises réponses
                ],
                borderWidth: 1,
              },
            ],
          };
        });

        setChartData(charts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header/>
      <h2>Voici ta progression :</h2>
      <div className='chart-grid'>
        {Object.keys(chartData).map((subject) => (
          <div key={subject} className="chart-container">
            <h3>{subject}</h3>
            <Doughnut
              data={chartData[subject]}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: `Progression en ${subject}`,
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressionChart;