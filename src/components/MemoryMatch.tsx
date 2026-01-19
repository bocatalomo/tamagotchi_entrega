// ============================================
// JUEGO 2: MEMORIA - VERSIÓN CORREGIDA
// ============================================
import React, { useState, useEffect, useCallback } from 'react';

const MemoryMatch = ({ petName, onGameEnd, onBack }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const [petThinking, setPetThinking] = useState(false);

  const emojis = ['🐕', '🐱', '🐰', '🦊', '🐼', '🐸'];

  // Inicializar cartas
  useEffect(() => {
    const cardPairs = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, matched: false }));
    setCards(cardPairs);
  }, []);

  // IA simple y justa de la mascota
  const petMove = useCallback(() => {
    const unmatched = cards.filter(c => !matched.includes(c.id));
    
    if (unmatched.length < 2) return; // No hay suficientes cartas
    
    setPetThinking(true);
    
    setTimeout(() => {
      // La mascota elige 2 cartas random
      const randomCards = unmatched
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      
      setFlipped(randomCards.map(c => c.id));
      
      setTimeout(() => {
        setFlipped([]);
        setPetThinking(false);
        setPlayerTurn(true); // Devuelve turno al jugador
      }, 1500);
    }, 1000);
  }, [cards, matched]);

  // Sistema de turnos
  useEffect(() => {
    if (!playerTurn && matched.length < 12) {
      petMove();
    }
  }, [playerTurn, matched.length, petMove]);

  // Verificar fin del juego
  useEffect(() => {
    if (matched.length === 12) {
      setTimeout(() => {
        onGameEnd(score.player > score.pet);
      }, 1000);
    }
  }, [matched.length, score.player, score.pet, onGameEnd]);

  // Click del jugador
  const handleCardClick = (cardId) => {
    if (!playerTurn || petThinking) return;
    if (matched.includes(cardId) || flipped.includes(cardId)) return;
    if (flipped.length >= 2) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.emoji === card2.emoji) {
        // Jugador encontró un par
        setTimeout(() => {
          setMatched(prev => [...prev, ...newFlipped]);
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
          setFlipped([]);
          setPlayerTurn(true); // Sigue jugando si acierta
        }, 1000);
      } else {
        // Jugador falló
        setTimeout(() => {
          setFlipped([]);
          setPlayerTurn(false); // Pasa turno a la mascota
        }, 1000);
      }
    }
  };

  return (
    <div className="minigame-container">
      <div className="minigame-header">
        <h3>🧠 Juego de Memoria</h3>
        <button onClick={onBack} className="back-button">← Volver</button>
      </div>

      <div className="game-info">
        <p>Ronda: {Math.floor(matched.length / 2) + 1}/6</p>
        <p>Marcador: Tú {score.player} - {petName} {score.pet}</p>
        <p>Turno: {playerTurn ? 'Tú' : `${petName} pensando...`}</p>
      </div>

      <div className="memory-game">
        <div className="cards-grid">
          {cards.map(card => {
            const isFlipped = flipped.includes(card.id);
            const isMatched = matched.includes(card.id);
            const isDisabled = !playerTurn || petThinking;

            return (
              <div
                key={card.id}
                className={`memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card.id)}
                style={{ cursor: (isDisabled || isMatched) ? 'not-allowed' : 'pointer', opacity: (isDisabled || isMatched) ? 0.6 : 1 }}
              >
                <div className="card-content">
                  {isFlipped || isMatched ? card.emoji : '?'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {petThinking && (
        <div className="thinking-indicator">
          <p>{petName} está pensando...</p>
        </div>
      )}
    </div>
  );
};