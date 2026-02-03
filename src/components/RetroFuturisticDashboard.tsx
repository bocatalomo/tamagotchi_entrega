import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/enhanced-design-system.css';

interface RetroFuturisticDashboardProps {
  pet: {
    name: string;
    stage: string;
    mood: string;
    level: number;
    age: number;
    coins: number;
  };
  stats: {
    hunger: number;
    happiness: number;
    energy: number;
    cleanliness: number;
    health: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  onActionClick: (action: string) => void;
  onAchievementClick: (achievement: string) => void;
}

const RetroFuturisticDashboard: React.FC<RetroFuturisticDashboardProps> = ({
  pet,
  stats,
  achievements,
  onActionClick,
  onAchievementClick,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'stats' | 'achievements'>('overview');
  const [backgroundAnimation, setBackgroundAnimation] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundAnimation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Inicio', icon: '🏠' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'achievements', label: 'Logros', icon: '🏆', badge: achievements.filter(a => a.isUnlocked).length },
  ];

  const quickActions = [
    { id: 'feed', label: 'Alimentar', icon: '🍖', color: 'var(--neon-gradient-green)' },
    { id: 'play', label: 'Jugar', icon: '🎮', color: 'var(--neon-gradient-magenta)' },
    { id: 'sleep', label: 'Dormir', icon: '😴', color: 'var(--neon-gradient-cyan)' },
    { id: 'clean', label: 'Limpiar', icon: '🧼', color: 'var(--neon-gradient-amber)' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
        var(--color-bg-darkest)
      `,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '10%',
          left: '10%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
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
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '10%',
          right: '10%',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Navigation */}
      <div style={{ paddingTop: '80px' }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 'var(--spacing-xl)' 
        }}>
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`glass-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                margin: '0 var(--spacing-xs)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {item.badge && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'var(--color-neon-amber)',
                    color: 'var(--color-bg-darkest)',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '0.4rem',
                    fontFamily: 'var(--font-pixel)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </motion.div>
              )}
              <span style={{ marginRight: '4px' }}>{item.icon}</span>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem' }}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--spacing-lg)',
              }}
            >
              {/* Pet Info Card */}
              <motion.div
                className="glass-card"
                style={{
                  padding: 'var(--spacing-xl)',
                  textAlign: 'center',
                  gridColumn: 'span 2',
                  position: 'relative',
                }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.h1
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '1.5rem',
                    background: 'var(--neon-gradient-cyan)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: 'var(--spacing-sm)',
                  }}
                  animate={{
                    textShadow: ['0 0 10px var(--color-neon-cyan)', '0 0 20px var(--color-neon-cyan)', '0 0 10px var(--color-neon-cyan)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {pet.name}
                </motion.h1>
                <div style={{ fontSize: '2rem', margin: 'var(--spacing-md) 0' }}>
                  {pet.stage === 'egg' ? '🥚' : pet.stage === 'baby' ? '🐣' : pet.stage === 'teen' ? '🐥' : '🐱'}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--spacing-lg)',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.6rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  <span>📊 Nivel {pet.level}</span>
                  <span>🎂 {pet.age} días</span>
                  <span>🪙 {pet.coins}</span>
                </div>
              </motion.div>

              {/* Quick Actions */}
              {quickActions.map((action) => (
                <motion.div
                  key={action.id}
                  className="glass-card floating-card"
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: -5,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onActionClick(action.id)}
                  style={{
                    padding: 'var(--spacing-lg)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: action.color,
                      opacity: 0.1,
                    }}
                  />
                  <motion.div
                    style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}
                    whileHover={{ 
                      scale: 1.2,
                      filter: `drop-shadow(0 0 15px ${action.color.split(',')[1].split(')')[0]})`
                    }}
                  >
                    {action.icon}
                  </motion.div>
                  <div style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.6rem',
                    color: 'var(--color-text-primary)',
                  }}>
                    {action.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeSection === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-lg)',
              }}
            >
              {[
                { icon: '🍖', label: 'Hambre', value: stats.hunger },
                { icon: '😊', label: 'Felicidad', value: stats.happiness },
                { icon: '⚡', label: 'Energía', value: stats.energy },
                { icon: '🧼', label: 'Limpieza', value: stats.cleanliness },
                { icon: '❤️', label: 'Salud', value: stats.health },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ padding: 'var(--spacing-lg)' }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-md)',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                    <span style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '0.6rem',
                      color: 'var(--color-text-secondary)',
                    }}>
                      {stat.label}
                    </span>
                  </div>
                  <div className="glass-progress">
                    <motion.div
                      className="glass-progress__fill"
                      style={{
                        width: `${stat.value}%`,
                        background: stat.value > 70 ? 'var(--neon-gradient-green)' : 
                                  stat.value > 40 ? 'var(--neon-gradient-amber)' : 
                                  'linear-gradient(45deg, #ff4444, #cc0000)',
                      }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                    <div className="glass-progress__value">{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeSection === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 'var(--spacing-lg)',
              }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onAchievementClick(achievement.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Use AchievementCard component here */}
                  <div
                    className="glass-card"
                    style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                      opacity: achievement.isUnlocked ? 1 : 0.6,
                      position: 'relative',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
                      {achievement.isUnlocked ? achievement.icon : '🔒'}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '0.5rem',
                      color: achievement.isUnlocked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    }}>
                      {achievement.title}
                    </div>
                    {achievement.isUnlocked && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          border: `2px solid ${
                            achievement.rarity === 'legendary' ? 'var(--color-neon-amber)' :
                            achievement.rarity === 'epic' ? 'var(--color-neon-magenta)' :
                            achievement.rarity === 'rare' ? 'var(--color-neon-cyan)' :
                            'var(--color-text-secondary)'
                          }`,
                          borderRadius: 'var(--radius-lg)',
                          opacity: 0.5,
                        }}
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RetroFuturisticDashboard;