export interface PetState {
  name: string;
  type: 'cat' | 'dog';
  color: 'white' | 'black' | 'brown';
  
  // Estadísticas principales
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  health: number;
  
  // Progresión
  stage: 'egg' | 'baby' | 'teen' | 'adult';
  level: number;
  exp: number;
  
  // Estado
  isAlive: boolean;
  isSick: boolean;
  mood: 'contento' | 'juguetón' | 'hambriento' | 'cansado' | 'triste' | 'enfermo' | 'agonizando';
  dangerLevel: 'normal' | 'alerta' | 'critico' | 'agonizante';
  
  // Recursos
  coins: number;
  age: number;
  
  // Timestamps
  lastFed: number;
  lastPlayed: number;
  lastCleaned: number;
  birthDate: number;
  lastUpdate: number;
  criticalHungerStart: number | null;
  criticalHealthStart: number | null;
  criticalComboStart: number | null;
  
  // Estado de sueño
  isSleeping: boolean;
  sleepStartTime: number | null;
  sleepStartEnergy: number | null;
}

export interface Inventory {
  food: number;
  medicine: number;
  treats: number;
  soap: number;
}

export interface Poop {
  id: number;
  x: number;
  y: number;
}

export interface GameState {
  currentScreen: 'home' | 'shop' | 'stats' | 'play';
  showNameInput: boolean;
  showMinigames: boolean;
  showSkateGame: boolean;
  message: string;
  animation: string;
  isSleeping: boolean;
}

export interface GameReward {
  coins: number;
  exp: number;
  happiness: number;
}

export type PetMood = PetState['mood'];
export type PetStage = PetState['stage'];
export type PetColor = PetState['color'];