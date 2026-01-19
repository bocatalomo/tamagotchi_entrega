import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Minigames.css';

// ============================================
// JUEGO 1: PIEDRA, PAPEL O TIJERA
// ============================================
const RockPaperScissors = ({ petName, petType, onGameEnd, onBack, coins }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [petChoice, setPetChoice] = useState(null);
  const [petThinking, setPetThinking] = useState(false);
  const [result, setResult] = useState(null);

  const emojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  const choices = ['rock', 'paper', 'scissors'];

  const play = useCallback((choice) => {
    if (petThinking || result) return;

    setPlayerChoice(choice);
    setPetThinking(true);
    setResult(null);

    // La mascota "piensa" por 1.5 segundos
    setTimeout(() => {
      const petChoiceIndex = Math.floor(Math.random() * 3);
      const selectedPetChoice = choices[petChoiceIndex];
      setPetChoice(selectedPetChoice);
      setPetThinking(false);

      // Determinar ganador
      let gameResult;
      if (choice === selectedPetChoice) {
        gameResult = 'tie';
      } else if (
        (choice === 'rock' && selectedPetChoice === 'scissors') ||
        (choice === 'paper' && selectedPetChoice === 'rock') ||
        (choice === 'scissors' && selectedPetChoice === 'paper')
      ) {
        gameResult = 'win';
      } else {
        gameResult = 'lose';
      }

      setResult(gameResult);

      // Mostrar resultado por 2 segundos y luego finalizar
      setTimeout(() => {
        onGameEnd(gameResult === 'win');
      }, 2000);
    }, 1500);
  }, [petThinking, result, onGameEnd]);

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">✊ Piedra, Papel o Tijera</h3>
      </div>

      <div className="game-info">
        <div className="coins-display">🪙 {coins} monedas</div>
        <div className="difficulty">Dificultad: Fácil</div>
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
// COMPONENTE PRINCIPAL: MINIJUEGOS
// ============================================
const Minigames = ({ petName, petType, onClose, onWin, onLose, onOpenSkateGame, coins }) => {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    {
      id: 'rock-paper-scissors',
      name: 'Piedra, Papel o Tijera',
      emoji: '✊',
      description: 'Juega contra tu mascota',
      difficulty: 'Fácil',
      reward: { coins: 8, exp: 15, happiness: 25 }
    }
  ];

  const handleGameEnd = (won, customReward = null) => {
    if (won) {
      onWin(customReward || games.find(g => g.id === currentGame)?.reward || { coins: 5, exp: 10, happiness: 20 });
    } else {
      onLose();
    }
    setCurrentGame(null);
  };

  const handleBack = () => {
    if (currentGame) {
      setCurrentGame(null);
    } else {
      onClose();
    }
  };

  // Renderizar juego específico
  if (currentGame === 'rock-paper-scissors') {
    return (
      <RockPaperScissors
        petName={petName}
        petType={petType}
        onGameEnd={handleGameEnd}
        onBack={handleBack}
        coins={coins}
      />
    );
  }

  // Menú principal de minijuegos
  return (
    <div className="minigames-overlay">
      <div className="minigames-container">
        <div className="minigames-header">
          <button className="close-button" onClick={onClose}>×</button>
          <h2 className="minigames-title">🎮 MINIJUEGOS</h2>
        </div>

        <div className="coins-display">🪙 {coins} monedas</div>

        <div className="games-grid">
          {games.map(game => (
            <button
              key={game.id}
              className="game-card"
              onClick={() => setCurrentGame(game.id)}
            >
              <div className="game-emoji">{game.emoji}</div>
              <div className="game-name">{game.name}</div>
              <div className="game-description">{game.description}</div>
              <div className="game-difficulty">{game.difficulty}</div>
              <div className="game-reward">
                🏆 {game.reward.coins} monedas
              </div>
            </button>
          ))}

          <button className="game-card skate-game" onClick={onOpenSkateGame}>
            <div className="game-emoji">🛹</div>
            <div className="game-name">Skate Game</div>
            <div className="game-description">Surfea con tu mascota</div>
            <div className="game-difficulty">Medio</div>
            <div className="game-reward">
              🏆 Variable
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Minigames;