/**
 * Exportaciones centralizadas del sistema de estados del Tamagotchi
 */

// Constantes
export { default as PET_CONSTANTS, type PetStage, type PetMood, type VitalStatus, type DangerLevel, type StateFlag } from '../constants/petConstants';

// Reducer y State Machine
export {
  petReducer,
  getAnimationForState,
  createInitialPetState,
  createInitialInventory,
  type PetEvent,
  type PetEventType,
} from '../reducers/petReducer';

// Tipos relacionados
export type { ReducedPetState } from '../reducers/petReducer';
