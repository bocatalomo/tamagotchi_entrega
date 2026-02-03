import { useState, useEffect, useCallback } from 'react';
import '../Minigames.css';

interface GuessNumberProps {
  petName: string;
  onGameEnd: (won: boolean) => void;
  onBack: () => void;
}

const GuessNumber = ({ petName, onGameEnd, onBack }: GuessNumberProps) => {
  const [secretNumber, setSecretNumber] = useState<number | null>(null);
  const [petRange, setPetRange] = useState<[number, number]>([1, 50]);
  const [guess, setGuess] = useState('');
  const [hint, setHint] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [petAttempts, setPetAttempts] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    setSecretNumber(Math.floor(Math.random() * 50) + 1);
    setPetRange([1, 50]);
    setHint('');
    setAttempts(0);
    setPetAttempts(0);
    setWon(false);
  }, []);

  const makePetGuess = useCallback(() => {
    if (secretNumber === null) return;

    const [min, max] = petRange;
    const random = Math.random();
    let petGuess: number;

    if (random < 0.4) {
      petGuess = Math.floor((min + max) / 2);
    } else if (random < 0.7) {
      petGuess = Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      const tendency = Math.random() < 0.5 ? min : max;
      petGuess = Math.floor(tendency + (Math.random() * 5 - 2.5));
    }

    petGuess = Math.max(min, Math.min(max, petGuess));

    if (petGuess === secretNumber) {
      onGameEnd(false);
      return;
    }

    if (petGuess < secretNumber) {
      setPetRange([petGuess + 1, max]);
    } else {
      setPetRange([min, petGuess - 1]);
    }
    setPetAttempts(prev => prev + 1);
  }, [petRange, secretNumber, onGameEnd]);

  useEffect(() => {
    if (petAttempts < 7 && !won && secretNumber) {
      const timer = setTimeout(() => makePetGuess(), 2000);
      return () => clearTimeout(timer);
    }
  }, [petAttempts, won, secretNumber, makePetGuess]);

  const handleGuess = () => {
    if (secretNumber === null) return;

    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 50) {
      setHint('Ingresa un número entre 1 y 50');
      return;
    }

    setAttempts(prev => prev + 1);

    if (numGuess === secretNumber) {
      setWon(true);
      setTimeout(() => onGameEnd(true), 1500);
    } else if (numGuess < secretNumber) {
      setHint(`${numGuess} es muy bajo`);
    } else {
      setHint(`${numGuess} es muy alto`);
    }

    setGuess('');
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">🔢 Adivina el Número</h3>
      </div>
      <div className="game-info">
        <div className="guess-info">Número entre 1 y 50</div>
        <div className="score-info">
          <span className="player-score">Tus intentos: {attempts}</span>
          <span className="pet-score">{petName}: {petAttempts}</span>
        </div>
      </div>
      <div className="guess-game">
        {won && secretNumber !== null ? (
          <div className="guess-won">
            <div className="won-emoji">🎉</div>
            <div className="won-text">¡Encontraste el número {secretNumber}!</div>
            <div className="won-attempts">En {attempts} intentos</div>
          </div>
        ) : (
          <>
            <div className="guess-input-group">
              <input
                type="number"
                className="guess-input"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                placeholder="Tu número..."
                min={1}
                max={50}
              />
              <button className="guess-button" onClick={handleGuess}>Adivinar</button>
            </div>
            {hint && <div className="guess-hint">{hint}</div>}
            <div className="guess-pet-thinking">
              {petName} está pensando... 🤔
              <div className="pet-range">Rango: {petRange[0]} - {petRange[1]}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuessNumber;
