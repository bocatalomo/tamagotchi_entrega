import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/enhanced-design-system.css';

interface GlassStatsCardProps {
  title: string;
  value: number;
  maxValue?: number;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  onClick?: () => void;
}

const GlassStatsCard: React.FC<GlassStatsCardProps> = ({
  title,
  value,
  maxValue = 100,
  icon,
  color,
  trend,
  trendValue,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = (value / maxValue) * 100;

  const getColorForValue = (val: number): string => {
    if (val > 70) return 'var(--neon-gradient-green)';
    if (val > 40) return 'var(--neon-gradient-amber)';
    return 'linear-gradient(45deg, #ff4444, #cc0000)';
  };

  const displayColor = color === 'auto' ? getColorForValue(value) : color;

  return (
    <motion.div
      className="glass-card floating-card"
      whileHover={{ 
        scale: 1.02,
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
      }}
    >
      {/* Animated Background Gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: displayColor,
          opacity: isHovered ? 0.1 : 0.05,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 'var(--spacing-md)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '1.5rem', filter: isHovered ? `drop-shadow(${color} 0 0 10px)` : 'none' }}>
            {icon}
          </span>
          <div>
            <div style={{ 
              fontFamily: 'var(--font-pixel)', 
              fontSize: '0.6rem', 
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {title}
            </div>
            {trend && trendValue && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '0.5rem',
                  color: trend === 'up' ? 'var(--color-neon-green)' : 
                         trend === 'down' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                  marginTop: '2px',
                }}
              >
                <span>{trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}</span>
                <span>{Math.abs(trendValue)}%</span>
              </motion.div>
            )}
          </div>
        </div>
        
        <motion.div
          style={{
            fontSize: '1.2rem',
            fontFamily: 'var(--font-pixel)',
            background: displayColor,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: isHovered ? `0 0 20px ${color}` : 'none',
          }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
        >
          {Math.round(value)}
        </motion.div>
      </div>

      {/* Glass Progress Bar */}
      <div className="glass-progress">
        <motion.div
          className="glass-progress__fill"
          style={{ 
            background: displayColor,
            width: `${percentage}%`,
          }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="glass-progress__value">
          {Math.round(percentage)}%
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, transparent 30%, ${color}22 100%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GlassStatsCard;