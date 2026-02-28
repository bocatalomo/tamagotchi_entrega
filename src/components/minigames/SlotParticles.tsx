import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
  symbol: string;
  size: number;
}

interface SlotParticlesProps {
  type: 'jackpot' | 'win' | 'lose' | null;
  onComplete?: () => void;
}

const SlotParticles = ({ type, onComplete }: SlotParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!type) {
      setParticles([]);
      return;
    }

    let newParticles: Particle[] = [];

    if (type === 'jackpot') {
      // EXPLOSIÓN ÉPICA para jackpot - 200 partículas!
      const count = 200;
      const colors = ['#FFD700', '#FFA500', '#FF6B9D', '#87CEEB', '#98FB98', '#FFF', '#FFEB3B', '#FF1493', '#00FFFF'];
      const symbols = ['⭐', '💰', '💎', '✨', '🎉', '🎊', '💫', '🌟', '💥', '⚡', '🔥'];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const velocity = 2 + Math.random() * 5; // Mayor variación de velocidad
        
        newParticles.push({
          id: i,
          x: 50,
          y: 50,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 3, // Más impulso hacia arriba
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: 10 + Math.random() * 16, // Partículas más grandes
        });
      }
    } else if (type === 'win') {
      // Explosión intensa para victoria - 80 partículas
      const count = 80;
      const colors = ['#4ecca3', '#98FB98', '#7FFF00', '#00FF7F', '#ADFF2F', '#FFD700', '#32CD32'];
      const symbols = ['✨', '⭐', '💫', '🌟', '💚', '💛'];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const velocity = 2 + Math.random() * 3.5;
        
        newParticles.push({
          id: i,
          x: 50,
          y: 50,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 1.5,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: 10 + Math.random() * 10,
        });
      }
    } else if (type === 'lose') {
      // Partículas cayendo para derrota
      const count = 20;
      const colors = ['#888', '#999', '#AAA', '#666'];
      const symbols = ['💨', '😢', '💔'];

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: 20 + Math.random() * 60,
          y: 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 2 + 1,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: 6 + Math.random() * 6,
        });
      }
    }

    setParticles(newParticles);

    const duration = type === 'jackpot' ? 3000 : type === 'win' ? 2000 : 1500;
    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 100,
    }}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              opacity: 1,
              scale: 0,
              rotate: particle.rotation,
            }}
            animate={{
              x: `${particle.x + particle.vx * 15}%`,
              y: `${particle.y + particle.vy * 15 + (type === 'lose' ? 80 : 60)}%`,
              opacity: [1, 1, 0],
              scale: [0, 1, 0.8, 0],
              rotate: particle.rotation + (Math.random() - 0.5) * 720,
            }}
            transition={{
              duration: type === 'jackpot' ? 3 : type === 'win' ? 2 : 1.5,
              ease: type === 'lose' ? 'easeIn' : 'easeOut',
            }}
            style={{
              position: 'absolute',
              fontSize: `${particle.size}px`,
              color: particle.color,
              textShadow: type === 'jackpot' ? `0 0 10px ${particle.color}, 0 0 20px ${particle.color}` : 'none',
              fontWeight: 'bold',
            }}
          >
            {particle.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SlotParticles;
