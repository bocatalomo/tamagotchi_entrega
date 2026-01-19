import { useCallback, useMemo } from 'react';
import { PetState } from '../types';

export const getInitialPetState = (): PetState => ({
  name: '',
  type: 'cat' as const,
  color: 'white' as const,
  hunger: 100,
  happiness: 100,
  energy: 100,
  cleanliness: 100,
  health: 100,
  stage: 'egg' as const,
  level: 1,
  exp: 0,
  isAlive: true,
  isSick: false,
  mood: 'contento' as const,
  dangerLevel: 'normal' as const,
  coins: 50,
  age: 0,
  lastFed: Date.now(),
  lastPlayed: Date.now(),
  lastCleaned: Date.now(),
  birthDate: Date.now(),
  lastUpdate: Date.now(),
  criticalHungerStart: null,
  criticalHealthStart: null,
  criticalComboStart: null,
  isSleeping: false,
  sleepStartTime: null,
  sleepStartEnergy: null
});

export const usePetUtils = (pet: PetState) => {
  const showMessage = useCallback((msg: string, setMessage: (msg: string) => void) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 8000);
  }, []);

  const getStatColor = useCallback((value: number): string => {
    if (value > 70) return '#4ecca3';
    if (value > 40) return '#ffd93d';
    return '#ff6b6b';
  }, []);

  const getPetState = useCallback((): string => {
    if (!pet.isAlive) return 'dead';
    if (pet.mood === 'enfermo') return 'sick';
    if (pet.mood === 'cansado') return 'tired';
    if (pet.mood === 'triste') return 'sad';
    return 'happy';
  }, [pet.isAlive, pet.mood]);

  const loadOfflineProgress = useCallback((
    loadedPet: any, 
    initialPetState: PetState
  ): PetState => {
    const timeElapsed = Date.now() - (loadedPet.lastUpdate || Date.now());
    const minutesElapsed = timeElapsed / (1000 * 60);

    loadedPet.dangerLevel = loadedPet.dangerLevel || 'normal';
    loadedPet.lastUpdate = loadedPet.lastUpdate || Date.now();
    loadedPet.criticalHungerStart = loadedPet.criticalHungerStart || null;
    loadedPet.criticalHealthStart = loadedPet.criticalHealthStart || null;
    loadedPet.criticalComboStart = loadedPet.criticalComboStart || null;
    loadedPet.isSleeping = loadedPet.isSleeping || false;
    loadedPet.sleepStartTime = loadedPet.sleepStartTime || null;
    loadedPet.sleepStartEnergy = loadedPet.sleepStartEnergy || null;
    loadedPet.birthDate = loadedPet.birthDate || Date.now();

    loadedPet.age = Math.floor((Date.now() - loadedPet.birthDate) / (1000 * 60 * 60 * 24));

    if (!loadedPet.isSleeping && loadedPet.stage !== 'egg' && loadedPet.isAlive) {
      const decayRate = minutesElapsed / 0.5;

      loadedPet.hunger = Math.max(0, loadedPet.hunger - (2 * decayRate));
      loadedPet.happiness = Math.max(0, loadedPet.happiness - (1.5 * decayRate));
      loadedPet.energy = Math.max(0, loadedPet.energy - (1 * decayRate));
      loadedPet.cleanliness = Math.max(0, loadedPet.cleanliness - (0.8 * decayRate));

      if (loadedPet.cleanliness < 20) {
        const healthDecay = loadedPet.hunger < 30 ? (3 * decayRate) : (1.5 * decayRate);
        loadedPet.health = Math.max(0, loadedPet.health - healthDecay);
      } else if (loadedPet.cleanliness > 50 && loadedPet.health < 100) {
        loadedPet.health = Math.min(100, loadedPet.health + (0.5 * decayRate));
      }

      if (loadedPet.hunger === 0) {
        loadedPet.health = Math.max(0, loadedPet.health - (2 * decayRate));
        if (!loadedPet.criticalHungerStart) {
          loadedPet.criticalHungerStart = loadedPet.lastUpdate || Date.now();
        }
      } else {
        loadedPet.criticalHungerStart = null;
      }
    }

    loadedPet.lastUpdate = Date.now();
    return loadedPet;
  }, []);

  return {
    showMessage,
    getStatColor,
    getPetState,
    loadOfflineProgress
  };
};