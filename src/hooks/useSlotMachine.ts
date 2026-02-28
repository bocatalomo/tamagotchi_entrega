import { useState, useCallback, useRef } from 'react';
import { audioManager } from '../utils/audioManager';

export type SlotSymbol = '🍒' | '🍋' | '🍊' | '🍇' | '💎' | '7️⃣' | '⭐';

export interface SlotStats {
  totalSpins: number;
  totalWins: number;
  totalLosses: number;
  biggestWin: number;
  currentStreak: number;
  totalWagered: number;
  totalWon: number;
}

export interface ReelState {
  symbols: SlotSymbol[];
  offset: number;
  isSpinning: boolean;
  finalSymbol: SlotSymbol;
}

const SYMBOLS: SlotSymbol[] = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐'];
const REEL_SIZE = 30; // Número de símbolos en cada rodillo

export function useSlotMachine() {
  const [bet, setBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<ReelState[]>([
    { symbols: generateReelSymbols(), offset: 0, isSpinning: false, finalSymbol: '🍒' },
    { symbols: generateReelSymbols(), offset: 0, isSpinning: false, finalSymbol: '🍋' },
    { symbols: generateReelSymbols(), offset: 0, isSpinning: false, finalSymbol: '🍊' },
  ]);
  const [result, setResult] = useState<'jackpot' | 'win' | 'lose' | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [showJackpotOverlay, setShowJackpotOverlay] = useState(false);
  const [autoSpinEnabled, setAutoSpinEnabled] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [winningReels, setWinningReels] = useState<boolean[]>([false, false, false]);
  
  const [stats, setStats] = useState<SlotStats>({
    totalSpins: 0,
    totalWins: 0,
    totalLosses: 0,
    biggestWin: 0,
    currentStreak: 0,
    totalWagered: 0,
    totalWon: 0,
  });

  const autoSpinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const muteRef = useRef(false);

  function generateReelSymbols(): SlotSymbol[] {
    const symbols: SlotSymbol[] = [];
    for (let i = 0; i < REEL_SIZE; i++) {
      symbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    return symbols;
  }

  function generateReelSymbolsWithFinal(finalSymbol: SlotSymbol): SlotSymbol[] {
    const symbols: SlotSymbol[] = [finalSymbol];
    for (let i = 1; i < REEL_SIZE; i++) {
      symbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    return symbols;
  }

  const getSpinResult = useCallback((): [SlotSymbol, SlotSymbol, SlotSymbol] => {
    const random = Math.random();
    
    // 5% probabilidad de jackpot (3 iguales)
    if (random < 0.05) {
      const jackpotSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      return [jackpotSymbol, jackpotSymbol, jackpotSymbol];
    }
    
    // 20% probabilidad de 2 iguales
    if (random < 0.25) {
      const matchSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const differentSymbol = SYMBOLS.filter(s => s !== matchSymbol)[
        Math.floor(Math.random() * (SYMBOLS.length - 1))
      ];
      
      // Aleatoriamente decidir qué posiciones coinciden
      const positions = Math.random() < 0.5 
        ? [matchSymbol, matchSymbol, differentSymbol]
        : [matchSymbol, differentSymbol, matchSymbol];
      
      return positions as [SlotSymbol, SlotSymbol, SlotSymbol];
    }
    
    // 75% probabilidad de perder (todos diferentes)
    const symbols = [...SYMBOLS].sort(() => Math.random() - 0.5);
    return [symbols[0], symbols[1], symbols[2]];
  }, []);

  const evaluateResult = useCallback((symbols: [SlotSymbol, SlotSymbol, SlotSymbol], betAmount: number) => {
    const [s1, s2, s3] = symbols;
    
    // Jackpot: 3 iguales
    if (s1 === s2 && s2 === s3) {
      const multiplier = s1 === '💎' ? 10 : s1 === '7️⃣' ? 8 : 5;
      const win = betAmount * multiplier;
      return { type: 'jackpot' as const, amount: win };
    }
    
    // Victoria menor: 2 iguales
    if (s1 === s2 || s2 === s3 || s1 === s3) {
      const win = Math.floor(betAmount * 0.8);
      return { type: 'win' as const, amount: win };
    }
    
    // Derrota
    return { type: 'lose' as const, amount: 0 };
  }, []);

  const spin = useCallback(async (availableCoins: number, onUpdateCoins: (change: number) => void) => {
    if (isSpinning || bet > availableCoins) return;

    // Deducir apuesta
    onUpdateCoins(-bet);
    
    setIsSpinning(true);
    setResult(null);
    setWinAmount(0);
    setShowJackpotOverlay(false);
    setWinningReels([false, false, false]);

    // Reproducir sonido de palanca
    if (!muteRef.current) {
      audioManager.playSlotLever();
      setTimeout(() => audioManager.playSlotSpin(), 100);
    }

    // Obtener resultado final
    const finalSymbols = getSpinResult();
    const spinDuration = turboMode ? 2000 : 5000;

    // Iniciar animación de rodillos
    const newReels = reels.map((reel, index) => ({
      ...reel,
      isSpinning: true,
      finalSymbol: finalSymbols[index],
      symbols: generateReelSymbols(),
    }));
    setReels(newReels);

    // Detener rodillos SECUENCIALMENTE: izquierda → derecha
    // Delays claros y escalonados para máxima tensión
    const stopDelays = turboMode 
      ? [1200, 1800, 2400]  // Turbo: 0.6s entre cada reel (total 2.4s)
      : [2500, 3500, 4500];  // Normal: 1s entre cada reel (total 4.5s)
    
    // Si hay 2 símbolos iguales, hacer el tercer reel MÁS lento (near-miss effect)
    const hasNearMiss = finalSymbols[0] === finalSymbols[1] || finalSymbols[1] === finalSymbols[2];
    if (hasNearMiss && !turboMode) {
      stopDelays[2] = 6000; // Extra lento: 2.5s después del segundo (total 6s)
    }
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        setReels(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            isSpinning: false,
            finalSymbol: finalSymbols[i],
            symbols: generateReelSymbolsWithFinal(finalSymbols[i]),
          };
          return updated;
        });
        
        if (!muteRef.current) {
          audioManager.playReelStop();
          
          // Sonido especial si hay near-miss en el segundo reel
          if (i === 1 && hasNearMiss) {
            setTimeout(() => audioManager.playSlotTick(), 100);
            setTimeout(() => audioManager.playSlotTick(), 200);
          }
        }
      }, stopDelays[i]);
    }

    // Evaluar resultado después de que todos los rodillos se detengan
    setTimeout(() => {
      const evaluation = evaluateResult(finalSymbols, bet);
      setResult(evaluation.type);
      setWinAmount(evaluation.amount);

      // Actualizar estadísticas
      setStats(prev => ({
        totalSpins: prev.totalSpins + 1,
        totalWins: evaluation.type !== 'lose' ? prev.totalWins + 1 : prev.totalWins,
        totalLosses: evaluation.type === 'lose' ? prev.totalLosses + 1 : prev.totalLosses,
        biggestWin: Math.max(prev.biggestWin, evaluation.amount),
        currentStreak: evaluation.type !== 'lose' ? prev.currentStreak + 1 : 0,
        totalWagered: prev.totalWagered + bet,
        totalWon: prev.totalWon + evaluation.amount,
      }));

      // Identificar símbolos ganadores para resaltarlos
      if (evaluation.type === 'jackpot') {
        setWinningReels([true, true, true]);
      } else if (evaluation.type === 'win') {
        // Determinar exactamente cuáles 2 de 3 coinciden
        const winning = [
          finalSymbols[0] === finalSymbols[1] || finalSymbols[0] === finalSymbols[2],
          finalSymbols[1] === finalSymbols[0] || finalSymbols[1] === finalSymbols[2],
          finalSymbols[2] === finalSymbols[0] || finalSymbols[2] === finalSymbols[1],
        ];
        setWinningReels(winning);
      } else {
        setWinningReels([false, false, false]);
      }

      // Reproducir sonidos y aplicar recompensas
      if (evaluation.type === 'jackpot') {
        if (!muteRef.current) {
          audioManager.playSlotJackpot();
        }
        setShowJackpotOverlay(true);
        setTimeout(() => setShowJackpotOverlay(false), 3000);
        onUpdateCoins(evaluation.amount);
      } else if (evaluation.type === 'win') {
        if (!muteRef.current) {
          audioManager.playSlotWin();
        }
        onUpdateCoins(evaluation.amount);
      } else {
        if (!muteRef.current) {
          audioManager.playSlotLose();
        }
      }

      setIsSpinning(false);
    }, stopDelays[2] + 200);

  }, [bet, isSpinning, reels, getSpinResult, evaluateResult, turboMode]);

  const adjustBet = useCallback((amount: number, maxCoins: number) => {
    const newBet = Math.max(1, Math.min(maxCoins, bet + amount));
    setBet(newBet);
  }, [bet]);

  const setBetPreset = useCallback((amount: number, maxCoins: number) => {
    setBet(Math.min(amount, maxCoins));
  }, []);

  const toggleAutoSpin = useCallback(() => {
    setAutoSpinEnabled(prev => !prev);
  }, []);

  const toggleTurboMode = useCallback(() => {
    setTurboMode(prev => !prev);
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      totalSpins: 0,
      totalWins: 0,
      totalLosses: 0,
      biggestWin: 0,
      currentStreak: 0,
      totalWagered: 0,
      totalWon: 0,
    });
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    muteRef.current = muted;
  }, []);

  return {
    bet,
    setBet,
    adjustBet,
    setBetPreset,
    isSpinning,
    reels,
    result,
    winAmount,
    showJackpotOverlay,
    stats,
    autoSpinEnabled,
    turboMode,
    winningReels,
    toggleAutoSpin,
    toggleTurboMode,
    resetStats,
    spin,
    setMuted,
  };
}
