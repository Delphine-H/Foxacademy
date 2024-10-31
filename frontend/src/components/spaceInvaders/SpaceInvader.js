import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Player from './Player';
import Controls from './Controls';
import { fetchUserScore } from '../../utils/appUtils';
import { generateEnemies, moveRockets, checkCollisions, moveEnemies, movePlayer, shootRocket, victorySound, collisionSound, rainbowColors } from '../../utils/gameUtils';
import spaceInvaderImage from '../../assets/game_screenshot/space_invader.png';

function Game() {
    const canvasRef = useRef(null);
    const [playerX, setPlayerX] = useState(375);
    const [movingLeft, setMovingLeft] = useState(false);
    const [movingRight, setMovingRight] = useState(false);
    const [rockets, setRockets] = useState([]); // Array of rockets
    const [lastShotTime, setLastShotTime] = useState(0);
    const [enemies, setEnemies] = useState(generateEnemies()); // Array of enemies
    const [enemyDirection, setEnemyDirection] = useState('right');
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState('waiting'); // Initial game status is 'waiting'
    const [enemySpeed, setEnemySpeed] = useState(15);
    const [enemyColorIndex, setEnemyColorIndex] = useState(0);
    const lastUpdateTimeRef = useRef(performance.now()); // Reference to the last update time
    const [totalScore, setTotalScore] = useState(0); // Total score of the user (will be fetched from the backend)

    // Callback to move the player
    const movePlayerCallback = useCallback(() => {
        movePlayer(playerX, setPlayerX, movingLeft, movingRight);
    }, [playerX, setPlayerX, movingLeft, movingRight]);

    // Callback to shoot a rocket
    const shootRocketCallback = useCallback(() => {
        shootRocket(playerX, lastShotTime, setLastShotTime, setRockets);
    }, [playerX, lastShotTime, setLastShotTime, setRockets]);

    // Function to update the game state
    const updateGame = useCallback(() => {
        if (gameStatus !== 'playing') return;

        const now = performance.now();
        const deltaTime = now - lastUpdateTimeRef.current;
        lastUpdateTimeRef.current = now;

        movePlayerCallback();

        setRockets(prevRockets => moveRockets(prevRockets));
        const { newEnemies, rocketsToRemove } = checkCollisions(enemies, rockets);
        if (rocketsToRemove.size > 0 && collisionSound) {
            collisionSound.play();
        }

        setEnemies(newEnemies);
    
        setRockets(prevRockets => moveRockets(prevRockets, rocketsToRemove));
        
        setTimeElapsed(prevTime => prevTime + deltaTime);

        if (timeElapsed + deltaTime >= 1000) {
            setEnemies(prevEnemies => moveEnemies(prevEnemies, enemyDirection, setEnemyDirection, enemySpeed, setGameStatus));
            setTimeElapsed(0);
        }

        if (newEnemies.length === 0) {
            victorySound.play();
            setScore(prevScore => prevScore + 1);
            setEnemySpeed(prevSpeed => prevSpeed + 3);
            setEnemyColorIndex(prevIndex => (prevIndex + 1) % rainbowColors.length);
            setEnemies(generateEnemies());
        }
    }, [gameStatus, movePlayerCallback, rockets, enemies, enemyDirection, timeElapsed, enemySpeed]);

    // Effect to set up the game update interval
    useEffect(() => {
        const interval = setInterval(updateGame, 16);
        return () => clearInterval(interval);
    }, [updateGame]);

    // Effect to fetch the user's total score on component mount
    useEffect(() => {
        const fetchTotalScore = async () => {
            try {
                const score = await fetchUserScore();
                setTotalScore(score);
            } catch (error) {
                console.error('Erreur lors de la récupération du score de l\'utilisateur:', error);
            }
        };
        fetchTotalScore();
    }, []); // Run only on component mount

    // Effect to draw the image when the game status is 'waiting'
    useEffect(() => {
        if (gameStatus === 'waiting') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = spaceInvaderImage;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        }
    }, [gameStatus]);

    // Function to start the game
   const startGame = async () => {
    try {
        const userScore = await fetchUserScore();
        console.log('Score de l\'utilisateur:', userScore);
        if (userScore < 10) {
            alert('Tu n\'as pas assez de points pour démarrer le jeu. Tu as besoin de 10 points pour jouer.');
            return;
        }
        const response = await axios.post(`http://localhost:5000/game/consume`, { ScoreConsumed: 10 }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            setTotalScore(response.data.newTotalScore);
            setGameStatus('playing');
        } else {
            alert('Erreur lors de la consommation des points. Veuillez réessayer.');
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert('Votre session a expiré. Vous devez vous reconnecter pour jouer.');
        } else {
        alert('Erreur lors de la vérification des points. Veuillez réessayer.');
        }
    }
};

    // Function to reset the game
    const resetGame = () => {
        setPlayerX(375);
        setMovingLeft(false);
        setMovingRight(false);
        setRockets([]);
        setEnemies(generateEnemies());
        setEnemyDirection('right');
        setTimeElapsed(0);
        setScore(0);
        setGameStatus('waiting'); // Reset game status to 'waiting'
        setEnemySpeed(15);
        setEnemyColorIndex(0);
        lastUpdateTimeRef.current = performance.now();
    };

    return (
        <div tabIndex="0" style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Space Invaders</h2>
            <div style={{ position: 'absolute', top: '100px', left: '10px', fontSize: '18px', fontWeight: 'bold' }}>
                Score Total: {totalScore}
            </div>
            <canvas ref={canvasRef} width={800} height={600} style={{ border: '2px solid black', backgroundColor: 'white' }}></canvas>
            <div>
            {gameStatus === 'waiting' ? (
                <button onClick={startGame} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                    Commencer
                </button>
            ) : (
                <>
                    <Player canvasRef={canvasRef} playerX={playerX} rockets={rockets} enemies={enemies} gameStatus={gameStatus} enemyColor={rainbowColors[enemyColorIndex]} />
                    <Controls 
                        setMovingLeft={setMovingLeft} 
                        setMovingRight={setMovingRight} 
                        shootRocket={shootRocketCallback} 
                        gameStatus={gameStatus} 
                        resetGame={resetGame}
                    />
                    <h3>Points de la partie : {score}</h3>
                    {gameStatus === 'lost' && <h3>Bien joué, essaye encore !</h3>}
                </>
            )}
            </div>
        </div>
    );
}

export default Game;