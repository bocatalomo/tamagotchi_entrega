import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/enhanced-design-system.css';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedDate?: string;
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  isUnlocked,
  progress = 0,
  maxProgress = 100,
  rarity,
  unlockedDate,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRarityStyles = () => {
    switch (rarity) {
      case 'common':
        return {
          background: 'linear-gradient(45deg, #888888, #aaaaaa)',
          glowColor: '#aaaaaa',
          bgColor: 'rgba(170, 170, 170, 0.1)',
        };
      case 'rare':
        return {
          background: 'linear-gradient(45deg, #0080ff, #00ccff)',
          glowColor: '#00ccff',
          bgColor: 'rgba(0, 204, 255, 0.1)',
        };
      case 'epic':
        return {
          background: 'linear-gradient(45deg, #ff00ff, #aa00ff)',
          glowColor: '#ff00ff',
          bgColor: 'rgba(255, 0, 255, 0.1)',
        };
      case 'legendary':
        return {
          background: 'linear-gradient(45deg, #ffaa00, #ff6600)',
          glowColor: '#ffaa00',
          bgColor: 'rgba(255, 170, 0, 0.1)',
        };
      default:
        return {
          background: 'linear-gradient(45deg, #888888, #aaaaaa)',
          glowColor: '#aaaaaa',
          bgColor: 'rgba(170, 170, 170, 0.1)',
        };
    }
  };

  const rarityStyles = getRarityStyles();
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  return (
    <motion.div
      className={`glass-card floating-card ${isUnlocked ? 'unlocked' : 'locked'}`}
      whileHover={{ 
        scale: 1.03,
        rotateX: 5,
        rotateY: -5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: 'var(--spacing-lg)',
        position: 'relative',
        overflow: 'hidden',
        background: isUnlocked ? rarityStyles.bgColor : 'rgba(50, 50, 60, 0.2)',
        opacity: isUnlocked ? 1 : 0.6,
      }}
    >
      {/* Rarity Border Glow */}
      {isUnlocked && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            border: `2px solid ${rarityStyles.glowColor}`,
            borderRadius: 'var(--radius-lg)',
            opacity: isHovered ? 1 : 0.3,
            boxShadow: isHovered ? `0 0 20px ${rarityStyles.glowColor}` : 'none',
          }}
          animate={{
            opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Icon Container */}
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-md)',
          position: 'relative',
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          filter: isUnlocked && isHovered 
            ? `drop-shadow(0 0 15px ${rarityStyles.glowColor})` 
            : 'none',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            borderRadius: '50%',
            background: isUnlocked ? rarityStyles.background : 'linear-gradient(45deg, #333333, #555555)',
            boxShadow: isUnlocked 
              ? `0 0 20px ${rarityStyles.glowColor}40` 
              : 'inset 2px 2px 5px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isUnlocked ? icon : '🔒'}
          
          {/* Rarity Sparkle Effect */}
          {isUnlocked && rarity !== 'common' && (
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                borderRadius: '50%',
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.h3
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.7rem',
            margin: '0 0 var(--spacing-xs) 0',
            background: isUnlocked ? rarityStyles.background : 'none',
            WebkitBackgroundClip: isUnlocked ? 'text' : 'unset',
            WebkitTextFillColor: isUnlocked ? 'transparent' : 'var(--color-text-secondary)',
            backgroundClip: 'text',
          }}
          animate={{
            textShadow: isUnlocked && isHovered 
              ? `0 0 10px ${rarityStyles.glowColor}` 
              : 'none',
          }}
        >
          {title}
        </motion.h3>
        
        <p style={{
          fontSize: '0.6rem',
          color: isUnlocked ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
          margin: '0 0 var(--spacing-sm) 0',
          lineHeight: '1.3',
        }}>
          {description}
        </p>

        {/* Progress Bar or Unlocked Date */}
        {isUnlocked && unlockedDate ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: '0.5rem',
              color: rarityStyles.glowColor,
              fontFamily: 'var(--font-pixel)',
              textAlign: 'center',
              marginTop: 'var(--spacing-xs)',
            }}
          >
            ✨ {new Date(unlockedDate).toLocaleDateString()}
          </motion.div>
        ) : !isUnlocked && maxProgress > 0 ? (
          <div style={{ marginTop: 'var(--spacing-sm)' }}>
            <div
              style={{
                height: '4px',
                background: 'var(--color-bg-dark)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: rarityStyles.background,
                  width: `${progressPercentage}%`,
                  borderRadius: '2px',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div style={{
              fontSize: '0.5rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              marginTop: '2px',
            }}>
              {progress} / {maxProgress}
            </div>
          </div>
        ) : null}
      </div>

      {/* Hover Reveal Effect */}
      <AnimatePresence>
        {isHovered && !isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              color: rarityStyles.glowColor,
              fontSize: '0.6rem',
              fontFamily: 'var(--font-pixel)',
              textAlign: 'center',
            }}>
              🔒 {rarity.toUpperCase()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AchievementCard;