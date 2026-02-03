import { useCallback, useEffect, useState, useRef } from 'react';
import { audioManager } from '../utils/audioManager';

interface UseAudioOptions {
  volume?: number;
  muted?: boolean;
  onError?: (error: Error) => void;
}

export function useAudio(options: UseAudioOptions = {}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const initAudio = async () => {
      if (initializedRef.current) return;
      
      try {
        await audioManager.initialize();
        initializedRef.current = true;
        setIsInitialized(true);
        
        if (options.volume !== undefined) {
          audioManager.setMasterVolume(options.volume);
        }
      } catch (error) {
        options.onError?.(error as Error);
      }
    };

    initAudio();

    return () => {
      audioManager.dispose();
      initializedRef.current = false;
      setIsInitialized(false);
    };
  }, [options.onError]);

  useEffect(() => {
    if (options.muted !== undefined) {
      setIsMuted(options.muted);
      audioManager.setMuted(options.muted);
    }
  }, [options.muted]);

  const playHover = useCallback(() => {
    if (!isMuted) {
      audioManager.playHover();
    }
  }, [isMuted]);

  const playClick = useCallback(() => {
    if (!isMuted) {
      audioManager.playClick();
    }
  }, [isMuted]);

  const playFeed = useCallback(() => {
    if (!isMuted) {
      audioManager.playFeed();
    }
  }, [isMuted]);

  const playPlay = useCallback(() => {
    if (!isMuted) {
      audioManager.playPlay();
    }
  }, [isMuted]);

  const playClean = useCallback(() => {
    if (!isMuted) {
      audioManager.playClean();
    }
  }, [isMuted]);

  const playSleep = useCallback(() => {
    if (!isMuted) {
      audioManager.playSleep();
    }
  }, [isMuted]);

  const playWake = useCallback(() => {
    if (!isMuted) {
      audioManager.playWake();
    }
  }, [isMuted]);

  const playMedicine = useCallback(() => {
    if (!isMuted) {
      audioManager.playMedicine();
    }
  }, [isMuted]);

  const playTreat = useCallback(() => {
    if (!isMuted) {
      audioManager.playTreat();
    }
  }, [isMuted]);

  const playHappy = useCallback(() => {
    if (!isMuted) {
      audioManager.playHappy();
    }
  }, [isMuted]);

  const playSad = useCallback(() => {
    if (!isMuted) {
      audioManager.playSad();
    }
  }, [isMuted]);

  const playCritical = useCallback(() => {
    if (!isMuted) {
      audioManager.playCritical();
    }
  }, [isMuted]);

  const playEvolution = useCallback(() => {
    if (!isMuted) {
      audioManager.playEvolution();
    }
  }, [isMuted]);

  const playLevelUp = useCallback(() => {
    if (!isMuted) {
      audioManager.playLevelUp();
    }
  }, [isMuted]);

  const playPoop = useCallback(() => {
    if (!isMuted) {
      audioManager.playPoop();
    }
  }, [isMuted]);

  const playCoin = useCallback(() => {
    if (!isMuted) {
      audioManager.playCoin();
    }
  }, [isMuted]);

  const playDeath = useCallback(() => {
    if (!isMuted) {
      audioManager.playDeath();
    }
  }, [isMuted]);

  const playEggHatch = useCallback(() => {
    if (!isMuted) {
      audioManager.playEggHatch();
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioManager.setMuted(newMuted);
  }, [isMuted]);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    audioManager.setMuted(muted);
  }, []);

  return {
    isInitialized,
    isMuted,
    playHover,
    playClick,
    playFeed,
    playPlay,
    playClean,
    playSleep,
    playWake,
    playMedicine,
    playTreat,
    playHappy,
    playSad,
    playCritical,
    playEvolution,
    playLevelUp,
    playPoop,
    playCoin,
    playDeath,
    playEggHatch,
    toggleMute,
    setMuted,
  };
}

export default useAudio;
