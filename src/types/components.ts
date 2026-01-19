import { PetState } from './pet';

export interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export interface HomeScreenProps {
  pet: PetState;
  inventory: any;
  message: string;
  animation: string;
  getPetState: () => string;
  getStatColor: (value: number) => string;
  onFeed: () => void;
  onSleep: () => void;
  onWakeUp: () => void;
  onClean: () => void;
  onMedicine: () => void;
  onTreat: () => void;
  onPlay: () => void;
  isSleeping: boolean;
  poops: any[];
  onCleanPoop: (id: number) => void;
}

export interface ShopScreenProps {
  pet: PetState;
  inventory: any;
  message: string;
  animation: string;
  onBuyItem: (item: string, price: number) => void;
}

export interface StatsScreenProps {
  pet: PetState;
  inventory: any;
}

export interface NameInputProps {
  onSubmit: (name: string) => void;
}

export interface EggScreenProps {
  pet: PetState;
  onHatch: () => void;
}

export interface MinigamesProps {
  petName: string;
  onClose: () => void;
  onWin: (reward: any) => void;
  onLose: () => void;
  onOpenSkateGame: () => void;
  coins: number;
}

export interface PlayScreenProps {
  pet: PetState;
  onOpenMinigames: () => void;
  onOpenAchievements: () => void;
  onOpenSkateGame: () => void;
  unlockedAchievements?: string[];
}