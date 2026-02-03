import React from 'react';
import { motion } from 'framer-motion';
import './ArcadeButton.css';

interface ArcadeButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent | React.FormEvent) => void;
  onKeyDown?: (e?: React.KeyboardEvent) => void;
  variant?: 'primary' | 'secondary' | 'joystick';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  active?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
  tabIndex?: number;
}

const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  children,
  onClick,
  onKeyDown,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  active = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
  tabIndex = 0
}) => {
  const baseVariants = {
    idle: { 
      scale: 1, 
      rotateZ: 0,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
    },
    hover: { 
      scale: 1.05, 
      rotateZ: 0,
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 107, 157, 0.3)'
    },
    tap: { 
      scale: 0.95, 
      rotateZ: -2,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
    }
  };

  const joystickVariants = {
    idle: { 
      scale: 1, 
      y: 0,
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(255, 255, 255, 0.1)'
    },
    hover: { 
      scale: 1.05, 
      y: -2,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(255, 255, 255, 0.2)'
    },
    tap: { 
      scale: 0.95, 
      y: 2,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
    }
  };

  const variants = variant === 'joystick' ? joystickVariants : baseVariants;

  return (
    <motion.button
      className={`arcade-button arcade-button--${variant} arcade-button--${size} ${active ? 'arcade-button--active' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      type={type || 'button'}
      variants={variants}
      initial="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={!disabled ? "tap" : "idle"}
      animate={active ? "hover" : "idle"}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      tabIndex={tabIndex}
    >
      {variant === 'joystick' && (
        <div className="joystick-base">
          <div className="joystick-top" />
        </div>
      )}
      
      <span className="button-text">
        {children}
      </span>

      {active && (
        <motion.div
          className="active-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {variant === 'primary' && (
        <div className="button-reflection" />
      )}
    </motion.button>
  );
};

export default ArcadeButton;