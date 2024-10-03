// Array of rainbow colors used for enemy colors
export const rainbowColors = ['red', 'orange', 'yellow', 'springgreen', 'blue', 'indigo', 'violet'];

// Sound effects
export const victorySound = new Audio('/sounds/victory.mp3');
export const collisionSound = new Audio('/sounds/collision.mp3');
export const gameOverSound = new Audio('/sounds/gameover.mp3');

// Function to generate the initial array of enemies
export function generateEnemies() {
    const enemiesArray = [];
    for (let i = 0; i < 5; i++) { // 5 rows of enemies
        for (let j = 0; j < 10; j++) { // 10 enemies per row
            enemiesArray.push({ x: j * 60, y: i * 40 }); // Position each enemy
        }
    }
    return enemiesArray;
}

// Function to move rockets upwards and filter out those that are off-screen or hit an enemy
export function moveRockets(rockets, rocketsToRemove = new Set()) {
    return rockets
        .map(rocket => ({ ...rocket, y: rocket.y - 5 })) // Move rocket up by 5 units
        .filter(rocket => rocket.y > 0 && !rocketsToRemove.has(rocket.id)); // Remove rockets that are off-screen or hit an enemy
}

// Function to shoot a rocket from the player's position
export function shootRocket(playerX, lastShotTime, setLastShotTime, setRockets) {
    const now = performance.now();
    if (now - lastShotTime < 500) return; // 500ms delay between shots
    setLastShotTime(now);
    setRockets(prevRockets => [...prevRockets, { x: playerX + 22.5, y: 530, id: now }]); // Add new rocket
}

// Function to check for collisions between rockets and enemies
export function checkCollisions(enemies, rockets) {
    const newEnemies = [];
    const rocketsToRemove = new Set();

    enemies.forEach(enemy => {
        const hit = rockets.some(rocket => {
            const collision = rocket.x < enemy.x + 50 &&
                              rocket.x + 5 > enemy.x &&
                              rocket.y < enemy.y + 30 &&
                              rocket.y + 20 > enemy.y;
            if (collision) {
                rocketsToRemove.add(rocket.id); // Mark rocket for removal
            }
            return collision;
        });

        if (!hit) {
            newEnemies.push(enemy); // Keep enemy if not hit
        }
    });

    return { newEnemies, rocketsToRemove };
}

// Function to move the player left or right
export function movePlayer(playerX, setPlayerX, movingLeft, movingRight) {
    if (movingLeft && playerX > 0) setPlayerX(prevX => prevX - 5);
    if (movingRight && playerX < 750) setPlayerX(prevX => prevX + 5);
}

// Function to move enemies and handle direction changes and descent
export function moveEnemies(enemies, direction, setDirection, speed, setGameStatus) {
    let newDirection = direction;
    let shouldDescend = false;
    let gameOver = false;

    // Check if any enemy reaches the edge of the screen
    enemies.forEach(enemy => {
        if (direction === 'right' && enemy.x + 50 + speed >= 800) {
            newDirection = 'left';
            shouldDescend = true;
        } else if (direction === 'left' && enemy.x - speed <= 0) {
            newDirection = 'right';
            shouldDescend = true;
        }
    });

    const newEnemies = enemies.map(enemy => {
        let newX = enemy.x;
        let newY = enemy.y;

        if (direction === 'right') {
            newX += speed;
        } else {
            newX -= speed;
        }

        if (shouldDescend) {
            newY += 40; // Move enemies down by 40 units
        }

        if (newY >= 520) {
            gameOver = true; // Game over if any enemy reaches the player's level
        }

        return { ...enemy, x: newX, y: newY };
    });

    if (gameOver) {
        setGameStatus('lost');
        gameOverSound.play();
    }

    setDirection(newDirection); // Update direction
    return newEnemies;
}