class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size to match Google's Snake game
    this.canvas.width = 600;
    this.canvas.height = 530;
    
    // DOM elements
    this.appleCountEl = document.getElementById('appleCount');
    this.trophyScoreEl = document.getElementById('trophyScore');
    this.gameOverEl = document.getElementById('gameOver');
    this.menuEl = document.getElementById('menu');
    this.playBtn = document.querySelector('.play-btn');
    
    // Game constants
    this.GRID_SIZE = 20;
    this.TILE_COUNT_X = 30; // 600/20
    this.TILE_COUNT_Y = 26; // 530/20
    
    // Speed settings (milliseconds per move)
    this.SPEEDS = {
      slow: 100,
      normal: 80,
      fast: 50,
      insane: 30
    };
    
    // Game state
    this.snake = [];
    this.foods = [];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.appleCount = 0;
    this.gameSpeed = 80;
    this.isPaused = false;
    this.isGameOver = false;
    
    // Bind event listeners
    this.bindEvents();
    
    // Initialize menu
    this.initializeMenu();
  }
  
  bindEvents() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    this.restartBtn.addEventListener('click', () => this.resetGame());
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.settingsBtn.addEventListener('click', () => this.toggleMenu());
    this.playBtn.addEventListener('click', () => this.startGame());
    
    // Speed option buttons
    document.querySelectorAll('.option-btn[data-speed]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.option-btn[data-speed]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.setGameSpeed(e.target.dataset.speed);
      });
    });
  }
  
  initializeMenu() {
    this.menuEl.classList.add('active');
    this.gameSpeed = 80; // Default normal speed
  }
  
  setGameSpeed(speed) {
    switch(speed) {
      case 'slow':
        this.gameSpeed = 100;
        break;
      case 'normal':
        this.gameSpeed = 80;
        break;
      case 'fast':
        this.gameSpeed = 60;
        break;
      case 'insane':
        this.gameSpeed = 40;
        break;
    }
  }
  
  startGame() {
    this.menuEl.classList.remove('active');
    this.resetGame();
  }
  
  toggleMenu() {
    if (!this.isPaused) this.togglePause();
    this.menuEl.classList.toggle('active');
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseBtn.innerHTML = this.isPaused ? 
      '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\'%3E%3Cpath fill=\'%23fff\' d=\'M8 5v14l11-7z\'/%3E%3C/svg%3E" alt="Play">' :
      '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\'%3E%3Cpath fill=\'%23fff\' d=\'M6 19h4V5H6v14zm8-14v14h4V5h-4z\'/%3E%3C/svg%3E" alt="Pause">';
    
    if (!this.isPaused) {
      this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
    } else {
      clearInterval(this.gameInterval);
    }
  }
  
  resetGame() {
    // Reset game state
    this.snake = [
      { x: Math.floor(this.TILE_COUNT_X / 2), y: Math.floor(this.TILE_COUNT_Y / 2) }
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.appleCount = 0;
    this.foods = [];
    this.isGameOver = false;
    this.isPaused = false;
    
    // Reset UI
    this.updateScore();
    this.gameOverEl.classList.remove('active');
    
    // Place initial food
    this.placeFood();
    this.placeFood();
    
    // Start game loop
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
  }
  
  placeFood() {
    let valid = false;
    let food;
    
    while (!valid) {
      food = {
        x: Math.floor(Math.random() * this.TILE_COUNT_X),
        y: Math.floor(Math.random() * this.TILE_COUNT_Y),
        type: Math.random() < 0.2 ? 'special' : 'normal'
      };
      
      valid = !this.snake.some(seg => seg.x === food.x && seg.y === food.y) &&
              !this.foods.some(f => f.x === food.x && f.y === food.y);
    }
    
    this.foods.push(food);
  }
  
  gameLoop() {
    if (this.isPaused || this.isGameOver) return;
    
    // Move snake
    this.direction = this.nextDirection;
    const newHead = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };
    
    // Check collision with walls or self
    if (this.checkCollision(newHead)) {
      this.endGame();
      return;
    }
    
    this.snake.unshift(newHead);
    
    // Check food collision
    let ateFood = false;
    this.foods = this.foods.filter(food => {
      if (newHead.x === food.x && newHead.y === food.y) {
        this.score += food.type === 'special' ? 5 : 1;
        this.appleCount++;
        ateFood = true;
        return false;
      }
      return true;
    });
    
    if (!ateFood) {
      this.snake.pop();
    } else {
      this.updateScore();
      if (this.foods.length < 2) {
        this.placeFood();
      }
    }
    
    this.draw();
  }
  
  checkCollision(pos) {
    return pos.x < 0 || pos.x >= this.TILE_COUNT_X ||
           pos.y < 0 || pos.y >= this.TILE_COUNT_Y ||
           this.snake.some(seg => seg.x === pos.x && seg.y === pos.y);
  }
  
  updateScore() {
    this.appleCountEl.textContent = this.appleCount;
    this.trophyScoreEl.textContent = this.score;
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw foods
    this.foods.forEach(food => {
      const x = food.x * this.GRID_SIZE + this.GRID_SIZE / 2;
      const y = food.y * this.GRID_SIZE + this.GRID_SIZE / 2;
      const radius = this.GRID_SIZE / 2 - 2;

      // Draw apple
      this.ctx.fillStyle = food.type === 'special' ? '#fdd663' : '#e44d3c';
      this.ctx.strokeStyle = food.type === 'special' ? '#c4a052' : '#ba3e31';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Draw apple stem
      this.ctx.fillStyle = '#578a34';
      this.ctx.fillRect(x - 1, y - radius - 2, 2, 4);
    
    // Draw snake
    this.snake.forEach((segment, index) => {
      const x = segment.x * this.GRID_SIZE + this.GRID_SIZE / 2;
      const y = segment.y * this.GRID_SIZE + this.GRID_SIZE / 2;
      const radius = this.GRID_SIZE / 2 - 1;

      // Draw segment body
      this.ctx.fillStyle = '#4a752c';
      this.ctx.strokeStyle = '#578a34';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      if (index === 0) {
        // Draw eyes
        const eyeSize = 3;
        const eyeOffset = 6;
        this.ctx.fillStyle = '#fff';
        
        let eyeX1, eyeY1, eyeX2, eyeY2;
        
        if (this.direction.x !== 0) {
          // Horizontal movement
          eyeX1 = eyeX2 = x + (this.direction.x > 0 ? eyeOffset : -eyeOffset);
          eyeY1 = y - eyeOffset/2;
          eyeY2 = y + eyeOffset/2;
        } else {
          // Vertical movement
          eyeY1 = eyeY2 = y + (this.direction.y > 0 ? eyeOffset : -eyeOffset);
          eyeX1 = x - eyeOffset/2;
          eyeX2 = x + eyeOffset/2;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }
  
  endGame() {
    this.isGameOver = true;
    clearInterval(this.gameInterval);
    this.finalScoreEl.textContent = this.score;
    this.gameOverEl.classList.add('active');
  }
  
  handleKeyPress(e) {
    if (this.isGameOver && e.key === 'Enter') {
      this.resetGame();
      return;
    }
    
    if (e.key === ' ') {
      this.togglePause();
      return;
    }
    
    if (this.isPaused) return;
    
    switch (e.key) {
      case 'ArrowUp':
        if (this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 };
        break;
    }
  }
}

// Initialize game
const game = new SnakeGame();
