import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/enhanced-design-system.css';

interface GlassNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  items: Array<{
    id: string;
    label: string;
    icon: string;
    badge?: number;
    notification?: boolean;
  }>;
}

const GlassNav: React.FC<GlassNavProps> = ({
  currentScreen,
  onNavigate,
  items,
}) => {
  const [activeIndicator, setActiveIndicator] = useState(currentScreen);

  React.useEffect(() => {
    setActiveIndicator(currentScreen);
  }, [currentScreen]);

  return (
    <motion.div
      className="glass-nav"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        position: 'fixed',
        top: 'var(--spacing-lg)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      {/* Active Indicator */}
      <motion.div
        className="nav-indicator"
        style={{
          position: 'absolute',
          bottom: '2px',
          height: '3px',
          background: 'var(--neon-gradient-cyan)',
          borderRadius: '2px',
          boxShadow: '0 0 10px var(--color-neon-cyan)',
        }}
        initial={false}
        animate={{
          x: items.findIndex(item => item.id === activeIndicator) * 100 - 50,
          width: '60px',
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30,
          duration: 0.4 
        }}
      />

      {items.map((item, index) => {
        const isActive = item.id === currentScreen;
        const hasNotification = item.notification || (item.badge && item.badge > 0);

        return (
          <motion.div
            key={item.id}
            style={{ position: 'relative' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              className={`glass-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: '20px',
                minWidth: '80px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Notification Badge */}
              <AnimatePresence>
                {hasNotification && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'var(--color-danger)',
                      color: 'white',
                      borderRadius: '50%',
                      minWidth: '16px',
                      height: '16px',
                      fontSize: '0.4rem',
                      fontFamily: 'var(--font-pixel)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(255, 68, 68, 0.8)',
                      zIndex: 2,
                    }}
                  >
                    {item.badge || '!'}
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <motion.span
                  style={{
                    fontSize: '1rem',
                    filter: isActive ? 'drop-shadow(0 0 8px var(--color-neon-cyan))' : 'none',
                  }}
                  animate={{ 
                    rotate: hasNotification ? [0, -10, 10, -10, 10, 0] : 0,
                    transition: { duration: 0.5, repeat: hasNotification ? Infinity : 0, repeatDelay: 2 }
                  }}
                >
                  {item.icon}
                </motion.span>
                <span style={{ 
                  fontFamily: 'var(--font-pixel)', 
                  fontSize: '0.5rem',
                  letterSpacing: '0.05em',
                }}>
                  {item.label}
                </span>
              </div>

              {/* Active State Glow Effect */}
              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--neon-gradient-cyan)',
                    borderRadius: '20px',
                    opacity: 0.2,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default GlassNav;