import { useCallback } from 'react';
import { PetState } from '../types';

interface GameReward {
  coins: number;
  exp: number;
  happiness: number;
}

interface UseGameRewardsReturn {
  handleWinGame: (reward: GameReward) => void;
  handleLoseGame: () => void;
}

interface UseGameRewardsProps {
  pet: PetState;
  onPetUpdate: (update: Partial<PetState>) => void;
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  playCoin: () => void;
}

export const useGameRewards = ({ pet, onPetUpdate, addNotification, playCoin }: UseGameRewardsProps): UseGameRewardsReturn => {
  const handleWinGame = useCallback((reward: GameReward) => {
    onPetUpdate({
      coins: pet.coins + reward.coins,
      exp: pet.exp + reward.exp,
      happiness: Math.min(100, pet.happiness + reward.happiness),
    });
    addNotification(`¡Victoria! +${reward.coins} monedas`, 'success');
    playCoin();
  }, [pet, onPetUpdate, addNotification, playCoin]);

  const handleLoseGame = useCallback(() => {
    onPetUpdate({
      energy: Math.max(0, pet.energy - 8),
      happiness: Math.max(0, pet.happiness - 5),
    });
    addNotification('Mejor suerte la próxima vez', 'info');
  }, [pet, onPetUpdate, addNotification]);

  return {
    handleWinGame,
    handleLoseGame,
  };
};

export default useGameRewards;
