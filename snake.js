class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // DOM elements
    this.appleCountEl = document.getElementById('appleCount');
    this.trophyScoreEl = document.getElementById('trophyScore');
    this.finalScoreEl = document.getElementById('finalScore');
    this.restartBtn = document.getElementById('restartBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.settingsBtn = document.getElementById('settingsBtn');
    this.menuEl = document.getElementById('menu');
    this.gameOverEl = document.getElementById('gameOver');
    this.playBtn = document.querySelector('.play-btn');
    
    // Game constants
    this.GRID_SIZE = 20;
    this.TILE_COUNT_X = Math.floor(this.canvas.width / this.GRID_SIZE);
    this.TILE_COUNT_Y = Math.floor(this.canvas.height / this.GRID_SIZE);
    
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
      this.ctx.fillStyle = food.type === 'special' ? '#ffd700' : '#ff3b30';
      this.ctx.beginPath();
      this.ctx.arc(
        food.x * this.GRID_SIZE + this.GRID_SIZE / 2,
        food.y * this.GRID_SIZE + this.GRID_SIZE / 2,
        this.GRID_SIZE / 2.2, 0, Math.PI * 2
      );
      this.ctx.fill();
    });
    
    // Draw snake
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        // Draw head
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(
          segment.x * this.GRID_SIZE,
          segment.y * this.GRID_SIZE,
          this.GRID_SIZE,
          this.GRID_SIZE
        );
        
        // Draw eyes
        this.ctx.fillStyle = '#000';
        const eyeSize = 3;
        const eyeOffset = 4;
        
        if (this.direction.x !== 0) {
          // Horizontal movement
          const x = segment.x * this.GRID_SIZE + (this.direction.x > 0 ? this.GRID_SIZE - eyeOffset : eyeOffset);
          this.ctx.fillRect(x, segment.y * this.GRID_SIZE + eyeOffset, eyeSize, eyeSize);
          this.ctx.fillRect(x, segment.y * this.GRID_SIZE + this.GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else {
          // Vertical movement
          const y = segment.y * this.GRID_SIZE + (this.direction.y > 0 ? this.GRID_SIZE - eyeOffset : eyeOffset);
          this.ctx.fillRect(segment.x * this.GRID_SIZE + eyeOffset, y, eyeSize, eyeSize);
          this.ctx.fillRect(segment.x * this.GRID_SIZE + this.GRID_SIZE - eyeOffset - eyeSize, y, eyeSize, eyeSize);
        }
      } else {
        // Draw body
        this.ctx.fillStyle = '#41b85f';
        this.ctx.fillRect(
          segment.x * this.GRID_SIZE + 1,
          segment.y * this.GRID_SIZE + 1,
          this.GRID_SIZE - 2,
          this.GRID_SIZE - 2
        );
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
