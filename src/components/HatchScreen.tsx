import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HatchScreen.css';

interface HatchScreenProps {
  petName: string;
  onHatch: (name: string) => void;
}

const HatchScreen = ({ petName, onHatch }: HatchScreenProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const [hatched, setHatched] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const ballRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const timerBarRef = useRef<HTMLDivElement>(null);
  const eggRef = useRef<HTMLDivElement>(null);

  const gameRef = useRef({
    pointPosition: 0,
    targetPosition: 30,
    targetDirection: 1,
    isHolding: false,
    isComplete: false,
    chargeLevel: 0,
  });

  const [uiState, setUiState] = useState({
    isInsideTarget: false,
    isComplete: false,
  });

  const VELOCITY = 35;
  const TARGET_VELOCITY = 18;
  const TARGET_WIDTH = 25;
  const RANDOM_CHANGE = 0.03;

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const startHolding = useCallback(() => {
    if (gameRef.current.isComplete) return;
    gameRef.current.isHolding = true;
  }, []);

  const stopHolding = useCallback(() => {
    gameRef.current.isHolding = false;
  }, []);

  const handleStart = useCallback(() => {
    setShowIntro(false);
    localStorage.setItem('tamagotchi_has_seen_hatch', 'true');
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const gameLoop = useCallback((currentTime: number) => {
    if (gameRef.current.isComplete) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    const safeDelta = deltaTime > 100 ? 16.67 : deltaTime;
    const deltaSeconds = safeDelta / 1000;

    // Mover bola horizontalmente
    if (gameRef.current.isHolding) {
      gameRef.current.pointPosition += VELOCITY * deltaSeconds;
    } else {
      gameRef.current.pointPosition -= VELOCITY * deltaSeconds;
    }
    gameRef.current.pointPosition = Math.max(0, Math.min(100, gameRef.current.pointPosition));

    // Mover objetivo
    gameRef.current.targetPosition += TARGET_VELOCITY * gameRef.current.targetDirection * deltaSeconds;

    // Cambio aleatorio de dirección
    if (Math.random() < RANDOM_CHANGE) {
      gameRef.current.targetDirection *= -1;
    }

    // Mantener en rango
    gameRef.current.targetPosition = Math.max(0, Math.min(100 - TARGET_WIDTH, gameRef.current.targetPosition));

    // Verificar colisión
    const targetEnd = gameRef.current.targetPosition + TARGET_WIDTH;
    const isInside = gameRef.current.pointPosition >= gameRef.current.targetPosition && gameRef.current.pointPosition <= targetEnd;

    // Cargar o descargar carga
    if (isInside && gameRef.current.isHolding) {
      gameRef.current.chargeLevel += 10 * deltaSeconds;
    } else if (!isInside) {
      gameRef.current.chargeLevel -= 5 * deltaSeconds;
    }
    gameRef.current.chargeLevel = Math.max(0, Math.min(100, gameRef.current.chargeLevel));

    // Actualizar DOM directamente
    if (ballRef.current) {
      ballRef.current.style.left = `${gameRef.current.pointPosition}%`;
      ballRef.current.className = `hatch-point ${isInside ? 'inside' : 'outside'}`;
    }
    if (targetRef.current) {
      targetRef.current.style.left = `${gameRef.current.targetPosition}%`;
      targetRef.current.className = `hatch-target ${isInside ? 'active' : ''}`;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${gameRef.current.chargeLevel}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = gameRef.current.chargeLevel >= 100 ? '¡CASI!' : `${Math.floor(gameRef.current.chargeLevel)}%`;
    }
    if (timerBarRef.current) {
      timerBarRef.current.style.width = `${gameRef.current.chargeLevel}%`;
    }
    if (eggRef.current) {
      eggRef.current.className = `hatch-egg ${gameRef.current.isHolding ? 'holding' : ''}`;
    }

    // Verificar victoria
    if (gameRef.current.chargeLevel >= 100) {
      gameRef.current.isComplete = true;
      setUiState({ isInsideTarget: true, isComplete: true });
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const handleComplete = useCallback(() => {
    if (hatched) return;

    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 120,
      y: 50 + (Math.random() - 0.5) * 120,
      color: ['#FFD700', '#FF6B9D', '#87CEEB', '#98FB98', '#FFF'][Math.floor(Math.random() * 5)],
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setHatched(true);
      onHatch(petName);
    }, 2000);
  }, [hatched, onHatch, petName]);

  useEffect(() => {
    const seen = localStorage.getItem('tamagotchi_has_seen_hatch');
    if (seen === 'true') {
      setShowIntro(false);
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  useEffect(() => {
    if (uiState.isComplete && !hatched) {
      handleComplete();
    }
  }, [uiState.isComplete, hatched, handleComplete]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (showIntro) {
    return (
      <motion.div
        className="hatch-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="hatch-intro">
          <motion.div className="intro-egg">🥚</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            ¡Tu Tamagotchi está listo!
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Mantén presionado el huevo mientras la bola está en la zona dorada para hacerlo nacer
          </motion.p>
          <motion.button
            className="hatch-start-button"
            onClick={handleStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ¡Comenzar!
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (hatched) {
    return (
      <motion.div className="hatch-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="hatch-celebration">
          <motion.div className="hatch-flash" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5 }} />
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={`burst-${i}`}
              className="hatch-burst-particle"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: ['#FFD700', '#FF6B9D', '#87CEEB', '#98FB98', '#FFF'][i % 5],
              }}
              initial={{ opacity: 1, scale: 0 }}
              animate={{
                opacity: 0,
                scale: [0, 1.5, 0],
                x: `calc(cos(${i * 3.6}deg) * ${150 + Math.random() * 100}px)`,
                y: `calc(sin(${i * 3.6}deg) * ${150 + Math.random() * 100}px)`,
              }}
              transition={{ duration: 1.5, delay: i * 0.01 }}
            />
          ))}
          <motion.div className="hatch-pet-appearing">🐣</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            ¡Bienvenido, {petName}! 🎉
          </motion.h1>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="hatch-screen">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="hatch-particle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.color }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 2, y: -50 }}
          transition={{ duration: 0.8 }}
        />
      ))}

      {/* Progress Bar - Top */}
      <div className="hatch-progress-section">
        <div className="hatch-progress-header">
          <span className="hatch-progress-label">PROGRESO</span>
          <span ref={progressTextRef} className="hatch-progress-percent">0%</span>
        </div>
        <div className="hatch-progress-bar">
          <div ref={progressBarRef} className="hatch-progress-fill" />
        </div>
      </div>

      {/* Game Bar - Middle */}
      <div className="hatch-game-section">
        <div className="hatch-bar-container">
          <div className="hatch-bar">
            <div
              ref={targetRef}
              className="hatch-target"
              style={{ left: `${gameRef.current.targetPosition}%`, width: `${TARGET_WIDTH}%` }}
            />
            <div
              ref={ballRef}
              className="hatch-point outside"
              style={{ left: `${gameRef.current.pointPosition}%` }}
            />
          </div>
          <p className={`hatch-game-hint ${uiState.isInsideTarget ? 'active' : ''}`}>
            {gameRef.current.isHolding ? '¡Mantén!' : 'Presiona el huevo'}
          </p>
        </div>

        {/* Timer - Separate Bar */}
        <div className="hatch-timer-section">
          <div className="hatch-timer-container">
            <span className="hatch-timer-icon">⏱️</span>
            <div className="hatch-timer-bar-bg">
              <div ref={timerBarRef} className="hatch-timer-bar" />
            </div>
            <span className="hatch-timer-text">
              {gameRef.current.chargeLevel >= 100 ? '¡LISTO!' : `${Math.floor(gameRef.current.chargeLevel)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Egg - Bottom */}
      <div className="hatch-egg-section">
        <motion.div
          ref={eggRef}
          className="hatch-egg"
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={(e) => { e.preventDefault(); startHolding(); }}
          onTouchEnd={(e) => { e.preventDefault(); stopHolding(); }}
        >
          🥚
        </motion.div>
        <p className={`hatch-hold-hint ${gameRef.current.isHolding ? 'active' : ''}`}>
          {gameRef.current.isHolding ? '¡NO SUELTES!' : 'Mantén presionado'}
        </p>
      </div>
    </div>
  );
};

export default HatchScreen;
