import { useState, useEffect } from 'react';
import '../Minigames.css';
import { predictNextMove, registerRound, checkServerHealth, toSpanish, toEnglish } from '@/utils/rpsAiApi';
import type { GameHistory, RPSChoice, RoundWinner } from '@/types/rpsAi';

interface RockPaperScissorsProps {
  petName: string;
  onGameEnd: (won: boolean, customReward?: { coins: number; exp: number; happiness: number; energy?: number }) => void;
  onBack: () => void;
}

type Choice = 'rock' | 'paper' | 'scissors';
type GamePhase = 'choosing' | 'playerChose' | 'petThinking' | 'revealing' | 'showingResult' | 'gameOver';
type RoundResult = 'win' | 'lose' | 'tie';

const RockPaperScissors = ({ petName, onGameEnd, onBack }: RockPaperScissorsProps) => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [petChoice, setPetChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ player: 0, pet: 0 });
  const [phase, setPhase] = useState<GamePhase>('choosing');
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);
  const [playerHistory, setPlayerHistory] = useState<Choice[]>([]);
  
  // Estado para la integración con IA
  const [serverAvailable, setServerAvailable] = useState<boolean>(false);
  const [isConnectingAI, setIsConnectingAI] = useState<boolean>(false);
  const [gameHistory, setGameHistory] = useState<GameHistory>({ 
    player: [], 
    ai: [] 
  });

  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  const emojis: Record<Choice, string> = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  const resultMessages: Record<RoundResult, string> = {
    win: '🎉 ¡Ganaste esta ronda!',
    lose: `😅 ¡${petName} ganó esta ronda!`,
    tie: '🤝 ¡Empate!'
  };

  /**
   * Verificar servidor al montar el componente
   */
  useEffect(() => {
    checkServerHealth().then(available => {
      setServerAvailable(available);
      if (available) {
        console.log('✅ Servidor de IA conectado');
      } else {
        console.log('⚠️ Servidor de IA offline - usando IA simple');
      }
    });
  }, []);

  /**
   * IA adaptativa que aprende de los movimientos del jugador (FALLBACK LOCAL)
   */
  const getPetChoice = (history: Choice[]): Choice => {
    // Primera jugada o sin historial suficiente → Aleatorio
    if (history.length === 0) {
      return choices[Math.floor(Math.random() * 3)];
    }

    const random = Math.random();

    // 50% del tiempo → Completamente aleatorio
    if (random < 0.5) {
      return choices[Math.floor(Math.random() * 3)];
    }

    // 30% del tiempo → Intentar contrarrestar último movimiento
    if (random < 0.8) {
      const lastMove = history[history.length - 1];
      const counter: Record<Choice, Choice> = { 
        rock: 'paper', 
        paper: 'scissors', 
        scissors: 'rock' 
      };
      return counter[lastMove];
    }

    // 20% del tiempo → Detectar patrones de 2 movimientos
    if (history.length >= 2) {
      const lastTwo = history.slice(-2);
      // Predecir qué jugará el jugador basándose en su patrón
      const patterns: Record<string, Choice> = {
        'rock,rock': 'paper',       // Si jugó piedra 2 veces, podría jugar piedra otra vez
        'rock,paper': 'scissors',   // Si jugó piedra-papel, probablemente juegue tijera
        'rock,scissors': 'rock',    // Si jugó piedra-tijera, probablemente juegue piedra
        'paper,rock': 'paper',
        'paper,paper': 'scissors',
        'paper,scissors': 'rock',
        'scissors,rock': 'scissors',
        'scissors,paper': 'rock',
        'scissors,scissors': 'paper'
      };
      const patternKey = `${lastTwo[0]},${lastTwo[1]}`;
      return patterns[patternKey] || choices[Math.floor(Math.random() * 3)];
    }

    return choices[Math.floor(Math.random() * 3)];
  };

  /**
   * Obtiene la jugada de la IA usando el servidor de ML (con fallback local)
   */
  const getPetChoiceAI = async (): Promise<Choice> => {
    // Si servidor no disponible, usar IA local
    if (!serverAvailable) {
      return getPetChoice(playerHistory);
    }

    setIsConnectingAI(true);
    try {
      const prediction = await predictNextMove(gameHistory);
      
      if (prediction && prediction.aiMove) {
        // Mapear de español a inglés: 'piedra' → 'rock'
        const aiMove = toEnglish(prediction.aiMove as RPSChoice);
        console.log('🤖 IA decidió jugar:', aiMove, '(predicción:', prediction.predictedOpponentMove, ')');
        setIsConnectingAI(false);
        return aiMove;
      }
    } catch (error) {
      console.error('❌ Error al consultar IA:', error);
    }

    setIsConnectingAI(false);
    // Fallback si falla la API
    return getPetChoice(playerHistory);
  };

  /**
   * Determina el ganador de la ronda
   */
  const determineWinner = (player: Choice, pet: Choice): RoundResult => {
    if (player === pet) return 'tie';
    if ((player === 'rock' && pet === 'scissors') ||
        (player === 'paper' && pet === 'rock') ||
        (player === 'scissors' && pet === 'paper')) {
      return 'win';
    }
    return 'lose';
  };

  /**
   * Maneja la jugada del usuario con timing mejorado + integración con IA
   */
  const play = async (choice: Choice) => {
    // Fase 1: Jugador eligió (inmediato)
    console.log('🎮 Jugador eligió:', choice);
    setPlayerChoice(choice);
    setPhase('playerChose');
    
    // ✅ FIX: Crear historial actualizado ANTES de los timeouts
    // Esto previene el bug de closure donde playerHistory tiene el valor antiguo
    const updatedHistory = [...playerHistory, choice];
    
    // Agregar al historial para la IA
    setPlayerHistory(updatedHistory);

    // Fase 2: Mostrar "pensando" de la IA (después de 500ms)
    setTimeout(() => {
      console.log('🤔 IA pensando...');
      setPhase('petThinking');
    }, 500);

    // Fase 3: IA elige y revela (después de 2500ms total)
    // ✅ FIX: Cambiado de 2000ms a 2500ms para que ocurra DESPUÉS de 2s completos de "pensando"
    // Timeline: 0ms → playerChose, 500ms → petThinking, 2500ms → revealing
    setTimeout(async () => {
      // ✅ NUEVO: Usar getPetChoiceAI en lugar de getPetChoice
      const petSelection = await getPetChoiceAI();
      console.log('🎲 IA eligió:', petSelection, '(historial:', updatedHistory, ')');
      setPetChoice(petSelection);
      setPhase('revealing');

      // Fase 4: Mostrar resultado (después de 3000ms total = 2500ms + 500ms)
      setTimeout(async () => {
        const outcome = determineWinner(choice, petSelection);
        console.log('📊 Resultado:', outcome);
        setResult(outcome);
        setPhase('showingResult');

        // Actualizar puntaje
        const newScore = { ...score };
        if (outcome === 'win') newScore.player += 1;
        if (outcome === 'lose') newScore.pet += 1;
        setScore(newScore);

        // ✅ NUEVO: Registrar ronda en el servidor
        if (serverAvailable) {
          const playerSpanish = toSpanish(choice);
          const petSpanish = toSpanish(petSelection);
          const winner: RoundWinner = outcome === 'win' ? 'player' : outcome === 'lose' ? 'ai' : 'tie';
          
          await registerRound(playerSpanish, petSpanish, winner);
          
          // Actualizar historial para próxima predicción
          setGameHistory(prev => ({
            player: [...prev.player, playerSpanish],
            ai: [...prev.ai, petSpanish]
          }));
        }

        // Fase 5: Verificar fin de juego o continuar (después de 5500ms total = 3000ms + 2500ms)
        setTimeout(() => {
          if (newScore.player === 2) {
            console.log('🏆 Jugador ganó el juego completo');
            setGameOver('win');
            setPhase('gameOver');
          } else if (newScore.pet === 2) {
            console.log('😢 IA ganó el juego completo');
            setGameOver('lose');
            setPhase('gameOver');
          } else {
            console.log('➡️ Siguiente ronda');
            // Resetear para la siguiente ronda
            setRound(r => r + 1);
            setPlayerChoice(null);
            setPetChoice(null);
            setResult(null);
            setPhase('choosing');
          }
        }, 2500); // Tiempo para ver el resultado: 2.5 segundos
      }, 500); // Tiempo para ver la elección de la IA: 0.5 segundos
    }, 2500); // ✅ CORREGIDO: 500ms espera inicial + 2000ms pensando = 2500ms total
  };

  /**
   * Reinicia el juego para otra partida
   */
  const playAgain = () => {
    console.log('🔄 Reiniciando juego');
    setPlayerChoice(null);
    setPetChoice(null);
    setResult(null);
    setRound(1);
    setScore({ player: 0, pet: 0 });
    setPhase('choosing');
    setGameOver(null);
    setPlayerHistory([]);
    // ✅ NUEVO: No resetear gameHistory del servidor - el modelo aprende entre partidas
    // Solo se resetea el estado local de la partida actual
  };

  /**
   * Sale del juego y entrega recompensas
   */
  const exitGame = () => {
    console.log('👋 Saliendo del juego');
    onGameEnd(gameOver === 'win');
  };

  // ============================================
  // RENDERIZADO: PANTALLA DE VICTORIA/DERROTA
  // ============================================
  if (phase === 'gameOver' && gameOver) {
    const isWin = gameOver === 'win';
    const rewards = isWin 
      ? { coins: 8, exp: 15, happiness: 25 }
      : { coins: 2, exp: 5, happiness: 5 }; // Pequeña recompensa de consolación

    return (
      <div className="game-screen">
        <div className="game-header">
          <button className="back-button" onClick={onBack}>← Volver</button>
          <h3 className="game-title">🤖 Piedra, Papel o Tijera IA</h3>
        </div>

        <div className="rps-game-over">
          <div className={`game-over-content ${isWin ? 'victory' : 'defeat'}`}>
            <div className="game-over-icon">
              {isWin ? '🏆' : '😢'}
            </div>
            <h2 className="game-over-title">
              {isWin ? '¡Victoria Total!' : '¡Casi lo logras!'}
            </h2>
            <div className="final-score">
              <div className="score-item">
                <span className="score-label">Tú</span>
                <span className="score-value">{score.player}</span>
              </div>
              <div className="score-divider">-</div>
              <div className="score-item">
                <span className="score-label">{petName}</span>
                <span className="score-value">{score.pet}</span>
              </div>
            </div>

            <div className="rewards-section">
              <h3 className="rewards-title">
                {isWin ? 'Recompensas' : 'Recompensa de Consolación'}
              </h3>
              <div className="rewards-list">
                <div className="reward-item">
                  <span className="reward-icon">💰</span>
                  <span className="reward-value">+{rewards.coins} monedas</span>
                </div>
                <div className="reward-item">
                  <span className="reward-icon">⭐</span>
                  <span className="reward-value">+{rewards.exp} exp</span>
                </div>
                <div className="reward-item">
                  <span className="reward-icon">😊</span>
                  <span className="reward-value">+{rewards.happiness} felicidad</span>
                </div>
              </div>
            </div>

            <div className="game-over-actions">
              <button className="game-button secondary" onClick={playAgain}>
                🔄 Jugar de Nuevo
              </button>
              <button className="game-button primary" onClick={exitGame}>
                ✓ Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDERIZADO: PANTALLA DE JUEGO PRINCIPAL
  // ============================================
  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">🤖 Piedra, Papel o Tijera IA</h3>
      </div>

      <div className="game-info">
        <div className="round-info">
          Mejor de 3 - Ronda {round}
          {serverAvailable ? (
            <span className="ai-status online" style={{ marginLeft: '10px', fontSize: '0.85rem' }}>
              🤖 IA conectada
            </span>
          ) : (
            <span className="ai-status offline" style={{ marginLeft: '10px', fontSize: '0.85rem' }}>
              ⚠️ IA offline
            </span>
          )}
        </div>
        <div className="score-info">
          <span className="player-score">Tú: {score.player}</span>
          <span className="pet-score">{petName}: {score.pet}</span>
        </div>
      </div>

      <div className="rps-battle">
        <div className="rps-player">
          <div className="rps-label">Tú</div>
          <div className={`rps-choice ${playerChoice && phase !== 'choosing' ? 'chosen' : ''}`}>
            {playerChoice ? emojis[playerChoice] : '❓'}
          </div>
        </div>

        <div className="rps-vs">VS</div>

        <div className="rps-pet">
          <div className="rps-label">{petName}</div>
          <div className={`rps-choice ${phase === 'petThinking' ? 'thinking' : ''} ${petChoice && phase === 'revealing' ? 'chosen' : ''}`}>
            {phase === 'petThinking' && '🤔'}
            {phase === 'revealing' && petChoice && emojis[petChoice]}
            {phase === 'showingResult' && petChoice && emojis[petChoice]}
            {phase === 'choosing' && '❓'}
            {phase === 'playerChose' && '❓'}
          </div>
        </div>
      </div>

      {result && phase === 'showingResult' && (
        <div className={`rps-result ${result}`}>
          {resultMessages[result]}
        </div>
      )}

      {phase === 'choosing' && (
        <div className="rps-choices">
          <button 
            className="choice-button" 
            onClick={() => play('rock')}
          >
            <span className="choice-emoji">✊</span>
            <span className="choice-label">Piedra</span>
          </button>
          <button 
            className="choice-button" 
            onClick={() => play('paper')}
          >
            <span className="choice-emoji">✋</span>
            <span className="choice-label">Papel</span>
          </button>
          <button 
            className="choice-button" 
            onClick={() => play('scissors')}
          >
            <span className="choice-emoji">✌️</span>
            <span className="choice-label">Tijera</span>
          </button>
        </div>
      )}

      {phase !== 'choosing' && phase !== 'gameOver' && (
        <div className="rps-status">
          {phase === 'playerChose' && '⏳ Esperando...'}
          {phase === 'petThinking' && (
            serverAvailable && isConnectingAI 
              ? `🤖 Consultando IA...` 
              : `🤔 ${petName} está pensando...`
          )}
          {phase === 'revealing' && '🎲 ¡Revelando!'}
          {phase === 'showingResult' && '✨ Resultado de la ronda'}
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
