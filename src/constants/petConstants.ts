/**
 * Constantes Centralizadas del Tamagotchi
 * Todas las configuraciones, umbrales y valores mágicos en un solo lugar.
 */

export const PET_CONSTANTS = {
  // ============================================
  // ESTADOS DEL TAMAGOTCHI
  // ============================================
  STAGES: {
    EGG: 'egg',
    BABY: 'baby',
    TEEN: 'teen',
    ADULT: 'adult',
  } as const,

  MOODS: {
    CONTENTO: 'contento',
    JUGUETON: 'juguetón',
    HAMBRIENTO: 'hambriento',
    CANSADO: 'cansado',
    TRISTE: 'triste',
    ENFERMO: 'enfermo',
    AGONIZANDO: 'agonizando',
  } as const,

  VITAL_STATUS: {
    ALIVE: 'alive',
    CRITICAL: 'critical',
    DEAD: 'dead',
  } as const,

  DANGER_LEVELS: {
    NORMAL: 'normal',
    ALERTA: 'alerta',
    CRITICO: 'critico',
    AGONIZANTE: 'agonizante',
  } as const,

  STATE_FLAGS: {
    NORMAL: 'normal',
    SLEEPING: 'sleeping',
    EATING: 'eating',
    PLAYING: 'playing',
    SICK: 'sick',
    POOPING: 'pooping',
  } as const,

  PET_TYPES: {
    CAT: 'cat',
    DOG: 'dog',
  } as const,

  COLORS: {
    WHITE: 'white',
    BLACK: 'black',
    BROWN: 'brown',
  } as const,

  // ============================================
  // ESTADÍSTICAS (RANGOS 0-100)
  // ============================================
  STATS: {
    MAX_VALUE: 100,
    MIN_VALUE: 0,
    INITIAL_VALUE: 100,
  } as const,

  // ============================================
  // UMBRALES DE ESTADO
  // ============================================
  THRESHOLDS: {
    HUNGER: {
      CRITICAL: 10,
      ALERTA: 30,
    },
    HEALTH: {
      CRITICAL: 10,
      ALERTA: 30,
    },
    CLEANLINESS: {
      LOW: 20,
    },
    HAPPINESS: {
      LOW: 40,
      HIGH: 80,
    },
    ENERGY: {
      LOW: 30,
      HIGH: 70,
    },
  } as const,

  // ============================================
  // DECAY (DETERIORO)
  // ============================================
  DECAY: {
    INTERVAL_MS: 30000, // 30 segundos
    HUNGER_DECAY: 2,
    HAPPINESS_DECAY: 1.5,
    ENERGY_DECAY: 1,
    CLEANLINESS_DECAY: 0.8,
    HEALTH_DECAY_FROM_DIRTY: 1.5,
    HEALTH_DECAY_FROM_HUNGRY: 3,
  } as const,

  // ============================================
  // TIEMPO HASTA LA MUERTE (milisegundos)
  // ============================================
  TIME_TO_DEATH: {
    STARVATION: 7200000, // 2 horas con hambre 0
    CRITICAL_HEALTH: 1800000, // 30 minutos con salud 0
    COMBO_CRITICAL: 1800000, // 30 minutos con ambos críticos
  } as const,

  // ============================================
  // SUEÑO
  // ============================================
  SLEEP: {
    DURATION_MS: 300000, // 5 minutos
    UPDATE_INTERVAL_MS: 1000, // 1 segundo
    ENERGY_RECOVERY_RATE: 2, // por tick
    MIN_ENERGY_TO_SLEEP: 30,
  } as const,

  // ============================================
  // EDAD Y EVOLUCIÓN
  // ============================================
  AGE: {
    UPDATE_INTERVAL_MS: 3600000, // 1 hora
    LEVEL_UP_EXP_MULTIPLIER: 100, // XP necesaria = nivel * 100
    STAGE_THRESHOLDS: {
      BABY: 1,
      TEEN: 5,
      ADULT: 10,
    },
  } as const,

  // ============================================
  // ACCIONES DE USUARIO
  // ============================================
  ACTIONS: {
    FEED: {
      HUNGER_RECOVERY: 35,
      HAPPINESS_RECOVERY: 10,
      EXP_GAIN: 10,
      CLEANLINESS_PENALTY_CHANCE: 0.5,
      CLEANLINESS_PENALTY: 10,
    },
    SLEEP: {
      ENERGY_RECOVERY: 100,
      HAPPINESS_RECOVERY: 10,
      MIN_ENERGY_COST: 2,
    },
    CLEAN: {
      CLEANLINESS_SET: 100,
      HAPPINESS_RECOVERY: 15,
      EXP_GAIN: 8,
    },
    HEAL: {
      HEALTH_RECOVERY: 40,
      CLEANLINESS_RECOVERY: 30,
      EXP_GAIN: 20,
    },
    TREAT: {
      HAPPINESS_RECOVERY: 30,
      HUNGER_RECOVERY: 10,
      EXP_GAIN: 15,
    },
    PLAY: {
      MIN_ENERGY_REQUIRED: 30,
      ENERGY_COST: 20,
      HAPPINESS_RECOVERY: 15,
      EXP_GAIN: 5,
    },
  } as const,

  // ============================================
  // DEFECACIÓN
  // ============================================
  POOP: {
    CLEANLINESS_THRESHOLD: 15, // Generar poop al caer por debajo
    MAX_POOPS: 5,
  } as const,

  // ============================================
  // PROGRESIÓN
  // ============================================
  PROGRESSION: {
    INITIAL_COINS: 50,
    INITIAL_FOOD: 5,
    INITIAL_MEDICINE: 2,
    INITIAL_TREATS: 1,
    INITIAL_SOAP: 3,
    COINS_PER_LEVEL: 10,
  } as const,

  // ============================================
  // ANIMACIONES
  // ============================================
  ANIMATIONS: {
    EGG_IDLE: 'egg-idle',
    EGG_SHAKE: 'egg-shake',
    EGG_CRACK: 'egg-crack',
    BLINK: 'blink',
    JUMP: 'jump',
    HAPPY: 'happy',
    SAD: 'sad',
    SICK: 'sick',
    EATING: 'eating',
    SLEEPING: 'sleeping',
    PLAYING: 'playing',
  } as const,

  ANIMATION_CYCLES: {
    BLINK_DELAY: 8000,
    BLINK_NEXT_ANIMATION: 'jump',
    JUMP_CYCLES: 2,
    JUMP_NEXT_ANIMATION: 'blink',
  } as const,
};

export type PetStage = typeof PET_CONSTANTS.STAGES[keyof typeof PET_CONSTANTS.STAGES];
export type PetMood = typeof PET_CONSTANTS.MOODS[keyof typeof PET_CONSTANTS.MOODS];
export type VitalStatus = typeof PET_CONSTANTS.VITAL_STATUS[keyof typeof PET_CONSTANTS.VITAL_STATUS];
export type DangerLevel = typeof PET_CONSTANTS.DANGER_LEVELS[keyof typeof PET_CONSTANTS.DANGER_LEVELS];
export type StateFlag = typeof PET_CONSTANTS.STATE_FLAGS[keyof typeof PET_CONSTANTS.STATE_FLAGS];

export default PET_CONSTANTS;
