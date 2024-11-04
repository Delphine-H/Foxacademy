import React, { useEffect, useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../styles/progression.css';
import Header from '../components/header';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ProgressionChart = () => {
  const [chartData, setChartData] = useState({});

  // Liste de toutes les matières possibles, mémorisée pour éviter les changements de dépendances
  const allSubjects = useMemo(() => ['Mathématiques', 'Français', 'Histoire', 'Géographie', 'Sciences', 'Anglais'], []);

  useEffect(() => {
    let isMounted = true; // Drapeau pour vérifier si le composant est monté

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
        Object.entries(response.data).forEach(([subject, result]) => {
          const score = parseInt(result.totalScore, 10);
          const totalQuestions = parseInt(result.questionCount, 10);

          if (subjectsData[subject]) {
            subjectsData[subject].goodAnswers = score;
            subjectsData[subject].badAnswers = totalQuestions - score;
          }
        });

        // Créer les données pour chaque graphique
        const charts = {};
        Object.keys(subjectsData).forEach((subject) => {
          const goodAnswers = subjectsData[subject].goodAnswers;
          const badAnswers = subjectsData[subject].badAnswers;

          charts[subject] = {
            labels: ['Bonnes Réponses', 'Mauvaises Réponses'],
            datasets: [
              {
                label: subject,
                data: [goodAnswers, badAnswers],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)', // Couleur pour les bonnes réponses
                  'rgba(255, 99, 132, 0.6)',  // Couleur pour les mauvaises réponses
                ],
                borderWidth: 1,
              },
            ],
            plugins: {
              datalabels: {
                display: (context) => context.dataIndex === 0, // Afficher uniquement pour les bonnes réponses
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                  const percentage = total > 0 ? ((context.dataset.data[0] / total) * 100).toFixed(0) : null;
                  return percentage !== null ? `${percentage}%` : 'pas de données';
                },
                color: 'black',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
          };
        });

        if (isMounted) {
          setChartData(charts);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Mettre à jour le drapeau lorsque le composant est démonté
    };
  }, [allSubjects]); // Ajoutez allSubjects comme dépendance

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
                  datalabels: {
                    display: (context) => context.dataIndex === 0, // Afficher uniquement pour les bonnes réponses
                    formatter: (value, context) => {
                      const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                      const percentage = total > 0 ? ((context.dataset.data[0] / total) * 100).toFixed(0) : null;
                      return percentage !== null ? `${percentage}%` : 'pas de données';
                    },
                    color: 'black',
                    font: {
                      weight: 'bold',
                      size: 16,
                    },
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
