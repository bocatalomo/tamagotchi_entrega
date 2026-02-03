import React from 'react';
import { motion } from 'framer-motion';
import ArcadeButton from './ArcadeButton';
import './ArcadeStatsPanel.css';

// Helper function to get status text and color based on percentage
const getStatStatus = (value: number, max: number) => {
  const percentage = (value / max) * 100;
  if (percentage >= 80) return { text: 'Excelente', color: '#00ff88', bgColor: '#00ff8822' };
  if (percentage >= 60) return { text: 'Bueno', color: '#88ff88', bgColor: '#88ff8822' };
  if (percentage >= 40) return { text: 'Regular', color: '#ffcc00', bgColor: '#ffcc0022' };
  if (percentage >= 20) return { text: 'Bajo', color: '#ff8844', bgColor: '#ff884422' };
  return { text: 'Crítico', color: '#ff4444', bgColor: '#ff444422' };
};

interface Stat {
  label: string;
  value: number;
  max: number;
  color?: string;
}

interface ArcadeStatsPanelProps {
  stats: Stat[];
  title?: string;
}

const ArcadeStatsPanel: React.FC<ArcadeStatsPanelProps> = ({ 
  stats, 
  title = "ESTADÍSTICAS" 
}) => {
  return (
    <motion.div
      className="arcade-stats-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Panel Header */}
      <div className="stats-header">
        <motion.h2
          className="stats-title"
          animate={{
            textShadow: [
              "2px 2px 0 rgba(0, 0, 0, 0.5)",
              "2px 2px 0 rgba(0, 0, 0, 0.5), 0 0 10px var(--arcade-pink)",
              "2px 2px 0 rgba(0, 0, 0, 0.5)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {title}
        </motion.h2>
        <div className="header-decoration">
          <div className="deco-line"></div>
          <div className="deco-dot"></div>
          <div className="deco-line"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Stat Label */}
            <div className="stat-label">
              <span className="label-text">{stat.label}</span>
              <div className="label-decoration" />
            </div>

            {/* Stat Bar Container */}
            <div className="stat-bar-container">
              {/* Background Bar */}
              <div className="stat-bar-background">
                {/* Grid Lines */}
                <div className="grid-lines">
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                </div>
              </div>
              
              {/* Filled Bar */}
              <motion.div
                className="stat-bar-fill"
                style={{
                  background: stat.color ? 
                    `linear-gradient(90deg, ${stat.color}dd, ${stat.color}99)` :
                    `linear-gradient(90deg, var(--arcade-pink), var(--arcade-purple))`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                transition={{ 
                  duration: 1, 
                  ease: "easeOut",
                  delay: index * 0.1 + 0.3
                }}
              >
                {/* Bar Shine Effect */}
                <div className="bar-shine" />
              </motion.div>

              {/* Bar Frame */}
              <div className="stat-bar-frame" />

              {/* Value Display */}
              <div className="stat-value">
                <motion.span
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value}/{stat.max}
                </motion.span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="status-indicators">
              {Array.from({ length: Math.ceil(stat.max / 25) }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`status-dot ${i < Math.ceil(stat.value / 25) ? 'active' : ''}`}
                  style={{
                    backgroundColor: i < Math.ceil(stat.value / 25) ? 
                      (stat.color || 'var(--arcade-pink)') : '#333'
                  }}
                  whileHover={{ scale: 1.2 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>

            {/* Status Text */}
            <div className="status-text">
              <motion.span
                className="status-label"
                style={{ color: getStatStatus(stat.value, stat.max).color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {getStatStatus(stat.value, stat.max).text}
              </motion.span>
              <motion.span
                className="status-percentage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.6 }}
              >
                ({Math.round((stat.value / stat.max) * 100)}%)
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Panel Footer */}
      <div className="stats-footer">
        <div className="footer-decoration">
          <div className="deco-dot"></div>
          <div className="deco-line"></div>
          <div className="deco-dot"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArcadeStatsPanel;