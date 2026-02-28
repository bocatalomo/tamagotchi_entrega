/**
 * Calculador de Decay Offline
 * 
 * Calcula el deterioro acumulado de un tamagotchi cuando la app estuvo cerrada.
 * Simula el paso del tiempo como si la app hubiera estado abierta.
 */

import { PetState } from '../types';
import { PET_CONSTANTS } from '../constants/petConstants';

const {
  DECAY,
  THRESHOLDS,
  TIME_TO_DEATH,
} = PET_CONSTANTS;

export interface OfflineDecayResult {
  pet: PetState;
  died: boolean;
  deathReason?: 'starvation' | 'health' | 'combo';
}

/**
 * Calcula el decay acumulado basado en el tiempo transcurrido offline
 * @param pet Estado del pet al momento de cerrar la app
 * @param timeElapsedMs Tiempo transcurrido en milisegundos
 * @returns Estado actualizado del pet con el decay aplicado
 */
export function calculateOfflineDecay(
  pet: PetState,
  timeElapsedMs: number
): OfflineDecayResult {
  // Si está en huevo, durmiendo, o muerto, no aplicar decay
  if (pet.stage === 'egg' || pet.isSleeping || !pet.isAlive) {
    return {
      pet: { ...pet, lastUpdate: Date.now() },
      died: false,
    };
  }

  // Calcular cuántos ciclos de decay ocurrieron (cada 30 segundos)
  const decayCycles = timeElapsedMs / DECAY.INTERVAL_MS;
  
  // Aplicar decay acumulado a cada stat
  let newHunger = Math.max(0, pet.hunger - (DECAY.HUNGER_DECAY * decayCycles));
  let newHappiness = Math.max(0, pet.happiness - (DECAY.HAPPINESS_DECAY * decayCycles));
  let newEnergy = Math.max(0, pet.energy - (DECAY.ENERGY_DECAY * decayCycles));
  let newCleanliness = Math.max(0, pet.cleanliness - (DECAY.CLEANLINESS_DECAY * decayCycles));
  let newHealth = pet.health;

  // Calcular decay de salud basado en limpieza y hambre
  if (newCleanliness < THRESHOLDS.CLEANLINESS.LOW) {
    const healthDecay = newHunger < THRESHOLDS.HUNGER.ALERTA 
      ? DECAY.HEALTH_DECAY_FROM_HUNGRY 
      : DECAY.HEALTH_DECAY_FROM_DIRTY;
    newHealth = Math.max(0, newHealth - (healthDecay * decayCycles));
  } else if (newCleanliness > 50 && newHealth < 100) {
    // Recuperación pasiva de salud si está limpio
    newHealth = Math.min(100, newHealth + (0.5 * decayCycles));
  }

  // Decay adicional de salud si hunger está en 0
  if (newHunger === 0) {
    newHealth = Math.max(0, newHealth - (2 * decayCycles));
  }

  // Calcular timestamps críticos
  const now = Date.now();
  let newCriticalHungerStart = pet.criticalHungerStart;
  let newCriticalHealthStart = pet.criticalHealthStart;
  let newCriticalComboStart = pet.criticalComboStart;

  // Hambre crítica
  if (newHunger === 0) {
    if (!newCriticalHungerStart) {
      // Estimar cuándo llegó a 0
      const timeToZero = (pet.hunger / DECAY.HUNGER_DECAY) * DECAY.INTERVAL_MS;
      newCriticalHungerStart = pet.lastUpdate + timeToZero;
    }
  } else {
    newCriticalHungerStart = null;
  }

  // Salud crítica
  if (newHealth === 0) {
    if (!newCriticalHealthStart) {
      newCriticalHealthStart = now;
    }
  } else {
    newCriticalHealthStart = null;
  }

  // Combo crítico (ambos bajos)
  if (newHunger < THRESHOLDS.HUNGER.CRITICAL && newHealth < THRESHOLDS.HEALTH.CRITICAL) {
    if (!newCriticalComboStart) {
      newCriticalComboStart = now;
    }
  } else {
    newCriticalComboStart = null;
  }

  // Verificar si debe morir
  let isAlive = true;
  let deathReason: 'starvation' | 'health' | 'combo' | undefined;

  if (newCriticalHungerStart && (now - newCriticalHungerStart) >= TIME_TO_DEATH.STARVATION) {
    isAlive = false;
    deathReason = 'starvation';
  }
  
  if (newCriticalHealthStart && (now - newCriticalHealthStart) >= TIME_TO_DEATH.CRITICAL_HEALTH) {
    isAlive = false;
    deathReason = 'health';
  }
  
  if (newCriticalComboStart && (now - newCriticalComboStart) >= TIME_TO_DEATH.COMBO_CRITICAL) {
    isAlive = false;
    deathReason = 'combo';
  }

  // Calcular danger level
  let dangerLevel: PetState['dangerLevel'] = 'normal';
  if (newHunger === 0 || newHealth === 0) {
    dangerLevel = 'agonizante';
  } else if (newHunger < THRESHOLDS.HUNGER.CRITICAL || newHealth < THRESHOLDS.HEALTH.CRITICAL) {
    dangerLevel = 'critico';
  } else if (newHunger < THRESHOLDS.HUNGER.ALERTA || newHealth < THRESHOLDS.HEALTH.ALERTA) {
    dangerLevel = 'alerta';
  }

  // Calcular mood
  let mood: PetState['mood'] = 'contento';
  let isSick = false;

  if (!isAlive || dangerLevel === 'agonizante') {
    mood = 'agonizando';
    isSick = true;
  } else if (dangerLevel === 'critico') {
    mood = 'enfermo';
    isSick = true;
  } else if (newHealth < THRESHOLDS.HEALTH.ALERTA || newCleanliness < THRESHOLDS.CLEANLINESS.LOW) {
    mood = 'enfermo';
    isSick = true;
  } else if (
    newHappiness > THRESHOLDS.HAPPINESS.HIGH && 
    newEnergy > THRESHOLDS.ENERGY.HIGH && 
    newHunger > THRESHOLDS.HUNGER.ALERTA
  ) {
    mood = 'juguetón';
  } else {
    // Determinar mood por el stat más bajo
    const stats = [
      { value: newHunger, mood: 'hambriento' as const, threshold: THRESHOLDS.HUNGER.ALERTA },
      { value: newEnergy, mood: 'cansado' as const, threshold: THRESHOLDS.ENERGY.LOW },
      { value: newHappiness, mood: 'triste' as const, threshold: THRESHOLDS.HAPPINESS.LOW },
    ];
    
    const lowStats = stats.filter(stat => stat.value < stat.threshold);
    if (lowStats.length > 0) {
      const lowest = lowStats.reduce((prev, curr) => 
        curr.value < prev.value ? curr : prev
      );
      mood = lowest.mood;
    }
  }

  // Calcular edad en días
  const age = Math.floor((now - pet.birthDate) / (1000 * 60 * 60 * 24));

  // Retornar estado actualizado
  const updatedPet: PetState = {
    ...pet,
    hunger: newHunger,
    happiness: newHappiness,
    energy: newEnergy,
    cleanliness: newCleanliness,
    health: newHealth,
    isAlive,
    isSick,
    mood,
    dangerLevel,
    age,
    criticalHungerStart: newCriticalHungerStart,
    criticalHealthStart: newCriticalHealthStart,
    criticalComboStart: newCriticalComboStart,
    lastUpdate: now,
  };

  return {
    pet: updatedPet,
    died: !isAlive,
    deathReason,
  };
}

/**
 * Versión simplificada que solo calcula si el pet debería estar muerto
 * Útil para verificaciones rápidas sin modificar el estado completo
 */
export function wouldPetDie(pet: PetState, timeElapsedMs: number): boolean {
  if (pet.stage === 'egg' || pet.isSleeping || !pet.isAlive) {
    return false;
  }

  const result = calculateOfflineDecay(pet, timeElapsedMs);
  return result.died;
}

export default calculateOfflineDecay;
