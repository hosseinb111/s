// Simple Snake Game inspired by Google's version
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCountX = Math.floor(canvas.width / gridSize);
const tileCountY = Math.floor(canvas.height / gridSize);

let snake, direction, nextDirection, food, score, gameInterval, gameOver;

function resetGame() {
  snake = [
    { x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  placeFood();
  score = 0;
  gameOver = false;
  scoreEl.textContent = 'Score: 0';
  restartBtn.style.display = 'none';
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 80);
}

function placeFood() {
  let valid = false;
  while (!valid) {
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };
    valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
  }
}

function gameLoop() {
  // Move
  direction = nextDirection;
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Check collision
  if (
    newHead.x < 0 || newHead.x >= tileCountX ||
    newHead.y < 0 || newHead.y >= tileCountY ||
    snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(newHead);

  // Eat food
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreEl.textContent = 'Score: ' + score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = '#ff7769';
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2.2, 0, Math.PI * 2
  );
  ctx.fill();

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#fff' : '#41b85f';
    ctx.fillRect(
      snake[i].x * gridSize + 2,
      snake[i].y * gridSize + 2,
      gridSize - 4,
      gridSize - 4
    );
  }
}

function endGame() {
  clearInterval(gameInterval);
  gameOver = true;
  restartBtn.style.display = 'inline-block';
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Roboto, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  ctx.font = '24px Roboto, Arial';
  ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 40);
}

document.addEventListener('keydown', e => {
  if (gameOver && e.key === 'Enter') {
    resetGame();
    return;
  }
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
      break;
  }
});

restartBtn.addEventListener('click', resetGame);

resetGame();
