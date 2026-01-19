import { useState, useEffect, useRef } from 'react';
import './SkateGame.css';

const SkateGame = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Estado del juego con plataformas, doble salto y salto cancelable
  const gameStateRef = useRef({
    skater: {
      x: 100,
      y: 200,
      width: 35,
      height: 45,
      velocityY: 0,
      gravity: 0.6,
      jumpPower: -12,
      isGrounded: false,
      isHolding: false,
      jumpsRemaining: 0
    },
    platforms: [],
    obstacles: [],
    coins: [],
    groundY: 350,
    speed: 6,
    distance: 0,
    coinsCollected: 0,
    lastPlatformX: 0,
    lastObstacleX: 600,
    lastCoinX: 300,
    gameRunning: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const game = gameStateRef.current;

    // Añadir plataforma
    const addPlatform = () => {
      const minGap = 80;
      const maxGap = 180;
      const gap = minGap + Math.random() * (maxGap - minGap);

      const minWidth = 80;
      const maxWidth = 200;
      const width = minWidth + Math.random() * (maxWidth - minWidth);

      const platform = {
        x: game.lastPlatformX + gap,
        y: game.groundY,
        width: width,
        height: 20
      };

      game.platforms.push(platform);
      game.lastPlatformX = platform.x + width;
    };

    // Añadir obstáculo sobre una plataforma
    const addObstacle = () => {
      if (game.platforms.length < 3) return;

      // Elegir una plataforma aleatoria (no la última ni las 2 primeras)
      const platformIndex = Math.floor(Math.random() * (game.platforms.length - 2)) + 2;
      const platform = game.platforms[platformIndex];

      // Colocar obstáculo en el centro de la plataforma
      const obstacle = {
        x: platform.x + platform.width / 2 - 15,
        y: platform.y - 30,
        width: 30,
        height: 30,
        type: 'rock'
      };

      game.obstacles.push(obstacle);
    };

    // Añadir moneda
    const addCoin = () => {
      const minGap = 150;
      const maxGap = 300;
      const gap = minGap + Math.random() * (maxGap - minGap);

      const heightVariations = [
        game.groundY - 60,
        game.groundY - 120,
        game.groundY - 180
      ];

      const coin = {
        x: game.lastCoinX + gap,
        y: heightVariations[Math.floor(Math.random() * heightVariations.length)],
        width: 20,
        height: 20,
        collected: false
      };

      game.coins.push(coin);
      game.lastCoinX = coin.x;
    };

    // Iniciar salto
    const startJump = () => {
      if (!game.gameRunning) return;

      if (game.skater.jumpsRemaining > 0) {
        game.skater.velocityY = game.skater.jumpPower;
        game.skater.isHolding = true;
        game.skater.jumpsRemaining--;
      }
    };

    // Terminar salto
    const endJump = () => {
      game.skater.isHolding = false;
    };

    // Eventos
    const handleMouseDown = (e) => {
      e.preventDefault();
      startJump();
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      endJump();
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      startJump();
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      endJump();
    };

    // Iniciar juego
    if (isPlaying && !game.gameRunning) {
      game.platforms = [];
      game.obstacles = [];
      game.coins = [];
      game.speed = 6;
      game.distance = 0;
      game.coinsCollected = 0;
      game.lastPlatformX = -200;
      game.lastObstacleX = 600;
      game.lastCoinX = 300;

      // Crear plataforma inicial justo debajo del jugador (sin hueco al inicio)
      game.platforms.push({
        x: 0,
        y: game.groundY,
        width: 250,
        height: 20
      });
      game.lastPlatformX = 250;

      // Crear resto de plataformas
      for (let i = 0; i < 10; i++) {
        addPlatform();
      }

      // Posicionar jugador sobre la primera plataforma
      game.skater.x = 100;
      game.skater.y = game.groundY - game.skater.height;
      game.skater.velocityY = 0;
      game.skater.isGrounded = true;
      game.skater.isHolding = false;
      game.skater.jumpsRemaining = 2;

      // Crear algunos obstáculos (no en las primeras 2 plataformas)
      for (let i = 0; i < 3; i++) {
        addObstacle();
      }

      // Crear monedas iniciales
      for (let i = 0; i < 8; i++) {
        addCoin();
      }

      game.gameRunning = true;
    }

    // Actualizar física
    const update = () => {
      if (!game.gameRunning) return;

      // Si está manteniendo presionado y subiendo, aplicar menos gravedad
      if (game.skater.isHolding && game.skater.velocityY < 0) {
        game.skater.velocityY += game.skater.gravity * 0.5; // Gravedad reducida mientras mantiene
      } else {
        // Si soltó o está cayendo, aplicar gravedad fuerte para cancelar el salto
        if (game.skater.velocityY < 0) {
          // Si aún está subiendo pero soltó, aplicar gravedad extra para frenar rápido
          game.skater.velocityY += game.skater.gravity * 1.5;
        } else {
          // Gravedad normal cuando ya está cayendo
          game.skater.velocityY += game.skater.gravity;
        }
      }

      game.skater.y += game.skater.velocityY;

      // Resetear estado de suelo
      game.skater.isGrounded = false;

      // Mover plataformas
      game.platforms.forEach(platform => {
        platform.x -= game.speed;
      });

      // Mover obstáculos
      game.obstacles.forEach(obstacle => {
        obstacle.x -= game.speed;
      });

      // Mover monedas
      game.coins.forEach(coin => {
        if (!coin.collected) {
          coin.x -= game.speed;
        }
      });

      // Colisión con plataformas
      game.platforms.forEach(platform => {
        if (
          game.skater.x + game.skater.width > platform.x &&
          game.skater.x < platform.x + platform.width &&
          game.skater.y + game.skater.height > platform.y &&
          game.skater.y + game.skater.height < platform.y + platform.height + 15 &&
          game.skater.velocityY > 0
        ) {
          game.skater.y = platform.y - game.skater.height;
          game.skater.velocityY = 0;
          game.skater.isGrounded = true;
          game.skater.jumpsRemaining = 2; // Resetear doble salto al tocar plataforma
        }
      });

      // Colisión con obstáculos
      game.obstacles.forEach(obstacle => {
        if (
          game.skater.x + game.skater.width > obstacle.x &&
          game.skater.x < obstacle.x + obstacle.width &&
          game.skater.y + game.skater.height > obstacle.y &&
          game.skater.y < obstacle.y + obstacle.height
        ) {
          gameOver();
        }
      });

      // Colisión con monedas
      game.coins.forEach(coin => {
        if (
          !coin.collected &&
          game.skater.x + game.skater.width > coin.x &&
          game.skater.x < coin.x + coin.width &&
          game.skater.y + game.skater.height > coin.y &&
          game.skater.y < coin.y + coin.height
        ) {
          coin.collected = true;
          game.coinsCollected++;
        }
      });

      // Eliminar plataformas fuera de pantalla y añadir nuevas
      game.platforms = game.platforms.filter(p => p.x + p.width > -50);
      while (game.platforms.length < 10) {
        addPlatform();
      }

      // Eliminar obstáculos fuera de pantalla y añadir nuevos
      game.obstacles = game.obstacles.filter(o => o.x + o.width > -50);
      if (game.obstacles.length < 3 && Math.random() < 0.02) {
        addObstacle();
      }

      // Eliminar monedas fuera de pantalla y añadir nuevas
      game.coins = game.coins.filter(c => c.x + c.width > -50);
      while (game.coins.length < 8) {
        addCoin();
      }

      // Game over si cae fuera de pantalla
      if (game.skater.y > canvas.height) {
        gameOver();
      }

      // Incrementar distancia y velocidad
      game.distance += game.speed;
      game.speed += 0.001;
      setScore(Math.floor(game.distance / 10));
    };

    // Renderizar
    const render = () => {
      // Fondo
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Plataformas
      game.platforms.forEach(platform => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Borde superior
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(platform.x, platform.y, platform.width, 5);
      });

      // Skater
      ctx.fillStyle = '#FF6B9D';
      ctx.fillRect(game.skater.x, game.skater.y, game.skater.width, game.skater.height);

      // Detalles del skater
      ctx.fillStyle = '#333';
      ctx.fillRect(game.skater.x + 8, game.skater.y + 5, 10, 10); // Cabeza
      ctx.fillStyle = '#FFB3D9';
      ctx.fillRect(game.skater.x + 3, game.skater.y + game.skater.height - 8, game.skater.width - 6, 6); // Tabla

      // Obstáculos
      game.obstacles.forEach(obstacle => {
        ctx.fillStyle = '#555';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Detalles del obstáculo
        ctx.fillStyle = '#444';
        ctx.fillRect(obstacle.x + 5, obstacle.y + 5, 8, 8);
        ctx.fillRect(obstacle.x + 18, obstacle.y + 12, 6, 6);
      });

      // Monedas
      game.coins.forEach(coin => {
        if (!coin.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
          ctx.fill();

          // Brillo de la moneda
          ctx.fillStyle = '#FFF59D';
          ctx.beginPath();
          ctx.arc(coin.x + coin.width / 2 - 3, coin.y + coin.height / 2 - 3, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // UI
      if (game.gameRunning) {
        ctx.fillStyle = '#333';
        ctx.font = '20px "Press Start 2P"';
        ctx.fillText(`Score: ${Math.floor(game.distance / 10)}`, 10, 30);
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText(`Coins: ${game.coinsCollected}`, 10, 55);
        ctx.fillText(`Jumps: ${game.skater.jumpsRemaining}`, 10, 80);
      }
    };

    // Game Over
    const gameOver = () => {
      game.gameRunning = false;
      setIsGameOver(true);
      setIsPlaying(false);
    };

    // Game loop
    let animationId;
    const gameLoop = () => {
      update();
      render();
      animationId = requestAnimationFrame(gameLoop);
    };

    // Eventos
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Iniciar
    render();
    gameLoop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPlaying]);

  const handleExit = () => {
    onGameEnd(score);
  };

  const handleStart = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="skate-game">
      <div className="skate-game-content">
        <div className="game-header">
          <h2 className="game-title">Skate Jump</h2>
          <button className="exit-button" onClick={handleExit}>
            Salir
          </button>
        </div>

        <div className="game-container">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="game-canvas"
          />

          {!isPlaying && !isGameOver && (
            <div className="game-overlay" onClick={handleStart}>
              <div className="start-message">
                <h3>Skate Jump</h3>
                <p>Salta entre plataformas</p>
                <p>Doble salto disponible</p>
                <p>Mantén presionado para saltar más alto</p>
                <p>Suelta para cancelar el salto</p>
                <p className="start-hint">Toca para empezar</p>
              </div>
            </div>
          )}

          {isGameOver && (
            <div className="game-overlay" onClick={handleStart}>
              <div className="gameover-message">
                <h3>Game Over</h3>
                <p className="final-score">Score: {score}</p>
                <p className="restart-hint">Toca para reintentar</p>
              </div>
            </div>
          )}
        </div>

        <div className="game-instructions">
          <div className="instruction-item">
            <span className="instruction-icon">👆</span>
            <span className="instruction-text">Mantén = Saltar alto</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">✌️</span>
            <span className="instruction-text">Doble salto</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">💰</span>
            <span className="instruction-text">Recoge monedas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkateGame;
