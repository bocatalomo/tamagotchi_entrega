import { useEffect, useState, useRef } from 'react';
import './PixelPet.css';

/**
 * Configuración de animaciones disponibles
 * Cada animación debe tener una tira PNG en /assets/pets/{color}/{animation}.png
 */
const ANIMATIONS_CONFIG = {
  // Animaciones de huevo
  'egg-idle': {
    frames: 3,
    duration: 300,
    frameHeight: 32,
    frameWidth: 32,
    weight: 0
  },
  'egg-shake': {
    frames: 6,
    duration: 100,
    frameHeight: 32,
    frameWidth: 32,
    weight: 0
  },
  'egg-crack': {
    frames: 4,
    duration: 250,
    frameHeight: 32,
    frameWidth: 32,
    weight: 0
  },
  blink: {
    frames: 8,
    duration: 150,
    frameHeight: 17,
    frameWidth: 32,
    weight: 1,
    firstFrameDelay: 8000, // 8 segundos en el primer frame
    nextAnimation: 'jump' // Después de blink, viene jump
  },
  jump: {
    frames: 9,
    duration: 150,
    frameHeight: 18,
    frameWidth: 32,
    weight: 0, // No se selecciona aleatoriamente, solo después de blink
    cycles: 2, // Reproducir 2 ciclos completos
    nextAnimation: 'blink' // Después de jump, vuelve a blink
  },
  // Animaciones basadas en estado
  'happy': {
    frames: 4,
    duration: 200,
    frameHeight: 26,
    frameWidth: 32,
    weight: 0 // Sin pausas, loop continuo
  },
  'sad': {
    frames: 2,
    duration: 400,
    frameHeight: 19,
    frameWidth: 31.5,
    weight: 0
  },
  'sick': {
    frames: 1,
    duration: 250,
    frameHeight: 21,
    frameWidth: 17,
    weight: 0
  },
  walk: {
    frames: 3,
    duration: 200,
    frameHeight: 18,
    weight: 0, // DESHABILITADO
    nextDelay: { min: 5000, max: 5000 }
  },
  idle: {
    frames: 8,
    duration: 150,
    frameHeight: 24,
    weight: 0, // DESHABILITADO
    nextDelay: { min: 5000, max: 5000 }
  },
  yawn: {
    frames: 6,
    duration: 180,
    frameHeight: 24,
    weight: 0, // DESHABILITADO
    nextDelay: { min: 5000, max: 5000 }
  },
  scratch: {
    frames: 6,
    duration: 150,
    frameHeight: 24,
    weight: 0, // DESHABILITADO
    nextDelay: { min: 5000, max: 5000 }
  },
  // Animaciones especiales (se activan por estado)
  eating: {
    frames: 6,
    duration: 200,
    frameHeight: 24,
    frameWidth: 32,
    weight: 0 // DESHABILITADO
  },
  sleeping: {
    frames: 4,
    duration: 400,
    frameHeight: 24,
    frameWidth: 32,
    weight: 0 // DESHABILITADO
  },
  playing: {
    frames: 8,
    duration: 120,
    frameHeight: 24,
    frameWidth: 32,
    weight: 0 // DESHABILITADO
  }
};

/**
 * Determina qué animación usar basándose en el estado de la mascota
 */
const getAnimationFromMood = (mood) => {
  switch (mood) {
    case 'contento':
    case 'juguetón':
      return 'happy'; // Contento/Juguetón
    case 'triste':
      return 'sad'; // Triste
    case 'cansado':
      return 'blink'; // Cansado
    case 'enfermo':
      return 'sick'; // Enfermo
    case 'hambriento':
      return 'jump'; // Hambriento (misma animación que al alimentar)
    default:
      return 'happy'; // Por defecto contento
  }
};

const PixelPet = ({ color = 'brown', animation: forcedAnimation, mood = 'contento' }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Determinar la animación base según el estado de la mascota
  const baseAnimation = getAnimationFromMood(mood);
  const [currentAnimation, setCurrentAnimation] = useState(baseAnimation);

  const [isWaitingOnFirstFrame, setIsWaitingOnFirstFrame] = useState(true);
  const [isWaitingBeforeJump, setIsWaitingBeforeJump] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const frameIntervalRef = useRef(null);
  const firstFrameTimeoutRef = useRef(null);

  // Dimensiones del sprite - escala responsiva
  const getScale = () => {
    if (typeof window !== 'undefined') {
      // En móvil (ancho < 768px), usar escala menor
      if (window.innerWidth < 768) {
        return 5;
      }
    }
    return 7; // Escala para desktop
  };

  const scale = getScale();

  // Actualizar animación cuando cambia el mood o forcedAnimation
  useEffect(() => {
    if (forcedAnimation) {
      // Resetear estados cuando hay una animación forzada
      setCurrentFrame(0);
      setIsWaitingOnFirstFrame(true);
      setIsWaitingBeforeJump(false);
      setCycleCount(0);
    } else {
      const newBaseAnimation = getAnimationFromMood(mood);
      if (newBaseAnimation !== currentAnimation) {
        setCurrentAnimation(newBaseAnimation);
        setCurrentFrame(0);
        setIsWaitingOnFirstFrame(true);
        setIsWaitingBeforeJump(false);
        setCycleCount(0);
      }
    }
  }, [mood, forcedAnimation, currentAnimation]);

  // Sistema de animación con pausa en el primer frame
  useEffect(() => {
    // Limpiar intervalos previos
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }
    if (firstFrameTimeoutRef.current) {
      clearTimeout(firstFrameTimeoutRef.current);
    }

    // Si hay una animación forzada (eating, playing, blink para sleep), usarla
    if (forcedAnimation && ANIMATIONS_CONFIG[forcedAnimation]) {
      const animConfig = ANIMATIONS_CONFIG[forcedAnimation];

      // Si es blink forzado (para dormir)
      if (forcedAnimation === 'blink') {
        // Pausa de 3 segundos en el primer frame antes de cada ciclo
        if (isWaitingOnFirstFrame) {
          setCurrentFrame(0);
          firstFrameTimeoutRef.current = setTimeout(() => {
            setIsWaitingOnFirstFrame(false);
          }, 3000); // Pausa de 3 segundos

          return () => {
            if (firstFrameTimeoutRef.current) clearTimeout(firstFrameTimeoutRef.current);
          };
        }

        // Reproducir la animación frame por frame
        let frame = 0;
        frameIntervalRef.current = setInterval(() => {
          frame = (frame + 1) % animConfig.frames;
          setCurrentFrame(frame);

          // Cuando vuelve al primer frame (completa el ciclo)
          if (frame === 0) {
            // Detener y activar pausa de 3 segundos antes del siguiente ciclo
            if (frameIntervalRef.current) {
              clearInterval(frameIntervalRef.current);
            }
            setIsWaitingOnFirstFrame(true);
          }
        }, animConfig.duration);

        return () => {
          if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
        };
      }

      // Para otras animaciones forzadas, reproducir normalmente
      frameIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % animConfig.frames);
      }, animConfig.duration);

      return () => {
        if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      };
    }

    // Animación por defecto con secuencia blink -> jump -> blink
    const animConfig = ANIMATIONS_CONFIG[currentAnimation];

    // Para animaciones que solo hacen loop continuo (happy, sad y sick)
    if (currentAnimation === 'happy' || currentAnimation === 'sad' || currentAnimation === 'sick') {
      frameIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % animConfig.frames);
      }, animConfig.duration);

      return () => {
        if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      };
    }

    // Para blink: pausa en el primer frame (estado inicial)
    if (currentAnimation === 'blink' && isWaitingOnFirstFrame) {
      setCurrentFrame(0);

      firstFrameTimeoutRef.current = setTimeout(() => {
        setIsWaitingOnFirstFrame(false);
      }, animConfig.firstFrameDelay || 8000);
    }
    // Pausa de 4 segundos después de blink, antes de jump
    else if (currentAnimation === 'blink' && isWaitingBeforeJump) {
      setCurrentFrame(0);

      firstFrameTimeoutRef.current = setTimeout(() => {
        setIsWaitingBeforeJump(false);
        setCurrentAnimation('jump');
      }, 4000); // 4 segundos de pausa
    }
    else {
      // Reproducir la animación normalmente
      let frame = 0;

      frameIntervalRef.current = setInterval(() => {
        frame = (frame + 1) % animConfig.frames;
        setCurrentFrame(frame);

        // Cuando vuelve al primer frame (completa el ciclo)
        if (frame === 0) {
          // Para jump: verificar si necesita hacer otro ciclo
          if (currentAnimation === 'jump') {
            const currentCycles = cycleCount + 1;

            if (currentCycles < (animConfig.cycles || 1)) {
              // Continuar con otro ciclo de jump
              setCycleCount(currentCycles);
            } else {
              // Completó todos los ciclos de jump
              if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
              }
              setCycleCount(0);
              setCurrentAnimation(animConfig.nextAnimation || 'blink');
              setIsWaitingOnFirstFrame(true);
            }
          } else {
            // Para blink: activar pausa de 4 segundos antes de jump
            if (frameIntervalRef.current) {
              clearInterval(frameIntervalRef.current);
            }
            // Activar la pausa de 4 segundos en el primer frame antes de jump
            setIsWaitingBeforeJump(true);
            setIsWaitingOnFirstFrame(false);
          }
        }
      }, animConfig.duration);
    }

    // Cleanup
    return () => {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      if (firstFrameTimeoutRef.current) clearTimeout(firstFrameTimeoutRef.current);
    };
  }, [currentAnimation, forcedAnimation, isWaitingOnFirstFrame, isWaitingBeforeJump, cycleCount]);

  const animConfig = ANIMATIONS_CONFIG[forcedAnimation || currentAnimation];
  const animationName = forcedAnimation || currentAnimation;
  // Usar ruta relativa que funciona mejor en móvil
  const assetPath = `${import.meta.env.BASE_URL || '/'}assets/pets/${color}/${animationName}.png`;
  const totalFrames = animConfig.frames;
  const frameHeight = animConfig.frameHeight;
  const frameWidth = animConfig.frameWidth || 32; // Default 32px si no está especificado
  const bgPosition = `-${currentFrame * frameWidth}px 0`;

  // Verificar si está durmiendo (animación blink forzada)
  const isSleeping = forcedAnimation === 'blink';

  return (
    <div className="pixel-pet-wrapper">
      <div
        className="pixel-pet-container"
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          margin: '0 auto',
          backgroundImage: `url("${assetPath}")`,
          backgroundSize: `${frameWidth * totalFrames}px ${frameHeight}px`,
          backgroundPosition: bgPosition,
          backgroundRepeat: 'no-repeat',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          imageRendering: 'pixelated',
          imageRendering: '-moz-crisp-edges',
          imageRendering: 'crisp-edges'
        }}
      />
      {isSleeping && (
        <div className="sleep-zzz-container">
          <span className="zzz zzz-1">z</span>
          <span className="zzz zzz-2">z</span>
          <span className="zzz zzz-3">z</span>
        </div>
      )}
    </div>
  );
};

export default PixelPet;
