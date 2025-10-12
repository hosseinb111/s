// Get the canvas and its context, which is what we draw on.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Define the size of each square in our grid.
const gridSize = 20;
let tileCount = canvas.width / gridSize;

// Snake variables
let snake = [
    { x: 10, y: 10 } // Starting position in the middle of the grid
];
let direction = { x: 0, y: 0 }; // Initial direction (not moving)

// Food variables
let food = { x: 15, y: 15 };

// Score
let score = 0;

/**
 * The main game loop function. This function is called repeatedly
 * to update the game state and redraw the screen.
 */
function gameLoop() {
    // Check if the game is over before continuing
    if (isGameOver()) {
        ctx.fillStyle = 'white';
        ctx.font = '50px "Courier New"';
        ctx.fillText('Game Over', canvas.width / 6.5, canvas.height / 2);
        return; // Stop the game loop
    }

    // This sets the game speed. The lower the number, the faster the game.
    setTimeout(() => {
        clearScreen();
        moveSnake();
        checkFoodCollision();
        drawFood();
        drawSnake();
        gameLoop(); // Call the loop again
    }, 100);
}

/**
 * Clears the entire canvas to prepare for the next frame.
 */
function clearScreen() {
    ctx.fillStyle = '#a9d4a9'; // The green background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws each segment of the snake on the canvas.
 */
function drawSnake() {
    ctx.fillStyle = '#333'; // Snake color
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

/**
 * Draws the food on the canvas.
 */
function drawFood() {
    ctx.fillStyle = 'red'; // Food color
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

/**
 * Updates the snake's position based on the current direction.
 */
function moveSnake() {
    // Create a new head by adding the direction to the old head's position
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    // If the snake hasn't eaten food, remove the last segment (tail)
    // This makes the snake appear to move.
    if (head.x !== food.x || head.y !== food.y) {
        snake.pop();
    }
}

/**
 * Checks if the snake's head has collided with the food.
 */
function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood(); // Generate new food at a random location
    }
}

/**
 * Generates a new piece of food at a random position on the grid.
 */
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Ensure food doesn't spawn on the snake
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

/**
 * Checks for game-over conditions: hitting a wall or hitting itself.
 * @returns {boolean} - True if the game is over, otherwise false.
 */
function isGameOver() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Event listener for keyboard input
document.addEventListener('keydown', e => {
    // Prevent the snake from reversing on itself
    const isGoingUp = direction.y === -1;
    const isGoingDown = direction.y === 1;
    const isGoingLeft = direction.x === -1;
    const isGoingRight = direction.x === 1;

    switch (e.key) {
        case 'ArrowUp':
            if (!isGoingDown) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (!isGoingUp) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (!isGoingRight) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (!isGoingLeft) direction = { x: 1, y: 0 };
            break;
    }
});

// Start the game!
gameLoop();