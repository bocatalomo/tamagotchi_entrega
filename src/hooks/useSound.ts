import { useCallback } from 'react';
import { audioManager } from '../utils/audioManager';

export type SoundEvent = 
  | 'hover'
  | 'click'
  | 'feed'
  | 'play'
  | 'clean'
  | 'sleep'
  | 'wake'
  | 'medicine'
  | 'treat'
  | 'happy'
  | 'sad'
  | 'critical'
  | 'evolution'
  | 'levelUp'
  | 'poop'
  | 'coin'
  | 'death'
  | 'eggHatch';

const soundMap: Record<SoundEvent, () => void> = {
  hover: () => audioManager.playHover(),
  click: () => audioManager.playClick(),
  feed: () => audioManager.playFeed(),
  play: () => audioManager.playPlay(),
  clean: () => audioManager.playClean(),
  sleep: () => audioManager.playSleep(),
  wake: () => audioManager.playWake(),
  medicine: () => audioManager.playMedicine(),
  treat: () => audioManager.playTreat(),
  happy: () => audioManager.playHappy(),
  sad: () => audioManager.playSad(),
  critical: () => audioManager.playCritical(),
  evolution: () => audioManager.playEvolution(),
  levelUp: () => audioManager.playLevelUp(),
  poop: () => audioManager.playPoop(),
  coin: () => audioManager.playCoin(),
  death: () => audioManager.playDeath(),
  eggHatch: () => audioManager.playEggHatch(),
};

interface UseSoundOptions {
  volume?: number;
  disabled?: boolean;
}

export function useSound(event: SoundEvent, options: UseSoundOptions = {}) {
  const play = useCallback(() => {
    if (options.disabled) return;
    const playFn = soundMap[event];
    if (playFn) {
      playFn();
    }
  }, [event, options.disabled]);

  return { play };
}

export function useSounds(events: SoundEvent[], options: UseSoundOptions = {}) {
  const sounds = events.reduce((acc, event) => {
    acc[event] = useSound(event, options);
    return acc;
  }, {} as Record<SoundEvent, { play: () => void }>);

  return sounds;
}

export default useSound;
