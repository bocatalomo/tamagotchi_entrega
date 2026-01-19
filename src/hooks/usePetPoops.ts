import { useState, useCallback, useRef } from 'react';
import { Poop } from '../types';

export const usePetPoops = () => {
  const [poops, setPoops] = useState<Poop[]>([]);
  const previousCleanlinessRef = useRef(100);

  const generatePoop = useCallback(() => {
    const position = Math.random();
    let x: number, y: number;

    if (position < 0.33) {
      // Izquierda
      x = Math.random() * 20 + 8;
      y = Math.random() * 30 + 35;
    } else if (position < 0.66) {
      // Derecha
      x = Math.random() * 20 + 65;
      y = Math.random() * 30 + 35;
    } else {
      // Abajo
      x = Math.random() * 50 + 25;
      y = Math.random() * 15 + 60;
    }

    const newPoop: Poop = {
      id: Date.now() + Math.random(),
      x,
      y
    };

    setPoops(prev => [...prev, newPoop]);
  }, []);

  const cleanPoop = useCallback((poopId: number, setPet: any) => {
    setPoops(prev => prev.filter(p => p.id !== poopId));
    setPet(prev => ({ ...prev, coins: prev.coins + 1 }));
  }, []);

  const checkAndGeneratePoop = useCallback((
    currentCleanliness: number, 
    isAlive: boolean, 
    stage: string
  ) => {
    if (!isAlive || stage === 'egg') return;

    const cleanlinessDropThreshold = 15;
    const previousCleanliness = previousCleanlinessRef.current;

    if (previousCleanliness - currentCleanliness >= cleanlinessDropThreshold) {
      generatePoop();
      previousCleanlinessRef.current = currentCleanliness;
    }

    if (currentCleanliness > previousCleanliness) {
      previousCleanlinessRef.current = currentCleanliness;
      setPoops([]); // Limpiar todas las cacas cuando limpian
    }
  }, [generatePoop]);

  return {
    poops,
    cleanPoop,
    checkAndGeneratePoop
  };
};