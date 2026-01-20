import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/design-system.css';
import './styles/App.css';
import PetDisplay from './components/PetDisplay';
import { StatsDisplay } from './components/StatsDisplay';
import { ActionsGrid } from './components/ActionButtons';
import { NotificationContainer } from './components/Notification';
import { AudioControls } from './components/AudioControls';
import { BottomNav } from './components/BottomNav';
import Minigames from './components/Minigames';
import SkateGame from './components/SkateGame';
import UserProfileScreen from './components/UserProfile';
import { useAuth } from './contexts/AuthContext';
import { useAudio } from './hooks/useAudio';
import { pageVariants } from './utils/animationVariants';
import { audioManager } from './utils/audioManager';
import { PetState, Inventory, Poop } from './types';

const initialPetState: PetState = {
  name: '',
  type: 'cat',
  color: 'white',
  hunger: 100,
  happiness: 100,
  energy: 100,
  cleanliness: 100,
  health: 100,
  stage: 'egg',
  level: 1,
  exp: 0,
  isAlive: true,
  isSick: false,
  mood: 'contento',
  dangerLevel: 'normal',
  coins: 50,
  age: 0,
  lastFed: Date.now(),
  lastPlayed: Date.now(),
  lastCleaned: Date.now(),
  birthDate: Date.now(),
  lastUpdate: Date.now(),
  criticalHungerStart: null,
  criticalHealthStart: null,
  criticalComboStart: null,
  isSleeping: false,
  sleepStartTime: null,
  sleepStartEnergy: null,
};

const initialInventory: Inventory = {
  food: 5,
  medicine: 2,
  treats: 1,
  soap: 3,
};

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

function App() {
  const [pet, setPet] = useState<PetState>(initialPetState);
  const [inventory, setInventory] = useState<Inventory>(initialInventory);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'shop' | 'stats' | 'play'>('home');
  const [showNameInput, setShowNameInput] = useState(true);
  const [message, setMessage] = useState('');
  const [animation, setAnimation] = useState('');
  const [isSleeping, setIsSleeping] = useState(false);
  const [poops, setPoops] = useState<Poop[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [activeGame, setActiveGame] = useState<'skate-game' | null>(null);

  const sleepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sleepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sleepStartEnergyRef = useRef(0);
  const sleepStartTimeRef = useRef(0);
  const previousCleanlinessRef = useRef(100);

  const {
    isInitialized: audioInitialized,
    playFeed,
    playPlay,
    playClean,
    playSleep,
    playWake,
    playMedicine,
    playTreat,
    playHappy,
    playCritical,
    playEvolution,
    playLevelUp,
    playPoop,
    playCoin,
    playEggHatch,
    playDeath,
    playHover,
    playClick,
  } = useAudio({ muted: isAudioMuted });

  const { user } = useAuth();

  useEffect(() => {
    const initAudioOnInteraction = async () => {
      if (audioInitialized) return;
      
      const handleInteraction = async () => {
        await audioManager.resume();
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      };

      document.addEventListener('click', handleInteraction);
      document.addEventListener('keydown', handleInteraction);

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      };
    };

    initAudioOnInteraction();
  }, [audioInitialized]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  }, []);

  useEffect(() => {
    const savedPet = localStorage.getItem('tamagotchiPet');
    const savedInventory = localStorage.getItem('tamagotchiInventory');

    if (savedPet) {
      try {
        const loadedPet = JSON.parse(savedPet);
        loadedPet.dangerLevel = loadedPet.dangerLevel || 'normal';
        loadedPet.lastUpdate = loadedPet.lastUpdate || Date.now();
        loadedPet.criticalHungerStart = loadedPet.criticalHungerStart || null;
        loadedPet.criticalHealthStart = loadedPet.criticalHealthStart || null;
        loadedPet.criticalComboStart = loadedPet.criticalComboStart || null;
        loadedPet.isSleeping = loadedPet.isSleeping || false;
        loadedPet.sleepStartTime = loadedPet.sleepStartTime || null;
        loadedPet.sleepStartEnergy = loadedPet.sleepStartEnergy || null;
        loadedPet.birthDate = loadedPet.birthDate || Date.now();

        const timeElapsed = Date.now() - (loadedPet.lastUpdate || Date.now());
        const minutesElapsed = timeElapsed / (1000 * 60);
        loadedPet.age = Math.floor((Date.now() - loadedPet.birthDate) / (1000 * 60 * 60 * 24));

        if (!loadedPet.isSleeping && loadedPet.stage !== 'egg' && loadedPet.isAlive) {
          const decayRate = minutesElapsed / 0.5;
          loadedPet.hunger = Math.max(0, loadedPet.hunger - (2 * decayRate));
          loadedPet.happiness = Math.max(0, loadedPet.happiness - (1.5 * decayRate));
          loadedPet.energy = Math.max(0, loadedPet.energy - (1 * decayRate));
          loadedPet.cleanliness = Math.max(0, loadedPet.cleanliness - (0.8 * decayRate));

          if (loadedPet.cleanliness < 20) {
            const healthDecay = loadedPet.hunger < 30 ? (3 * decayRate) : (1.5 * decayRate);
            loadedPet.health = Math.max(0, loadedPet.health - healthDecay);
          } else if (loadedPet.cleanliness > 50 && loadedPet.health < 100) {
            loadedPet.health = Math.min(100, loadedPet.health + (0.5 * decayRate));
          }

          if (loadedPet.hunger === 0) {
            loadedPet.health = Math.max(0, loadedPet.health - (2 * decayRate));
          }

          if (loadedPet.health === 0 && !loadedPet.criticalHealthStart) {
            loadedPet.criticalHealthStart = loadedPet.lastUpdate || Date.now();
          } else if (loadedPet.health > 0) {
            loadedPet.criticalHealthStart = null;
          }

          const now = Date.now();
          if (loadedPet.criticalHungerStart && (now - loadedPet.criticalHungerStart) >= 7200000) {
            loadedPet.isAlive = false;
          }
          if (loadedPet.criticalHealthStart && (now - loadedPet.criticalHealthStart) >= 1800000) {
            loadedPet.isAlive = false;
          }

          let dangerLevel = 'normal';
          if (loadedPet.hunger === 0 || loadedPet.health === 0) {
            dangerLevel = 'agonizante';
          } else if (loadedPet.hunger < 10 || loadedPet.health < 10) {
            dangerLevel = 'critico';
          } else if (loadedPet.hunger < 30 || loadedPet.health < 30) {
            dangerLevel = 'alerta';
          }
          loadedPet.dangerLevel = dangerLevel;

          let mood = 'contento';
          let isSick = false;
          if (dangerLevel === 'agonizante') {
            mood = 'agonizando';
            isSick = true;
          } else if (dangerLevel === 'critico') {
            mood = 'enfermo';
            isSick = true;
          } else if (loadedPet.health < 30 || loadedPet.cleanliness < 20) {
            mood = 'enfermo';
            isSick = true;
          } else if (loadedPet.happiness > 80 && loadedPet.energy > 70 && loadedPet.hunger > 70) {
            mood = 'juguetón';
          }
          loadedPet.mood = mood;
          loadedPet.isSick = isSick;
        }

        loadedPet.lastUpdate = Date.now();
        setPet(loadedPet);
        setShowNameInput(false);
        setIsSleeping(loadedPet.isSleeping || false);
      } catch (error) {
        console.error('Error loading pet data:', error);
      }
    }

    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (error) {
        console.error('Error loading inventory data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (pet.name) {
      localStorage.setItem('tamagotchiPet', JSON.stringify(pet));
      localStorage.setItem('tamagotchiInventory', JSON.stringify(inventory));
    }
  }, [pet, inventory]);

  useEffect(() => {
    if (showNameInput || !pet.isAlive || pet.stage === 'egg') return;

    const decayInterval = setInterval(() => {
      setPet(prev => {
        if (prev.isSleeping) {
          return { ...prev, lastUpdate: Date.now() };
        }

        const newHunger = Math.max(0, prev.hunger - 2);
        const newHappiness = Math.max(0, prev.happiness - 1.5);
        const newEnergy = Math.max(0, prev.energy - 1);
        const newCleanliness = Math.max(0, prev.cleanliness - 0.8);

        let newHealth = prev.health;
        if (newCleanliness < 20) {
          const healthDecay = newHunger < 30 ? 3 : 1.5;
          newHealth = Math.max(0, newHealth - healthDecay);
        } else if (newCleanliness > 50 && newHealth < 100) {
          newHealth = Math.min(100, newHealth + 0.5);
        }
        if (newHunger === 0) {
          newHealth = Math.max(0, newHealth - 2);
        }

        const now = Date.now();
        let newCriticalHungerStart = prev.criticalHungerStart;
        let newCriticalHealthStart = prev.criticalHealthStart;
        let newCriticalComboStart = prev.criticalComboStart;

        if (newHunger === 0 && !newCriticalHungerStart) {
          newCriticalHungerStart = now;
        } else if (newHunger > 0) {
          newCriticalHungerStart = null;
        }

        if (newHealth === 0 && !newCriticalHealthStart) {
          newCriticalHealthStart = now;
        } else if (newHealth > 0) {
          newCriticalHealthStart = null;
        }

        if (newHunger < 10 && newHealth < 10) {
          if (!newCriticalComboStart) {
            newCriticalComboStart = now;
          }
        } else {
          newCriticalComboStart = null;
        }

        let isAlive = true;
        if (newCriticalHungerStart && (now - newCriticalHungerStart) >= 7200000) {
          isAlive = false;
        }
        if (newCriticalHealthStart && (now - newCriticalHealthStart) >= 1800000) {
          isAlive = false;
        }
        if (newCriticalComboStart && (now - newCriticalComboStart) >= 1800000) {
          isAlive = false;
        }

        let dangerLevel: 'normal' | 'alerta' | 'critico' | 'agonizante' = 'normal';
        if (newHunger === 0 || newHealth === 0) {
          dangerLevel = 'agonizante';
        } else if (newHunger < 10 || newHealth < 10) {
          dangerLevel = 'critico';
        } else if (newHunger < 30 || newHealth < 30) {
          dangerLevel = 'alerta';
        }

        let mood: PetState['mood'] = 'contento';
        let isSick = false;
        if (dangerLevel === 'agonizante') {
          mood = 'agonizando';
          isSick = true;
        } else if (dangerLevel === 'critico') {
          mood = 'enfermo';
          isSick = true;
        } else if (newHealth < 30 || newCleanliness < 20) {
          mood = 'enfermo';
          isSick = true;
        } else if (newHappiness > 80 && newEnergy > 70 && newHunger > 70) {
          mood = 'juguetón';
        } else {
          const stats = [
            { value: newHunger, mood: 'hambriento' as const, threshold: 30 },
            { value: newEnergy, mood: 'cansado' as const, threshold: 30 },
            { value: newHappiness, mood: 'triste' as const, threshold: 40 }
          ];
          const lowStats = stats.filter(stat => stat.value < stat.threshold);
          if (lowStats.length > 0) {
            const lowestStat = lowStats.reduce((prev, current) =>
              current.value < prev.value ? current : prev
            );
            mood = lowestStat.mood;
          }
        }

        if (!prev.isAlive && isAlive) {
          playHappy();
          addNotification('Tu mascota se ha recuperado!', 'success');
        } else if (prev.isAlive && !isAlive) {
          playDeath();
          addNotification('Tu mascota ha fallecido...', 'danger');
        } else if (dangerLevel === 'critico' && prev.dangerLevel !== 'critico') {
          playCritical();
          addNotification('Tu mascota necesita atención!', 'warning');
        }

        return {
          ...prev,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          cleanliness: newCleanliness,
          health: newHealth,
          isSick,
          mood,
          isAlive,
          dangerLevel,
          criticalHungerStart: newCriticalHungerStart,
          criticalHealthStart: newCriticalHealthStart,
          criticalComboStart: newCriticalComboStart,
          lastUpdate: Date.now(),
        };
      });
    }, 30000);

    return () => clearInterval(decayInterval);
  }, [showNameInput, pet.isAlive, pet.stage, addNotification]);

  useEffect(() => {
    if (showNameInput || !pet.isAlive) return;

    const ageInterval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        age: Math.floor((Date.now() - prev.birthDate) / (1000 * 60 * 60 * 24)),
      }));
    }, 3600000);

    return () => clearInterval(ageInterval);
  }, [showNameInput, pet.isAlive]);

  const clearSleepState = useCallback(() => {
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
      sleepTimeoutRef.current = null;
    }
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
    }
    if (isSleeping) {
      setIsSleeping(false);
      setAnimation('');
      setPet(prev => ({
        ...prev,
        isSleeping: false,
        sleepStartTime: null,
        sleepStartEnergy: null,
      }));
      playWake();
    }
  }, [isSleeping, playWake]);

  const generatePoop = useCallback(() => {
    const position = Math.random();
    let x, y;

    if (position < 0.33) {
      x = Math.random() * 20 + 8;
      y = Math.random() * 30 + 35;
    } else if (position < 0.66) {
      x = Math.random() * 20 + 65;
      y = Math.random() * 30 + 35;
    } else {
      x = Math.random() * 50 + 25;
      y = Math.random() * 15 + 60;
    }

    const newPoop = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    setPoops(prev => [...prev, newPoop]);
    playPoop();
  }, [playPoop]);

  const cleanPoop = useCallback((poopId: number) => {
    setPoops(prev => prev.filter(p => p.id !== poopId));
    setPet(prev => ({ ...prev, coins: prev.coins + 1 }));
    playCoin();
    addNotification('+1 moneda!', 'success');
  }, [playCoin, addNotification]);

  useEffect(() => {
    if (showNameInput || !pet.isAlive || pet.stage === 'egg') return;

    const cleanlinessDropThreshold = 15;
    const previousCleanliness = previousCleanlinessRef.current;
    const currentCleanliness = pet.cleanliness;

    if (previousCleanliness - currentCleanliness >= cleanlinessDropThreshold) {
      generatePoop();
      previousCleanlinessRef.current = currentCleanliness;
    }

    if (currentCleanliness > previousCleanliness) {
      previousCleanlinessRef.current = currentCleanliness;
      setPoops([]);
    }
  }, [pet.cleanliness, pet.isAlive, pet.stage, showNameInput, generatePoop]);

  useEffect(() => {
    if (pet.level >= 5 && pet.stage === 'baby') {
      setPet(prev => ({ ...prev, stage: 'teen' }));
      playEvolution();
      addNotification('Tu mascota ha crecido a adolescente!', 'success');
    } else if (pet.level >= 10 && pet.stage === 'teen') {
      setPet(prev => ({ ...prev, stage: 'adult' }));
      playEvolution();
      addNotification('Tu mascota es ahora adulta!', 'success');
    }
  }, [pet.level, pet.stage, playEvolution, addNotification]);

  useEffect(() => {
    const expNeeded = pet.level * 100;
    if (pet.exp >= expNeeded) {
      setPet(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: prev.exp - expNeeded,
        coins: prev.coins + 10,
      }));
      playLevelUp();
      addNotification(`Nivel ${pet.level + 1}! +10 monedas`, 'success');
    }
  }, [pet.exp, pet.level, playLevelUp, addNotification]);

  const feed = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.food <= 0) {
      addNotification('Sin comida! Ve a la tienda', 'warning');
      return;
    }

    clearSleepState();

    const makesMess = Math.random() < 0.5;
    const cleanlinessReduction = makesMess ? 10 : 0;

    setInventory(prev => ({ ...prev, food: prev.food - 1 }));
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 35),
      happiness: Math.min(100, prev.happiness + 10),
      cleanliness: Math.max(0, prev.cleanliness - cleanlinessReduction),
      exp: prev.exp + 10,
      lastFed: Date.now(),
    }));
    setAnimation('jump');

    if (makesMess) {
      addNotification('Nam nam! *Se ensucia*', 'info');
    } else {
      addNotification('Nam nam!', 'success');
    }
    playFeed();

    setTimeout(() => setAnimation(''), 2000);
  }, [pet.isAlive, inventory.food, clearSleepState, addNotification, playFeed]);

  const sleep = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (isSleeping) {
      addNotification('Tu mascota ya está durmiendo', 'info');
      return;
    }

    const sleepStart = Date.now();
    sleepStartEnergyRef.current = pet.energy;
    sleepStartTimeRef.current = sleepStart;

    setIsSleeping(true);
    setAnimation('blink');

    setPet(prev => ({
      ...prev,
      isSleeping: true,
      sleepStartTime: sleepStart,
      sleepStartEnergy: prev.energy,
    }));

    addNotification('Dulces sueños... (5 min)', 'info');
    playSleep();

    const totalSleepTime = 300000;
    const updateInterval = 1000;

    sleepIntervalRef.current = setInterval(() => {
      setPet(prev => {
        const timeSlept = Date.now() - sleepStartTimeRef.current;
        const sleepProgress = Math.min(timeSlept / totalSleepTime, 1);
        const energyToRecover = 100 - sleepStartEnergyRef.current;
        const newEnergy = Math.min(100, sleepStartEnergyRef.current + (energyToRecover * sleepProgress));

        return { ...prev, energy: newEnergy };
      });
    }, updateInterval);

    sleepTimeoutRef.current = setTimeout(() => {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
        sleepIntervalRef.current = null;
      }

      setPet(prev => ({
        ...prev,
        energy: 100,
        happiness: Math.min(100, prev.happiness + 10),
      }));

      addNotification('Tu mascota está completamente descansada', 'success');
      sleepTimeoutRef.current = null;
    }, totalSleepTime);
  }, [pet.isAlive, pet.energy, isSleeping, addNotification, playSleep]);

  const clean = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.soap <= 0) {
      addNotification('Sin jabón! Ve a la tienda', 'warning');
      return;
    }

    clearSleepState();

    setInventory(prev => ({ ...prev, soap: prev.soap - 1 }));
    setPet(prev => ({
      ...prev,
      cleanliness: 100,
      happiness: Math.min(100, prev.happiness + 15),
      exp: prev.exp + 8,
      lastCleaned: Date.now(),
    }));

    addNotification('Qué limpio!', 'success');
    playClean();
  }, [pet.isAlive, inventory.soap, clearSleepState, addNotification, playClean]);

  const giveMedicine = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.medicine <= 0) {
      addNotification('Sin medicina! Ve a la tienda', 'warning');
      return;
    }

    clearSleepState();

    setInventory(prev => ({ ...prev, medicine: prev.medicine - 1 }));
    setPet(prev => {
      const newHealth = Math.min(100, prev.health + 40);
      const newCleanliness = Math.min(100, prev.cleanliness + 30);
      const stillSick = newHealth < 50 || newCleanliness < 30;

      return {
        ...prev,
        health: newHealth,
        cleanliness: newCleanliness,
        isSick: stillSick,
        mood: stillSick ? 'enfermo' : 'contento',
        exp: prev.exp + 20,
      };
    });

    addNotification('Medicina administrada!', 'success');
    playMedicine();
  }, [pet.isAlive, inventory.medicine, clearSleepState, addNotification, playMedicine]);

  const giveTreat = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (inventory.treats <= 0) {
      addNotification('Sin golosinas! Ve a la tienda', 'warning');
      return;
    }

    clearSleepState();

    setInventory(prev => ({ ...prev, treats: prev.treats - 1 }));
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      hunger: Math.min(100, prev.hunger + 10),
      exp: prev.exp + 15,
    }));

    addNotification('Qué rico!', 'success');
    playTreat();
  }, [pet.isAlive, inventory.treats, clearSleepState, addNotification, playTreat]);

  const play = useCallback(() => {
    if (!pet.isAlive) {
      addNotification('Tu mascota ha fallecido...', 'danger');
      return;
    }
    if (pet.energy < 30) {
      addNotification('Tu mascota necesita más energía (mín. 30)', 'warning');
      return;
    }

    clearSleepState();

    addNotification('Elige un juego!', 'info');
    setShowGameModal(true);
  }, [pet.isAlive, pet.energy, clearSleepState, addNotification]);

  const wake = useCallback(() => {
    clearSleepState();
    playWake();
    addNotification('Buenos días! ☀️', 'success');
  }, [clearSleepState, playWake, addNotification]);

  const handleHatch = useCallback(() => {
    setPet(prev => ({
      ...prev,
      stage: 'baby',
      birthDate: Date.now(),
      age: 0,
    }));
    addNotification(`${pet.name} ha nacido! Bienvenido!`, 'success');
    playEggHatch();
  }, [pet.name, addNotification, playEggHatch]);

  const handleNameSubmit = useCallback((name: string) => {
    setPet(prev => ({ ...prev, name, birthDate: Date.now(), type: 'cat', color: 'white' }));
    setShowNameInput(false);
  }, []);

  const resetGame = useCallback(() => {
    if (window.confirm('Estás seguro de que quieres reiniciar?')) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsAudioMuted(prev => !prev);
  }, []);

  const handleHover = useCallback((action: string) => {
    playHover();
  }, [playHover]);

  if (showNameInput) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '1.5rem',
            color: 'var(--color-neon-cyan)',
            marginBottom: 'var(--spacing-xl)',
            textShadow: '0 0 20px var(--color-neon-cyan)',
          }}>
            🥚 Mi Tamagotchi
          </h1>
          <NameInput onSubmit={handleNameSubmit} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AudioControls isMuted={isAudioMuted} onToggleMute={toggleMute} />
      <NotificationContainer notifications={notifications} onRemove={() => {}} />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div
              key="home"
              className="screen-container"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <PetDisplay
                name={pet.name}
                stage={pet.stage}
                mood={pet.mood}
                isSleeping={isSleeping}
                isAlive={pet.isAlive}
                animation={animation}
                onHatch={pet.stage === 'egg' ? handleHatch : undefined}
              />

              <div style={{ textAlign: 'center' }}>
                <h2 className="pet-name">{pet.name}</h2>
                <p className="pet-stage">
                  {pet.stage === 'egg' ? '🥚 HUEVO' : pet.stage === 'baby' ? '🐣 BEBÉ' : pet.stage === 'teen' ? '🐥 JOVEN' : '🐱 ADULTO'}
                </p>
              </div>

              <StatsDisplay
                hunger={pet.hunger}
                happiness={pet.happiness}
                energy={pet.energy}
                cleanliness={pet.cleanliness}
                health={pet.health}
                coins={pet.coins}
                level={pet.level}
                age={pet.age}
              />

              <ActionsGrid
                onFeed={feed}
                onPlay={play}
                onSleep={sleep}
                onClean={clean}
                onMedicine={giveMedicine}
                onTreat={giveTreat}
                onWake={wake}
                needsFeeding={pet.hunger < 30}
                needsCleaning={pet.cleanliness < 40}
                needsMedicine={pet.isSick || pet.health < 50}
                isSleeping={isSleeping}
                hasLowEnergy={pet.energy < 30}
                onHoverFeed={() => handleHover('feed')}
                onHoverPlay={() => handleHover('play')}
                onHoverSleep={() => handleHover('sleep')}
                onHoverClean={() => handleHover('clean')}
                onHoverMedicine={() => handleHover('medicine')}
                onHoverTreat={() => handleHover('treat')}
                onHoverWake={() => handleHover('wake')}
              />

              {poops.length > 0 && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                  }}
                >
                  {poops.map(poop => (
                    <motion.div
                      key={poop.id}
                      style={{
                        position: 'absolute',
                        left: `${poop.x}%`,
                        top: `${poop.y}%`,
                        fontSize: '1.5rem',
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => cleanPoop(poop.id)}
                    >
                      💩
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {currentScreen === 'shop' && (
            <motion.div
              key="shop"
              className="screen-container"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ShopScreen
                pet={pet}
                inventory={inventory}
                onBuyItem={(item, price) => {
                  if (pet.coins < price) {
                    addNotification('No tienes suficientes monedas', 'warning');
                    return;
                  }
                  setPet(prev => ({ ...prev, coins: prev.coins - price }));
                  setInventory(prev => ({ ...prev, [item]: prev[item as keyof Inventory] + 1 }));
                  addNotification(`Has comprado ${item}!`, 'success');
                  playCoin();
                }}
              />
            </motion.div>
          )}

          {currentScreen === 'stats' && (
            <motion.div
              key="stats"
              className="screen-container"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <StatsScreen
                pet={pet}
                inventory={inventory}
                onReset={resetGame}
              />
            </motion.div>
          )}

          {currentScreen === 'play' && (
            <motion.div
              key="play"
              className="screen-container"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <PlayScreen
                petName={pet.name}
                coins={pet.coins}
                onClose={() => setCurrentScreen('home')}
                onWin={(reward) => {
                  setPet(prev => ({
                    ...prev,
                    coins: prev.coins + reward.coins,
                    exp: prev.exp + reward.exp,
                    happiness: Math.min(100, prev.happiness + reward.happiness),
                    energy: Math.max(0, prev.energy - 10),
                  }));
                  addNotification(`Victoria! +${reward.coins} monedas`, 'success');
                  playCoin();
                }}
                onLose={() => {
                  setPet(prev => ({
                    ...prev,
                    energy: Math.max(0, prev.energy - 8),
                    happiness: Math.max(0, prev.happiness - 5),
                  }));
                  addNotification('Mejor suerte la próxima vez', 'info');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav
        currentScreen={currentScreen}
        onNavigate={(screen: 'home' | 'shop' | 'stats' | 'play') => setCurrentScreen(screen)}
        onShowProfile={() => setShowUserProfile(true)}
      />

      {showGameModal && (
        <Minigames
          petName={pet.name}
          coins={pet.coins}
          onClose={() => setShowGameModal(false)}
          onWin={(reward) => {
            setPet(prev => ({
              ...prev,
              coins: prev.coins + reward.coins,
              exp: prev.exp + reward.exp,
              happiness: Math.min(100, prev.happiness + reward.happiness),
            }));
            addNotification(`Victoria! +${reward.coins} monedas`, 'success');
            playCoin();
          }}
          onLose={() => {
            setPet(prev => ({
              ...prev,
              happiness: Math.max(0, prev.happiness - 5),
            }));
            addNotification('Mejor suerte la próxima vez', 'info');
          }}
          onOpenSkateGame={() => {
            setActiveGame('skate-game');
          }}
          onWinGame={playHappy}
          onStartGame={() => {
            setPet(prev => ({
              ...prev,
              energy: Math.max(0, prev.energy - 2),
              happiness: Math.min(100, prev.happiness + 5),
              exp: prev.exp + 2,
            }));
          }}
        />
      )}

      {activeGame === 'skate-game' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--color-bg-darkest)',
          zIndex: 100,
        }}>
          <SkateGame
            onGameEnd={(score) => {
              setActiveGame(null);
              const coinsEarned = Math.floor(score / 10);
              setPet(prev => ({
                ...prev,
                coins: prev.coins + coinsEarned,
                exp: prev.exp + 25,
                energy: Math.max(0, prev.energy - 10),
              }));
              addNotification(`Skate completado! +${coinsEarned} monedas`, 'success');
              playCoin();
            }}
          />
          <motion.button
            onClick={() => setActiveGame(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              top: 'var(--spacing-lg)',
              right: 'var(--spacing-lg)',
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 110,
            }}
          >
            ✕
          </motion.button>
        </div>
      )}

      {showUserProfile && (
        <UserProfileScreen onClose={() => setShowUserProfile(false)} />
      )}

      {pet.coins < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            background: 'var(--color-bg-medium)',
            border: '2px solid var(--color-neon-amber)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.6rem',
            color: 'var(--color-neon-amber)',
            cursor: 'pointer',
            zIndex: 50,
          }}
          onClick={() => setCurrentScreen('shop')}
        >
          💰 Necesitas más monedas!
        </motion.div>
      )}
    </div>
  );
}

function NameInput({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
        maxWidth: '300px',
        width: '100%',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <label
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
        }}
      >
        Cómo quieres llamar a tu mascota?
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={12}
        placeholder="Nombre..."
        style={{
          padding: 'var(--spacing-md)',
          fontFamily: 'var(--font-retro)',
          fontSize: '1.5rem',
          background: 'var(--color-bg-medium)',
          border: '2px solid var(--color-neon-cyan)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-primary)',
          textAlign: 'center',
          outline: 'none',
        }}
      />
      <motion.button
        type="submit"
        disabled={!name.trim()}
        whileHover={{ scale: name.trim() ? 1.05 : 1 }}
        whileTap={{ scale: name.trim() ? 0.95 : 1 }}
        style={{
          padding: 'var(--spacing-md)',
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.8rem',
          background: name.trim() ? 'var(--color-neon-cyan)' : 'var(--color-bg-light)',
          color: name.trim() ? 'var(--color-bg-darkest)' : 'var(--color-text-muted)',
          border: '2px solid var(--color-neon-cyan)',
          borderRadius: 'var(--radius-md)',
          cursor: name.trim() ? 'pointer' : 'not-allowed',
        }}
      >
        Comenzar!
      </motion.button>
    </motion.form>
  );
}

function ShopScreen({ pet, inventory, onBuyItem }: {
  pet: PetState;
  inventory: Inventory;
  onBuyItem: (item: string, price: number) => void;
}) {
  const items = [
    { id: 'food', name: 'Comida', icon: '🍖', price: 5, count: inventory.food },
    { id: 'medicine', name: 'Medicina', icon: '💊', price: 10, count: inventory.medicine },
    { id: 'treats', name: 'Golosinas', icon: '🍬', price: 8, count: inventory.treats },
    { id: 'soap', name: 'Jabón', icon: '🧼', price: 3, count: inventory.soap },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '1rem',
        color: 'var(--color-neon-amber)',
        textAlign: 'center',
      }}>
        🛒 Tienda
      </h2>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-sm)',
        background: 'var(--color-bg-dark)',
        borderRadius: 'var(--radius-md)',
      }}>
        <span>🪙</span>
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: 'var(--color-neon-amber)' }}>
          {pet.coins}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
        {items.map(item => (
          <motion.button
            key={item.id}
            onClick={() => onBuyItem(item.id, item.price)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md)',
              background: 'var(--color-bg-medium)',
              border: '2px solid var(--color-bg-light)',
              borderRadius: 'var(--radius-md)',
              cursor: pet.coins >= item.price ? 'pointer' : 'not-allowed',
              opacity: pet.coins >= item.price ? 1 : 0.5,
            }}
          >
            <span style={{ fontSize: '2rem' }}>{item.icon}</span>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--color-text-primary)' }}>
              {item.name}
            </span>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--color-neon-amber)' }}>
              {item.price} 🪙
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
              x{item.count}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StatsScreen({ pet, inventory, onReset }: {
  pet: PetState;
  inventory: Inventory;
  onReset: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '1rem',
        color: 'var(--color-neon-cyan)',
        textAlign: 'center',
      }}>
        📊 Estadísticas
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        background: 'var(--color-bg-medium)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <StatRow label="Nombre" value={pet.name} />
        <StatRow label="Etapa" value={pet.stage === 'egg' ? 'Huevo' : pet.stage === 'baby' ? 'Bebé' : pet.stage === 'teen' ? 'Joven' : 'Adulto'} />
        <StatRow label="Nivel" value={pet.level} />
        <StatRow label="Experiencia" value={`${pet.exp}/${pet.level * 100}`} />
        <StatRow label="Edad" value={`${pet.age} días`} />
        <StatRow label="Monedas" value={pet.coins} />
        <StatRow label="Comida" value={inventory.food} />
        <StatRow label="Medicina" value={inventory.medicine} />
        <StatRow label="Golosinas" value={inventory.treats} />
        <StatRow label="Jabón" value={inventory.soap} />
      </div>

      <motion.button
        onClick={onReset}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: 'var(--spacing-md)',
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.7rem',
          color: 'var(--color-danger)',
          background: 'transparent',
          border: '2px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
        }}
      >
        🔄 Reiniciar Juego
      </motion.button>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: 'var(--spacing-sm)',
      borderBottom: '1px solid var(--color-bg-light)',
    }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--color-text-primary)' }}>
        {value}
      </span>
    </div>
  );
}

function PlayScreen({ petName, coins, onClose, onWin, onLose }: {
  petName: string;
  coins: number;
  onClose: () => void;
  onWin: (reward: { coins: number; exp: number; happiness: number }) => void;
  onLose: () => void;
}) {
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [score, setScore] = useState(0);

  const handleGame = (result: 'win' | 'lose') => {
    setGameResult(result);
    if (result === 'win') {
      onWin({ coins: 10, exp: 20, happiness: 10 });
    } else {
      onLose();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '1rem',
          color: 'var(--color-neon-magenta)',
        }}>
          🎮 Minijuegos
        </h2>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            fontSize: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ✕
        </motion.button>
      </div>

      <div style={{
        display: 'flex',
        gap: 'var(--spacing-lg)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <MiniGameButton
          icon="🎰"
          name="Tragaperras"
          description="Gira y gana!"
          onClick={() => handleGame(Math.random() > 0.5 ? 'win' : 'lose')}
        />
        <MiniGameButton
          icon="🧠"
          name="Memoria"
          description="Encuentra pares"
          onClick={() => handleGame(Math.random() > 0.4 ? 'win' : 'lose')}
        />
        <MiniGameButton
          icon="🛹"
          name="Skate"
          description="Haz tricks!"
          onClick={() => handleGame(Math.random() > 0.6 ? 'win' : 'lose')}
        />
      </div>

      {gameResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 'var(--spacing-lg)',
            background: gameResult === 'win' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)',
            border: `2px solid ${gameResult === 'win' ? 'var(--color-success)' : 'var(--color-danger)'}`,
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
            {gameResult === 'win' ? '🎉' : '😢'}
          </p>
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
            {gameResult === 'win' ? 'Victoria!' : 'Mejor suerte la próxima'}
          </p>
          <motion.button
            onClick={() => setGameResult(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.6rem',
              background: 'var(--color-neon-cyan)',
              color: 'var(--color-bg-darkest)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Jugar de nuevo
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

function MiniGameButton({ icon, name, description, onClick }: {
  icon: string;
  name: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-lg)',
        background: 'var(--color-bg-medium)',
        border: '2px solid var(--color-bg-light)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        minWidth: '120px',
      }}
    >
      <span style={{ fontSize: '3rem' }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--color-text-primary)' }}>
        {name}
      </span>
      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
        {description}
      </span>
    </motion.button>
  );
}

export default App;
