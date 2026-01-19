import { useState, useEffect, useCallback, useMemo } from 'react';
import { PetState, Inventory, Poop } from '../types';

export const usePetState = (initialPetState: PetState) => {
  const [pet, setPet] = useState<PetState>(initialPetState);

  // Funciones básicas de manipulación del estado
  const updatePet = useCallback((updates: Partial<PetState>) => {
    setPet(prev => ({ ...prev, ...updates }));
  }, []);

  const feedPet = useCallback((amount: number = 35) => {
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + amount),
      happiness: Math.min(100, prev.happiness + 10),
      exp: prev.exp + 10,
      lastFed: Date.now()
    }));
  }, []);

  const playWithPet = useCallback(() => {
    setPet(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 20),
      happiness: Math.min(100, prev.happiness + 15),
      exp: prev.exp + 5
    }));
  }, []);

  const cleanPet = useCallback(() => {
    setPet(prev => ({
      ...prev,
      cleanliness: 100,
      happiness: Math.min(100, prev.happiness + 15),
      exp: prev.exp + 8,
      lastCleaned: Date.now()
    }));
  }, []);

  const healPet = useCallback(() => {
    setPet(prev => {
      const newHealth = Math.min(100, prev.health + 40);
      const newCleanliness = Math.min(100, prev.cleanliness + 30);
      const stillSick = newHealth < 50 || newCleanliness < 30;

      return {
        ...prev,
        health: newHealth,
        cleanliness: newCleanliness,
        isSick: stillSick,
        mood: stillSick ? 'enfermo' : 'contento',
        exp: prev.exp + 20
      };
    });
  }, []);

  return {
    pet,
    setPet,
    updatePet,
    feedPet,
    playWithPet,
    cleanPet,
    healPet
  };
};