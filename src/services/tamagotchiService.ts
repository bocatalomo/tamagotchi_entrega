import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { PetState, Inventory } from '../types';

export interface TamagotchiData {
  pet: PetState;
  inventory: Inventory;
  lastUpdated: Date;
}

export interface CreateTamagotchiOptions {
  name: string;
  type?: 'cat' | 'dog';
  color?: 'white' | 'black' | 'brown';
}

// Estado inicial para un nuevo tamagotchi
const createInitialPetState = (options: CreateTamagotchiOptions): PetState => ({
  name: options.name,
  type: options.type || 'cat',
  color: options.color || 'white',
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
});

const createInitialInventory = (): Inventory => ({
  food: 5,
  medicine: 2,
  treats: 1,
  soap: 3,
});

// Obtener referencia al documento del tamagotchi
const getTamagotchiRef = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('Usuario no autenticado');
  return doc(db, 'users', userId, 'tamagotchi', 'current');
};

// Cargar tamagotchi desde Firestore
export const loadTamagotchi = async (): Promise<TamagotchiData | null> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('No hay usuario autenticado, no se puede cargar tamagotchi');
      return null;
    }

    const docRef = doc(db, 'users', userId, 'tamagotchi', 'current');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('✅ Tamagotchi cargado desde Firestore');
      return {
        pet: data.pet as PetState,
        inventory: data.inventory as Inventory,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
    }

    console.log('No se encontró tamagotchi en Firestore');
    return null;
  } catch (error) {
    console.error('Error al cargar tamagotchi desde Firestore:', error);
    return null;
  }
};

// Guardar tamagotchi en Firestore
export const saveTamagotchi = async (pet: PetState, inventory: Inventory): Promise<boolean> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn('No hay usuario autenticado, no se puede guardar');
      return false;
    }

    const docRef = doc(db, 'users', userId, 'tamagotchi', 'current');
    await setDoc(docRef, {
      pet,
      inventory,
      lastUpdated: serverTimestamp(),
    }, { merge: true });

    console.log('✅ Tamagotchi guardado en Firestore');
    return true;
  } catch (error) {
    console.error('Error al guardar tamagotchi en Firestore:', error);
    return false;
  }
};

// Crear nuevo tamagotchi para usuario
export const createTamagotchi = async (options: CreateTamagotchiOptions): Promise<TamagotchiData> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const pet = createInitialPetState(options);
    const inventory = createInitialInventory();

    const docRef = doc(db, 'users', userId, 'tamagotchi', 'current');
    await setDoc(docRef, {
      pet,
      inventory,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });

    console.log('✅ Nuevo tamagotchi creado en Firestore');
    return { pet, inventory, lastUpdated: new Date() };
  } catch (error) {
    console.error('Error al crear tamagotchi:', error);
    throw error;
  }
};

// Verificar si existe tamagotchi para el usuario
export const hasTamagotchi = async (): Promise<boolean> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const docRef = doc(db, 'users', userId, 'tamagotchi', 'current');
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error al verificar existencia de tamagotchi:', error);
    return false;
  }
};

// Actualizar solo el estado del pet (más eficiente)
export const updatePetState = async (updates: Partial<PetState>): Promise<boolean> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const docRef = doc(db, 'users', userId, 'tamagotchi', 'current');
    await updateDoc(docRef, {
      ...updates,
      lastUpdate: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar estado del pet:', error);
    return false;
  }
};

// Guardar solo el inventario
export const updateInventory = async (inventory: Inventory): Promise<boolean> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const docRef = doc(db, 'users', userId, 'tamagotchi', 'current');
    await updateDoc(docRef, {
      inventory,
      lastUpdate: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    return false;
  }
};

// Eliminar tamagotchi (para reset del juego)
export const deleteTamagotchi = async (): Promise<boolean> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const docRef = doc(db, 'users', userId, 'tamagotchi', 'current');
    await setDoc(docRef, {
      pet: null,
      inventory: null,
      deletedAt: serverTimestamp(),
    });
    console.log('✅ Tamagotchi eliminado de Firestore');
    return true;
  } catch (error) {
    console.error('Error al eliminar tamagotchi:', error);
    return false;
  }
};

export default {
  loadTamagotchi,
  saveTamagotchi,
  createTamagotchi,
  hasTamagotchi,
  updatePetState,
  updateInventory,
  deleteTamagotchi,
};
