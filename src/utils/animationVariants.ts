import { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const slideUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const scaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const bounceVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

export const pulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-8, 0, -8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const blinkVariants: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: [1, 1, 0.3, 1, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
      times: [0, 0.45, 0.5, 0.55, 1],
    },
  },
};

export const eatVariants: Variants = {
  initial: {
    scale: 1,
  },
  eat: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export const jumpVariants: Variants = {
  initial: {
    y: 0,
  },
  jump: {
    y: [-15, 0, -10, 0],
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const shakeVariants: Variants = {
  initial: {
    x: 0,
  },
  shake: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.4,
      ease: 'linear',
    },
  },
};

export const wobbleVariants: Variants = {
  initial: {
    rotate: 0,
  },
  wobble: {
    rotate: [-3, 3, -2, 2, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

export const glowVariants: Variants = {
  initial: {
    boxShadow: '0 0 0 rgba(0, 255, 136, 0)',
  },
  glow: {
    boxShadow: [
      '0 0 0 rgba(0, 255, 136, 0)',
      '0 0 20px rgba(0, 255, 136, 0.4)',
      '0 0 40px rgba(0, 255, 136, 0.2)',
      '0 0 0 rgba(0, 255, 136, 0)',
    ],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

export const statBarVariants: Variants = {
  initial: {
    width: '0%',
  },
  animate: {
    width: 'var(--stat-width)',
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const notificationVariants: Variants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const modalVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export const modalContentVariants: Variants = {
  initial: {
    scale: 0.9,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

export const petStageVariants: Variants = {
  egg: {
    scale: [1, 1.05, 1],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  baby: {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  teen: {
    y: [0, -5, 0],
    x: [0, 3, 0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  adult: {
    y: [0, -4, 0],
    x: [0, 5, 0, -5, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const sleepingVariants: Variants = {
  awake: {
    scale: 1,
    opacity: 1,
  },
  sleeping: {
    scale: [1, 0.98, 1],
    opacity: 0.7,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const idleVariants: Variants = {
  idle: {
    y: [0, -2, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  moving: {
    y: [0, -8, 0],
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const actionFeedbackVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  success: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    backgroundColor: ['rgba(0, 255, 136, 0.1)', 'rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0.1)'],
    transition: {
      duration: 0.4,
    },
  },
  error: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    backgroundColor: ['rgba(255, 68, 68, 0.1)', 'rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.1)'],
    transition: {
      duration: 0.4,
    },
  },
};

export const transitionSpring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const transitionGentle = {
  duration: 0.3,
  ease: 'easeOut',
};

export const transitionQuick = {
  duration: 0.15,
  ease: 'easeOut',
};
