import { useEffect, useCallback } from 'react';
import { PetState } from '../types';
import { DECAY, TIME, DEATH_TIMEOUT } from '../constants/gameConstants';

interface UsePetDecayOptions {
  onDeath?: (reason: string) => void;
}

export const usePetDecay = (
  pet: PetState,
  setPet: React.Dispatch<React.SetStateAction<PetState>>,
  options: UsePetDecayOptions = {}
) => {
  const { onDeath } = options;

  const calculateDecay = useCallback((prev: PetState) => {
    if (prev.isSleeping) {
      return {
        ...prev,
        lastUpdate: Date.now() as number,
      };
    }

    const newHunger = Math.max(0, prev.hunger - DECAY.HUNGER);
    const newHappiness = Math.max(0, prev.happiness - DECAY.HAPPINESS);
    const newEnergy = Math.max(0, prev.energy - DECAY.ENERGY);
    const newCleanliness = Math.max(0, prev.cleanliness - DECAY.CLEANLINESS);

    let newHealth = prev.health;

    if (newCleanliness < 20) {
      const healthDecay = newHunger < 30 ? DECAY.HEALTH.LOW_CLEANLINESS_HUNGRY : DECAY.HEALTH.LOW_CLEANLINESS_NORMAL;
      newHealth = Math.max(0, newHealth - healthDecay);
    } else if (newCleanliness > 50 && newHealth < 100) {
      newHealth = Math.min(100, newHealth + 0.5);
    }

    if (newHunger === 0) {
      newHealth = Math.max(0, newHealth - DECAY.HEALTH.ZERO_HUNGER);
    }

    const now = Date.now();
    let newCriticalHungerStart = prev.criticalHungerStart;
    let newCriticalHealthStart = prev.criticalHealthStart;
    let newCriticalComboStart = prev.criticalComboStart;

    if (newHunger === 0 && !newCriticalHungerStart) {
      newCriticalHungerStart = now;
    } else if (newHunger > 0) {
      newCriticalHungerStart = null;
    }

    if (newHealth === 0 && !newCriticalHealthStart) {
      newCriticalHealthStart = now;
    } else if (newHealth > 0) {
      newCriticalHealthStart = null;
    }

    if (newHunger < 10 && newHealth < 10) {
      if (!newCriticalComboStart) {
        newCriticalComboStart = now;
      }
    } else {
      newCriticalComboStart = null;
    }

    let isAlive = true;
    let deathReason = '';

    if (newCriticalHungerStart && (now - newCriticalHungerStart) >= DEATH_TIMEOUT.HUNGER) {
      isAlive = false;
      deathReason = 'starvation';
    }
    if (newCriticalHealthStart && (now - newCriticalHealthStart) >= DEATH_TIMEOUT.HEALTH) {
      isAlive = false;
      deathReason = 'health';
    }
    if (newCriticalComboStart && (now - newCriticalComboStart) >= DEATH_TIMEOUT.COMBO) {
      isAlive = false;
      deathReason = 'combo';
    }

    return {
      ...prev,
      hunger: newHunger,
      happiness: newHappiness,
      energy: newEnergy,
      cleanliness: newCleanliness,
      health: newHealth,
      dangerLevel: isAlive ? prev.dangerLevel : 'agonizante' as const,
      mood: isAlive ? prev.mood : 'agonizando' as const,
      isSick: isAlive ? prev.isSick : false,
      criticalHungerStart: newCriticalHungerStart,
      criticalHealthStart: newCriticalHealthStart,
      criticalComboStart: newCriticalComboStart,
      lastUpdate: now,
    };
  }, []);

  const tick = useCallback(() => {
    setPet(prev => {
      if (!prev.isAlive || prev.stage === 'egg' || prev.isSleeping) {
        return { ...prev, lastUpdate: Date.now() as number };
      }
      return calculateDecay(prev);
    });
  }, [setPet, calculateDecay]);

  useEffect(() => {
    if (!pet.isAlive || pet.stage === 'egg' || pet.isSleeping) return;

    const decayInterval = setInterval(() => {
      setPet(prev => {
        if (!prev.isAlive || prev.stage === 'egg' || prev.isSleeping) {
          return prev;
        }
        const result = calculateDecay(prev);
        if (!result.isAlive && onDeath) {
          const deathReason = prev.criticalHungerStart ? 'starvation' :
                            prev.criticalHealthStart ? 'health' : 'combo';
          onDeath(deathReason);
        }
        return result;
      });
    }, TIME.DECAY_INTERVAL);

    return () => clearInterval(decayInterval);
  }, [pet.isAlive, pet.stage, pet.isSleeping, setPet, calculateDecay, onDeath]);

  return { tick };
};

export default usePetDecay;
