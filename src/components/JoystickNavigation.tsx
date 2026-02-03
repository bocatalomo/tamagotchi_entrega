import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ArcadeButton from './ArcadeButton';
import './JoystickNavigation.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}

interface JoystickNavigationProps {
  items: NavItem[];
  className?: string;
}

const JoystickNavigation: React.FC<JoystickNavigationProps> = ({ 
  items, 
  className = '' 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + items.length) % items.length);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % items.length);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (items[activeIndex]?.onClick) {
            items[activeIndex].onClick();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, activeIndex]);
  return (
    <motion.div
      className={`joystick-navigation ${className}`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Navigation Panel */}
      <div className="nav-panel">
        {/* Panel Background */}
        <div className="panel-background">
          {/* Grid Pattern */}
          <div className="grid-pattern" />
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="nav-item-wrapper"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <ArcadeButton
                variant={item.active ? "primary" : "secondary"}
                size="small"
                onClick={item.onClick}
                active={item.active}
                className={`nav-button ${index === activeIndex ? 'keyboard-focused' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    setActiveIndex(index);
                  }
                }}
                tabIndex={0}
                aria-label={`Navegar a ${item.label}`}
                aria-current={item.active ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </ArcadeButton>
              
              {/* Active Indicator */}
              {item.active && (
                <motion.div
                  className="active-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Joystick Controller */}
        <div className="joystick-controller">
          <div className="joystick-base">
            <motion.div
              className="joystick-stick"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="stick-top" />
              <div className="stick-shadow" />
            </motion.div>
          </div>
          
          {/* Direction Buttons */}
          <div className="direction-pad">
            <div className="d-pad-button d-pad-up">▲</div>
            <div className="d-pad-button d-pad-down">▼</div>
            <div className="d-pad-button d-pad-left">◄</div>
            <div className="d-pad-button d-pad-right">►</div>
            <div className="d-pad-center" />
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <div className="action-button button-a">A</div>
            <div className="action-button button-b">B</div>
          </div>
        </div>

        {/* Panel Decorations */}
        <div className="panel-decorations">
          <div className="deco-light deco-light-1" />
          <div className="deco-light deco-light-2" />
          <div className="deco-light deco-light-3" />
        </div>

        {/* Speaker Grille */}
        <div className="speaker-grille">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="speaker-hole" />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default JoystickNavigation;