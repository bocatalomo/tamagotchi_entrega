import { useCallback } from 'react';
import { PetState, Inventory } from '../types';
import { loadTamagotchi, saveTamagotchi, createTamagotchi, deleteTamagotchi, hasTamagotchi } from '../services/tamagotchiService';
import { INITIAL_PET_STATE, INITIAL_INVENTORY } from '../constants';

export interface UsePetPersistenceReturn {
  loadPet: () => Promise<{ pet: PetState; inventory: Inventory } | null>;
  savePet: (pet: PetState, inventory: Inventory) => Promise<void>;
  createPet: (name: string, type: 'cat' | 'dog', color: 'white' | 'black' | 'brown') => Promise<{ pet: PetState; inventory: Inventory }>;
  deletePet: () => Promise<void>;
  checkHasPet: () => Promise<boolean>;
  initialPetState: PetState;
  initialInventory: Inventory;
}

export const usePetPersistence = (): UsePetPersistenceReturn => {
  const loadPet = useCallback(async () => {
    try {
      const data = await loadTamagotchi();
      if (data) {
        return { pet: data.pet, inventory: data.inventory };
      }
      return null;
    } catch (error) {
      console.error('Error loading pet:', error);
      return null;
    }
  }, []);

  const savePet = useCallback(async (pet: PetState, inventory: Inventory) => {
    try {
      await saveTamagotchi(pet, inventory);
    } catch (error) {
      console.error('Error saving pet:', error);
    }
  }, []);

  const createPet = useCallback(async (name: string, type: 'cat' | 'dog', color: 'white' | 'black' | 'brown') => {
    return createTamagotchi({ name, type, color });
  }, []);

  const deletePet = useCallback(async () => {
    try {
      await deleteTamagotchi();
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  }, []);

  const checkHasPet = useCallback(async () => {
    return hasTamagotchi();
  }, []);

  return {
    loadPet,
    savePet,
    createPet,
    deletePet,
    checkHasPet,
    initialPetState: INITIAL_PET_STATE,
    initialInventory: INITIAL_INVENTORY,
  };
};

export default usePetPersistence;
