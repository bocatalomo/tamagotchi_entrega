/**
 * Configuración Centralizada de Animaciones del Tamagotchi
 * Unifica las configuraciones de PixelPet.tsx y PetDisplay.tsx
 */

import { PetMood, PetStage } from '../types';

// ============================================
// INTERFAZ DE CONFIGURACIÓN DE ANIMACIÓN
// ============================================

export interface AnimationConfig {
  /** Número de frames en la animación */
  frames: number;
  /** Duración de cada frame en ms */
  duration: number;
  /** Altura de cada frame en px */
  frameHeight: number;
  /** Anchura de cada frame en px (opcional) */
  frameWidth?: number;
  /** Peso para selección aleatoria (0 = deshabilitado) */
  weight?: number;
  /** Delay antes del primer frame en ms */
  firstFrameDelay?: number;
  /** Animación siguiente en la cadena */
  nextAnimation?: string;
  /** Número de ciclos a reproducir */
  cycles?: number;
  /** Delay aleatorio entre repeticiones */
  nextDelay?: { min: number; max: number };
}

// ============================================
// CONFIGURACIÓN COMPLETA DE ANIMACIONES
// ============================================

export const ANIMATIONS: Record<string, AnimationConfig> = {
  // ========================================
  // ANIMACIONES DE HUEVO
  // ========================================
  'egg-idle': {
    frames: 3,
    duration: 300,
    frameHeight: 32,
    frameWidth: 32,
    weight: 0,
  },
  'egg-shake': {
    frames: 6,
    duration: 100,
    frameHeight: 32,
    frameWidth: 32,
    weight: 0,
  },
  'egg-crack': {
    frames: 4,
    duration: 250,
    frameHeight: 32,
    frameWidth: 32,
    weight: 0,
  },

  // ========================================
  // ANIMACIONES DE MASCOTA (BABY/TEEN/ADULT)
  // ========================================

  // Animación de parpadeo con cadena a jump
  blink: {
    frames: 8,
    duration: 150,
    frameHeight: 17,
    frameWidth: 32,
    weight: 1,
    firstFrameDelay: 8000,
    nextAnimation: 'jump',
  },

  // Animación de salto (después de blink)
  jump: {
    frames: 9,
    duration: 150,
    frameHeight: 18,
    frameWidth: 32,
    weight: 0,
    cycles: 2,
    nextAnimation: 'blink',
  },

  // Animaciones de estado de ánimo
  'happy': {
    frames: 4,
    duration: 200,
    frameHeight: 26,
    frameWidth: 32,
    weight: 0,
  },
  'sad': {
    frames: 2,
    duration: 400,
    frameHeight: 19,
    frameWidth: 31.5,
    weight: 0,
  },
  'sick': {
    frames: 1,
    duration: 250,
    frameHeight: 21,
    frameWidth: 17,
    weight: 0,
  },

  // Animaciones adicionales (peso 0 = no se seleccionan aleatoriamente)
  walk: {
    frames: 3,
    duration: 200,
    frameHeight: 18,
    weight: 0,
    nextDelay: { min: 5000, max: 5000 },
  },
  idle: {
    frames: 8,
    duration: 150,
    frameHeight: 24,
    weight: 0,
    nextDelay: { min: 5000, max: 5000 },
  },
  yawn: {
    frames: 6,
    duration: 180,
    frameHeight: 24,
    weight: 0,
    nextDelay: { min: 5000, max: 5000 },
  },
  scratch: {
    frames: 6,
    duration: 150,
    frameHeight: 24,
    weight: 0,
    nextDelay: { min: 5000, max: 5000 },
  },

  // Animaciones especiales
  eating: {
    frames: 6,
    duration: 200,
    frameHeight: 24,
    frameWidth: 32,
    weight: 0,
  },
  sleeping: {
    frames: 4,
    duration: 400,
    frameHeight: 24,
    frameWidth: 32,
    weight: 0,
  },
  playing: {
    frames: 8,
    duration: 120,
    frameHeight: 24,
    frameWidth: 32,
    weight: 0,
  },
};

// ============================================
// MAPA DE ANIMACIONES POR TIPO DE MASCOTA
// ============================================

export const ANIMATIONS_BY_PET_TYPE: Record<string, Record<string, string>> = {
  cat: {
    egg: 'egg-idle',
    baby: 'happy',
    teen: 'happy',
    adult: 'happy',
  },
};

// ============================================
// FUNCIÓN: Determinar animación desde estado
// ============================================

/**
 * Determina qué animación usar basándose en el estado de la mascota
 * Esta función reemplaza getAnimationFromMood de PixelPet.tsx y PetDisplay.tsx
 */
export const getAnimationFromMood = (
  mood: PetMood,
  stage: PetStage,
  isSleeping: boolean = false,
  forcedAnimation?: string
): string => {
  // Si hay animación forzada, usarla
  if (forcedAnimation && ANIMATIONS[forcedAnimation]) {
    return forcedAnimation;
  }

  // Si está durmiendo
  if (isSleeping) {
    return 'sleeping';
  }

  // Si es un huevo
  if (stage === 'egg') {
    return 'egg-idle';
  }

  // Determinar por estado de ánimo
  switch (mood) {
    case 'contento':
    case 'juguetón':
      return 'happy';
    case 'triste':
      return 'sad';
    case 'cansado':
      return 'blink';
    case 'enfermo':
      return 'sick';
    case 'hambriento':
      return 'jump';
    default:
      return 'happy';
  }
};

// ============================================
// FUNCIÓN: Obtener animación por defecto
// ============================================

/**
 * Obtiene la animación por defecto para una etapa
 */
export const getDefaultAnimation = (stage: PetStage): string => {
  if (stage === 'egg') {
    return 'egg-idle';
  }
  return 'happy';
};

// ============================================
// FUNCIÓN: ObtenerAsset path
// ============================================

/**
 * Genera la ruta del asset de animación
 */
export const getAnimationAssetPath = (
  color: string,
  animation: string
): string => {
  return `/assets/pets/${color}/${animation}.png`;
};

// ============================================
// CONSTANTES DE RESPONSIVE
// ============================================

export const RESPONSIVE = {
  BREAKPOINT_DESKTOP: 768,
  SCALE_DESKTOP: 7,
  SCALE_MOBILE: 5,
} as const;

// ============================================
// AYUDANTES
// ============================================

/**
 * Verifica si una animación existe
 */
export const animationExists = (animation: string): boolean =>
  animation in ANIMATIONS;

/**
 * Obtiene la configuración de una animación
 */
export const getAnimationConfig = (
  animation: string
): AnimationConfig | undefined => ANIMATIONS[animation];

/**
 * Calcula la duración total de una animación
 */
export const calculateAnimationDuration = (animation: string): number => {
  const config = ANIMATIONS[animation];
  if (!config) return 0;
  return config.frames * config.duration;
};
