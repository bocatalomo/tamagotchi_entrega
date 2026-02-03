import { useState, useEffect, useRef, useCallback } from 'react';
import './SkateGame.css';
import {
  GameState,
  createInitialState,
  startGame,
  startJump,
  endJump,
  updatePhysics,
} from './GamePhysics';

interface SkateGameProps {
  onGameEnd: (score: number) => void;
}

const SkateGame = ({ onGameEnd }: SkateGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const groundY = 350;

  const render = useCallback((ctx: CanvasRenderingContext2D) => {
    const game = gameStateRef.current;
    if (!game) return;

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 600, 400);

    game.platforms.forEach(platform => {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(platform.x, platform.y, platform.width, 5);
    });

    ctx.fillStyle = '#FF6B9D';
    ctx.fillRect(game.skater.x, game.skater.y, game.skater.width, game.skater.height);
    ctx.fillStyle = '#333';
    ctx.fillRect(game.skater.x + 8, game.skater.y + 5, 10, 10);
    ctx.fillStyle = '#FFB3D9';
    ctx.fillRect(game.skater.x + 3, game.skater.y + game.skater.height - 8, game.skater.width - 6, 6);

    game.obstacles.forEach(obstacle => {
      ctx.fillStyle = '#555';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.fillStyle = '#444';
      ctx.fillRect(obstacle.x + 5, obstacle.y + 5, 8, 8);
      ctx.fillRect(obstacle.x + 18, obstacle.y + 12, 6, 6);
    });

    game.coins.forEach(coin => {
      if (!coin.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF59D';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2 - 3, coin.y + coin.height / 2 - 3, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (game.gameRunning) {
      ctx.fillStyle = '#333';
      ctx.font = '20px "Press Start 2P"';
      ctx.fillText(`Score: ${Math.floor(game.distance / 10)}`, 10, 30);
      ctx.font = '16px "Press Start 2P"';
      ctx.fillText(`Coins: ${game.coinsCollected}`, 10, 55);
      ctx.fillText(`Jumps: ${game.skater.jumpsRemaining}`, 10, 80);
    }
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const game = gameStateRef.current;
    if (!canvas || !game) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updatePhysics(game, 400, () => {
      game.gameRunning = false;
      setIsGameOver(true);
      setIsPlaying(false);
    });

    if (game.gameRunning) {
      setScore(Math.floor(game.distance / 10));
    }

    render(ctx);

    if (game.gameRunning) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!gameStateRef.current) {
      gameStateRef.current = createInitialState(groundY);
    }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      if (gameStateRef.current && gameStateRef.current.gameRunning) {
        startJump(gameStateRef.current);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      if (gameStateRef.current) {
        endJump(gameStateRef.current);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (gameStateRef.current && gameStateRef.current.gameRunning) {
        startJump(gameStateRef.current);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (gameStateRef.current) {
        endJump(gameStateRef.current);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);

    render(ctx);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [render]);

  useEffect(() => {
    if (isPlaying && gameStateRef.current && !gameStateRef.current.gameRunning) {
      startGame(gameStateRef.current);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (!isPlaying && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, gameLoop]);

  const handleExit = useCallback(() => {
    onGameEnd(score);
  }, [onGameEnd, score]);

  const handleStart = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
  }, []);

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
