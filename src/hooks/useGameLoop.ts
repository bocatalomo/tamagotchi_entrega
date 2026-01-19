import { useState, useEffect, useCallback } from 'react';
import { PetState, Inventory } from '../types';

export const useGameLoop = (pet: PetState, setPet: (pet: PetState) => void) => {
  // Sistema de deterioro
  useEffect(() => {
    if (!pet.isAlive || pet.stage === 'egg' || pet.isSleeping) return;

    const decayInterval = setInterval(() => {
      setPet(prev => {
        if (prev.isSleeping) return { ...prev, lastUpdate: Date.now() };

        const newHunger = Math.max(0, prev.hunger - 2);
        const newHappiness = Math.max(0, prev.happiness - 1.5);
        const newEnergy = Math.max(0, prev.energy - 1);
        const newCleanliness = Math.max(0, prev.cleanliness - 0.8);

        let newHealth = prev.health;

        if (newCleanliness < 20) {
          const healthDecay = newHunger < 30 ? 3 : 1.5;
          newHealth = Math.max(0, newHealth - healthDecay);
        } else if (newCleanliness > 50 && newHealth < 100) {
          newHealth = Math.min(100, newHealth + 0.5);
        }

        if (newHunger === 0) {
          newHealth = Math.max(0, newHealth - 2);
        }

        // Lógica de supervivencia
        const now = Date.now();
        let newCriticalHungerStart = prev.criticalHungerStart;
        let newCriticalHealthStart = prev.criticalHealthStart;
        let newCriticalComboStart = prev.criticalComboStart;
        let isAlive = true;

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

        // Verificar muerte
        if (newCriticalHungerStart && (now - newCriticalHungerStart) >= 7200000) {
          isAlive = false;
        }
        if (newCriticalHealthStart && (now - newCriticalHealthStart) >= 1800000) {
          isAlive = false;
        }
        if (newCriticalComboStart && (now - newCriticalComboStart) >= 1800000) {
          isAlive = false;
        }

        // Determinar mood y danger level
        let dangerLevel = 'normal';
        if (newHunger === 0 || newHealth === 0) {
          dangerLevel = 'agonizante';
        } else if (newHunger < 10 || newHealth < 10) {
          dangerLevel = 'critico';
        } else if (newHunger < 30 || newHealth < 30) {
          dangerLevel = 'alerta';
        }

        let mood = 'contento';
        let isSick = false;

        if (dangerLevel === 'agonizante') {
          mood = 'agonizando';
          isSick = true;
        } else if (dangerLevel === 'critico') {
          mood = 'enfermo';
          isSick = true;
        } else if (newHealth < 30 || newCleanliness < 20) {
          mood = 'enfermo';
          isSick = true;
        } else if (newHappiness > 80 && newEnergy > 70 && newHunger > 70) {
          mood = 'juguetón';
        } else {
          const stats = [
            { value: newHunger, mood: 'hambriento', threshold: 30 },
            { value: newEnergy, mood: 'cansado', threshold: 30 },
            { value: newHappiness, mood: 'triste', threshold: 40 }
          ];

          const lowStats = stats.filter(stat => stat.value < stat.threshold);
          if (lowStats.length > 0) {
            const lowestStat = lowStats.reduce((prev, current) =>
              current.value < prev.value ? current : prev
            );
            mood = lowestStat.mood;
          }
        }

        return {
          ...prev,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          cleanliness: newCleanliness,
          health: newHealth,
          isSick,
          mood,
          isAlive,
          dangerLevel,
          criticalHungerStart: newCriticalHungerStart,
          criticalHealthStart: newCriticalHealthStart,
          criticalComboStart: newCriticalComboStart,
          lastUpdate: Date.now()
        };
      });
    }, 30000);

    return () => clearInterval(decayInterval);
  }, [pet.isAlive, pet.stage, pet.isSleeping, setPet]);

  // Sistema de edad
  useEffect(() => {
    if (!pet.isAlive) return;

    const ageInterval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        age: Math.floor((Date.now() - prev.birthDate) / (1000 * 60 * 60 * 24))
      }));
    }, 3600000);

    return () => clearInterval(ageInterval);
  }, [pet.isAlive, setPet]);

  // Sistema de evolución
  useEffect(() => {
    if (pet.stage === 'egg') return;

    if (pet.level >= 5 && pet.stage === 'baby') {
      setPet(prev => ({ ...prev, stage: 'teen' }));
    } else if (pet.level >= 10 && pet.stage === 'teen') {
      setPet(prev => ({ ...prev, stage: 'adult' }));
    }
  }, [pet.level, pet.stage, setPet]);

  // Sistema de nivel
  useEffect(() => {
    const expNeeded = pet.level * 100;
    if (pet.exp >= expNeeded) {
      setPet(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: prev.exp - expNeeded,
        coins: prev.coins + 10
      }));
    }
  }, [pet.exp, pet.level, setPet]);
};