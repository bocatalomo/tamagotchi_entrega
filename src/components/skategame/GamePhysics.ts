export interface Skater {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  gravity: number;
  jumpPower: number;
  isGrounded: boolean;
  isHolding: boolean;
  jumpsRemaining: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

export interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

export interface GameState {
  skater: Skater;
  platforms: Platform[];
  obstacles: Obstacle[];
  coins: Coin[];
  groundY: number;
  speed: number;
  distance: number;
  coinsCollected: number;
  lastPlatformX: number;
  lastObstacleX: number;
  lastCoinX: number;
  gameRunning: boolean;
}

export const createInitialState = (groundY: number): GameState => ({
  skater: {
    x: 100,
    y: groundY - 45,
    width: 35,
    height: 45,
    velocityY: 0,
    gravity: 0.6,
    jumpPower: -12,
    isGrounded: false,
    isHolding: false,
    jumpsRemaining: 2,
  },
  platforms: [],
  obstacles: [],
  coins: [],
  groundY,
  speed: 6,
  distance: 0,
  coinsCollected: 0,
  lastPlatformX: 0,
  lastObstacleX: 600,
  lastCoinX: 300,
  gameRunning: false,
});

export const addPlatform = (state: GameState): void => {
  const minGap = 80;
  const maxGap = 180;
  const gap = minGap + Math.random() * (maxGap - minGap);
  const minWidth = 80;
  const maxWidth = 200;
  const width = minWidth + Math.random() * (maxWidth - minWidth);

  const platform: Platform = {
    x: state.lastPlatformX + gap,
    y: state.groundY,
    width,
    height: 20,
  };

  state.platforms.push(platform);
  state.lastPlatformX = platform.x + width;
};

export const addObstacle = (state: GameState): void => {
  if (state.platforms.length < 3) return;
  const platformIndex = Math.floor(Math.random() * (state.platforms.length - 2)) + 2;
  const platform = state.platforms[platformIndex];

  const obstacle: Obstacle = {
    x: platform.x + platform.width / 2 - 15,
    y: platform.y - 30,
    width: 30,
    height: 30,
    type: 'rock',
  };

  state.obstacles.push(obstacle);
};

export const addCoin = (state: GameState): void => {
  const minGap = 150;
  const maxGap = 300;
  const gap = minGap + Math.random() * (maxGap - minGap);
  const heightVariations = [
    state.groundY - 60,
    state.groundY - 120,
    state.groundY - 180,
  ];

  const coin: Coin = {
    x: state.lastCoinX + gap,
    y: heightVariations[Math.floor(Math.random() * heightVariations.length)],
    width: 20,
    height: 20,
    collected: false,
  };

  state.coins.push(coin);
  state.lastCoinX = coin.x;
};

export const startGame = (state: GameState): void => {
  state.platforms = [];
  state.obstacles = [];
  state.coins = [];
  state.speed = 6;
  state.distance = 0;
  state.coinsCollected = 0;
  state.lastPlatformX = -200;
  state.lastObstacleX = 600;
  state.lastCoinX = 300;

  state.platforms.push({
    x: 0,
    y: state.groundY,
    width: 250,
    height: 20,
  });
  state.lastPlatformX = 250;

  for (let i = 0; i < 10; i++) {
    addPlatform(state);
  }

  state.skater.x = 100;
  state.skater.y = state.groundY - state.skater.height;
  state.skater.velocityY = 0;
  state.skater.isGrounded = true;
  state.skater.isHolding = false;
  state.skater.jumpsRemaining = 2;

  for (let i = 0; i < 3; i++) {
    addObstacle(state);
  }

  for (let i = 0; i < 8; i++) {
    addCoin(state);
  }

  state.gameRunning = true;
};

export const startJump = (state: GameState): void => {
  if (!state.gameRunning) return;
  if (state.skater.jumpsRemaining > 0) {
    state.skater.velocityY = state.skater.jumpPower;
    state.skater.isHolding = true;
    state.skater.jumpsRemaining--;
  }
};

export const endJump = (state: GameState): void => {
  state.skater.isHolding = false;
};

export const updatePhysics = (state: GameState, canvasHeight: number, onGameOver: () => void): void => {
  if (!state.gameRunning) return;

  if (state.skater.isHolding && state.skater.velocityY < 0) {
    state.skater.velocityY += state.skater.gravity * 0.5;
  } else {
    if (state.skater.velocityY < 0) {
      state.skater.velocityY += state.skater.gravity * 1.5;
    } else {
      state.skater.velocityY += state.skater.gravity;
    }
  }

  state.skater.y += state.skater.velocityY;
  state.skater.isGrounded = false;

  state.platforms.forEach(platform => {
    platform.x -= state.speed;
  });

  state.obstacles.forEach(obstacle => {
    obstacle.x -= state.speed;
  });

  state.coins.forEach(coin => {
    if (!coin.collected) {
      coin.x -= state.speed;
    }
  });

  state.platforms.forEach(platform => {
    if (
      state.skater.x + state.skater.width > platform.x &&
      state.skater.x < platform.x + platform.width &&
      state.skater.y + state.skater.height > platform.y &&
      state.skater.y + state.skater.height < platform.y + platform.height + 15 &&
      state.skater.velocityY > 0
    ) {
      state.skater.y = platform.y - state.skater.height;
      state.skater.velocityY = 0;
      state.skater.isGrounded = true;
      state.skater.jumpsRemaining = 2;
    }
  });

  state.obstacles.forEach(obstacle => {
    if (
      state.skater.x + state.skater.width > obstacle.x &&
      state.skater.x < obstacle.x + obstacle.width &&
      state.skater.y + state.skater.height > obstacle.y &&
      state.skater.y < obstacle.y + obstacle.height
    ) {
      onGameOver();
    }
  });

  state.coins.forEach(coin => {
    if (
      !coin.collected &&
      state.skater.x + state.skater.width > coin.x &&
      state.skater.x < coin.x + coin.width &&
      state.skater.y + state.skater.height > coin.y &&
      state.skater.y < coin.y + coin.height
    ) {
      coin.collected = true;
      state.coinsCollected++;
    }
  });

  state.platforms = state.platforms.filter(p => p.x + p.width > -50);
  while (state.platforms.length < 10) {
    addPlatform(state);
  }

  state.obstacles = state.obstacles.filter(o => o.x + o.width > -50);
  if (state.obstacles.length < 3 && Math.random() < 0.02) {
    addObstacle(state);
  }

  state.coins = state.coins.filter(c => c.x + c.width > -50);
  while (state.coins.length < 8) {
    addCoin(state);
  }

  if (state.skater.y > canvasHeight) {
    onGameOver();
  }

  state.distance += state.speed;
  state.speed += 0.001;
};
