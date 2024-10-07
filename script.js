const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the size of the canvas
canvas.width = 400;
canvas.height = 400;

const tileSize = 20;
const tileCount = canvas.width / tileSize;

let score = 0;
let gameSpeed = 100;
let snake = [{ x: 10, y: 10 }];
let snakeLength = 1;
let velocityX = 0;
let velocityY = 0;
let isGameOver = false; // New variable to track game over state

let foodX = Math.floor(Math.random() * tileCount);
let foodY = Math.floor(Math.random() * tileCount);

const scoreElement = document.getElementById('score');
const tryAgainButton = document.getElementById('tryAgainButton');

function updateScore() {
    scoreElement.textContent = "Score: " + score;
}

// Main game loop
function gameLoop() {
    if (isGameOver) return;  // Stop game loop if game is over

    moveSnake();

    if (checkCollision()) {
        endGame();  // If collision occurs, end the game
        return;
    }

    if (snake[0].x === foodX && snake[0].y === foodY) {
        eatFood();
    }

    clearCanvas();
    drawSnake();
    drawFood();

    setTimeout(gameLoop, gameSpeed);
}

// Move the snake
function moveSnake() {
    const newHead = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    snake.unshift(newHead);

    while (snake.length > snakeLength) {
        snake.pop();
    }
}

// Check for collisions
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// End the game
function endGame() {
    isGameOver = true;
    tryAgainButton.style.display = 'block';  // Show the "Try Again" button
}

// Restart the game
function restartGame() {
    isGameOver = false;
    score = 0;
    snake = [{ x: 10, y: 10 }];
    snakeLength = 1;
    velocityX = 0;
    velocityY = 0;
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
    updateScore();
    tryAgainButton.style.display = 'none';  // Hide the "Try Again" button
    gameLoop();  // Restart the game loop
}

// Draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        const shade = Math.floor((255 / snake.length) * i);
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.fillRect(snake[i].x * tileSize, snake[i].y * tileSize, tileSize, tileSize);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake[i].x * tileSize, snake[i].y * tileSize, tileSize, tileSize);
    }
}

// Draw the food
function drawFood() {
    ctx.fillStyle = '#39ff14';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 10;
    ctx.fillRect(foodX * tileSize, foodY * tileSize, tileSize, tileSize);
    ctx.shadowBlur = 0;
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Handle food consumption
function eatFood() {
    score++;
    snakeLength++;
    updateScore();
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (isGameOver) return;  // Disable movement if game is over

    switch (event.key) {
        case 'ArrowUp':
            if (velocityY === 0) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'ArrowDown':
            if (velocityY === 0) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if (velocityX === 0) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'ArrowRight':
            if (velocityX === 0) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
});

// Start the game loop
gameLoop();
