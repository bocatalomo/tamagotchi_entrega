import { useCallback, useMemo } from 'react';
import { PetState } from '../types';
import { PET_CONSTANTS } from '../constants/petConstants';

const { THRESHOLDS, DANGER_LEVELS, MOODS } = PET_CONSTANTS;

export interface PetStatus {
  mood: PetState['mood'];
  dangerLevel: PetState['dangerLevel'];
  isSick: boolean;
  isCritical: boolean;
  isWarning: boolean;
}

export const calculateMoodAndDanger = (
  hunger: number,
  health: number,
  happiness: number,
  energy: number,
  cleanliness: number,
  isAlive: boolean
): PetStatus => {
  if (!isAlive) {
    return {
      mood: MOODS.AGONIZANDO,
      dangerLevel: DANGER_LEVELS.AGONIZANTE,
      isSick: true,
      isCritical: true,
      isWarning: false,
    };
  }

  let mood: PetState['mood'] = MOODS.CONTENTO;
  let dangerLevel: PetState['dangerLevel'] = DANGER_LEVELS.NORMAL;
  let isSick = false;

  if (hunger === 0 || health === 0) {
    return {
      mood: MOODS.AGONIZANDO,
      dangerLevel: DANGER_LEVELS.AGONIZANTE,
      isSick: true,
      isCritical: true,
      isWarning: true,
    };
  }

  if (hunger < THRESHOLDS.HUNGER.CRITICAL || health < THRESHOLDS.HEALTH.CRITICAL) {
    mood = MOODS.ENFERMO;
    dangerLevel = DANGER_LEVELS.CRITICO;
    isSick = true;
  } else if (hunger < THRESHOLDS.HUNGER.ALERTA || health < THRESHOLDS.HEALTH.ALERTA) {
    dangerLevel = DANGER_LEVELS.ALERTA;
  }

  if (!isSick && (health < 30 || cleanliness < THRESHOLDS.CLEANLINESS.LOW)) {
    mood = MOODS.ENFERMO;
    isSick = true;
  }

  if (!isSick && happiness > THRESHOLDS.HAPPINESS.HIGH && energy > THRESHOLDS.ENERGY.HIGH && hunger > THRESHOLDS.HUNGER.ALERTA) {
    mood = MOODS.JUGUETON;
  }

  if (!isSick) {
    const lowStats = [
      { value: hunger, mood: MOODS.HAMBRIENTO, threshold: THRESHOLDS.HUNGER.ALERTA },
      { value: energy, mood: MOODS.CANSADO, threshold: THRESHOLDS.ENERGY.LOW },
      { value: happiness, mood: MOODS.TRISTE, threshold: THRESHOLDS.HAPPINESS.LOW },
    ].filter(stat => stat.value < stat.threshold);

    if (lowStats.length > 0 && dangerLevel === DANGER_LEVELS.NORMAL) {
      const lowest = lowStats.reduce((prev, curr) => curr.value < prev.value ? curr : prev);
      mood = lowest.mood;
    }
  }

  const isCritical = dangerLevel !== DANGER_LEVELS.NORMAL && dangerLevel !== DANGER_LEVELS.ALERTA;
  const isWarning = dangerLevel === DANGER_LEVELS.ALERTA || isCritical;

  return { mood, dangerLevel, isSick, isCritical, isWarning };
};

export const usePetStatus = (pet: PetState) => {
  const status = useMemo(
    () => calculateMoodAndDanger(
      pet.hunger,
      pet.health,
      pet.happiness,
      pet.energy,
      pet.cleanliness,
      pet.isAlive
    ),
    [pet.hunger, pet.health, pet.happiness, pet.energy, pet.cleanliness, pet.isAlive]
  );

  const isActionBlocked = useCallback(() => {
    if (!pet.isAlive) return { blocked: true, reason: 'dead' };
    if (pet.isSleeping) return { blocked: true, reason: 'sleeping' };
    if (pet.energy < 30) return { blocked: true, reason: 'low_energy' };
    return { blocked: false, reason: null };
  }, [pet.isAlive, pet.isSleeping, pet.energy]);

  const getStatusColor = useCallback(() => {
    if (status.isCritical) return '#FF5252';
    if (status.isWarning) return '#FFC107';
    return '#00E676';
  }, [status.isCritical, status.isWarning]);

  return {
    ...status,
    isActionBlocked,
    getStatusColor,
  };
};

export default usePetStatus;
