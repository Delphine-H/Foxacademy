import React, { useEffect } from 'react';

// Style for the buttons
const buttonStyle = {
    margin: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
};

// Controls component to handle player controls
function Controls({ setMovingLeft, setMovingRight, shootRocket, gameStatus, resetGame }) {
    useEffect(() => {
        // Function to handle key down events
        const handleKeyDown = (e) => {
            if (gameStatus !== 'playing') return; // Don't handle key events if the game is not playing
            if (e.key === 'ArrowLeft') setMovingLeft(true);
            if (e.key === 'ArrowRight') setMovingRight(true);
            if (e.key === ' ') shootRocket();
        };

        // Function to handle key up events
        const handleKeyUp = (e) => {
            if (e.key === 'ArrowLeft') setMovingLeft(false);
            if (e.key === 'ArrowRight') setMovingRight(false);
        };

        // Add event listeners for key down and key up
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Clean up event listeners on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setMovingLeft, setMovingRight, shootRocket, gameStatus]); // Dependencies for useEffect

    return (
        <div>
            {gameStatus === 'lost' ? (
                // Show "Rejouer" button if the game is lost
                <button style={buttonStyle} onClick={resetGame}>
                    Rejouer
                </button>
            ) : (
                // Show control buttons if the game is playing
                <>
                    <button
                        style={buttonStyle}
                        onMouseDown={() => setMovingLeft(true)}
                        onMouseUp={() => setMovingLeft(false)}
                        onMouseLeave={() => setMovingLeft(false)}
                    >
                        Gauche
                    </button>
                    <button
                        style={buttonStyle}
                        onMouseDown={() => setMovingRight(true)}
                        onMouseUp={() => setMovingRight(false)}
                        onMouseLeave={() => setMovingRight(false)}
                    >
                        Droite
                    </button>
                    <button style={buttonStyle} onClick={shootRocket}>
                        Tirer
                    </button>
                </>
            )}
        </div>
    );
}

export default Controls;