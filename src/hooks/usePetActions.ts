import { useCallback } from 'react';
import { PetState, Inventory } from '../types';

interface UsePetActionsProps {
  pet: PetState;
  inventory: Inventory;
  isSleeping: boolean;
  onPetUpdate: (update: Partial<PetState> | ((prev: PetState) => Partial<PetState>)) => void;
  onInventoryUpdate: (update: Partial<Inventory>) => void;
  onAnimation: (animation: string) => void;
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  playFeed: () => void;
  playSleep: () => void;
  playWake: () => void;
  playClean: () => void;
  playMedicine: () => void;
  playTreat: () => void;
  playPlay: () => void;
  playEggHatch: () => void;
  saveToFirestore: () => void;
  clearSleepState: () => void;
}

export const usePetActions = ({
  pet,
  inventory,
  isSleeping,
  onPetUpdate,
  onInventoryUpdate,
  onAnimation,
  addNotification,
  playFeed,
  playSleep,
  playWake,
  playClean,
  playMedicine,
  playTreat,
  playPlay,
  playEggHatch,
  saveToFirestore,
  clearSleepState,
}: UsePetActionsProps) => {
  const feed = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.food <= 0) {
      addNotification('Sin comida! Ve a la tienda', 'warning');
      return;
    }
    if (isSleeping) {
      addNotification('Tu mascota está dormida', 'info');
      return;
    }

    clearSleepState();

    const makesMess = Math.random() < 0.5;
    const cleanlinessReduction = makesMess ? 10 : 0;

    onInventoryUpdate({ food: inventory.food - 1 });
    onPetUpdate({
      hunger: Math.min(100, pet.hunger + 35),
      happiness: Math.min(100, pet.happiness + 10),
      cleanliness: Math.max(0, pet.cleanliness - cleanlinessReduction),
      exp: pet.exp + 10,
      lastFed: Date.now(),
    });
    onAnimation('jump');
    saveToFirestore();

    if (makesMess) {
      addNotification('Nam nam! *Se ensucia*', 'info');
    } else {
      addNotification('Nam nam!', 'success');
    }
    playFeed();

    setTimeout(() => onAnimation(''), 2000);
  }, [pet, inventory, isSleeping, clearSleepState, addNotification, playFeed, saveToFirestore, onPetUpdate, onInventoryUpdate, onAnimation]);

  const clean = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.soap <= 0) {
      addNotification('Sin jabón! Ve a la tienda', 'warning');
      return;
    }
    if (isSleeping) {
      addNotification('Tu mascota está dormida', 'info');
      return;
    }

    clearSleepState();

    onInventoryUpdate({ soap: inventory.soap - 1 });
    onPetUpdate({
      cleanliness: 100,
      happiness: Math.min(100, pet.happiness + 15),
      exp: pet.exp + 8,
      lastCleaned: Date.now(),
    });

    addNotification('Qué limpio!', 'success');
    playClean();
    saveToFirestore();
  }, [pet, inventory, isSleeping, clearSleepState, addNotification, playClean, saveToFirestore, onPetUpdate, onInventoryUpdate]);

  const giveMedicine = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.medicine <= 0) {
      addNotification('Sin medicina! Ve a la tienda', 'warning');
      return;
    }
    if (isSleeping) {
      addNotification('Tu mascota está dormida', 'info');
      return;
    }

    clearSleepState();

    onInventoryUpdate({ medicine: inventory.medicine - 1 });
    onPetUpdate(prev => ({
      health: Math.min(100, prev.health + 40),
      cleanliness: Math.min(100, prev.cleanliness + 30),
      isSick: prev.health < 50 || prev.cleanliness < 30,
      mood: (prev.health < 50 || prev.cleanliness < 30) ? 'enfermo' : 'contento',
      exp: prev.exp + 20,
    }));

    addNotification('Medicina administrada! 💊', 'success');
    playMedicine();
    saveToFirestore();
  }, [pet, inventory, isSleeping, clearSleepState, addNotification, playMedicine, saveToFirestore, onPetUpdate, onInventoryUpdate]);

  const giveTreat = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.treats <= 0) {
      addNotification('Sin golosinas! Ve a la tienda', 'warning');
      return;
    }
    if (isSleeping) {
      addNotification('Tu mascota está dormida', 'info');
      return;
    }

    clearSleepState();

    onInventoryUpdate({ treats: inventory.treats - 1 });
    onPetUpdate({
      happiness: Math.min(100, pet.happiness + 30),
      hunger: Math.min(100, pet.hunger + 10),
      exp: pet.exp + 15,
    });

    addNotification('Yummy! 🍰', 'success');
    playTreat();
    saveToFirestore();
  }, [pet, inventory, isSleeping, clearSleepState, addNotification, playTreat, saveToFirestore, onPetUpdate, onInventoryUpdate]);

  const play = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (pet.energy < 30) {
      addNotification('Tu mascota está muy cansada', 'warning');
      return;
    }
    if (isSleeping) {
      addNotification('Tu mascota está dormida', 'info');
      return;
    }

    clearSleepState();

    onPetUpdate({
      energy: Math.max(0, pet.energy - 20),
      happiness: Math.min(100, pet.happiness + 15),
      exp: pet.exp + 5,
      lastPlayed: Date.now(),
    });

    addNotification('Qué divertido! 🎉', 'success');
    playPlay();
    saveToFirestore();
  }, [pet, isSleeping, clearSleepState, addNotification, playPlay, saveToFirestore, onPetUpdate]);

  const wake = useCallback(() => {
    clearSleepState();
    playWake();
    addNotification('Buenos días! ☀️', 'success');
    saveToFirestore();
  }, [clearSleepState, playWake, addNotification, saveToFirestore]);

  const sleep = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (isSleeping) {
      addNotification('Tu mascota ya está durmiendo', 'info');
      return;
    }

    onPetUpdate({
      isSleeping: true,
      sleepStartTime: Date.now(),
      sleepStartEnergy: pet.energy,
    });

    addNotification('Dulces sueños... (5 min)', 'info');
    playSleep();
    onAnimation('blink');
    saveToFirestore();
  }, [pet, isSleeping, addNotification, playSleep, saveToFirestore, onPetUpdate, onAnimation]);

  const hatch = useCallback(() => {
    onPetUpdate({
      stage: 'baby',
      birthDate: Date.now(),
      age: 0,
    });
    playEggHatch();
    saveToFirestore();
  }, [playEggHatch, saveToFirestore, onPetUpdate]);

  const heal = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }

    onPetUpdate({
      health: 100,
      isSick: false,
    });

    addNotification('Tu mascota se ha recuperado!', 'success');
  }, [addNotification, onPetUpdate]);

  return {
    feed,
    sleep,
    wake,
    clean,
    giveMedicine,
    giveTreat,
    play,
    hatch,
    heal,
  };
};

export default usePetActions;
