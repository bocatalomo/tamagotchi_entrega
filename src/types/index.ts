export * from './pet';
export * from './components';

// Types para juegos
export interface GameResult {
  won: boolean;
  score?: number;
  reward?: {
    coins: number;
    exp: number;
    happiness: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

// Types para eventos del juego
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  rarity: 'common' | 'uncommon' | 'rare';
  condition?: (pet: any) => boolean;
  effect?: (pet: any) => any;
}

// Types para minijuegos
export interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

export interface MinigameConfig {
  name: string;
  icon: string;
  description: string;
  minEnergy: number;
  rewards: {
    win: { coins: number; exp: number; happiness: number };
    lose: { energyLoss: number; happinessLoss: number };
  };
}