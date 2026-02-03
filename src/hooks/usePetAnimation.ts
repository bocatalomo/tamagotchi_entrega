import { useState, useEffect, useCallback, useRef } from 'react';
import { PetState } from '../types';
import {
  ANIMATIONS,
  getAnimationFromMood,
  getAnimationConfig,
  animationExists,
  AnimationConfig,
} from '../constants/animationConfig';

interface UsePetAnimationOptions {
  autoPlay?: boolean;
  onAnimationComplete?: (animation: string) => void;
}

interface PetAnimationState {
  currentAnimation: string;
  currentFrame: number;
  isPlaying: boolean;
  isWaitingOnFirstFrame: boolean;
}

export const usePetAnimation = (
  pet: PetState,
  forcedAnimation?: string,
  options: UsePetAnimationOptions = {}
) => {
  const { autoPlay = true, onAnimationComplete } = options;

  const [state, setState] = useState<PetAnimationState>({
    currentAnimation: '',
    currentFrame: 0,
    isPlaying: false,
    isWaitingOnFirstFrame: true,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<string>('');

  const getEffectiveAnimation = useCallback((): string => {
    if (forcedAnimation && animationExists(forcedAnimation)) {
      return forcedAnimation;
    }

    if (pet.isSleeping) {
      return 'sleeping';
    }

    if (pet.stage === 'egg') {
      return 'egg-idle';
    }

    return getAnimationFromMood(pet.mood, pet.stage, pet.isSleeping);
  }, [forcedAnimation, pet.mood, pet.stage, pet.isSleeping]);

  const getNextAnimation = useCallback((currentAnim: string): string | null => {
    const config = ANIMATIONS[currentAnim];
    if (!config) return null;

    if (config.nextAnimation) {
      return config.nextAnimation;
    }

    if (config.weight && config.weight > 0 && pet.stage !== 'egg') {
      const random = Math.random() * 10;
      if (random < config.weight) {
        return 'blink';
      }
    }

    return 'blink';
  }, [pet.stage]);

  const startAnimation = useCallback((animation: string, frame: number = 0) => {
    const config = ANIMATIONS[animation];
    if (!config) return;

    setState({
      currentAnimation: animation,
      currentFrame: frame,
      isPlaying: true,
      isWaitingOnFirstFrame: false,
    });

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const nextFrame = prev.currentFrame + 1;
        const config = ANIMATIONS[prev.currentAnimation];

        if (!config || nextFrame >= config.frames) {
          const nextAnim = getNextAnimation(prev.currentAnimation);

          if (nextAnim && onAnimationComplete) {
            onAnimationComplete(prev.currentAnimation);
          }

          if (nextAnim && nextAnim !== prev.currentAnimation) {
            return {
              ...prev,
              currentAnimation: nextAnim,
              currentFrame: 0,
            };
          }

          if (nextAnim === prev.currentAnimation && config.cycles) {
            return {
              ...prev,
              currentFrame: 0,
            };
          }

          return {
            ...prev,
            currentFrame: 0,
          };
        }

        return {
          ...prev,
          currentFrame: nextFrame,
        };
      });
    }, config.duration);
  }, [getNextAnimation, onAnimationComplete]);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const playAnimation = useCallback((animation: string) => {
    stopAnimation();
    const config = ANIMATIONS[animation];
    if (!config) return;

    animationRef.current = animation;

    if (config.firstFrameDelay && config.firstFrameDelay > 0) {
      setState({
        currentAnimation: animation,
        currentFrame: 0,
        isPlaying: false,
        isWaitingOnFirstFrame: true,
      });

      timeoutRef.current = setTimeout(() => {
        startAnimation(animation, 0);
      }, config.firstFrameDelay);
    } else {
      startAnimation(animation, 0);
    }
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    if (!autoPlay || pet.stage === 'egg') return;

    const effectiveAnim = getEffectiveAnimation();

    if (effectiveAnim !== animationRef.current || state.currentAnimation === '') {
      if (state.currentAnimation === '') {
        startAnimation(effectiveAnim, 0);
      } else if (state.currentAnimation !== animationRef.current) {
        playAnimation(effectiveAnim);
      }
    }
  }, [pet.mood, pet.isSleeping, pet.stage, autoPlay, getEffectiveAnimation, state.currentAnimation, startAnimation, playAnimation]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  const frameOffset = useCallback((): number => {
    const config = ANIMATIONS[state.currentAnimation];
    if (!config) return 0;
    return state.currentFrame * config.frameHeight;
  }, [state.currentAnimation, state.currentFrame]);

  const frameWidth = useCallback((): number => {
    const config = ANIMATIONS[state.currentAnimation];
    if (!config) return 32;
    return config.frameWidth || 32;
  }, [state.currentAnimation]);

  const frameHeight = useCallback((): number => {
    const config = ANIMATIONS[state.currentAnimation];
    if (!config) return 24;
    return config.frameHeight;
  }, [state.currentAnimation]);

  return {
    currentAnimation: state.currentAnimation,
    currentFrame: state.currentFrame,
    isPlaying: state.isPlaying,
    isWaitingOnFirstFrame: state.isWaitingOnFirstFrame,
    playAnimation,
    stopAnimation,
    frameOffset,
    frameWidth,
    frameHeight,
    getEffectiveAnimation,
  };
};

export default usePetAnimation;
