import { useState, useEffect, useCallback } from 'react';
import './Minigames.css';
import SlotMachine from './SlotMachine';

const Minigames = ({ petName, onClose, onWin, onLose, onOpenSkateGame, coins }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, result

  const games = [
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
      id: 'skate-game',
      name: 'Skate Jump',
      emoji: '🛹',
      description: '¡Salta entre plataformas!',
      difficulty: 'Difícil',
      reward: { coins: 'Variable', exp: 'Variable', happiness: 30 },
      isExternal: true
    }
  ];

  const selectGame = (game) => {
    // Si es el juego de skate, cerramos minigames y abrimos SkateGame
    if (game.id === 'skate-game') {
      onClose();
      if (onOpenSkateGame) {
        onOpenSkateGame();
      }
      return;
    }

    setCurrentGame(game);
    setGameState('playing');
  };

  const handleGameEnd = (won, customReward = null) => {
    setGameState('result');
    if (won) {
      onWin(customReward || currentGame.reward);
    } else {
      // Para la tragaperras, si pierde también usamos customReward
      if (customReward) {
        onWin(customReward); // Usa onWin pero con recompensa negativa
      } else {
        onLose();
      }
    }
  };

  const resetGame = () => {
    setCurrentGame(null);
    setGameState('menu');
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
            onBack={resetGame}
          />
        </div>
      </div>
    );
  }

  return null;
};

// Componente que renderiza el juego específico
const GameComponent = ({ game, petName, petType, onGameEnd, onBack, coins }) => {
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
      return <SlotMachine petName={petName} coins={coins} onGameEnd={onGameEnd} onBack={onBack} />;
    default:
      return null;
  }
};

// ============================================
// JUEGO 1: PIEDRA, PAPEL O TIJERA
// ============================================
const RockPaperScissors = ({ petName, onGameEnd, onBack }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [petChoice, setPetChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const [petThinking, setPetThinking] = useState(false);

  const choices = ['rock', 'paper', 'scissors'];
  const emojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  // IA de la mascota - Equilibrada y divertida
  const getPetChoice = (playerHistory = []) => {
    // Si es la primera ronda, elección random
    if (playerHistory.length === 0) {
      return choices[Math.floor(Math.random() * 3)];
    }

    const random = Math.random();

    // 60% - Elección completamente random (justa)
    if (random < 0.6) {
      return choices[Math.floor(Math.random() * 3)];
    }

    // 25% - Counter simple del último movimiento
    if (random < 0.85) {
      const lastMove = playerHistory[playerHistory.length - 1];
      const counter = {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock'
      };
      return counter[lastMove];
    }

    // 15% - Patrón simple (alternancia)
    if (playerHistory.length >= 2) {
      const lastTwo = playerHistory.slice(-2);
      const patterns = {
        'rock,rock': 'scissors',
        'rock,paper': 'rock',
        'rock,scissors': 'paper',
        'paper,rock': 'scissors',
        'paper,paper': 'rock',
        'paper,scissors': 'paper',
        'scissors,rock': 'paper',
        'scissors,paper': 'scissors',
        'scissors,scissors': 'rock'
      };
      const patternKey = `${lastTwo[0]},${lastTwo[1]}`;
      return patterns[patternKey] || choices[Math.floor(Math.random() * 3)];
    }

    return choices[Math.floor(Math.random() * 3)];
  };

  const play = (choice) => {
    setPlayerChoice(choice);
    setPetThinking(true);

    // La mascota "piensa" por un momento
    setTimeout(() => {
      const petSelection = getPetChoice([playerChoice]);
      setPetChoice(petSelection);
      setPetThinking(false);

      // Determinar ganador
      const outcome = determineWinner(choice, petSelection);
      setResult(outcome);

      // Actualizar puntuación
      if (outcome === 'win') {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (outcome === 'lose') {
        setScore(prev => ({ ...prev, pet: prev.pet + 1 }));
      }

      // Verificar si hay ganador (mejor de 3)
      const newScore = { ...score };
      if (outcome === 'win') newScore.player += 1;
      if (outcome === 'lose') newScore.pet += 1;

      if (newScore.player === 2) {
        setTimeout(() => onGameEnd(true), 1500);
      } else if (newScore.pet === 2) {
        setTimeout(() => onGameEnd(false), 1500);
      } else if (round < 3) {
        setTimeout(() => {
          setRound(round + 1);
          setPlayerChoice(null);
          setPetChoice(null);
          setResult(null);
        }, 1500);
      }
    }, 1000);
  };

  const determineWinner = (player, pet) => {
    if (player === pet) return 'tie';
    if (
      (player === 'rock' && pet === 'scissors') ||
      (player === 'paper' && pet === 'rock') ||
      (player === 'scissors' && pet === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
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
          <div className="rps-choice">
            {playerChoice ? emojis[playerChoice] : '❓'}
          </div>
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
          {result === 'lose' && '😅 ¡' + petName + ' ganó esta ronda!'}
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

// ============================================
// JUEGO 2: MEMORIA
// ============================================
const MemoryMatch = ({ petName, onGameEnd, onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const [petThinking, setPetThinking] = useState(false);

  const emojis = ['🐕', '🐱', '🐰', '🦊', '🐼', '🐸'];

  useEffect(() => {
    // Crear pares de cartas
    const cardPairs = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, matched: false }));
    setCards(cardPairs);
  }, []);

  const petMove = useCallback(() => {
    const unmatched = cards.filter(c => !matched.includes(c.id));
    
    if (unmatched.length === 0) return; // No quedan cartas
    
    // IA simple y justa: elige UN par al azar si sabe alguno
    const random = Math.random();
    
    if (random < 0.25 && unmatched.length >= 2) {
      // 25% - Intenta encontrar UN par que ya ha visto
      const recentlySeen = unmatched.filter(card => flipped.includes(card.id));
      
      if (recentlySeen.length >= 1) {
        // Buscar si alguna de las cartas vistas tiene su par disponible
        for (const seenCard of recentlySeen) {
          const matchingCard = unmatched.find(c => 
            c.emoji === seenCard.emoji && c.id !== seenCard.id
          );
          
          if (matchingCard) {
            setFlipped(prev => [...prev, seenCard.id, matchingCard.id]);
            setTimeout(() => {
              setFlipped(prev => prev.filter(id => id !== seenCard.id && id !== matchingCard.id));
              // Solo añade UN par a matched
              setMatched(prev => [...prev, seenCard.id, matchingCard.id]);
              setScore(prev => ({ ...prev, pet: prev.pet + 1 }));
              setPlayerTurn(false); // Devuelve turno al jugador
            }, 1500);
            return;
          }
        }
      }
    }

    // 75% - Elige dos cartas completamente random
    const randomCards = unmatched.sort(() => Math.random() - 0.5).slice(0, 2);
    setFlipped(prev => [...prev, ...randomCards.map(c => c.id)]);
    
    setTimeout(() => {
      setFlipped(prev => prev.filter(id => !randomCards.some(c => c.id === id)));
      setPlayerTurn(false); // Devuelve turno al jugador
    }, 1500);
  }, [cards, matched, flipped]);

  useEffect(() => {
    if (!playerTurn && matched.length < 12) {
      // Turno de la mascota (IA)
      setPetThinking(true);
      setTimeout(() => {
        petMove();
        setPetThinking(false);
      }, 1500);
    }
  }, [playerTurn, matched.length]); // Dependencias simplificadas

  useEffect(() => {
    if (matched.length === 12) {
      // Juego terminado - todas las cartas encontradas
      setTimeout(() => {
        onGameEnd(score.player > score.pet);
      }, 1000);
    }
  }, [matched.length, score.player, score.pet, onGameEnd]);

  const handleCardClick = (cardId) => {
    if (!playerTurn || flipped.length >= 2 || matched.includes(cardId) || flipped.includes(cardId)) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.emoji === card2.emoji) {
        // Jugador encontró un par
        setMatched(prev => [...prev, ...newFlipped]);
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        setFlipped([]);
        setPlayerTurn(true); // Sigue siendo turno del jugador si acierta
      } else {
        // Jugador falló, pasa turno a la mascota
        setTimeout(() => {
          setFlipped([]);
          setPlayerTurn(false); // Turno de la mascota
        }, 1000);
      }
    }
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">🧠 Juego de Memoria</h3>
      </div>

      <div className="game-info">
        <div className="turn-info">
          {playerTurn ? '🎮 Tu turno' : '🤖 Turno de ' + petName}
        </div>
        <div className="score-info">
          <span className="player-score">Tú: {score.player}</span>
          <span className="pet-score">{petName}: {score.pet}</span>
        </div>
      </div>

      <div className="memory-grid">
        {cards.map(card => (
          <button
            key={card.id}
            className={`memory-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${!playerTurn ? 'disabled' : ''}`}
            onClick={() => handleCardClick(card.id)}
            disabled={!playerTurn || flipped.includes(card.id) || matched.includes(card.id)}
          >
            <div className="card-front">❓</div>
            <div className="card-back">{card.emoji}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// JUEGO 3: TIEMPO DE REACCIÓN
// ============================================
const ReactionTime = ({ petName, onGameEnd, onBack }) => {
  const [gameState, setGameState] = useState('ready'); // ready, waiting, show, clicked
  const [playerTime, setPlayerTime] = useState(null);
  const [petTime, setPetTime] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const startTime = useRef(null);

const startRound = useCallback(() => {
    setGameState('waiting');
    setPlayerTime(null);
    setPetTime(null);

    // Tiempo random entre 1-4 segundos
    const waitTime = 1000 + Math.random() * 3000;
    setTimeout(() => {
      setGameState('show');
      startTime.current = Date.now();
    }, waitTime);
  }, []);

  const handleClick = () => {
    if (gameState === 'waiting') {
      // Click muy temprano
      setPlayerTime(9999);
      setTimeout(() => evaluateRound(9999), 500);
    } else if (gameState === 'show') {
      // Click correcto
      const reactionTime = Date.now() - startTime.current;
      setPlayerTime(reactionTime);
      setGameState('clicked');
      setTimeout(() => evaluateRound(reactionTime), 1000);
    }
  };

  const evaluateRound = (playerReaction) => {
    // IA más realista: la mascota tiene reacción humana (no perfecta)
    const baseReactionTime = 250 + Math.random() * 400; // 250-650ms (humano real)
    const petReaction = petTime || baseReactionTime;

    // Añadir pequeño error aleatorio a veces (para hacerlo más humano)
    const petHasError = Math.random() < 0.15; // 15% de veces la mascota falla
    const effectivePetTime = petHasError ? petReaction + 200 : petReaction;

    if (playerReaction < effectivePetTime) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setScore(prev => ({ ...prev, pet: prev.pet + 1 }));
    }

    if (round >= 3) {
      setTimeout(() => {
        onGameEnd(score.player + (playerReaction < petReaction ? 1 : 0) >= 2);
      }, 1500);
    } else {
      setTimeout(() => {
        setRound(round + 1);
        setGameState('ready');
      }, 1500);
    }
  };

  useEffect(() => {
    if (gameState === 'ready') {
      const timer = setTimeout(() => startRound(), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, round]);

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
          {gameState === 'clicked' && (
            <div className="reaction-result">
              {playerTime && playerTime < 9999 ? (
                <>
                  <div>Tu tiempo: {playerTime}ms</div>
                  <div>{petName}: {petTime}ms</div>
                  <div className="winner">
                    {playerTime < petTime ? '🎉 ¡Ganaste!' : '😅 ¡' + petName + ' ganó!'}
                  </div>
                </>
              ) : (
                <div className="early-click">❌ ¡Muy temprano!</div>
              )}
            </div>
          )}
        </button>

        <div className="reaction-instructions">
          Presiona cuando veas el ⚡
        </div>
      </div>
    </div>
  );
};

// ============================================
// JUEGO 4: ADIVINA EL NÚMERO
// ============================================
const GuessNumber = ({ petName, onGameEnd, onBack }) => {
  const [secretNumber, setSecretNumber] = useState<number | null>(null);
  const [petRange, setPetRange] = useState<[number, number]>([1, 50]);

  

  useEffect(() => {
    // Iniciar nuevo juego
    setSecretNumber(Math.floor(Math.random() * 50) + 1);
    setPetRange([1, 50]);
    setHint('');
    setAttempts(0);
    setPetAttempts(0);
    setWon(false);
  }, []);

  useEffect(() => {
    // Turno automático de la mascota
    if (petAttempts < 7 && !won && secretNumber) {
      const timer = setTimeout(() => {
        makePetGuess();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [petAttempts, won, makePetGuess, secretNumber]);

  const makePetGuess = useCallback(() => {
    const [min, max] = petRange;
    
    // IA más humana: no siempre usa binary search perfecto
    const random = Math.random();
    let petGuess: number;

    if (random < 0.4) {
      // 40% - Binary search (inteligente)
      petGuess = Math.floor((min + max) / 2);
    } else if (random < 0.7) {
      // 30% - Random en el rango
      petGuess = Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      // 30% -倾向 hacia los extremos (más humano)
      const tendency = Math.random() < 0.5 ? min : max;
      petGuess = Math.floor(tendency + (Math.random() * 5 - 2.5));
    }

    // Asegurarse de que esté en el rango válido
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

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 50) {
      setHint('Ingresa un número entre 1 y 50');
      return;
    }

    setAttempts(attempts + 1);

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
        {won ? (
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
                min="1"
                max="50"
              />
              <button className="guess-button" onClick={handleGuess}>
                Adivinar
              </button>
            </div>

            {hint && <div className="guess-hint">{hint}</div>}

            <div className="guess-pet-thinking">
              {petName} está pensando... 🤔
              <div className="pet-range">
                Rango: {petRange[0]} - {petRange[1]}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Minigames;
