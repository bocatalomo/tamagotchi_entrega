import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import './ArcadeCabinet.css';

interface ArcadeCabinetProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({ 
  children, 
  title = "TAMAGOTCHI ARCADE",
  className = "" 
}) => {
  return (
    <motion.div
      className={`arcade-cabinet ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Cabinet Frame */}
      <div className="cabinet-frame">
        {/* Top Marquee */}
        <div className="cabinet-marquee">
          <motion.div 
            className="marquee-text"
            animate={{
              textShadow: [
                "0 0 10px rgba(255, 107, 157, 0.8)",
                "0 0 20px rgba(255, 107, 157, 1)",
                "0 0 10px rgba(255, 107, 157, 0.8)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {title}
          </motion.div>
        </div>

        {/* Screen Container with CRT Effect */}
        <div className="crt-screen-container">
          {/* CRT Screen Frame */}
          <div className="crt-frame">
            {/* Screen Glass Effect */}
            <div className="screen-glass">
              {/* Scanlines Effect */}
              <div className="scanlines" />
              {/* Content Area */}
              <div className="screen-content">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Cabinet Controls Area */}
        <div className="cabinet-controls">
          <div className="control-panel">
            <div className="speaker-grille">
              <div className="speaker-hole"></div>
              <div className="speaker-hole"></div>
              <div className="speaker-hole"></div>
              <div className="speaker-hole"></div>
              <div className="speaker-hole"></div>
              <div className="speaker-hole"></div>
            </div>
          </div>
        </div>

        {/* Cabinet Base */}
        <div className="cabinet-base">
          <div className="base-decoration">
            <div className="led-indicator active"></div>
            <div className="led-indicator"></div>
          </div>
        </div>
      </div>

      {/* Ambient Lighting Effects */}
      <div className="ambient-glow" />
    </motion.div>
  );
};

export default ArcadeCabinet;