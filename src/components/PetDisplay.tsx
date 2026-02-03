import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './PixelPet.css';

interface AnimationConfig {
  frames: number;
  duration: number;
  frameHeight: number;
  frameWidth?: number;
  weight?: number;
  firstFrameDelay?: number;
  nextAnimation?: string;
  cycles?: number;
}

const ANIMATIONS_CONFIG: Record<string, AnimationConfig> = {
  'egg-idle': { frames: 3, duration: 300, frameHeight: 32, frameWidth: 32 },
  'egg-shake': { frames: 6, duration: 100, frameHeight: 32, frameWidth: 32 },
  'egg-crack': { frames: 4, duration: 250, frameHeight: 32, frameWidth: 32 },
  blink: { frames: 8, duration: 150, frameHeight: 17, frameWidth: 32, weight: 1, firstFrameDelay: 8000, nextAnimation: 'jump' },
  jump: { frames: 9, duration: 150, frameHeight: 18, frameWidth: 32, weight: 0, cycles: 2, nextAnimation: 'blink' },
  'happy': { frames: 4, duration: 200, frameHeight: 26, frameWidth: 32, weight: 0 },
  'sad': { frames: 2, duration: 400, frameHeight: 19, frameWidth: 31.5, weight: 0 },
  'sick': { frames: 1, duration: 250, frameHeight: 21, frameWidth: 17, weight: 0 },
  idle: { frames: 8, duration: 150, frameHeight: 24, weight: 0 },
  eating: { frames: 6, duration: 200, frameHeight: 24, frameWidth: 32, weight: 0 },
  sleeping: { frames: 4, duration: 400, frameHeight: 24, frameWidth: 32, weight: 0 },
  playing: { frames: 8, duration: 120, frameHeight: 24, frameWidth: 32, weight: 0 },
  walk: { frames: 3, duration: 200, frameHeight: 18, weight: 0 },
  yawn: { frames: 6, duration: 180, frameHeight: 24, weight: 0 },
  scratch: { frames: 6, duration: 150, frameHeight: 24, weight: 0 },
};

const getAnimationFromMood = (mood: string, stage: string): string => {
  if (stage === 'egg') return 'egg-idle';
  switch (mood) {
    case 'contento':
    case 'juguetón': return 'happy';
    case 'triste': return 'sad';
    case 'cansado': return 'blink';
    case 'enfermo': return 'sick';
    case 'hambriento': return 'jump';
    default: return 'happy';
  }
};

interface PetDisplayProps {
  name: string;
  stage: 'egg' | 'baby' | 'teen' | 'adult';
  mood: string;
  isSleeping: boolean;
  isAlive: boolean;
  animation?: string;
  onHatch?: () => void;
  color?: string;
  type?: string;
}

const PetDisplay: React.FC<PetDisplayProps> = ({
  name,
  stage,
  mood,
  isSleeping,
  isAlive,
  animation,
  onHatch,
  color = 'brown',
  type = 'cat'
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isWaitingOnFirstFrame, setIsWaitingOnFirstFrame] = useState(true);
  const [isWaitingBeforeJump, setIsWaitingBeforeJump] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const firstFrameTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const baseAnimation = getAnimationFromMood(mood, stage);
  const [currentAnimation, setCurrentAnimation] = useState(baseAnimation);

  const getScale = (): number => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 5;
    }
    return 7;
  };

  const scale = getScale();

  useEffect(() => {
    if (animation) {
      setCurrentFrame(0);
      setIsWaitingOnFirstFrame(true);
      setIsWaitingBeforeJump(false);
      setCycleCount(0);
    } else {
      const newBaseAnimation = getAnimationFromMood(mood, stage);
      if (newBaseAnimation !== currentAnimation) {
        setCurrentAnimation(newBaseAnimation);
        setCurrentFrame(0);
        setIsWaitingOnFirstFrame(true);
        setIsWaitingBeforeJump(false);
        setCycleCount(0);
      }
    }
  }, [mood, animation, stage, currentAnimation]);

  useEffect(() => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (firstFrameTimeoutRef.current) clearTimeout(firstFrameTimeoutRef.current);

    const forcedAnimation = animation || (isSleeping ? 'blink' : null);
    
    if (forcedAnimation && ANIMATIONS_CONFIG[forcedAnimation as keyof typeof ANIMATIONS_CONFIG]) {
      const animConfig = ANIMATIONS_CONFIG[forcedAnimation as keyof typeof ANIMATIONS_CONFIG];

      if (forcedAnimation === 'blink') {
        if (isWaitingOnFirstFrame) {
          firstFrameTimeoutRef.current = setTimeout(() => {
            setCurrentFrame(0);
            setIsWaitingOnFirstFrame(false);
          }, 3000);
          return;
        }

        let frame = 0;
        frameIntervalRef.current = setInterval(() => {
          frame = (frame + 1) % animConfig.frames;
          setCurrentFrame(frame);
          if (frame === 0) {
            if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
            setIsWaitingOnFirstFrame(true);
          }
        }, animConfig.duration);
        return;
      }

      frameIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % animConfig.frames);
      }, animConfig.duration);
      return;
    }

    const animConfig = ANIMATIONS_CONFIG[currentAnimation as keyof typeof ANIMATIONS_CONFIG];
    if (!animConfig) return;

    if (currentAnimation === 'happy' || currentAnimation === 'sad' || currentAnimation === 'sick') {
      frameIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % animConfig.frames);
      }, animConfig.duration);
      return;
    }

    if (currentAnimation === 'blink' && isWaitingOnFirstFrame) {
      setCurrentFrame(0);
      firstFrameTimeoutRef.current = setTimeout(() => {
        setIsWaitingOnFirstFrame(false);
      }, animConfig.firstFrameDelay || 8000);
    } else if (currentAnimation === 'blink' && isWaitingBeforeJump) {
      setCurrentFrame(0);
      firstFrameTimeoutRef.current = setTimeout(() => {
        setIsWaitingBeforeJump(false);
        setCurrentAnimation('jump');
      }, 4000);
    } else {
      let frame = 0;
      frameIntervalRef.current = setInterval(() => {
        frame = (frame + 1) % animConfig.frames;
        setCurrentFrame(frame);
        if (frame === 0) {
          if (currentAnimation === 'jump') {
            const currentCycles = cycleCount + 1;
            if (currentCycles < (animConfig.cycles || 1)) {
              setCycleCount(currentCycles);
            } else {
              if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
              setCycleCount(0);
              setCurrentAnimation(animConfig.nextAnimation || 'blink');
              setIsWaitingOnFirstFrame(true);
            }
          } else {
            if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
            setIsWaitingBeforeJump(true);
            setIsWaitingOnFirstFrame(false);
          }
        }
      }, animConfig.duration);
    }

    return () => {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      if (firstFrameTimeoutRef.current) clearTimeout(firstFrameTimeoutRef.current);
    };
  }, [currentAnimation, animation, isSleeping, isWaitingOnFirstFrame, isWaitingBeforeJump, cycleCount]);

  if (!isAlive) {
    return (
      <motion.div
        className="pet-display-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: 'center' }}
      >
        <motion.div
          style={{ fontSize: '4rem', filter: 'grayscale(100%)' }}
          animate={{ scale: 0.9 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          💀
        </motion.div>
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', marginTop: 'var(--spacing-md)' }}>
          {name} ha fallecido
        </p>
      </motion.div>
    );
  }

  if (stage === 'egg' && onHatch) {
    return (
      <motion.div className="pet-display-container">
        <motion.div
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHatch}
        >
          <div style={{ fontSize: '5rem' }}>🥚</div>
        </motion.div>
        <p style={{ 
          fontFamily: 'var(--font-pixel)', 
          fontSize: '0.6rem', 
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--spacing-md)',
          textAlign: 'center'
        }}>
          Click para hacer eclosión
        </p>
      </motion.div>
    );
  }

  const animationName = animation || (isSleeping ? 'blink' : currentAnimation);
  const animConfig = ANIMATIONS_CONFIG[animationName as keyof typeof ANIMATIONS_CONFIG];
  const assetPath = `/assets/pets/${color}/${animationName}.png`;
  const totalFrames = animConfig?.frames || 1;
  const frameHeight = animConfig?.frameHeight || 24;
  const frameWidth = animConfig?.frameWidth || 32;
  const bgPosition = `-${currentFrame * frameWidth}px 0`;

  return (
    <motion.div
      className="pet-display-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundImage: 'url("/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated' as any,
      }}
    >
      <div className="pixel-pet-wrapper" style={{ zIndex: 1, position: 'relative' }}>
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
            imageRendering: 'pixelated' as any
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
    </motion.div>
  );
};

export default PetDisplay;
