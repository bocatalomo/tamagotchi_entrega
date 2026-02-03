import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/enhanced-design-system.css';

interface NeuroButtonProps {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  glowEffect?: boolean;
  pulse?: boolean;
  fullWidth?: boolean;
}

const NeuroButton: React.FC<NeuroButtonProps> = ({
  label,
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  glowEffect = true,
  pulse = false,
  fullWidth = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          color: 'var(--color-neon-cyan)',
          glowColor: 'var(--color-neon-cyan)',
        };
      case 'secondary':
        return {
          color: 'var(--color-neon-magenta)',
          glowColor: 'var(--color-neon-magenta)',
        };
      case 'danger':
        return {
          color: 'var(--color-danger)',
          glowColor: 'var(--color-danger)',
        };
      case 'success':
        return {
          color: 'var(--color-neon-green)',
          glowColor: 'var(--color-neon-green)',
        };
      default:
        return {
          color: 'var(--color-neon-cyan)',
          glowColor: 'var(--color-neon-cyan)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'var(--spacing-sm) var(--spacing-md)',
          fontSize: '0.6rem',
          minWidth: '80px',
        };
      case 'md':
        return {
          padding: 'var(--spacing-md) var(--spacing-lg)',
          fontSize: '0.7rem',
          minWidth: '120px',
        };
      case 'lg':
        return {
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          fontSize: '0.8rem',
          minWidth: '160px',
        };
      default:
        return {
          padding: 'var(--spacing-md) var(--spacing-lg)',
          fontSize: '0.7rem',
          minWidth: '120px',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <motion.button
      className={`neuro-button ${pulse ? 'pulse-glow' : ''}`}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        width: fullWidth ? '100%' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        fontFamily: 'var(--font-pixel)',
        color: disabled ? 'var(--color-text-muted)' : variantStyles.color,
        border: disabled ? '1px solid var(--color-text-muted)' : 'none',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: isPressed
          ? `inset 2px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.03)`
          : isHovered
          ? `7px 7px 14px rgba(0, 0, 0, 0.4), -7px -7px 14px rgba(255, 255, 255, 0.05)`
          : `5px 5px 10px rgba(0, 0, 0, 0.4), -5px -5px 10px rgba(255, 255, 255, 0.03)`,
        ...sizeStyles,
        ...(glowEffect && !disabled && {
          boxShadow: `${isPressed ? '' : isHovered ? '0 0 20px ' : '0 0 10px '}${variantStyles.glowColor}, ${isPressed ? 'inset 2px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.03)' : isHovered ? '7px 7px 14px rgba(0, 0, 0, 0.4), -7px -7px 14px rgba(255, 255, 255, 0.05)' : '5px 5px 10px rgba(0, 0, 0, 0.4), -5px -5px 10px rgba(255, 255, 255, 0.03)'}`,
        }),
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {icon && (
        <motion.span
          style={{
            fontSize: '1.2em',
            filter: glowEffect && !disabled ? `drop-shadow(0 0 8px ${variantStyles.glowColor})` : 'none',
          }}
          animate={isHovered && !disabled ? { 
            rotate: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5 }
          } : {}}
        >
          {icon}
        </motion.span>
      )}
      
      <motion.span
        animate={{
          textShadow: isHovered && !disabled && glowEffect 
            ? `0 0 10px ${variantStyles.glowColor}` 
            : 'none',
        }}
      >
        {label}
      </motion.span>

      {/* Hover Effect Overlay */}
      <AnimatePresence>
        {isHovered && !disabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: variantStyles.glowColor,
              borderRadius: 'var(--radius-lg)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default NeuroButton;