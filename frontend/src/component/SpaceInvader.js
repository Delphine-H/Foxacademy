import React, { useRef, useEffect, useState, useCallback } from 'react';
import Player from './Player';
import Controls from './Controls';
import { generateEnemies, moveRockets, checkCollisions, moveEnemies, movePlayer, shootRocket, victorySound, collisionSound, rainbowColors } from '../utils/gameUtils';

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

    // Function to start the game
    const startGame = () => {
        setGameStatus('playing');
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
            <h2>Jeu Space Invaders</h2>
            <canvas ref={canvasRef} width={800} height={600} style={{ border: '2px solid black' }}></canvas>
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
                    <h3>Score: {score}</h3>
                    {gameStatus === 'lost' && <h3>Bien joué, essaye encore !</h3>}
                </>
            )}
            </div>
        </div>
    );
}

export default Game;