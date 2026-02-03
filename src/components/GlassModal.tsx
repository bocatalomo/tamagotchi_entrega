import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/enhanced-design-system.css';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'danger' | 'success' | 'warning';
  showCloseButton?: boolean;
  preventCloseOnBackdrop?: boolean;
  backdropVariant?: 'blur' | 'dark' | 'gradient';
}

const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  preventCloseOnBackdrop = false,
  backdropVariant = 'blur',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          borderColor: 'var(--color-danger)',
          glowColor: 'var(--color-danger)',
          background: 'rgba(255, 68, 68, 0.05)',
        };
      case 'success':
        return {
          borderColor: 'var(--color-neon-green)',
          glowColor: 'var(--color-neon-green)',
          background: 'rgba(0, 255, 136, 0.05)',
        };
      case 'warning':
        return {
          borderColor: 'var(--color-neon-amber)',
          glowColor: 'var(--color-neon-amber)',
          background: 'rgba(255, 170, 0, 0.05)',
        };
      default:
        return {
          borderColor: 'var(--color-neon-cyan)',
          glowColor: 'var(--color-neon-cyan)',
          background: 'var(--glass-bg)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          maxWidth: '400px',
          width: '90vw',
        };
      case 'md':
        return {
          maxWidth: '600px',
          width: '90vw',
        };
      case 'lg':
        return {
          maxWidth: '800px',
          width: '95vw',
        };
      case 'xl':
        return {
          maxWidth: '1200px',
          width: '95vw',
        };
      case 'full':
        return {
          maxWidth: '100vw',
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: 0,
        };
      default:
        return {
          maxWidth: '600px',
          width: '90vw',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventCloseOnBackdrop) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)',
            ...(backdropVariant === 'blur' && {
              backdropFilter: 'blur(8px)',
              background: 'rgba(0, 0, 0, 0.5)',
            }),
            ...(backdropVariant === 'dark' && {
              background: 'rgba(0, 0, 0, 0.8)',
            }),
            ...(backdropVariant === 'gradient' && {
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(26, 26, 36, 0.9) 100%)',
            }),
          }}
        >
          {/* Animated Background Orbs */}
          <motion.div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${variantStyles.glowColor}20 0%, transparent 70%)`,
              filter: 'blur(60px)',
              top: '20%',
              left: '10%',
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${variantStyles.glowColor}15 0%, transparent 70%)`,
              filter: 'blur(40px)',
              bottom: '20%',
              right: '10%',
            }}
            animate={{
              scale: [1.5, 1, 1.5],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="glass-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.34, 1.56, 0.64, 1] 
            }}
            style={{
              position: 'relative',
              border: `2px solid ${variantStyles.borderColor}`,
              background: variantStyles.background,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px ${variantStyles.glowColor}40`,
              maxHeight: '90vh',
              overflowY: 'auto',
              ...sizeStyles,
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: 'var(--spacing-lg)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                background: 'rgba(26, 26, 36, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 1,
              }}
            >
              <motion.h2
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: size === 'sm' ? '0.8rem' : size === 'full' ? '1.2rem' : '1rem',
                  background: `linear-gradient(45deg, ${variantStyles.glowColor}, ${variantStyles.borderColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                }}
                animate={{
                  textShadow: `0 0 10px ${variantStyles.glowColor}`,
                }}
              >
                {title}
              </motion.h2>

              {showCloseButton && (
                <motion.button
                  onClick={onClose}
                  className="neuro-button"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: variantStyles.glowColor,
                    border: `1px solid ${variantStyles.borderColor}`,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: `${variantStyles.glowColor}20`,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              )}
            </div>

            {/* Modal Content */}
            <div
              style={{
                padding: size === 'full' ? 'var(--spacing-xl)' : 'var(--spacing-lg)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <AnimatePresence mode="wait">
                {children}
              </AnimatePresence>
            </div>

            {/* Animated Border Glow */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px solid ${variantStyles.glowColor}`,
                borderRadius: 'var(--radius-lg)',
                opacity: 0.3,
                pointerEvents: 'none',
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;