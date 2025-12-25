import { useState } from 'react';
import './SlotMachine.css';

const SlotMachine = ({ petName, coins, onGameEnd, onBack }) => {
  const [bet, setBet] = useState(10);
  const [slots, setSlots] = useState(['❓', '❓', '❓']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [lastWin, setLastWin] = useState(0);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐'];

  const spin = () => {
    if (isSpinning) return;
    if (bet <= 0) {
      setResult({ type: 'error', message: 'La apuesta debe ser mayor a 0' });
      return;
    }
    if (bet > coins) {
      setResult({ type: 'error', message: 'No tienes suficientes monedas' });
      return;
    }

    setIsSpinning(true);
    setResult(null);
    setLastWin(0);

    // Animación de giro
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setSlots([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      spinCount++;

      if (spinCount >= 20) {
        clearInterval(spinInterval);
        // Resultado final
        const finalSlots = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];
        setSlots(finalSlots);
        setIsSpinning(false);
        evaluateResult(finalSlots);
      }
    }, 100);
  };

  const evaluateResult = (finalSlots) => {
    const [slot1, slot2, slot3] = finalSlots;

    // 3 iguales - Gana x5
    if (slot1 === slot2 && slot2 === slot3) {
      const winAmount = bet * 5;
      setLastWin(winAmount);
      setResult({
        type: 'jackpot',
        message: `JACKPOT! Ganaste ${winAmount} monedas`,
        amount: winAmount
      });
      setTimeout(() => onGameEnd(true, { coins: winAmount, exp: 30, happiness: 40 }), 2000);
      return;
    }

    // 2 iguales - Gana x0.8
    if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      const winAmount = Math.floor(bet * 0.8);
      setLastWin(winAmount);
      setResult({
        type: 'win',
        message: `Bien! Recuperaste ${winAmount} monedas`,
        amount: winAmount
      });
      setTimeout(() => onGameEnd(true, { coins: winAmount, exp: 10, happiness: 15 }), 2000);
      return;
    }

    // Ninguno igual - Pierde todo
    setResult({
      type: 'lose',
      message: `Perdiste ${bet} monedas`,
      amount: -bet
    });
    setTimeout(() => onGameEnd(false, { coins: -bet, exp: 0, happiness: -10 }), 2000);
  };

  const adjustBet = (amount) => {
    const newBet = bet + amount;
    if (newBet < 1) return;
    if (newBet > coins) return;
    setBet(newBet);
  };

  const setBetPreset = (amount) => {
    if (amount > coins) return;
    setBet(amount);
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h3 className="game-title">🎰 Tragaperras</h3>
      </div>

      <div className="game-info">
        <div className="slot-info">
          <div className="slot-rule">3 iguales = x5</div>
          <div className="slot-rule">2 iguales = x0.8</div>
          <div className="slot-rule">Diferente = Pierde todo</div>
        </div>
      </div>

      <div className="slot-machine">
        <div className="slot-display">
          <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
            <div className="slot-symbol">{slots[0]}</div>
          </div>
          <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
            <div className="slot-symbol">{slots[1]}</div>
          </div>
          <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
            <div className="slot-symbol">{slots[2]}</div>
          </div>
        </div>

        {result && (
          <div className={`slot-result ${result.type}`}>
            {result.message}
          </div>
        )}

        <div className="slot-controls">
          <div className="bet-section">
            <div className="bet-label">Apuesta:</div>
            <div className="bet-controls">
              <button
                className="bet-button"
                onClick={() => adjustBet(-10)}
                disabled={isSpinning || bet <= 10}
              >
                -10
              </button>
              <button
                className="bet-button"
                onClick={() => adjustBet(-1)}
                disabled={isSpinning || bet <= 1}
              >
                -1
              </button>
              <div className="bet-amount">{bet} 💰</div>
              <button
                className="bet-button"
                onClick={() => adjustBet(1)}
                disabled={isSpinning || bet >= coins}
              >
                +1
              </button>
              <button
                className="bet-button"
                onClick={() => adjustBet(10)}
                disabled={isSpinning || bet + 10 > coins}
              >
                +10
              </button>
            </div>
          </div>

          <div className="bet-presets">
            <button
              className="preset-button"
              onClick={() => setBetPreset(10)}
              disabled={isSpinning || coins < 10}
            >
              10
            </button>
            <button
              className="preset-button"
              onClick={() => setBetPreset(25)}
              disabled={isSpinning || coins < 25}
            >
              25
            </button>
            <button
              className="preset-button"
              onClick={() => setBetPreset(50)}
              disabled={isSpinning || coins < 50}
            >
              50
            </button>
            <button
              className="preset-button"
              onClick={() => setBetPreset(Math.min(100, coins))}
              disabled={isSpinning || coins < 10}
            >
              {coins < 100 ? 'MAX' : '100'}
            </button>
          </div>

          <button
            className="spin-button"
            onClick={spin}
            disabled={isSpinning || bet > coins}
          >
            {isSpinning ? 'GIRANDO...' : 'GIRAR 🎰'}
          </button>

          <div className="coins-display">
            Monedas disponibles: {coins} 💰
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
