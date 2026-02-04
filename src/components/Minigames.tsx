import { useState } from 'react';
import './Minigames.css';
import RockPaperScissors from './minigames/RockPaperScissors';
import MemoryMatch from './minigames/MemoryMatch';
import ReactionTime from './minigames/ReactionTime';
import GuessNumber from './minigames/GuessNumber';
import SlotMachine from './minigames/SlotMachine';
import QuizGame from './minigames/QuizGame';

interface GameReward {
  coins: number;
  exp: number;
  happiness: number;
  energy?: number;
}

interface Game {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: string;
  reward: GameReward | { coins: string | number; exp: string | number; happiness: string | number };
  isExternal?: boolean;
}

interface MinigamesProps {
  petName: string;
  onClose: () => void;
  onWin: (reward: GameReward) => void;
  onLose: () => void;
  onOpenSkateGame: () => void;
  coins: number;
  onWinGame: () => void;
  onStartGame: () => void;
  onUpdateCoins: (coinsChange: number) => void;
}

const Minigames = ({ petName, onClose, onWin, onLose, onOpenSkateGame, coins, onWinGame, onStartGame, onUpdateCoins }: MinigamesProps) => {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');

  const games: Game[] = [
    {
      id: 'rock-paper-scissors',
      name: 'Piedra, Papel o Tijera',
      emoji: '✊',
      description: 'Juega contra tu mascota',
      difficulty: 'Fácil',
      reward: { coins: 8, exp: 15, happiness: 25 }
    },
    {
      id: 'memory-match',
      name: 'Memoria',
      emoji: '🧠',
      description: 'Encuentra las parejas más rápido',
      difficulty: 'Medio',
      reward: { coins: 12, exp: 20, happiness: 30 }
    },
    {
      id: 'reaction-time',
      name: 'Reflejos',
      emoji: '⚡',
      description: 'Presiona cuando veas el emoji',
      difficulty: 'Medio',
      reward: { coins: 10, exp: 18, happiness: 28 }
    },
    {
      id: 'guess-number',
      name: 'Adivina el Número',
      emoji: '🔢',
      description: 'Encuentra el número secreto',
      difficulty: 'Fácil',
      reward: { coins: 7, exp: 12, happiness: 20 }
    },
    {
      id: 'slot-machine',
      name: 'Tragaperras',
      emoji: '🎰',
      description: 'Apuesta y gana monedas',
      difficulty: 'Medio',
      reward: { coins: 'Variable', exp: 'Variable', happiness: 'Variable' }
    },
    {
      id: 'quiz-tamagotchi',
      name: 'Quiz Tamagotchi',
      emoji: '🎯',
      description: 'Pon a prueba tus conocimientos',
      difficulty: 'Variable',
      reward: { coins: 'Variable', exp: 'Variable', happiness: 'Variable' }
    },
    {
      id: 'skate-game',
      name: 'Skate Jump',
      emoji: '🛹',
      description: '¡Salta entre plataformas!',
      difficulty: 'Difícil',
      reward: { coins: 'Variable', exp: 'Variable', happiness: 30 },
      isExternal: true
    }
  ];

  const selectGame = (game: Game) => {
    if (game.id === 'skate-game') {
      onClose();
      onOpenSkateGame();
      return;
    }
    onStartGame();
    setCurrentGame(game);
    setGameState('playing');
  };

  const handleGameEnd = (won: boolean, customReward?: GameReward) => {
    console.log('handleGameEnd llamado, won:', won);
    if (won && currentGame) {
      const reward = customReward || currentGame.reward as GameReward;
      console.log('Ganando juego, recompensa:', reward);
      onWin(reward);
      onWinGame();
    } else {
      if (customReward) {
        console.log('Recompensa personalizada');
        onWin(customReward);
        onWinGame();
      } else {
        console.log('Perdiendo juego');
        onLose();
      }
    }
    console.log('Estableciendo estado a menu...');
    setCurrentGame(null);
    setGameState('menu');
    console.log('Estado después:', null, 'menu');
  };

  const handleBack = () => {
    console.log('handleBack llamado');
    setCurrentGame(null);
    setGameState('menu');
  };

  interface GameComponentProps {
    game: Game;
    petName: string;
    coins: number;
    onGameEnd: (won: boolean, customReward?: { coins: number; exp: number; happiness: number; energy?: number }) => void;
    onBack: () => void;
    onOpenSkateGame: () => void;
    onUpdateCoins: (coinsChange: number) => void;
  }

  const GameComponent = ({ game, petName, coins, onGameEnd, onBack, onUpdateCoins }: GameComponentProps) => {
    switch (game.id) {
      case 'rock-paper-scissors':
        return <RockPaperScissors petName={petName} onGameEnd={onGameEnd} onBack={onBack} />;
      case 'memory-match':
        return <MemoryMatch petName={petName} onGameEnd={onGameEnd} onBack={onBack} />;
      case 'reaction-time':
        return <ReactionTime petName={petName} onGameEnd={onGameEnd} onBack={onBack} />;
      case 'guess-number':
        return <GuessNumber petName={petName} onGameEnd={onGameEnd} onBack={onBack} />;
      case 'slot-machine':
        return <SlotMachine coins={coins} onUpdateCoins={onUpdateCoins} onBack={onBack} />;
      case 'quiz-tamagotchi':
        return <QuizGame
          petName={petName}
          onWin={(reward) => onGameEnd(true, reward)}
          onLose={() => onGameEnd(false)}
          onClose={onBack}
        />;
      case 'skate-game':
        return null;
      default:
        return null;
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="minigame-overlay">
        <div className="minigame-container">
          <div className="minigame-header">
            <h2 className="minigame-title">🎮 Mini-Juegos</h2>
            <button className="minigame-close" onClick={onClose}>✕</button>
          </div>
          
          <p className="minigame-intro">
            ¡{petName} quiere jugar contigo! Elige un juego:
          </p>

          <div className="games-grid">
            {games.map(game => (
              <button
                key={game.id}
                className="game-card"
                onClick={() => selectGame(game)}
              >
                <div className="game-icon">{game.emoji}</div>
                <div className="game-name">{game.name}</div>
                <div className="game-description">{game.description}</div>
                <div className="game-difficulty">{game.difficulty}</div>
                <div className="game-reward">
                  {game.isExternal ?
                    'Recompensa por puntuación' :
                    `+${game.reward.coins}💰 +${game.reward.exp}✨`
                  }
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && currentGame) {
    return (
      <div className="minigame-overlay">
        <div className="minigame-container">
          <GameComponent
            game={currentGame}
            petName={petName}
            coins={coins}
            onGameEnd={handleGameEnd}
            onBack={handleBack}
            onOpenSkateGame={onOpenSkateGame}
            onUpdateCoins={onUpdateCoins}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default Minigames;
