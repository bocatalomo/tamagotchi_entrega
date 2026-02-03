import { useState, useEffect, useCallback, useRef } from 'react';
import '../Minigames.css';

interface ReactionTimeProps {
  petName: string;
  onGameEnd: (won: boolean) => void;
  onBack: () => void;
}

const ReactionTime = ({ petName, onGameEnd, onBack }: ReactionTimeProps) => {
  const [gameState, setGameState] = useState('ready');
  const [playerTime, setPlayerTime] = useState<number | null>(null);
  const [petTime, setPetTime] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const startTime = useRef<number | null>(null);

  const startRound = useCallback(() => {
    setGameState('waiting');
    setPlayerTime(null);
    setPetTime(null);
    const waitTime = 1000 + Math.random() * 3000;
    setTimeout(() => {
      setGameState('show');
      startTime.current = Date.now();
    }, waitTime);
  }, []);

  const evaluateRound = useCallback((playerReaction: number) => {
    const baseReactionTime = 250 + Math.random() * 400;
    const effectivePetTime = Math.random() < 0.15 ? baseReactionTime + 200 : baseReactionTime;
    const roundedPetTime = Math.floor(effectivePetTime);
    setPetTime(roundedPetTime);

    const playerWins = playerReaction < effectivePetTime;

    setScore(prevScore => {
      const newScore = { ...prevScore };
      if (playerWins) newScore.player += 1;
      else newScore.pet += 1;

      if (round >= 3) {
        setTimeout(() => onGameEnd(newScore.player >= 2), 1500);
      } else {
        setTimeout(() => {
          setRound(r => r + 1);
          setGameState('ready');
        }, 1500);
      }

      return newScore;
    });
  }, [round, onGameEnd]);

  const handleClick = () => {
    if (gameState === 'waiting') {
      setPlayerTime(9999);
      setTimeout(() => evaluateRound(9999), 500);
    } else if (gameState === 'show' && startTime.current) {
      const reactionTime = Date.now() - startTime.current;
      setPlayerTime(reactionTime);
      setGameState('clicked');
      setTimeout(() => evaluateRound(reactionTime), 1000);
    }
  };

  useEffect(() => {
    if (gameState === 'ready') {
      const timer = setTimeout(() => startRound(), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, round, startRound]);

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">⚡ Tiempo de Reacción</h3>
      </div>
      <div className="game-info">
        <div className="round-info">Ronda {round}/3</div>
        <div className="score-info">
          <span className="player-score">Tú: {score.player}</span>
          <span className="pet-score">{petName}: {score.pet}</span>
        </div>
      </div>
      <div className="reaction-game">
        <button
          className={`reaction-area ${gameState}`}
          onClick={handleClick}
          disabled={gameState === 'ready' || gameState === 'clicked'}
        >
          {gameState === 'ready' && <div className="reaction-text">Prepárate...</div>}
          {gameState === 'waiting' && <div className="reaction-text">Espera...</div>}
          {gameState === 'show' && <div className="reaction-emoji">⚡</div>}
          {gameState === 'clicked' && playerTime !== null && (
            <div className="reaction-result">
              {playerTime < 9999 ? (
                <>
                  <div>Tu tiempo: {playerTime}ms</div>
                  <div>{petName}: {Math.floor(petTime || 0)}ms</div>
                  <div className="winner">
                    {playerTime < (petTime || 0) ? '🎉 ¡Ganaste!' : `😅 ¡${petName} ganó!`}
                  </div>
                </>
              ) : <div className="early-click">❌ ¡Muy temprano!</div>}
            </div>
          )}
        </button>
        <div className="reaction-instructions">Presiona cuando veas el ⚡</div>
      </div>
    </div>
  );
};

export default ReactionTime;
