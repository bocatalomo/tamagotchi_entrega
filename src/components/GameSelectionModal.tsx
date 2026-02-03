import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassModal from './GlassModal';
import './styles/enhanced-design-system.css';

interface GameSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameSelect: (gameId: string) => void;
  pet: {
    name: string;
    energy: number;
    level: number;
  };
}

const GameSelectionModal: React.FC<GameSelectionModalProps> = ({
  isOpen,
  onClose,
  onGameSelect,
  pet,
}) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'slots',
      name: 'Tragamedas',
      icon: '🎰',
      description: 'Gira y gana monedas',
      difficulty: 'Fácil',
      energyCost: 5,
      reward: { min: 10, max: 50 },
      rarity: 'common',
      unlockLevel: 1,
      color: 'var(--neon-gradient-green)',
    },
    {
      id: 'memory',
      name: 'Memoria',
      icon: '🧠',
      description: 'Encuentra pares iguales',
      difficulty: 'Medio',
      energyCost: 8,
      reward: { min: 20, max: 80 },
      rarity: 'rare',
      unlockLevel: 3,
      color: 'var(--neon-gradient-cyan)',
    },
    {
      id: 'skate',
      name: 'Skateboarding',
      icon: '🛹',
      description: 'Haz tricks y gana puntos',
      difficulty: 'Difícil',
      energyCost: 15,
      reward: { min: 40, max: 150 },
      rarity: 'epic',
      unlockLevel: 5,
      color: 'var(--neon-gradient-magenta)',
    },
    {
      id: 'quiz',
      name: 'Quiz Tamagotchi',
      icon: '🎯',
      description: 'Pon a prueba tus conocimientos',
      difficulty: 'Variable',
      energyCost: 10,
      reward: { min: 30, max: 100 },
      rarity: 'legendary',
      unlockLevel: 7,
      color: 'var(--neon-gradient-amber)',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'var(--color-neon-green)';
      case 'Medio': return 'var(--color-neon-amber)';
      case 'Difícil': return 'var(--color-neon-magenta)';
      default: return 'var(--color-neon-cyan)';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '0 0 30px var(--color-neon-amber)';
      case 'epic': return '0 0 20px var(--color-neon-magenta)';
      case 'rare': return '0 0 15px var(--color-neon-cyan)';
      default: return '0 0 10px var(--color-neon-green)';
    }
  };

  const isGameUnlocked = (unlockLevel: number, energyCost: number) => {
    return pet.level >= unlockLevel && pet.energy >= energyCost;
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="🎮 Selecciona un Juego"
      size="lg"
      variant="default"
      backdropVariant="gradient"
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-lg)',
        padding: 'var(--spacing-md)',
      }}>
        {games.map((game, index) => {
          const isUnlocked = isGameUnlocked(game.unlockLevel, game.energyCost);
          
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={isUnlocked ? { 
                scale: 1.03,
                rotateX: 5,
                rotateY: -5,
              } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
              onClick={() => isUnlocked ? onGameSelect(game.id) : null}
              style={{
                position: 'relative',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.6,
              }}
            >
              <div
                className="glass-card"
                style={{
                  padding: 'var(--spacing-lg)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  border: isUnlocked ? `2px solid transparent` : '2px solid var(--color-text-muted)',
                  background: isUnlocked 
                    ? `linear-gradient(45deg, transparent, ${game.color}10)` 
                    : 'var(--color-bg-dark)',
                }}
              >
                {/* Rarity Glow */}
                {isUnlocked && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      boxShadow: getRarityGlow(game.rarity),
                      borderRadius: 'var(--radius-lg)',
                    }}
                    animate={{
                      boxShadow: [getRarityGlow(game.rarity), `${getRarityGlow(game.rarity)}40`, getRarityGlow(game.rarity)],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                {/* Lock Overlay */}
                {!isUnlocked && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>🔒</div>
                      <div style={{
                        fontFamily: 'var(--font-pixel)',
                        fontSize: '0.5rem',
                        color: 'var(--color-text-secondary)',
                      }}>
                        Nivel {game.unlockLevel}
                      </div>
                    </div>
                  </div>
                )}

                {/* Game Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <motion.div
                    style={{
                      fontSize: '3rem',
                      marginBottom: 'var(--spacing-md)',
                      filter: isUnlocked ? `drop-shadow(${game.color.split(',')[1]}40 0 0 10px)` : 'none',
                    }}
                    whileHover={isUnlocked ? { 
                      scale: 1.2,
                      rotate: [0, -10, 10, -10, 10, 0],
                    } : {}}
                  >
                    {game.icon}
                  </motion.div>

                  <h3 style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.7rem',
                    margin: '0 0 var(--spacing-xs) 0',
                    background: isUnlocked ? game.color : 'var(--color-text-muted)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {game.name}
                  </h3>

                  <p style={{
                    fontSize: '0.6rem',
                    color: isUnlocked ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                    margin: '0 0 var(--spacing-sm) 0',
                    lineHeight: '1.3',
                  }}>
                    {game.description}
                  </p>

                  {/* Game Stats */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-xs)',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      fontSize: '0.5rem',
                      color: isUnlocked ? getDifficultyColor(game.difficulty) : 'var(--color-text-muted)',
                    }}>
                      <span>⚡</span>
                      <span>{game.energyCost} energía</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      fontSize: '0.5rem',
                      color: isUnlocked ? 'var(--color-neon-amber)' : 'var(--color-text-muted)',
                    }}>
                      <span>🪙</span>
                      <span>{game.reward.min}-{game.reward.max}</span>
                    </div>

                    <div style={{
                      fontSize: '0.4rem',
                      padding: '2px 6px',
                      background: isUnlocked ? `${game.color}30` : 'var(--color-bg-medium)',
                      borderRadius: '10px',
                      color: isUnlocked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-pixel)',
                    }}>
                      {game.difficulty}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                {isUnlocked && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, transparent 30%, ${game.color}20 100%)`,
                      borderRadius: 'var(--radius-lg)',
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Energy Warning */}
      {pet.energy < 15 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            background: 'rgba(255, 170, 0, 0.1)',
            border: '2px solid var(--color-neon-amber)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.6rem',
            color: 'var(--color-neon-amber)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            ⚠️ Energía Baja
          </div>
          <p style={{
            fontSize: '0.5rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            Tu mascota necesita más energía para jugar. Dale de comer o hazla dormir primero.
          </p>
        </motion.div>
      )}
    </GlassModal>
  );
};

export default GameSelectionModal;