import { useState, useRef } from 'react';
import './SlotMachine.css';

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐'];

interface Props {
  coins: number;
  onUpdateCoins: (coinsChange: number) => void;
  onBack: () => void;
}

export default function SlotMachine({ coins, onUpdateCoins, onBack }: Props) {
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState('');
  const [displayCoins, setDisplayCoins] = useState(coins);
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState(['🍒', '🍋', '🍊']);
  const [isJackpot, setIsJackpot] = useState(false);

  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);
  const reel3Ref = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning) return;
    if (bet > coins) {
      setResult('No hay suficientes monedas');
      return;
    }

    onUpdateCoins(-bet);
    setDisplayCoins(coins - bet);
    setResult('');
    setSpinning(true);
    setIsJackpot(false);

    let count = 0;
    const maxCount = 20;

    const updateReels = () => {
      if (!reel1Ref.current || !reel2Ref.current || !reel3Ref.current) return;

      const s1 = symbols[Math.floor(Math.random() * symbols.length)];
      const s2 = symbols[Math.floor(Math.random() * symbols.length)];
      const s3 = symbols[Math.floor(Math.random() * symbols.length)];

      reel1Ref.current.textContent = s1;
      reel2Ref.current.textContent = s2;
      reel3Ref.current.textContent = s3;

      count++;

      if (count < maxCount) {
        setTimeout(updateReels, 50);
      } else {
        finishSpin(s1, s2, s3);
      }
    };

    updateReels();
  };

  const finishSpin = (s1: string, s2: string, s3: string) => {
    setSlots([s1, s2, s3]);
    setSpinning(false);

    if (s1 === s2 && s2 === s3) {
      const win = bet * 5;
      setResult(`JACKPOT! +${win} MONEDAS`);
      onUpdateCoins(win);
      setDisplayCoins(displayCoins + win);
      setIsJackpot(true);
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      const win = Math.floor(bet * 0.8);
      setResult(`¡BIEN! +${win} MONEDAS`);
      onUpdateCoins(win);
      setDisplayCoins(displayCoins + win);
    } else {
      setResult(`PERDISTE ${bet} MONEDAS`);
    }
  };

  return (
    <div className="slot-machine-wrapper">
      <div className="slot-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <h1 className="slot-title">🎰 TRAGAPERRAS</h1>
        <div className="coins-display">
          <span>{displayCoins} 💰</span>
        </div>
      </div>

      <div className="reels-container">
        <div className="reel">
          <div className="reel-emoji" ref={reel1Ref} style={{fontSize: '50px'}}>{slots[0]}</div>
        </div>
        <div className="reel">
          <div className="reel-emoji" ref={reel2Ref} style={{fontSize: '50px'}}>{slots[1]}</div>
        </div>
        <div className="reel">
          <div className="reel-emoji" ref={reel3Ref} style={{fontSize: '50px'}}>{slots[2]}</div>
        </div>
      </div>

      <div className="result-text" style={{
        padding: '10px',
        margin: '20px 0',
        fontWeight: 'bold',
        color: result.includes('JACKPOT') ? '#f093fb' : result.includes('BIEN') ? '#4ecca3' : result.includes('PERDISTE') ? '#ff6b6b' : 'inherit'
      }}>
        {result}
      </div>

      <div style={{marginBottom: '20px'}}>
        <span>APUESTA: {bet} </span>
        <button onClick={() => setBet(Math.max(1, bet - 10))} disabled={spinning}>-10</button>
        <button onClick={() => setBet(Math.min(coins, bet + 10))} disabled={spinning}>+10</button>
      </div>

      <button 
        onClick={spin}
        disabled={spinning || bet > coins}
        style={{
          padding: '15px 40px',
          fontSize: '18px',
          background: spinning ? '#ccc' : '#f093fb',
          border: '3px solid #000',
          cursor: spinning ? 'not-allowed' : 'pointer'
        }}
      >
        {spinning ? 'GIRANDO...' : 'GIRAR'}
      </button>

      {isJackpot && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(240, 147, 251, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          zIndex: 1000
        }}>
          🎰 JACKPOT! 🎰
        </div>
      )}

      <button onClick={() => onUpdateCoins(100)} style={{marginTop: '15px', background: '#4ecca3'}}>
        +100 MONEDAS DEBUG
      </button>
    </div>
  );
}
