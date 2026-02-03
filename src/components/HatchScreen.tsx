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
  const progressTextRef = useRef<HTMLDivElement>(null);
  const timerBarRef = useRef<HTMLDivElement>(null);
  const eggRef = useRef<HTMLDivElement>(null);

  const gameRef = useRef({
    pointPosition: 0,
    targetPosition: 30,
    targetDirection: 1,
    isHolding: false,
    isComplete: false,
    timeInTarget: 0,
    chargeLevel: 0,
  });

  const [uiState, setUiState] = useState({
    isInsideTarget: false,
    isComplete: false,
  });

  const VELOCITY = 35;
  const TARGET_VELOCITY = 15;
  const TARGET_WIDTH = 25;
  const TARGET_TIME = 7000;
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

    // Mover bola
    if (gameRef.current.isHolding) {
      gameRef.current.pointPosition += VELOCITY * deltaSeconds;
    } else {
      gameRef.current.pointPosition -= VELOCITY * deltaSeconds;
    }
    gameRef.current.pointPosition = Math.max(0, Math.min(100, gameRef.current.pointPosition));

    // Mover objetivo
    gameRef.current.targetPosition += TARGET_VELOCITY * gameRef.current.targetDirection * deltaSeconds;

    // Cambio aleatorio de dirección (3% probabilidad)
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
      // Cargar: +10% por segundo
      gameRef.current.chargeLevel += 10 * deltaSeconds;
    } else if (!isInside) {
      // Decaer: -5% por segundo
      gameRef.current.chargeLevel -= 5 * deltaSeconds;
    }
    // Mantener carga si está dentro pero no sosteniendo
    gameRef.current.chargeLevel = Math.max(0, Math.min(100, gameRef.current.chargeLevel));

    // Verificar victoria
    if (gameRef.current.chargeLevel >= 100) {
      gameRef.current.isComplete = true;
      setUiState({ isInsideTarget: true, isComplete: true });
      return;
    }
    if (ballRef.current) {
      ballRef.current.style.left = `${gameRef.current.pointPosition}%`;
      ballRef.current.className = `hatch-point ${isInside ? 'inside' : 'outside'}`;
    }
    if (targetRef.current) {
      targetRef.current.style.left = `${gameRef.current.targetPosition}%`;
      targetRef.current.style.opacity = isInside ? '1' : '0.5';
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${gameRef.current.chargeLevel}%`;
      progressBarRef.current.style.backgroundColor = gameRef.current.chargeLevel >= 100 ? '#98FB98' : gameRef.current.chargeLevel >= 70 ? '#FFD700' : '#87CEEB';
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = gameRef.current.chargeLevel >= 100 ? '¡Casi listo!' : `${Math.floor(gameRef.current.chargeLevel)}%`;
    }
    if (timerBarRef.current) {
      timerBarRef.current.style.height = `${gameRef.current.chargeLevel}%`;
      timerBarRef.current.style.backgroundColor = gameRef.current.chargeLevel >= 100 ? '#98FB98' : gameRef.current.chargeLevel >= 70 ? '#FFD700' : '#87CEEB';
    }
    if (eggRef.current) {
      eggRef.current.style.transform = gameRef.current.isHolding ? 'scale(1.05)' : gameRef.current.chargeLevel >= 50 ? 'scale(1.02)' : 'scale(1)';
    }

    // Verificar victoria
    if (gameRef.current.timeInTarget >= TARGET_TIME) {
      gameRef.current.isComplete = true;
      setUiState({ isInsideTarget: true, isComplete: true });
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const handleComplete = useCallback(() => {
    if (hatched) return;

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 100,
      y: 50 + (Math.random() - 0.5) * 100,
      color: ['#FFD700', '#FF6B9D', '#87CEEB', '#98FB98'][Math.floor(Math.random() * 4)],
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
          <motion.div
            className="intro-egg"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🥚
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            ¡Tu Tamagotchi está listo para nacer!
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Completa el minijuego de eclosión
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
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={`burst-${i}`}
              className="hatch-burst-particle"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: ['#FFD700', '#FF6B9D', '#87CEEB', '#98FB98', '#FFF'][i % 5],
                '--angle': `${(i * 360) / 100}deg`,
              } as React.CSSProperties}
              initial={{ opacity: 1, scale: 0 }}
              animate={{
                opacity: 0,
                scale: [0, 1, 0],
                x: `calc(cos(var(--angle)) * ${150 + Math.random() * 150}px)`,
                y: `calc(sin(var(--angle)) * ${150 + Math.random() * 150}px)`,
              }}
              transition={{ duration: 1.5, delay: Math.random() * 0.3 }}
            />
          ))}
          <motion.div className="hatch-flash" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5 }} />
          <motion.div
            className="hatch-pet-appearing"
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            🐣
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>
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
          animate={{ opacity: 0, scale: 2, y: -100 }}
          transition={{ duration: 1 }}
        />
      ))}

      <div className="hatch-progress-container">
        <div className="hatch-progress-bar">
          <motion.div
            ref={progressBarRef}
            className="hatch-progress-fill"
            style={{
              width: '0%',
              backgroundColor: '#87CEEB'
            }}
          />
        </div>
        <div ref={progressTextRef} className="hatch-progress-text">
          0%
        </div>
      </div>

      <div className="hatch-bar-container">
        <div className="hatch-bar">
          <div
            ref={targetRef}
            className="hatch-target"
            style={{ left: `${gameRef.current.targetPosition}%`, width: `${TARGET_WIDTH}%`, opacity: 0.5 }}
          />
          <div
            ref={ballRef}
            className="hatch-point outside"
            style={{ left: `${gameRef.current.pointPosition}%` }}
          />
        </div>
        <p className="hatch-hint">
          {gameRef.current.isHolding ? '¡Mantén presionado!' : 'Mantén pulsado el huevo'}
        </p>
      </div>

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

      <div className="hatch-timer">
        <motion.div
          ref={timerBarRef}
          className="hatch-timer-bar"
          style={{
            height: '0%',
            backgroundColor: '#87CEEB'
          }}
        />
      </div>
    </div>
  );
};

export default HatchScreen;
