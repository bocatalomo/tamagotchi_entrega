/**
 * Estado inicial unificado del Tamagotchi
 * Este archivo centraliza el estado inicial para evitar duplicación
 */

import { PetState, Inventory } from '../types';

// ============================================
// ESTADO INICIAL DEL TAMAGOTCHI
// ============================================

export const INITIAL_PET_STATE: PetState = {
  name: '',
  type: 'cat',
  color: 'white',
  hunger: 100,
  happiness: 100,
  energy: 100,
  cleanliness: 100,
  health: 100,
  stage: 'egg',
  level: 1,
  exp: 0,
  isAlive: true,
  isSick: false,
  mood: 'contento',
  dangerLevel: 'normal',
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
  sleepStartEnergy: null,
};

// ============================================
// INVENTARIO INICIAL
// ============================================

export const INITIAL_INVENTORY: Inventory = {
  food: 5,
  medicine: 2,
  treats: 1,
  soap: 3,
};

// ============================================
// ITEMS DE LA TIENDA
// ============================================

export const SHOP_ITEMS = [
  { id: 'food', name: 'Comida', emoji: '🍖', price: 3, description: 'Restaurar +25 hambre' },
  { id: 'medicine', name: 'Medicina', emoji: '💊', price: 10, description: 'Curar enfermedad' },
  { id: 'treats', name: 'Golosina', emoji: '🍭', price: 5, description: '+15 felicidad' },
  { id: 'soap', name: 'Jabón', emoji: '🧼', price: 2, description: 'Limpiar incontinencia' },
] as const;

// ============================================
// AYUDANTES PARA CREAR ESTADO
// ============================================

/**
 * Crea un estado inicial para una nueva mascota
 */
export const createInitialPetState = (name: string): PetState => ({
  ...INITIAL_PET_STATE,
  name,
});

/**
 * Crea un inventario inicial
 */
export const createInitialInventory = (): Inventory => ({ ...INITIAL_INVENTORY });

/**
 * Resetea el estado del Tamagotchi a valores iniciales
 */
export const resetPetState = (currentState: PetState): PetState => ({
  ...INITIAL_PET_STATE,
  name: currentState.name,
  birthDate: Date.now(),
  lastUpdate: Date.now(),
});
