import { useState } from 'react';
import '../Minigames.css';

interface RockPaperScissorsProps {
  petName: string;
  onGameEnd: (won: boolean, customReward?: { coins: number; exp: number; happiness: number; energy?: number }) => void;
  onBack: () => void;
}

const RockPaperScissors = ({ petName, onGameEnd, onBack }: RockPaperScissorsProps) => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [petChoice, setPetChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const [petThinking, setPetThinking] = useState(false);

  const choices = ['rock', 'paper', 'scissors'];
  const emojis: Record<string, string> = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  const getPetChoice = (playerHistory: string[] = []): string => {
    if (playerHistory.length === 0) {
      return choices[Math.floor(Math.random() * 3)];
    }
    const random = Math.random();
    if (random < 0.6) {
      return choices[Math.floor(Math.random() * 3)];
    }
    if (random < 0.85) {
      const lastMove = playerHistory[playerHistory.length - 1];
      const counter: Record<string, string> = { rock: 'paper', paper: 'scissors', scissors: 'rock' };
      return counter[lastMove];
    }
    if (playerHistory.length >= 2) {
      const lastTwo = playerHistory.slice(-2);
      const patterns: Record<string, string> = {
        'rock,rock': 'scissors', 'rock,paper': 'rock', 'rock,scissors': 'paper',
        'paper,rock': 'scissors', 'paper,paper': 'rock', 'paper,scissors': 'paper',
        'scissors,rock': 'paper', 'scissors,paper': 'scissors', 'scissors,scissors': 'rock'
      };
      const patternKey = `${lastTwo[0]},${lastTwo[1]}`;
      return patterns[patternKey] || choices[Math.floor(Math.random() * 3)];
    }
    return choices[Math.floor(Math.random() * 3)];
  };

  const determineWinner = (player: string, pet: string): string => {
    if (player === pet) return 'tie';
    if ((player === 'rock' && pet === 'scissors') ||
        (player === 'paper' && pet === 'rock') ||
        (player === 'scissors' && pet === 'paper')) {
      return 'win';
    }
    return 'lose';
  };

  const play = (choice: string) => {
    setPlayerChoice(choice);
    setPetThinking(true);

    setTimeout(() => {
      const petSelection = getPetChoice([choice]);
      setPetChoice(petSelection);
      setPetThinking(false);

      const outcome = determineWinner(choice, petSelection);
      setResult(outcome);

      setScore(prevScore => {
        const newScore = { ...prevScore };
        if (outcome === 'win') newScore.player += 1;
        if (outcome === 'lose') newScore.pet += 1;

        if (newScore.player === 2) {
          setTimeout(() => onGameEnd(true), 1500);
        } else if (newScore.pet === 2) {
          setTimeout(() => onGameEnd(false), 1500);
        } else if (round < 3) {
          setTimeout(() => {
            setRound(r => r + 1);
            setPlayerChoice(null);
            setPetChoice(null);
            setResult(null);
          }, 1500);
        }

        return newScore;
      });
    }, 1000);
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">✊ Piedra, Papel o Tijera</h3>
      </div>
      <div className="game-info">
        <div className="round-info">Ronda {round}/3 - Mejor de 3</div>
        <div className="score-info">
          <span className="player-score">Tú: {score.player}</span>
          <span className="pet-score">{petName}: {score.pet}</span>
        </div>
      </div>
      <div className="rps-battle">
        <div className="rps-player">
          <div className="rps-label">Tú</div>
          <div className="rps-choice">{playerChoice ? emojis[playerChoice] : '❓'}</div>
        </div>
        <div className="rps-vs">VS</div>
        <div className="rps-pet">
          <div className="rps-label">{petName}</div>
          <div className={`rps-choice ${petThinking ? 'thinking' : ''}`}>
            {petThinking ? '🤔' : petChoice ? emojis[petChoice] : '❓'}
          </div>
        </div>
      </div>
      {result && (
        <div className={`rps-result ${result}`}>
          {result === 'win' && '🎉 ¡Ganaste esta ronda!'}
          {result === 'lose' && `😅 ¡${petName} ganó esta ronda!`}
          {result === 'tie' && '🤝 ¡Empate!'}
        </div>
      )}
      {!playerChoice && !petThinking && (
        <div className="rps-choices">
          <button className="choice-button" onClick={() => play('rock')}>
            <span className="choice-emoji">✊</span>
            <span className="choice-label">Piedra</span>
          </button>
          <button className="choice-button" onClick={() => play('paper')}>
            <span className="choice-emoji">✋</span>
            <span className="choice-label">Papel</span>
          </button>
          <button className="choice-button" onClick={() => play('scissors')}>
            <span className="choice-emoji">✌️</span>
            <span className="choice-label">Tijera</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
