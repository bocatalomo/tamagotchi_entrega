import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants } from '../utils/animationVariants';

interface ActionButtonProps {
  icon: string;
  label: string;
  color: 'neon-green' | 'neon-cyan' | 'neon-magenta' | 'amber' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  notification?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  color,
  disabled = false,
  onClick,
  onMouseEnter,
  notification = false,
}) => {
  return (
    <motion.button
      className={`action-button ${color} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      variants={buttonVariants}
      initial="initial"
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'tap'}
      style={{
        position: 'relative',
      }}
    >
      {notification && (
        <motion.span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--color-danger)',
            borderRadius: '50%',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </motion.button>
  );
};

interface ActionsGridProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onClean: () => void;
  onMedicine: () => void;
  onTreat: () => void;
  onWake?: () => void;
  needsFeeding?: boolean;
  needsCleaning?: boolean;
  needsMedicine?: boolean;
  isSleeping?: boolean;
  hasLowEnergy?: boolean;
  onHoverFeed?: () => void;
  onHoverPlay?: () => void;
  onHoverSleep?: () => void;
  onHoverClean?: () => void;
  onHoverMedicine?: () => void;
  onHoverTreat?: () => void;
  onHoverWake?: () => void;
}

export const ActionsGrid: React.FC<ActionsGridProps> = ({
  onFeed,
  onPlay,
  onSleep,
  onClean,
  onMedicine,
  onTreat,
  onWake,
  needsFeeding = false,
  needsCleaning = false,
  needsMedicine = false,
  isSleeping = false,
  hasLowEnergy = false,
  onHoverFeed,
  onHoverPlay,
  onHoverSleep,
  onHoverClean,
  onHoverMedicine,
  onHoverTreat,
  onHoverWake,
}) => {
  return (
    <motion.div
      className="actions-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {isSleeping ? (
        <ActionButton
          icon="☀️"
          label="Despertar"
          color="amber"
          onClick={onWake}
          onMouseEnter={onHoverWake}
        />
      ) : (
        <>
          <ActionButton
            icon="🍖"
            label="Alimentar"
            color="neon-green"
            disabled={isSleeping}
            onClick={onFeed}
            onMouseEnter={onHoverFeed}
            notification={needsFeeding && !isSleeping}
          />

          <motion.button
            className={`play-button-modal ${isSleeping || hasLowEnergy ? 'disabled' : ''}`}
            onClick={onPlay}
            onMouseEnter={onHoverPlay}
            disabled={isSleeping || hasLowEnergy}
            animate={{
              scale: [1, 1.03, 1],
              boxShadow: [
                '0 0 10px rgba(0, 255, 255, 0.3)',
                '0 0 20px rgba(0, 255, 255, 0.5)',
                '0 0 10px rgba(0, 255, 255, 0.3)'
              ]
            }}
            transition={{
              scale: { repeat: Infinity, duration: 2 },
              boxShadow: { repeat: Infinity, duration: 2 }
            }}
            whileHover={!isSleeping && !hasLowEnergy ? {
              scale: 1.08,
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.7)'
            } : {}}
            whileTap={!isSleeping && !hasLowEnergy ? { scale: 0.95 } : {}}
          >
            <span className="play-button-icon">🎮</span>
            <span className="play-button-label">JUGAR</span>
            {(hasLowEnergy || isSleeping) && (
              <span className="play-button-warning">
                ⚡{hasLowEnergy ? '30+' : ''}
              </span>
            )}
          </motion.button>

          <ActionButton
            icon="💤"
            label="Dormir"
            color="amber"
            disabled={isSleeping}
            onClick={onSleep}
            onMouseEnter={onHoverSleep}
          />
          <ActionButton
            icon="🧼"
            label="Limpiar"
            color="neon-cyan"
            disabled={isSleeping}
            onClick={onClean}
            onMouseEnter={onHoverClean}
            notification={needsCleaning && !isSleeping}
          />
          <ActionButton
            icon="💊"
            label="Medicina"
            color="neon-magenta"
            disabled={isSleeping}
            onClick={onMedicine}
            onMouseEnter={onHoverMedicine}
            notification={needsMedicine && !isSleeping}
          />
          <ActionButton
            icon="🍬"
            label="Golosina"
            color="amber"
            disabled={isSleeping}
            onClick={onTreat}
            onMouseEnter={onHoverTreat}
          />
        </>
      )}
    </motion.div>
  );
};

export default ActionButton;
