/**
 * Constantes del Juego - Centralizado para facilitar mantenimiento
 * Elimina todos los magic numbers del código
 */

// ============================================
// INTERVALOS DE TIEMPO (milisegundos)
// ============================================

export const TIME = {
  // Decay de stats cada 30 segundos
  DECAY_INTERVAL: 30_000,

  // Incremento de edad cada hora
  AGE_INTERVAL: 3_600_000,

  // Duración del sueño (5 minutos)
  SLEEP_DURATION: 300_000,

  // Duración de notificaciones
  NOTIFICATION_DURATION: 4_000,

  // Cooldowns de acciones
  FEED_COOLDOWN: 1_000,
  GAME_COOLDOWN: 500,

  // Tiempo máximo durmiendo (10 minutos)
  MAX_SLEEP_TIME: 600_000,

  // Timeout de evolución del huevo (3 segundos)
  EGG_HATCH_TIMEOUT: 3_000,
} as const;

// ============================================
// LÍMITES DE STATS
// ============================================

export const STAT = {
  MIN: 0,
  MAX: 100,
  CRITICAL: 20,
  WARNING: 40,
  GOOD: 70,
} as const;

// ============================================
// DECAY RATES (por intervalo de 30 segundos)
// ============================================

export const DECAY = {
  // Cantidad perdida por intervalo
  HUNGER: 2,
  HAPPINESS: 1.5,
  ENERGY: 1,
  CLEANLINESS: 0.8,

  // Multiplicadores de health decay
  HEALTH: {
    LOW_CLEANLINESS_HUNGRY: 3,
    LOW_CLEANLINESS_NORMAL: 1.5,
    ZERO_HUNGER: 2,
  },
} as const;

// ============================================
// TIME OUTS DE MUERTE (milisegundos)
// ============================================

export const DEATH_TIMEOUT = {
  // Muerte por hambre (2 horas sin comer)
  HUNGER: 2 * 60 * 60 * 1000,

  // Muerte por salud crítica (30 minutos)
  HEALTH: 30 * 60 * 1000,

  // Muerte por combo crítico (30 minutos)
  COMBO: 30 * 60 * 1000,
} as const;

// ============================================
// RECUPERACIÓN POR ACCIÓN
// ============================================

export const RECOVERY = {
  FEED: {
    hunger: 25,
    happiness: 5,
  },
  SLEEP: {
    energy: 100,
    happiness: 10,
  },
  CLEAN: {
    cleanliness: 100,
    health: 5,
  },
  TREAT: {
    happiness: 15,
  },
  MEDICINE: {
    health: 100,
  },
} as const;

// ============================================
// RECOMPENSAS
// ============================================

export const REWARD = {
  FEED: { coins: 0, exp: 10, happiness: 5 },
  CLEAN_POOP: { coins: 1, exp: 5, happiness: 3 },
  PLAY_WIN: { coins: 15, exp: 25, happiness: 35 },
  PLAY_LOSE: { coins: 0, exp: 5, happiness: 5 },
  LEVEL_UP: { coins: 10, exp: 0, happiness: 20 },
} as const;

// ============================================
// COSTOS DE ENERGÍA POR JUEGO
// ============================================

export const GAME_ENERGY = {
  ROCK_PAPER_SCISSORS: 10,
  MEMORY: 15,
  REACTION_TIME: 12,
  GUESS_NUMBER: 8,
  SLOT_MACHINE: 5,
  QUIZ: 10,
  SKATE: 20,
} as const;

// ============================================
// EXPERIENCIA
// ============================================

export const EXP = {
  PER_LEVEL: 100,
  MAX_PER_GAME: 35,
} as const;

// ============================================
// COLORES DE ESTADO (para UI)
// ============================================

export const STAT_COLOR = {
  CRITICAL: '#FF5252',   // Rojo
  WARNING: '#FFC107',    // Amarillo
  GOOD: '#00E676',      // Verde
} as const;

// ============================================
// RUTAS DE NAVEGACIÓN
// ============================================

export const ROUTE = {
  HOME: 'home',
  SHOP: 'shop',
  STATS: 'stats',
  PROFILE: 'profile',
} as const;

// ============================================
// ETAPAS DE LA MASCOTA
// ============================================

export const STAGE = {
  EGG: 'egg',
  BABY: 'baby',
  TEEN: 'teen',
  ADULT: 'adult',
} as const;

// ============================================
// NIVELES REQUERIDOS PARA DESBLOQUEAR
// ============================================

export const UNLOCK_LEVEL = {
  MEMORY: 3,
  REACTION_TIME: 5,
  SKATE: 5,
  QUIZ: 7,
} as const;

// ============================================
// MENSAJES
// ============================================

export const MESSAGE = {
  ERROR: {
    NOT_ENOUGH_COINS: 'No tienes suficientes monedas',
    NOT_ENOUGH_ENERGY: 'Tu mascota necesita más energía (mín. 30)',
    PET_DEAD: 'Tu mascota ha fallecido...',
    PET_SLEEPING: 'Tu mascota está dormida',
    INVENTORY_EMPTY: 'No tienes más artículos',
  } as const,

  SUCCESS: {
    PET_BORN: '¡Tu tamagotchi ha nacido! 🥚✨',
    LEVEL_UP: '¡Nivel actualizado!',
    GAME_WIN: '¡Victoria!',
    ITEM_PURCHASED: '¡Compra realizada!',
    FULLY_RESTED: 'Tu mascota está completamente descansada',
    GOOD_MORNING: 'Buenos días! ☀️',
  } as const,
} as const;

// ============================================
// TIPOS DE NOTIFICACIÓN
// ============================================

export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
} as const;

// ============================================
// CONFIGURACIÓN DE SONIDO
// ============================================

export const AUDIO = {
  DEFAULT_VOLUME: 0.7,
  MAX_SOUND_CHANNELS: 5,
} as const;

// ============================================
// CONFIGURACIÓN DE JUEGOS
// ============================================

export const GAME_CONFIG = {
  ROCK_PAPER_SCISSORS: {
    ROUNDS_TO_WIN: 2,
    TOTAL_ROUNDS: 3,
  },
  MEMORY: {
    PAIRS_TO_WIN: 6,
    FLIP_DELAY: 1000,
    MATCH_DELAY: 1500,
  },
  REACTION_TIME: {
    MAX_ATTEMPTS: 5,
    WIN_THRESHOLD_MS: 400,
  },
  GUESS_NUMBER: {
    MAX_RANGE: 50,
    MAX_ATTEMPTS: 7,
  },
} as const;

// ============================================
// AYUDANTES
// ============================================

/**
 * Verifica si un stat está en nivel crítico
 */
export const isStatCritical = (value: number): boolean => value <= STAT.CRITICAL;

/**
 * Verifica si un stat está en nivel bajo
 */
export const isStatLow = (value: number): boolean => value <= STAT.WARNING;

/**
 * Clampa un valor entre min y max
 */
export const clampStat = (value: number, min: number = STAT.MIN, max: number = STAT.MAX): number =>
  Math.max(min, Math.min(max, value));

/**
 * Calcula el porcentaje de un stat
 */
export const statPercentage = (value: number): number =>
  Math.round((value / STAT.MAX) * 100);

/**
 * Calcula la experiencia requerida para un nivel
 */
export const expForLevel = (level: number): number => level * EXP.PER_LEVEL;
