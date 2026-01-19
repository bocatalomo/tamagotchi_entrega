import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PetState, Inventory } from '../types';
import { getInitialPetState } from '../hooks/usePetUtils';

interface GameState {
  pet: PetState;
  inventory: Inventory;
  message: string;
  animation: string;
}

type GameAction = 
  | { type: 'SET_PET'; payload: PetState }
  | { type: 'SET_INVENTORY'; payload: Inventory }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'SET_ANIMATION'; payload: string }
  | { type: 'UPDATE_PET'; payload: Partial<PetState> }
  | { type: 'FEED_PET' }
  | { type: 'PLAY_WITH_PET' }
  | { type: 'CLEAN_PET' }
  | { type: 'HEAL_PET' }
  | { type: 'GIVE_TREAT' }
  | { type: 'BUY_ITEM'; payload: { item: string; price: number } };

const initialState: GameState = {
  pet: getInitialPetState(),
  inventory: {
    food: 5,
    medicine: 2,
    treats: 1,
    soap: 3
  },
  message: '',
  animation: ''
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_PET':
      return { ...state, pet: action.payload };
    
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };
    
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    
    case 'SET_ANIMATION':
      return { ...state, animation: action.payload };
    
    case 'UPDATE_PET':
      return { ...state, pet: { ...state.pet, ...action.payload } };
    
    case 'FEED_PET':
      return {
        ...state,
        pet: {
          ...state.pet,
          hunger: Math.min(100, state.pet.hunger + 35),
          happiness: Math.min(100, state.pet.happiness + 10),
          exp: state.pet.exp + 10,
          lastFed: Date.now()
        }
      };
    
    case 'PLAY_WITH_PET':
      return {
        ...state,
        pet: {
          ...state.pet,
          energy: Math.max(0, state.pet.energy - 20),
          happiness: Math.min(100, state.pet.happiness + 15),
          exp: state.pet.exp + 5
        }
      };
    
    case 'CLEAN_PET':
      return {
        ...state,
        pet: {
          ...state.pet,
          cleanliness: 100,
          happiness: Math.min(100, state.pet.happiness + 15),
          exp: state.pet.exp + 8,
          lastCleaned: Date.now()
        }
      };
    
    case 'HEAL_PET':
      const newHealth = Math.min(100, state.pet.health + 40);
      const newCleanliness = Math.min(100, state.pet.cleanliness + 30);
      const stillSick = newHealth < 50 || newCleanliness < 30;
      return {
        ...state,
        pet: {
          ...state.pet,
          health: newHealth,
          cleanliness: newCleanliness,
          isSick: stillSick,
          mood: stillSick ? 'enfermo' : 'contento',
          exp: state.pet.exp + 20
        }
      };
    
    case 'GIVE_TREAT':
      return {
        ...state,
        pet: {
          ...state.pet,
          happiness: Math.min(100, state.pet.happiness + 30),
          hunger: Math.min(100, state.pet.hunger + 10),
          exp: state.pet.exp + 15
        }
      };
    
    case 'BUY_ITEM':
      return {
        ...state,
        pet: {
          ...state.pet,
          coins: state.pet.coins - action.payload.price
        },
        inventory: {
          ...state.inventory,
          [action.payload.item]: state.inventory[action.payload.item] + 1
        }
      };
    
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Cargar datos guardados al inicio
  useEffect(() => {
    const savedPet = localStorage.getItem('tamagotchiPet');
    const savedInventory = localStorage.getItem('tamagotchiInventory');

    if (savedPet) {
      try {
        const loadedPet = JSON.parse(savedPet);
        dispatch({ type: 'SET_PET', payload: loadedPet });
      } catch (error) {
        console.error('Error loading pet data:', error);
      }
    }

    if (savedInventory) {
      try {
        const loadedInventory = JSON.parse(savedInventory);
        dispatch({ type: 'SET_INVENTORY', payload: loadedInventory });
      } catch (error) {
        console.error('Error loading inventory data:', error);
      }
    }
  }, []);

  // Guardar datos cuando cambian
  useEffect(() => {
    localStorage.setItem('tamagotchiPet', JSON.stringify(state.pet));
  }, [state.pet]);

  useEffect(() => {
    localStorage.setItem('tamagotchiInventory', JSON.stringify(state.inventory));
  }, [state.inventory]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};