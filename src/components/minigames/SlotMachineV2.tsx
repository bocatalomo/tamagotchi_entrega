import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlotMachine, SlotSymbol } from '../../hooks/useSlotMachine';
import SlotParticles from './SlotParticles';
import './SlotMachineV2.css';

interface SlotMachineV2Props {
  coins: number;
  onUpdateCoins: (coinsChange: number) => void;
  onBack: () => void;
}

const SlotMachineV2 = ({ coins, onUpdateCoins, onBack }: SlotMachineV2Props) => {
  const symbolHeight = 100;
  const {
    bet,
    adjustBet,
    setBetPreset,
    isSpinning,
    reels,
    result,
    winAmount,
    showJackpotOverlay,
    stats,
    autoSpinEnabled,
    turboMode,
    winningReels,
    toggleAutoSpin,
    toggleTurboMode,
    resetStats,
    spin,
    setMuted,
  } = useSlotMachine();

  const autoSpinRef = useRef<NodeJS.Timeout | null>(null);
  const [nearMissActive, setNearMissActive] = useState(false);
  const [displayCoins, setDisplayCoins] = useState(coins);

  // Auto-spin logic
  useEffect(() => {
    if (autoSpinEnabled && !isSpinning && coins >= bet) {
      autoSpinRef.current = setTimeout(() => {
        spin(coins, onUpdateCoins);
      }, turboMode ? 500 : 1500);
    }

    return () => {
      if (autoSpinRef.current) {
        clearTimeout(autoSpinRef.current);
      }
    };
  }, [autoSpinEnabled, isSpinning, coins, bet, spin, onUpdateCoins, turboMode]);

  // Detener auto-spin si no hay suficientes monedas
  useEffect(() => {
    if (autoSpinEnabled && coins < bet) {
      toggleAutoSpin();
    }
  }, [coins, bet, autoSpinEnabled, toggleAutoSpin]);

  const handleSpin = () => {
    if (!isSpinning && coins >= bet) {
      setNearMissActive(false);
      spin(coins, onUpdateCoins);
    }
  };

  // Detectar near-miss cuando el segundo reel se detenga
  useEffect(() => {
    const stoppedReels = reels.filter(r => !r.isSpinning).length;
    
    if (stoppedReels === 2 && reels[2].isSpinning) {
      // Comprobar si los primeros dos son iguales
      const symbol1 = reels[0].finalSymbol;
      const symbol2 = reels[1].finalSymbol;
      
      if (symbol1 === symbol2) {
        setNearMissActive(true);
      }
    }
    
    if (stoppedReels === 3) {
      setNearMissActive(false);
    }
  }, [reels]);

  // Contador animado de monedas
  useEffect(() => {
    if (displayCoins === coins) return;
    
    const difference = Math.abs(coins - displayCoins);
    const increment = displayCoins < coins ? 1 : -1;
    const speed = difference > 50 ? 10 : difference > 20 ? 5 : 1; // Más rápido si la diferencia es grande
    
    const timer = setInterval(() => {
      setDisplayCoins(prev => {
        const newValue = prev + (increment * speed);
        
        // Si nos pasamos, ir directamente al valor final
        if ((increment > 0 && newValue >= coins) || (increment < 0 && newValue <= coins)) {
          clearInterval(timer);
          return coins;
        }
        
        return newValue;
      });
    }, 30);
    
    return () => clearInterval(timer);
  }, [coins, displayCoins]);

  const getRTP = (): string => {
    if (stats.totalWagered === 0) return '0.0';
    return ((stats.totalWon / stats.totalWagered) * 100).toFixed(1);
  };

  const getWinRate = (): string => {
    if (stats.totalSpins === 0) return '0.0';
    return ((stats.totalWins / stats.totalSpins) * 100).toFixed(1);
  };

  return (
    <div className="slot-machine-v2">
      {/* Header */}
      <motion.div 
        className="slot-header-v2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="slot-back-btn" onClick={onBack}>
          ← Volver
        </button>
        <motion.h1 
          className="slot-title-v2"
          animate={{ 
            textShadow: [
              '0 0 10px #FFD700, 0 0 20px #FFD700',
              '0 0 20px #FFD700, 0 0 40px #FFA500',
              '0 0 10px #FFD700, 0 0 20px #FFD700',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎰 SUPER SLOT MACHINE
        </motion.h1>
        <div className="slot-coins-display">
          <motion.span
            animate={displayCoins !== coins ? {
              scale: [1, 1.15, 1],
              color: displayCoins < coins ? ['#FFF', '#4ecca3', '#FFF'] : ['#FFF', '#ff6b6b', '#FFF']
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {displayCoins} 💰
          </motion.span>
        </div>
      </motion.div>

      {/* Stats Panel */}
      <motion.div 
        className="slot-stats-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stat-item">
          <span className="stat-label">Giros:</span>
          <span className="stat-value">{stats.totalSpins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Victorias:</span>
          <span className="stat-value">{stats.totalWins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Racha:</span>
          <span className="stat-value">{stats.currentStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mayor Win:</span>
          <span className="stat-value">{stats.biggestWin} 💰</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">RTP:</span>
          <span className="stat-value">{getRTP()}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Win Rate:</span>
          <span className="stat-value">{getWinRate()}%</span>
        </div>
      </motion.div>

      {/* Slot Machine Container */}
      <div className="slot-machine-container">
        <motion.div 
          className={`slot-machine-frame ${nearMissActive ? 'near-miss' : ''}`}
          animate={nearMissActive ? {
            boxShadow: [
              '0 0 30px #FF6B9D, 0 0 60px #F093FB',
              '0 0 60px #FF6B9D, 0 0 120px #F093FB',
              '0 0 30px #FF6B9D, 0 0 60px #F093FB',
            ],
            scale: [1, 1.02, 1],
          } : isSpinning ? {
            boxShadow: [
              '0 0 20px #FFD700, 0 0 40px #FFA500',
              '0 0 40px #FFD700, 0 0 80px #FFA500',
              '0 0 20px #FFD700, 0 0 40px #FFA500',
            ]
          } : {}}
          transition={{ duration: nearMissActive ? 0.3 : 0.5, repeat: (isSpinning || nearMissActive) ? Infinity : 0 }}
        >
          {/* Reels - Animación Clásica Vertical */}
          <div className="reels-wrapper">
            {reels.map((reel, index) => (
              <div key={index} className="reel-container">
                <div className="reel-window">
                  <motion.div
                    className={`reel-strip ${reel.isSpinning ? 'spinning' : ''}`}
                    style={{
                      ['--spin-duration' as string]: turboMode ? '1.2s' : '2.4s',
                    }}
                    animate={reel.isSpinning ? {
                      y: [0, -reel.symbols.length * symbolHeight],
                    } : {
                      y: 0,
                    }}
                    transition={reel.isSpinning ? {
                      duration: turboMode ? 1.2 : 2.4,
                      repeat: Infinity,
                      ease: 'linear',
                    } : {
                      type: 'spring',
                      stiffness: 160,
                      damping: 22,
                      mass: 1,
                    }}
                  >
                    {/* Símbolos del reel */}
                    {reel.symbols.map((symbol, i) => (
                      <motion.div 
                        key={i} 
                        className={`reel-symbol ${!reel.isSpinning && i === 0 && winningReels[index] ? 'winning' : ''}`}
                        animate={!reel.isSpinning && i === 0 && winningReels[index] ? {
                          scale: [1, 1.25, 1.2],
                        } : !reel.isSpinning && i === 0 ? {
                          scale: [0.8, 1.1, 1],
                        } : {}}
                        transition={!reel.isSpinning && i === 0 && winningReels[index] ? {
                          duration: 0.6,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        } : {
                          duration: 0.5,
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                        }}
                      >
                        {symbol}
                      </motion.div>
                    ))}
                    {/* Símbolos repetidos para loop infinito */}
                    {reel.symbols.slice(0, 10).map((symbol, i) => (
                      <div key={`repeat-${i}`} className="reel-symbol">
                        {symbol}
                      </div>
                    ))}
                  </motion.div>
                </div>
                
                {/* Indicador de spinning */}
                <AnimatePresence>
                  {reel.isSpinning && (
                    <motion.div
                      className="spin-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      ↓
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Glass overlay effect */}
          <div className="glass-overlay"></div>
        </motion.div>

        {/* Panel de Resultados - Siempre Visible y Claro */}
        <div className="result-panel">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result}
                className={`result-content result-${result}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {result === 'jackpot' && (
                  <>
                    <motion.div 
                      className="result-icon"
                      animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      🎊
                    </motion.div>
                    <div className="result-title">¡JACKPOT!</div>
                    <motion.div 
                      className="result-amount win"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(78, 204, 163, 0.6)',
                          '0 0 40px rgba(78, 204, 163, 0.9)',
                          '0 0 20px rgba(78, 204, 163, 0.6)',
                        ]
                      }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      +{winAmount} 💰
                    </motion.div>
                  </>
                )}
                {result === 'win' && (
                  <>
                    <motion.div 
                      className="result-icon"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.div>
                    <div className="result-title">¡GANASTE!</div>
                    <div className="result-amount win">+{winAmount} 💰</div>
                    <div className="result-subtitle">Ganaste {winAmount} monedas</div>
                  </>
                )}
                {result === 'lose' && (
                  <>
                    <motion.div 
                      className="result-icon"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      😢
                    </motion.div>
                    <div className="result-title">PERDISTE</div>
                    <div className="result-amount lose">-{bet} 💰</div>
                    <div className="result-subtitle">Perdiste {bet} monedas</div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="result-content result-waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="result-icon">🎰</div>
                <div className="result-title-small">Presiona GIRAR</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Particles Effect */}
        <SlotParticles type={result} />
      </div>

      {/* Controls */}
      <motion.div 
        className="slot-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Bet Controls */}
        <div className="bet-section">
          <label className="bet-label">APUESTA:</label>
          <div className="bet-controls">
            <motion.button
              className="bet-btn"
              onClick={() => adjustBet(-10, coins)}
              disabled={isSpinning || bet <= 10}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              -10
            </motion.button>
            <motion.button
              className="bet-btn"
              onClick={() => adjustBet(-1, coins)}
              disabled={isSpinning || bet <= 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              -1
            </motion.button>
            <div className="bet-amount">{bet} 💰</div>
            <motion.button
              className="bet-btn"
              onClick={() => adjustBet(1, coins)}
              disabled={isSpinning || bet >= coins}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +1
            </motion.button>
            <motion.button
              className="bet-btn"
              onClick={() => adjustBet(10, coins)}
              disabled={isSpinning || bet + 10 > coins}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +10
            </motion.button>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="bet-presets">
          {[10, 25, 50, 100].map(amount => (
            <motion.button
              key={amount}
              className={`preset-btn ${bet === amount ? 'active' : ''}`}
              onClick={() => setBetPreset(amount, coins)}
              disabled={isSpinning || coins < amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {amount}
            </motion.button>
          ))}
          <motion.button
            className={`preset-btn ${bet === coins ? 'active' : ''}`}
            onClick={() => setBetPreset(coins, coins)}
            disabled={isSpinning || coins < 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            MAX
          </motion.button>
        </div>

        {/* Main Spin Button */}
        <motion.button
          className="spin-button"
          onClick={handleSpin}
          disabled={isSpinning || bet > coins}
          whileHover={!isSpinning && bet <= coins ? { 
            scale: 1.05,
            boxShadow: '0 0 30px #FFD700, 0 0 60px #FFA500'
          } : {}}
          whileTap={{ scale: 0.95 }}
          animate={!isSpinning && bet <= coins ? {
            boxShadow: [
              '0 0 20px #FFD700',
              '0 0 40px #FFA500',
              '0 0 20px #FFD700',
            ]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isSpinning ? '⚡ GIRANDO... ⚡' : `🎰 GIRAR (${bet} 💰)`}
        </motion.button>

        {/* Feature Buttons */}
        <div className="feature-buttons">
          <motion.button
            className={`feature-btn ${autoSpinEnabled ? 'active' : ''}`}
            onClick={toggleAutoSpin}
            disabled={isSpinning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {autoSpinEnabled ? '⏸️ AUTO' : '▶️ AUTO'}
          </motion.button>
          <motion.button
            className={`feature-btn ${turboMode ? 'active' : ''}`}
            onClick={toggleTurboMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {turboMode ? '⚡ TURBO' : '🐌 NORMAL'}
          </motion.button>
          <motion.button
            className="feature-btn"
            onClick={resetStats}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 RESET STATS
          </motion.button>
        </div>

        {/* Paytable */}
        <div className="paytable">
          <h3>💎 TABLA DE PAGOS</h3>
          <div className="paytable-row">
            <span>💎💎💎</span>
            <span>x10</span>
          </div>
          <div className="paytable-row">
            <span>7️⃣7️⃣7️⃣</span>
            <span>x8</span>
          </div>
          <div className="paytable-row">
            <span>⭐⭐⭐</span>
            <span>x5</span>
          </div>
          <div className="paytable-row">
            <span>🍒🍒🍒</span>
            <span>x5</span>
          </div>
          <div className="paytable-row">
            <span>XX_</span>
            <span>x0.8</span>
          </div>
        </div>
      </motion.div>

      {/* Jackpot Overlay */}
      <AnimatePresence>
        {showJackpotOverlay && (
          <motion.div
            className="jackpot-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="jackpot-content"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [- 180, 0, 0],
              }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.h1
                className="jackpot-text"
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    '0 0 20px #FFD700, 0 0 40px #FFA500',
                    '0 0 40px #FFD700, 0 0 80px #FFA500',
                    '0 0 20px #FFD700, 0 0 40px #FFA500',
                  ]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🎰 JACKPOT! 🎰
              </motion.h1>
              <motion.p
                className="jackpot-amount"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                +{winAmount} 💰
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlotMachineV2;
