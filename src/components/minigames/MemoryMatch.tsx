import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Minigames.css';

interface MemoryMatchProps {
  petName: string;
  onGameEnd: (won: boolean, customReward?: { coins: number; exp: number; happiness: number; energy: number }) => void;
  onBack: () => void;
}

interface Card {
  id: number;
  emoji: string;
}

const MemoryMatch = ({ petName, onGameEnd, onBack }: MemoryMatchProps) => {
  const [gamePhase, setGamePhase] = useState('coin-flip');
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showCoinResult, setShowCoinResult] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [cardStates, setCardStates] = useState<Record<number, string>>({});
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const [petThinking, setPetThinking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const emojis = ['🐕', '🐱', '🐰', '🦊', '🐼', '🐸'];

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const initializeCards = useCallback(() => {
    const cardPairs = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(cardPairs);
    const states: Record<number, string> = {};
    cardPairs.forEach(card => {
      states[card.id] = 'FACE_DOWN';
    });
    setCardStates(states);
    setSelectedCards([]);
    setMatchedPairs(0);
  }, []);

  const handleCoinChoice = (choice: string) => {
    setPlayerChoice(choice);
    setIsFlipping(true);

    setTimeout(async () => {
      const result = Math.random() > 0.5 ? 'CARA' : 'CRUZ';
      setCoinResult(result);

      await delay(4500);
      setIsFlipping(false);
      setShowCoinResult(true);

      const playerWonFlip = result === choice;
      setPlayerTurn(playerWonFlip);

      await delay(2500);

      setShowCoinResult(false);
      setCountdown(3);

      await delay(1000);
      setCountdown(2);

      await delay(1000);
      setCountdown(1);

      await delay(1000);
      setCountdown(null);

      setGamePhase('playing');
      initializeCards();
    }, 100);
  };

  const getReward = useCallback(() => {
    if (score.player > score.pet) {
      return { coins: 20, exp: 25, happiness: 20, energy: 10 };
    } else if (score.player === score.pet) {
      return { coins: 8, exp: 10, happiness: 10, energy: 5 };
    } else {
      return { coins: 5, exp: 5, happiness: 5, energy: 5 };
    }
  }, [score]);

  useEffect(() => {
    if (gamePhase === 'playing' && cards.length === 0) {
      initializeCards();
    }
  }, [gamePhase, cards.length, initializeCards]);

  useEffect(() => {
    if (matchedPairs === 6 && gamePhase === 'playing') {
      const reward = getReward();
      setTimeout(() => {
        onGameEnd(score.player > score.pet, reward);
      }, 1500);
    }
  }, [matchedPairs, gamePhase, score, onGameEnd, getReward]);

  const flipCard = async (cardId: number) => {
    setCardStates(prev => ({ ...prev, [cardId]: 'FLIPPING' }));
    await delay(400);
    setCardStates(prev => ({ ...prev, [cardId]: 'FACE_UP' }));
  };

  const flipCardBack = async (cardId: number) => {
    setCardStates(prev => ({ ...prev, [cardId]: 'FLIPPING' }));
    await delay(400);
    setCardStates(prev => ({ ...prev, [cardId]: 'FACE_DOWN' }));
  };

  const handleCardClick = async (cardId: number) => {
    if (!playerTurn || petThinking || isProcessing) return;
    if (cardStates[cardId] !== 'FACE_DOWN') return;
    if (selectedCards.length >= 2) return;

    await flipCard(cardId);
    setSelectedCards(prev => [...prev, cardId]);

    if (selectedCards.length === 1) {
      const [firstCardId] = selectedCards;
      const secondCardId = cardId;

      await delay(1500);

      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      setIsProcessing(true);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        await delay(200);
        setCardStates(prev => ({ ...prev, [firstCardId]: 'MATCHED', [secondCardId]: 'MATCHED' }));
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        setMatchedPairs(prev => prev + 1);
        setSelectedCards([]);
        setIsProcessing(false);
      } else {
        await delay(500);
        await flipCardBack(firstCardId);
        await flipCardBack(secondCardId);
        setSelectedCards([]);
        setPlayerTurn(false);
        setIsProcessing(false);
      }
    }
  };

  const petMove = useCallback(async () => {
    const unmatchedCards = cards.filter(c => cardStates[c.id] === 'FACE_DOWN' || cardStates[c.id] === 'FACE_UP');
    if (unmatchedCards.length < 2) return;

    setPetThinking(true);
    setIsProcessing(true);

    await delay(1500);

    const randomCards = unmatchedCards
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    await flipCard(randomCards[0].id);
    await delay(200);
    await flipCard(randomCards[1].id);

    await delay(1500);

    const firstCard = cards.find(c => c.id === randomCards[0].id);
    const secondCard = cards.find(c => c.id === randomCards[1].id);

    if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
      await delay(200);
      setCardStates(prev => ({ ...prev, [randomCards[0].id]: 'MATCHED', [randomCards[1].id]: 'MATCHED' }));
      setScore(prev => ({ ...prev, pet: prev.pet + 1 }));
      setMatchedPairs(prev => prev + 1);
      setSelectedCards([]);
      setIsProcessing(false);
      setPetThinking(false);
    } else {
      await delay(500);
      await flipCardBack(randomCards[0].id);
      await flipCardBack(randomCards[1].id);
      setSelectedCards([]);
      setPlayerTurn(true);
      setIsProcessing(false);
      setPetThinking(false);
    }
  }, [cards, cardStates]);

  useEffect(() => {
    if (!playerTurn && gamePhase === 'playing' && matchedPairs < 6 && !petThinking && !isProcessing) {
      const timer = setTimeout(() => {
        petMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, gamePhase, matchedPairs, petThinking, isProcessing, petMove]);

  const renderCoinFlipPhase = () => {
    if (!coinResult) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="coin-flip-container"
        >
          <h2 className="coin-flip-title">¿Cara o Cruz?</h2>
          <p className="coin-flip-subtitle">El ganador del lanzamiento empieza primero</p>
          <div className="coin-buttons">
            <motion.button
              className="coin-choice-button heads"
              onClick={() => handleCoinChoice('CARA')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="coin-preview cara-preview">
                <div className="tamagotchi-face">👾</div>
                <div className="coin-shine"></div>
              </div>
              <span className="coin-label">CARA</span>
            </motion.button>
            <motion.button
              className="coin-choice-button tails"
              onClick={() => handleCoinChoice('CRUZ')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="coin-preview cruz-preview">
                <div className="pixel-pattern"></div>
                <div className="coin-shine"></div>
              </div>
              <span className="coin-label">CRUZ</span>
            </motion.button>
          </div>
        </motion.div>
      );
    }

    if (isFlipping) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="coin-flipping-container"
        >
          <motion.div
            className="coin-large"
            animate={{
              rotateY: [0, 2160],
              y: [0, -200, 0, -50, 0],
            }}
            transition={{ duration: 4.5, ease: "easeInOut" }}
          >
            <div className="coin-face-large coin-heads-large">
              <span className="coin-face-icon">👾</span>
              <span className="coin-face-text">CARA</span>
            </div>
            <div className="coin-face-large coin-tails-large">
              <span className="coin-face-icon">✨</span>
              <span className="coin-face-text">CRUZ</span>
            </div>
          </motion.div>
          <p className="flipping-text">Lanzando moneda...</p>
        </motion.div>
      );
    }

    if (showCoinResult) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="coin-result-container"
        >
          <motion.div
            className="coin-large"
            animate={{ scale: [1, 1.15, 1.1], y: [0, -10, 0] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={`coin-face-large ${coinResult === 'CARA' ? 'coin-heads-large' : 'coin-tails-large'}`}>
              <span className="coin-face-icon">{coinResult === 'CARA' ? '👾' : '✨'}</span>
              <span className="coin-face-text">{coinResult}</span>
            </div>
          </motion.div>
          <motion.div
            className={`coin-result-message ${coinResult === playerChoice ? 'player-wins' : 'pet-wins'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {coinResult === playerChoice ? (
              <>
                <p className="result-main">¡GANASTE EL LANZAMIENTO! 🎉</p>
                <p className="result-sub">Empiezas tú primero</p>
              </>
            ) : (
              <>
                <p className="result-main">LA MÁQUINA GANA 🤖</p>
                <p className="result-sub">{petName} empieza primero</p>
              </>
            )}
          </motion.div>
        </motion.div>
      );
    }

    if (countdown !== null) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="countdown-container"
        >
          <motion.div
            className="countdown-number"
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
          >
            {countdown}
          </motion.div>
          <p className="countdown-text">El juego comienza en...</p>
        </motion.div>
      );
    }

    return null;
  };

  const renderGamePhase = () => (
    <>
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">🧠 Juego de Memoria</h3>
      </div>
      <div className={`game-info ${!playerTurn ? 'pet-turn' : ''}`}>
        <div className="turn-indicator">
          {playerTurn ? (
            <motion.span
              className="turn-badge player"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🎮 Tu turno
            </motion.span>
          ) : (
            <motion.span
              className="turn-badge pet"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🤖 Turno de {petName}
            </motion.span>
          )}
        </div>
        <div className="score-info">
          <span className="player-score">Tú: {score.player}</span>
          <span className="vs-text">VS</span>
          <span className="pet-score">{petName}: {score.pet}</span>
        </div>
        <div className="pairs-info">Parejas: {matchedPairs}/6</div>
      </div>
      <motion.div
        className="memory-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {cards.map((card, index) => {
          const cardState = cardStates[card.id] || 'FACE_DOWN';
          const isFaceUp = cardState === 'FACE_UP' || cardState === 'MATCHED';
          const isMatched = cardState === 'MATCHED';
          const isFlippingCard = cardState === 'FLIPPING';
          const isDisabled = !playerTurn || petThinking || isMatched || isFaceUp;

          return (
            <motion.button
              key={card.id}
              className={`memory-card ${isFaceUp ? 'flipped' : ''} ${isMatched ? 'matched' : ''} ${isFlippingCard ? 'flipping' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleCardClick(card.id)}
              disabled={isDisabled}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isMatched ? 0.5 : 1, scale: isMatched ? 0.95 : 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isDisabled ? { scale: isMatched ? 0.95 : 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              <div className="card-inner">
                <div className="card-back-face">
                  <span className="card-back-symbol">❓</span>
                </div>
                <div className="card-front-face">
                  <span className="card-emoji">{card.emoji}</span>
                </div>
              </div>
              {isMatched && (
                <motion.div
                  className="match-effect"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
      {petThinking && (
        <motion.div
          className="thinking-indicator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="thinking-dots">{petName} está pensando...</span>
        </motion.div>
      )}
    </>
  );

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">🧠 Juego de Memoria</h3>
      </div>
      <AnimatePresence mode="wait">
        {gamePhase === 'coin-flip' ? (
          <motion.div key="coin-flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderCoinFlipPhase()}
          </motion.div>
        ) : (
          <motion.div key="game-playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {renderGamePhase()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryMatch;
