import { useState, useEffect, useRef } from 'react';
import './SkateGame.css';

const SkateGame = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Estado del juego
  const gameStateRef = useRef({
    skater: {
      x: 100,
      y: 200,
      width: 30,
      height: 40,
      velocityY: 0,
      gravity: 0.8,
      floatPower: -0.65, // Poder de elevación al mantener presionado
      maxJumpHeight: 150, // Altura máxima del salto
      jumpStartY: 0, // Posición Y cuando empezó el salto
      isGrounded: false,
      isHolding: false, // Si está manteniendo presionado
      jumpsRemaining: 0, // Saltos disponibles (0, 1, o 2)
      isJumping: false // Si está actualmente en un salto activo
    },
    platforms: [],
    speed: 5,
    distance: 0,
    lastPlatformX: 0,
    gameRunning: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const game = gameStateRef.current;

    // Inicializar plataformas
    const initPlatforms = () => {
      game.platforms = [];
      game.lastPlatformX = 0;

      // Crear plataformas iniciales
      for (let i = 0; i < 8; i++) {
        addPlatform();
      }
    };

    // Añadir nueva plataforma
    const addPlatform = () => {
      const minGap = 80;
      const maxGap = 200;
      const gap = minGap + Math.random() * (maxGap - minGap);

      const minWidth = 60;
      const maxWidth = 150;
      const width = minWidth + Math.random() * (maxWidth - minWidth);

      const platform = {
        x: game.lastPlatformX + gap,
        y: 350,
        width: width,
        height: 20
      };

      game.platforms.push(platform);
      game.lastPlatformX = platform.x + width;
    };

    // Eventos de presionar y soltar
    const handlePressStart = (e) => {
      e.preventDefault();
      if (!game.gameRunning) return;

      // Iniciar salto si hay saltos disponibles
      if (game.skater.jumpsRemaining > 0) {
        game.skater.isHolding = true;
        game.skater.isJumping = true;
        game.skater.jumpStartY = game.skater.y;
        game.skater.jumpsRemaining--;
        game.skater.velocityY = 0; // Resetear velocidad al empezar el salto
      }
    };

    const handlePressEnd = (e) => {
      e.preventDefault();
      if (!game.gameRunning) return;
      game.skater.isHolding = false;
      game.skater.isJumping = false;
    };

    // Iniciar juego cuando isPlaying cambia a true
    if (isPlaying && !game.gameRunning) {
      game.skater.y = 200;
      game.skater.velocityY = 0;
      game.skater.isGrounded = false;
      game.skater.isHolding = false;
      game.skater.jumpsRemaining = 0;
      game.skater.isJumping = false;
      game.skater.jumpStartY = 0;
      game.speed = 5;
      game.distance = 0;
      game.gameRunning = true;
      initPlatforms();
    }

    // Actualizar física
    const update = () => {
      if (!game.gameRunning) return;

      // Si está saltando y manteniendo presionado
      if (game.skater.isJumping && game.skater.isHolding) {
        // Verificar si ha alcanzado la altura máxima del salto
        const heightTraveled = game.skater.jumpStartY - game.skater.y;

        if (heightTraveled < game.skater.maxJumpHeight) {
          // Aún puede subir, aplicar fuerza de elevación
          game.skater.velocityY += game.skater.floatPower;
        } else {
          // Alcanzó la altura máxima, terminar el salto
          game.skater.isJumping = false;
          game.skater.velocityY += game.skater.gravity;
        }
      } else {
        // Si no está saltando activamente, aplicar gravedad
        game.skater.velocityY += game.skater.gravity;
      }

      game.skater.y += game.skater.velocityY;

      // Resetear estado de suelo
      game.skater.isGrounded = false;

      // Mover plataformas
      game.platforms.forEach(platform => {
        platform.x -= game.speed;
      });

      // Remover plataformas fuera de pantalla y añadir nuevas
      game.platforms = game.platforms.filter(p => p.x + p.width > -50);

      while (game.platforms.length < 8) {
        addPlatform();
      }

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
          game.skater.jumpsRemaining = 2; // Resetear a 2 saltos al tocar el suelo
          game.skater.isJumping = false;
        }
      });

      // Incrementar velocidad gradualmente
      game.speed += 0.002;
      game.distance += game.speed;
      setScore(Math.floor(game.distance / 10));

      // Game Over si cae fuera de pantalla
      if (game.skater.y > canvas.height) {
        gameOver();
      }
    };

    // Renderizar
    const render = () => {
      // Limpiar canvas
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar plataformas
      ctx.fillStyle = '#8B4513';
      game.platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Borde superior
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(platform.x, platform.y, platform.width, 5);
        ctx.fillStyle = '#8B4513';
      });

      // Dibujar skater (representado como un rectángulo con detalles)
      ctx.fillStyle = '#FF6B9D';
      ctx.fillRect(game.skater.x, game.skater.y, game.skater.width, game.skater.height);

      // Detalles del skater
      ctx.fillStyle = '#333';
      ctx.fillRect(game.skater.x + 5, game.skater.y + 5, 8, 8); // Cabeza
      ctx.fillStyle = '#FFB3D9';
      ctx.fillRect(game.skater.x + 2, game.skater.y + game.skater.height - 10, game.skater.width - 4, 8); // Tabla

      // Mostrar score si está jugando
      if (game.gameRunning) {
        ctx.fillStyle = '#333';
        ctx.font = '20px "Press Start 2P"';
        ctx.fillText(`Score: ${Math.floor(game.distance / 10)}`, 10, 30);
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText(`Speed: ${game.speed.toFixed(1)}x`, 10, 55);
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
    canvas.addEventListener('mousedown', handlePressStart);
    canvas.addEventListener('mouseup', handlePressEnd);
    canvas.addEventListener('mouseleave', handlePressEnd); // Si el cursor sale del canvas
    canvas.addEventListener('touchstart', handlePressStart);
    canvas.addEventListener('touchend', handlePressEnd);
    canvas.addEventListener('touchcancel', handlePressEnd);

    // Iniciar
    initPlatforms();
    render();
    gameLoop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handlePressStart);
      canvas.removeEventListener('mouseup', handlePressEnd);
      canvas.removeEventListener('mouseleave', handlePressEnd);
      canvas.removeEventListener('touchstart', handlePressStart);
      canvas.removeEventListener('touchend', handlePressEnd);
      canvas.removeEventListener('touchcancel', handlePressEnd);
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
                <p>Tienes 2 saltos antes de tocar el suelo</p>
                <p>Mantén presionado para alcanzar altura máxima</p>
                <p>Suelta para caer</p>
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
            <span className="instruction-text">Mantén = Subir (altura máx.)</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">✌️</span>
            <span className="instruction-text">2 saltos disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkateGame;
