import { useEffect } from 'react';

// Player component to render the player, rockets, and enemies on the canvas
function Player({ canvasRef, playerX, rockets, enemies, gameStatus, enemyColor }) {
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Function to clear the canvas before each new update
        const clearCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        // Draw the player as a green rectangle
        ctx.fillStyle = 'green';
        ctx.fillRect(playerX, 550, 50, 30); // Player's position and size

        // Draw each rocket as a red rectangle
        rockets.forEach(rocket => {
            ctx.fillStyle = 'red';
            ctx.fillRect(rocket.x, rocket.y, 5, 20); // Rocket's position and size
        });

        // Draw each enemy as a rectangle, color depends on game status
        enemies.forEach(enemy => {
            ctx.fillStyle = gameStatus === 'lost' ? 'gray' : enemyColor;
            ctx.fillRect(enemy.x, enemy.y, 50, 30); // Enemy's position and size
        });

        // Return the clearCanvas function to be called on component unmount
        return clearCanvas;
    }, [playerX, rockets, enemies, gameStatus, enemyColor, canvasRef]); // Dependencies for useEffect

    return null; // This component does not render any JSX
}

export default Player;