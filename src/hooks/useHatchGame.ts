import { useState, useCallback, useRef, useEffect } from 'react';

export interface HatchGameState {
  isHolding: boolean;
  pointPosition: number;
  targetPosition: number;
  targetWidth: number;
  chargeLevel: number;
  isComplete: boolean;
  timeInTarget: number;
  isInsideTarget: boolean;
}

export interface HatchGameConfig {
  targetTimeRequired: number;
  velocity: number;
  targetVelocity: number;
  maxTargetPosition: number;
  minTargetPosition: number;
}

const DEFAULT_CONFIG: HatchGameConfig = {
  targetTimeRequired: 7000,
  velocity: 30,
  targetVelocity: 20,
  maxTargetPosition: 100,
  minTargetPosition: 0,
};

interface GameRef {
  isHolding: boolean;
  pointPosition: number;
  targetPosition: number;
  targetDirection: number;
  chargeLevel: number;
  isComplete: boolean;
  timeInTarget: number;
}

export const useHatchGame = (config: Partial<HatchGameConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [state, setState] = useState<HatchGameState>({
    isHolding: false,
    pointPosition: 0,
    targetPosition: 20,
    targetWidth: 25,
    chargeLevel: 0,
    isComplete: false,
    timeInTarget: 0,
    isInsideTarget: false,
  });

  const gameRef = useRef<GameRef>({
    isHolding: false,
    pointPosition: 0,
    targetPosition: 20,
    targetDirection: 1,
    chargeLevel: 0,
    isComplete: false,
    timeInTarget: 0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  const startHolding = useCallback(() => {
    if (gameRef.current.isComplete) return;
    gameRef.current.isHolding = true;
    setState(prev => ({ ...prev, isHolding: true }));
  }, []);

  const stopHolding = useCallback(() => {
    gameRef.current.isHolding = false;
    setState(prev => ({ ...prev, isHolding: false }));
  }, []);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    gameRef.current = {
      isHolding: false,
      pointPosition: 0,
      targetPosition: 20,
      targetDirection: 1,
      chargeLevel: 0,
      isComplete: false,
      timeInTarget: 0,
    };
    setState({
      isHolding: false,
      pointPosition: 0,
      targetPosition: 20,
      targetWidth: 25,
      chargeLevel: 0,
      isComplete: false,
      timeInTarget: 0,
      isInsideTarget: false,
    });
    lastTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const update = () => {
      const game = gameRef.current;
      if (game.isComplete) return;

      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const deltaSeconds = deltaTime / 1000;

      // Mover punto: -velocity si no sostiene, +velocity si sostiene
      const direction = game.isHolding ? 1 : -1;
      game.pointPosition += finalConfig.velocity * direction * deltaSeconds;

      // Mantener punto en rango
      game.pointPosition = Math.max(0, Math.min(100, game.pointPosition));

      // Mover objetivo constantemente
      game.targetPosition += finalConfig.targetVelocity * game.targetDirection * deltaSeconds;

      // Cambiar dirección en extremos
      if (game.targetPosition <= 0) {
        game.targetPosition = 0;
        game.targetDirection = 1;
      } else if (game.targetPosition >= 100 - 25) {
        game.targetPosition = 100 - 25;
        game.targetDirection = -1;
      }

      // Calcular si está dentro del objetivo
      const targetEnd = game.targetPosition + 25;
      const isInsideTarget = game.pointPosition >= game.targetPosition && game.pointPosition <= targetEnd;

      // Acumular tiempo solo cuando está sosteniendo Y dentro del objetivo
      if (isInsideTarget && game.isHolding) {
        game.timeInTarget += deltaTime;
        game.chargeLevel = Math.min(100, game.chargeLevel + (deltaTime / finalConfig.targetTimeRequired) * 100);

        if (game.timeInTarget >= finalConfig.targetTimeRequired) {
          game.isComplete = true;
          setState({
            isHolding: false,
            pointPosition: game.pointPosition,
            targetPosition: game.targetPosition,
            targetWidth: 25,
            chargeLevel: 100,
            isComplete: true,
            timeInTarget: game.timeInTarget,
            isInsideTarget: true,
          });
          return;
        }
      }

      setState({
        isHolding: game.isHolding,
        pointPosition: game.pointPosition,
        targetPosition: game.targetPosition,
        targetWidth: 25,
        chargeLevel: game.chargeLevel,
        isComplete: false,
        timeInTarget: game.timeInTarget,
        isInsideTarget,
      });

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [finalConfig]);

  return {
    state,
    startHolding,
    stopHolding,
    reset,
    config: finalConfig,
  };
};

export default useHatchGame;
