import React from 'react';
import { motion } from 'framer-motion';
import { statBarVariants, staggerContainer, staggerItem } from '../utils/animationVariants';

interface StatBarProps {
  icon: string;
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  onClick?: () => void;
}

const StatBar: React.FC<StatBarProps> = ({
  icon,
  label,
  value,
  maxValue = 100,
  color = 'var(--color-neon-green)',
  onClick,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  const getColorForValue = (val: number): string => {
    if (val > 70) return 'var(--color-neon-green)';
    if (val > 40) return 'var(--color-neon-amber)';
    return 'var(--color-danger)';
  };

  const displayColor = color === 'auto' ? getColorForValue(value) : color;

  return (
    <motion.div
      className="stat-row"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-bar-container">
        <motion.div
          className="stat-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: displayColor,
            boxShadow: `0 0 10px ${displayColor}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <span className="stat-value">{Math.round(value)}</span>
      </div>
    </motion.div>
  );
};

interface StatsDisplayProps {
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  health: number;
  coins: number;
  level: number;
  age: number;
  onStatClick?: (stat: string) => void;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  hunger,
  happiness,
  energy,
  cleanliness,
  health,
  coins,
  level,
  age,
  onStatClick,
}) => {
  return (
    <motion.div
      className="stats-container"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={staggerItem}>
        <StatBar
          icon="🍖"
          label="Hambre"
          value={hunger}
          color="auto"
          onClick={() => onStatClick?.('hunger')}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <StatBar
          icon="😊"
          label="Felicidad"
          value={happiness}
          color="auto"
          onClick={() => onStatClick?.('happiness')}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <StatBar
          icon="⚡"
          label="Energía"
          value={energy}
          color="auto"
          onClick={() => onStatClick?.('energy')}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <StatBar
          icon="🧼"
          label="Limpieza"
          value={cleanliness}
          color="auto"
          onClick={() => onStatClick?.('cleanliness')}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <StatBar
          icon="❤️"
          label="Salud"
          value={health}
          color="auto"
          onClick={() => onStatClick?.('health')}
        />
      </motion.div>

      <motion.div
        variants={staggerItem}
        style={{
          display: 'flex',
          gap: 'var(--spacing-lg)',
          justifyContent: 'center',
          marginTop: 'var(--spacing-sm)',
          padding: 'var(--spacing-sm)',
          background: 'var(--color-bg-dark)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <span>🪙</span>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--color-neon-amber)' }}>
            {coins}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <span>📊</span>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--color-neon-cyan)' }}>
            Nivel {level}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <span>🎂</span>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--color-neon-magenta)' }}>
            {age} días
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsDisplay;
