/**
 * Reducer Centralizado del Tamagotchi
 * State Machine explícita con validaciones de transiciones.
 */

import { PET_CONSTANTS, PetStage, PetMood, VitalStatus, DangerLevel, StateFlag } from '../constants/petConstants';
import { PetState, Inventory } from '../types';

export interface PetEvent {
  type: PetEventType;
  payload?: Record<string, unknown>;
}

export type PetEventType =
  | 'TICK'
  | 'FEED'
  | 'SLEEP'
  | 'WAKE'
  | 'CLEAN'
  | 'HEAL'
  | 'GIVE_TREAT'
  | 'PLAY'
  | 'HATCH'
  | 'EVOLVE'
  | 'LEVEL_UP'
  | 'POOP'
  | 'DIE'
  | 'RESET'
  | 'UPDATE_FROM_FIRESTORE';

export interface ReducedPetState {
  pet: PetState;
  inventory: Inventory;
  animation: string;
  notification: { message: string; type: 'info' | 'success' | 'warning' | 'danger' } | null;
}

const { STAGES, MOODS, VITAL_STATUS, DANGER_LEVELS, STATE_FLAGS, THRESHOLDS, DECAY, TIME_TO_DEATH, ACTIONS, SLEEP, AGE, PROGRESSION } = PET_CONSTANTS;

function calculateMoodAndDanger(stats: {
  hunger: number;
  health: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  isAlive: boolean;
}): { mood: PetMood; dangerLevel: DangerLevel; isSick: boolean } {
  const { hunger, health, happiness, energy, cleanliness, isAlive } = stats;

  if (!isAlive) {
    return { mood: MOODS.AGONIZANDO, dangerLevel: DANGER_LEVELS.AGONIZANTE, isSick: true };
  }

  let mood: PetMood = MOODS.CONTENTO;
  let dangerLevel: DangerLevel = DANGER_LEVELS.NORMAL;
  let isSick = false;

  // Prioridad 1: Estado agonizante/crítico
  if (hunger === 0 || health === 0) {
    return { mood: MOODS.AGONIZANDO, dangerLevel: DANGER_LEVELS.AGONIZANTE, isSick: true };
  }

  if (hunger < THRESHOLDS.HUNGER.CRITICAL || health < THRESHOLDS.HEALTH.CRITICAL) {
    mood = MOODS.ENFERMO;
    dangerLevel = DANGER_LEVELS.CRITICO;
    isSick = true;
  } else if (hunger < THRESHOLDS.HUNGER.ALERTA || health < THRESHOLDS.HEALTH.ALERTA) {
    dangerLevel = DANGER_LEVELS.ALERTA;
  }

    // Prioridad 2: Enfermo por limpieza
    if (!isSick && (health < 30 || cleanliness < THRESHOLDS.CLEANLINESS.LOW)) {
    mood = MOODS.ENFERMO;
    isSick = true;
  }

  // Prioridad 3: Juguetón (todos los stats altos)
  if (!isSick && happiness > THRESHOLDS.HAPPINESS.HIGH && energy > THRESHOLDS.ENERGY.HIGH && hunger > THRESHOLDS.HUNGER.ALERTA) {
    mood = MOODS.JUGUETON;
  }

  // Prioridad 4: Stats bajos determinan humor negativo
  if (!isSick && dangerLevel === DANGER_LEVELS.NORMAL) {
    const lowStats = [
      { value: hunger, mood: MOODS.HAMBRIENTO, threshold: THRESHOLDS.HUNGER.ALERTA },
      { value: energy, mood: MOODS.CANSADO, threshold: THRESHOLDS.ENERGY.LOW },
      { value: happiness, mood: MOODS.TRISTE, threshold: THRESHOLDS.HAPPINESS.LOW },
    ].filter(stat => stat.value < stat.threshold);

    if (lowStats.length > 0) {
      const lowest = lowStats.reduce((prev, curr) => curr.value < prev.value ? curr : prev);
      mood = lowest.mood;
    }
  }

  return { mood, dangerLevel, isSick };
}

export function createInitialPetState(overrides?: Partial<PetState>): PetState {
  const now = Date.now();
  return {
    name: '',
    type: 'cat',
    color: 'white',
    hunger: PROGRESSION.INITIAL_COINS,
    happiness: 100,
    energy: 100,
    cleanliness: 100,
    health: 100,
    stage: STAGES.EGG,
    level: 1,
    exp: 0,
    isAlive: true,
    isSick: false,
    mood: MOODS.CONTENTO,
    dangerLevel: DANGER_LEVELS.NORMAL,
    coins: PROGRESSION.INITIAL_COINS,
    age: 0,
    lastFed: now,
    lastPlayed: now,
    lastCleaned: now,
    birthDate: now,
    lastUpdate: now,
    criticalHungerStart: null,
    criticalHealthStart: null,
    criticalComboStart: null,
    isSleeping: false,
    sleepStartTime: null,
    sleepStartEnergy: null,
    ...overrides,
  };
}

export function createInitialInventory(): Inventory {
  return {
    food: PROGRESSION.INITIAL_FOOD,
    medicine: PROGRESSION.INITIAL_MEDICINE,
    treats: PROGRESSION.INITIAL_TREATS,
    soap: PROGRESSION.INITIAL_SOAP,
  };
}

export function petReducer(state: ReducedPetState, event: PetEvent): ReducedPetState {
  const { pet, inventory } = state;

  switch (event.type) {
    // ============================================
    // TICK: Deterioro natural del tiempo
    // ============================================
    case 'TICK': {
      if (!pet.isAlive) return state;

      let newHunger = Math.max(0, pet.hunger - DECAY.HUNGER_DECAY);
      let newHappiness = Math.max(0, pet.happiness - DECAY.HAPPINESS_DECAY);
      let newEnergy = Math.max(0, pet.energy - DECAY.ENERGY_DECAY);
      let newCleanliness = Math.max(0, pet.cleanliness - DECAY.CLEANLINESS_DECAY);
      let newHealth = pet.health;
      let newIsSleeping = pet.isSleeping;
      let newSleepStartTime = pet.criticalHungerStart;
      let newCriticalHealthStart = pet.criticalHealthStart;
      let newCriticalComboStart = pet.criticalComboStart;
      let shouldDie = false;
      let deathReason = '';

      // Si está durmiendo, recuperar energía
      if (newIsSleeping) {
        const sleepProgress = (Date.now() - (pet.sleepStartTime || Date.now())) / SLEEP.DURATION_MS;
        const energyToRecover = SLEEP.ENERGY_RECOVERY_RATE * (sleepProgress + 0.1);
        newEnergy = Math.min(100, newEnergy + energyToRecover);

        if (newEnergy >= 100 || sleepProgress >= 1) {
          newIsSleeping = false;
          newEnergy = 100;
          newSleepStartTime = null;
        }
      }

      // Cálculo de salud basado en limpieza
      if (newCleanliness < THRESHOLDS.CLEANLINESS.LOW) {
        const healthDecay = newHunger < THRESHOLDS.HUNGER.ALERTA ? DECAY.HEALTH_DECAY_FROM_HUNGRY : DECAY.HEALTH_DECAY_FROM_DIRTY;
        newHealth = Math.max(0, newHealth - healthDecay);
      } else if (newCleanliness > 50 && newHealth < 100) {
        newHealth = Math.min(100, newHealth + 0.5);
      }

      // Muerte por hambre (0)
      if (newHunger === 0) {
        newHealth = Math.max(0, newHealth - 2);
        if (pet.criticalHungerStart === null) {
          newSleepStartTime = Date.now();
        }
        const timeInCritical = Date.now() - (pet.criticalHungerStart || Date.now());
        if (timeInCritical > TIME_TO_DEATH.STARVATION) {
          shouldDie = true;
          deathReason = 'starvation';
        }
      } else {
        newSleepStartTime = null;
      }

      // Muerte por salud crítica
      if (newHealth === 0) {
        if (pet.criticalHealthStart === null) {
          newCriticalHealthStart = Date.now();
        }
        const timeInCritical = Date.now() - (pet.criticalHealthStart || Date.now());
        if (timeInCritical > TIME_TO_DEATH.CRITICAL_HEALTH) {
          shouldDie = true;
          deathReason = 'health';
        }
      } else {
        newCriticalHealthStart = null;
      }

      // Combo crítico
      if (newHunger < THRESHOLDS.HUNGER.CRITICAL && newHealth < THRESHOLDS.HEALTH.CRITICAL) {
        if (pet.criticalComboStart === null) {
          newCriticalComboStart = Date.now();
        }
        const timeInCritical = Date.now() - (pet.criticalComboStart || Date.now());
        if (timeInCritical > TIME_TO_DEATH.COMBO_CRITICAL) {
          shouldDie = true;
          deathReason = 'combo';
        }
      } else {
        newCriticalComboStart = null;
      }

      // Calcular mood y danger level
      const { mood, dangerLevel, isSick } = calculateMoodAndDanger({
        hunger: newHunger,
        health: newHealth,
        happiness: newHappiness,
        energy: newEnergy,
        cleanliness: newCleanliness,
        isAlive: !shouldDie,
      });

      if (shouldDie) {
        return {
          ...state,
          pet: {
            ...pet,
            hunger: newHunger,
            happiness: newHappiness,
            energy: newEnergy,
            cleanliness: newCleanliness,
            health: 0,
            isAlive: false,
            isSick: false,
            mood: MOODS.AGONIZANDO,
            dangerLevel: DANGER_LEVELS.AGONIZANTE,
            criticalHungerStart: null,
            criticalHealthStart: null,
            criticalComboStart: null,
            isSleeping: false,
            sleepStartTime: null,
            lastUpdate: Date.now(),
          },
          animation: 'sick',
          notification: { message: `Tu tamagotchi ha muerto (${deathReason})`, type: 'danger' },
        };
      }

      return {
        ...state,
        pet: {
          ...pet,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          cleanliness: newCleanliness,
          health: newHealth,
          isSick,
          mood,
          dangerLevel,
          criticalHungerStart: newSleepStartTime,
          criticalHealthStart: newCriticalHealthStart,
          criticalComboStart: newCriticalComboStart,
          isSleeping: newIsSleeping,
          sleepStartTime: newSleepStartTime,
          lastUpdate: Date.now(),
        },
        animation: pet.isSleeping ? 'sleeping' : '',
      };
    }

    // ============================================
    // FEED: Alimentar
    // ============================================
    case 'FEED': {
      if (!pet.isAlive || pet.isSleeping) return state;

      const newHunger = Math.min(100, pet.hunger + ACTIONS.FEED.HUNGER_RECOVERY);
      const newHappiness = Math.min(100, pet.happiness + ACTIONS.FEED.HAPPINESS_RECOVERY);
      const newCleanliness = ACTIONS.FEED.CLEANLINESS_PENALTY_CHANCE && Math.random() > 0.5
        ? Math.max(0, pet.cleanliness - ACTIONS.FEED.CLEANLINESS_PENALTY)
        : pet.cleanliness;

      return {
        ...state,
        pet: {
          ...pet,
          hunger: newHunger,
          happiness: newHappiness,
          cleanliness: newCleanliness,
          exp: pet.exp + ACTIONS.FEED.EXP_GAIN,
          lastFed: Date.now(),
          lastUpdate: Date.now(),
        },
        animation: 'eating',
        notification: { message: '¡Ñam ñam!', type: 'success' },
      };
    }

    // ============================================
    // SLEEP: Dormir
    // ============================================
    case 'SLEEP': {
      if (!pet.isAlive || pet.isSleeping || pet.energy >= 100) return state;

      return {
        ...state,
        pet: {
          ...pet,
          isSleeping: true,
          sleepStartTime: Date.now(),
          sleepStartEnergy: pet.energy,
          lastUpdate: Date.now(),
        },
        animation: 'sleeping',
        notification: null,
      };
    }

    // ============================================
    // WAKE: Despertar
    // ============================================
    case 'WAKE': {
      if (!pet.isAlive || !pet.isSleeping) return state;

      return {
        ...state,
        pet: {
          ...pet,
          isSleeping: false,
          energy: 100,
          happiness: Math.min(100, pet.happiness + ACTIONS.SLEEP.HAPPINESS_RECOVERY),
          sleepStartTime: null,
          sleepStartEnergy: null,
          lastUpdate: Date.now(),
        },
        animation: '',
        notification: { message: '¡Buenos días!', type: 'info' },
      };
    }

    // ============================================
    // CLEAN: Limpiar
    // ============================================
    case 'CLEAN': {
      if (!pet.isAlive || inventory.soap <= 0) return state;

      return {
        ...state,
        inventory: { ...inventory, soap: inventory.soap - 1 },
        pet: {
          ...pet,
          cleanliness: 100,
          happiness: Math.min(100, pet.happiness + ACTIONS.CLEAN.HAPPINESS_RECOVERY),
          exp: pet.exp + ACTIONS.CLEAN.EXP_GAIN,
          lastCleaned: Date.now(),
          lastUpdate: Date.now(),
        },
        animation: '',
        notification: { message: '¡Qué limpio! ✨', type: 'success' },
      };
    }

    // ============================================
    // HEAL: Medicar
    // ============================================
    case 'HEAL': {
      if (!pet.isAlive || inventory.medicine <= 0) return state;

      const newCleanliness = Math.min(100, pet.cleanliness + ACTIONS.HEAL.CLEANLINESS_RECOVERY);
      const stillSick = newCleanliness < THRESHOLDS.CLEANLINESS.LOW || pet.hunger < THRESHOLDS.HUNGER.ALERTA;
      const newMood = stillSick ? MOODS.ENFERMO : MOODS.CONTENTO;

      return {
        ...state,
        inventory: { ...inventory, medicine: inventory.medicine - 1 },
        pet: {
          ...pet,
          health: Math.min(100, pet.health + ACTIONS.HEAL.HEALTH_RECOVERY),
          cleanliness: newCleanliness,
          isSick: stillSick,
          mood: newMood,
          exp: pet.exp + ACTIONS.HEAL.EXP_GAIN,
          lastUpdate: Date.now(),
        },
        animation: '',
        notification: { message: '¡Medicina administrada! 💊', type: 'success' },
      };
    }

    // ============================================
    // GIVE_TREAT: Dar golosina
    // ============================================
    case 'GIVE_TREAT': {
      if (!pet.isAlive || inventory.treats <= 0) return state;

      return {
        ...state,
        inventory: { ...inventory, treats: inventory.treats - 1 },
        pet: {
          ...pet,
          happiness: Math.min(100, pet.happiness + ACTIONS.TREAT.HAPPINESS_RECOVERY),
          hunger: Math.min(100, pet.hunger + ACTIONS.TREAT.HUNGER_RECOVERY),
          exp: pet.exp + ACTIONS.TREAT.EXP_GAIN,
          lastUpdate: Date.now(),
        },
        animation: 'happy',
        notification: { message: '¡Yummy! 🍰', type: 'success' },
      };
    }

    // ============================================
    // PLAY: Jugar
    // ============================================
    case 'PLAY': {
      if (!pet.isAlive || pet.energy < ACTIONS.PLAY.MIN_ENERGY_REQUIRED) return state;

      return {
        ...state,
        pet: {
          ...pet,
          energy: Math.max(0, pet.energy - ACTIONS.PLAY.ENERGY_COST),
          happiness: Math.min(100, pet.happiness + ACTIONS.PLAY.HAPPINESS_RECOVERY),
          exp: pet.exp + ACTIONS.PLAY.EXP_GAIN,
          lastPlayed: Date.now(),
          lastUpdate: Date.now(),
        },
        animation: 'playing',
        notification: null,
      };
    }

    // ============================================
    // HATCH: Eclosionar del huevo
    // ============================================
    case 'HATCH': {
      if (pet.stage !== STAGES.EGG) return state;

      return {
        ...state,
        pet: {
          ...pet,
          stage: STAGES.BABY,
          birthDate: Date.now(),
          lastUpdate: Date.now(),
        },
        animation: 'egg-crack',
        notification: { message: '¡Tu tamagotchi ha nacido! 🥚✨', type: 'success' },
      };
    }

    // ============================================
    // EVOLVE: Evolucionar de etapa
    // ============================================
    case 'EVOLVE': {
      const nextStage = event.payload?.stage as PetStage;
      const validTransitions: Record<PetStage, PetStage[]> = {
        [STAGES.EGG]: [STAGES.BABY],
        [STAGES.BABY]: [STAGES.TEEN],
        [STAGES.TEEN]: [STAGES.ADULT],
        [STAGES.ADULT]: [],
      };

      if (!validTransitions[pet.stage].includes(nextStage)) return state;

      return {
        ...state,
        pet: {
          ...pet,
          stage: nextStage,
          lastUpdate: Date.now(),
        },
        animation: 'happy',
        notification: { message: `¡Tu tamagotchi ahora es ${nextStage}! 🎉`, type: 'success' },
      };
    }

    // ============================================
    // LEVEL_UP: Subir de nivel
    // ============================================
    case 'LEVEL_UP': {
      const expNeeded = pet.level * AGE.LEVEL_UP_EXP_MULTIPLIER;
      if (pet.exp < expNeeded) return state;

      return {
        ...state,
        pet: {
          ...pet,
          level: pet.level + 1,
          exp: pet.exp - expNeeded,
          coins: pet.coins + PROGRESSION.COINS_PER_LEVEL,
          lastUpdate: Date.now(),
        },
        animation: 'happy',
        notification: { message: `¡Nivel ${pet.level + 1}! ⬆️`, type: 'success' },
      };
    }

    // ============================================
    // POOP: Defecar
    // ============================================
    case 'POOP': {
      if (!pet.isAlive) return state;

      return {
        ...state,
        pet: {
          ...pet,
          cleanliness: Math.max(0, pet.cleanliness - 15),
          lastUpdate: Date.now(),
        },
        animation: '',
        notification: null,
      };
    }

    // ============================================
    // DIE: Morir
    // ============================================
    case 'DIE': {
      return {
        ...state,
        pet: {
          ...pet,
          isAlive: false,
          health: 0,
          isSick: false,
          mood: MOODS.AGONIZANDO,
          dangerLevel: DANGER_LEVELS.AGONIZANTE,
          isSleeping: false,
          sleepStartTime: null,
          lastUpdate: Date.now(),
        },
        animation: 'sick',
        notification: { message: 'Tu tamagotchi ha muerto 💀', type: 'danger' },
      };
    }

    // ============================================
    // RESET: Reiniciar juego
    // ============================================
    case 'RESET': {
      const newPet = createInitialPetState();
      const newInventory = createInitialInventory();

      return {
        ...state,
        pet: newPet,
        inventory: newInventory,
        animation: 'egg-idle',
        notification: { message: '¡Nuevo tamagotchi nacido! 🥚✨', type: 'success' },
      };
    }

    // ============================================
    // UPDATE_FROM_FIRESTORE: Cargar desde Firestore
    // ============================================
    case 'UPDATE_FROM_FIRESTORE': {
      const loadedPet = event.payload?.pet as PetState;
      const loadedInventory = event.payload?.inventory as Inventory;

      if (!loadedPet) return state;

      const { mood, dangerLevel, isSick } = calculateMoodAndDanger({
        hunger: loadedPet.hunger,
        health: loadedPet.health,
        happiness: loadedPet.happiness,
        energy: loadedPet.energy,
        cleanliness: loadedPet.cleanliness,
        isAlive: loadedPet.isAlive,
      });

      return {
        ...state,
        pet: {
          ...loadedPet,
          mood,
          dangerLevel,
          isSick,
        },
        inventory: loadedInventory || state.inventory,
        animation: loadedPet.isSleeping ? 'sleeping' : '',
        notification: null,
      };
    }

    default:
      return state;
  }
}

export function getAnimationForState(pet: PetState, defaultAnimation: string = 'blink'): string {
  // Prioridad 1: Animaciones de estado especial
  if (pet.isSleeping) return 'sleeping';

  // Prioridad 2: Animación forzada (temporal)
  // Esta se maneja desde fuera del reducer

  // Prioridad 3: Animación por mood
  const moodAnimationMap: Record<PetMood, string> = {
    [MOODS.CONTENTO]: 'happy',
    [MOODS.JUGUETON]: 'happy',
    [MOODS.HAMBRIENTO]: 'jump',
    [MOODS.CANSADO]: 'blink',
    [MOODS.TRISTE]: 'sad',
    [MOODS.ENFERMO]: 'sick',
    [MOODS.AGONIZANDO]: 'sick',
  };

  return moodAnimationMap[pet.mood] || defaultAnimation;
}

export default petReducer;
