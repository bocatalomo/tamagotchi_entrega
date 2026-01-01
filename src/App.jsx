import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import ShopScreen from './components/ShopScreen';
import StatsScreen from './components/StatsScreen';
import NameInput from './components/NameInput';
import Minigames from './components/Minigames';
import SkateGame from './components/SkateGame';
import EggScreen from './components/EggScreen';

function App() {
  // ==================== ESTADOS ====================
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showNameInput, setShowNameInput] = useState(true);
  const [showMinigames, setShowMinigames] = useState(false);
  const [showSkateGame, setShowSkateGame] = useState(false);
  const [message, setMessage] = useState('');
  const [animation, setAnimation] = useState('');
  const [isSleeping, setIsSleeping] = useState(false);
  const [poops, setPoops] = useState([]);

  // Ref para almacenar el timeout del sueño
  const sleepTimeoutRef = useRef(null);
  const sleepIntervalRef = useRef(null);
  const sleepStartEnergyRef = useRef(0);
  const sleepStartTimeRef = useRef(0);

  // Ref para rastrear limpieza anterior (para generar cacas)
  const previousCleanlinessRef = useRef(100);

  // Estado inicial de la mascota
  const initialPetState = {
    name: '',
    type: 'cat',
    color: 'white', // brown, white, black
    // Estadísticas principales
    hunger: 100,
    happiness: 100,
    energy: 100,
    cleanliness: 100,
    health: 100,
    // Progresión
    stage: 'egg', // egg, baby, teen, adult
    level: 1,
    exp: 0,
    // Estado
    isAlive: true,
    isSick: false,
    mood: 'contento',
    dangerLevel: 'normal', // normal, alerta, critico, agonizante
    // Recursos
    coins: 50,
    age: 0,
    // Timestamps
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastCleaned: Date.now(),
    birthDate: Date.now(),
    lastUpdate: Date.now(), // Para deterioro offline
    criticalHungerStart: null, // Cuando hunger llegó a 0
    criticalHealthStart: null, // Cuando health llegó a 0
    criticalComboStart: null, // Cuando ambos están críticos
    // Estado de sueño
    isSleeping: false,
    sleepStartTime: null,
    sleepStartEnergy: null
  };

  const [pet, setPet] = useState(initialPetState);
  const [inventory, setInventory] = useState({
    food: 5,
    medicine: 2,
    treats: 1,
    soap: 3
  });

  // ==================== CARGAR/GUARDAR DATOS ====================
  useEffect(() => {
    const savedPet = localStorage.getItem('tamagotchiPet');
    const savedInventory = localStorage.getItem('tamagotchiInventory');

    if (savedPet) {
      const loadedPet = JSON.parse(savedPet);

      // Migrar datos antiguos: asegurar que todos los nuevos campos existan
      loadedPet.dangerLevel = loadedPet.dangerLevel || 'normal';
      loadedPet.lastUpdate = loadedPet.lastUpdate || Date.now();
      loadedPet.criticalHungerStart = loadedPet.criticalHungerStart || null;
      loadedPet.criticalHealthStart = loadedPet.criticalHealthStart || null;
      loadedPet.criticalComboStart = loadedPet.criticalComboStart || null;
      loadedPet.isSleeping = loadedPet.isSleeping || false;
      loadedPet.sleepStartTime = loadedPet.sleepStartTime || null;
      loadedPet.sleepStartEnergy = loadedPet.sleepStartEnergy || null;
      loadedPet.birthDate = loadedPet.birthDate || Date.now(); // Si no existe, usar fecha actual

      // Calcular tiempo transcurrido desde la última actualización
      const timeElapsed = Date.now() - (loadedPet.lastUpdate || Date.now());
      const minutesElapsed = timeElapsed / (1000 * 60);

      // Calcular edad en días reales (24 horas = 1 día)
      loadedPet.age = Math.floor((Date.now() - loadedPet.birthDate) / (1000 * 60 * 60 * 24));

      // Aplicar deterioro offline SOLO si NO está durmiendo y NO está en etapa egg
      if (!loadedPet.isSleeping && loadedPet.stage !== 'egg' && loadedPet.isAlive) {
        // Deterioro por minuto (basado en el intervalo de 30 segundos = 0.5 min)
        const decayRate = minutesElapsed / 0.5; // Cuántos intervalos de 30 seg pasaron

        loadedPet.hunger = Math.max(0, loadedPet.hunger - (2 * decayRate));
        loadedPet.happiness = Math.max(0, loadedPet.happiness - (1.5 * decayRate));
        loadedPet.energy = Math.max(0, loadedPet.energy - (1 * decayRate));
        loadedPet.cleanliness = Math.max(0, loadedPet.cleanliness - (0.8 * decayRate));

        // Sistema de salud basado en limpieza
        if (loadedPet.cleanliness < 20) {
          const healthDecay = loadedPet.hunger < 30 ? (3 * decayRate) : (1.5 * decayRate);
          loadedPet.health = Math.max(0, loadedPet.health - healthDecay);
        } else if (loadedPet.cleanliness > 50 && loadedPet.health < 100) {
          loadedPet.health = Math.min(100, loadedPet.health + (0.5 * decayRate));
        }

        // Deterioro de salud por hambre = 0
        if (loadedPet.hunger === 0) {
          loadedPet.health = Math.max(0, loadedPet.health - (2 * decayRate));
          if (!loadedPet.criticalHungerStart) {
            loadedPet.criticalHungerStart = loadedPet.lastUpdate || Date.now();
          }
        } else {
          loadedPet.criticalHungerStart = null;
        }

        // Marcar inicio de salud crítica
        if (loadedPet.health === 0 && !loadedPet.criticalHealthStart) {
          loadedPet.criticalHealthStart = loadedPet.lastUpdate || Date.now();
        } else if (loadedPet.health > 0) {
          loadedPet.criticalHealthStart = null;
        }

        // Verificar condiciones de muerte
        const now = Date.now();

        // Muerte por hambre prolongada (2 horas = 7200000 ms)
        if (loadedPet.criticalHungerStart && (now - loadedPet.criticalHungerStart) >= 7200000) {
          loadedPet.isAlive = false;
        }

        // Muerte por salud = 0 prolongada (30 minutos = 1800000 ms)
        if (loadedPet.criticalHealthStart && (now - loadedPet.criticalHealthStart) >= 1800000) {
          loadedPet.isAlive = false;
        }

        // Muerte por combo crítico (hambre y salud < 10 por 30 min)
        if (loadedPet.hunger < 10 && loadedPet.health < 10) {
          if (!loadedPet.criticalComboStart) {
            loadedPet.criticalComboStart = loadedPet.lastUpdate || Date.now();
          } else if ((now - loadedPet.criticalComboStart) >= 1800000) {
            loadedPet.isAlive = false;
          }
        } else {
          loadedPet.criticalComboStart = null;
        }

        // Determinar nivel de peligro
        let dangerLevel = 'normal';
        if (loadedPet.hunger === 0 || loadedPet.health === 0) {
          dangerLevel = 'agonizante';
        } else if (loadedPet.hunger < 10 || loadedPet.health < 10) {
          dangerLevel = 'critico';
        } else if (loadedPet.hunger < 30 || loadedPet.health < 30) {
          dangerLevel = 'alerta';
        }
        loadedPet.dangerLevel = dangerLevel;

        // Determinar mood basado en stats
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
        } else {
          const stats = [
            { value: loadedPet.hunger, mood: 'hambriento', threshold: 30 },
            { value: loadedPet.energy, mood: 'cansado', threshold: 30 },
            { value: loadedPet.happiness, mood: 'triste', threshold: 40 }
          ];

          const lowStats = stats.filter(stat => stat.value < stat.threshold);
          if (lowStats.length > 0) {
            const lowestStat = lowStats.reduce((prev, current) =>
              current.value < prev.value ? current : prev
            );
            mood = lowestStat.mood;
          }
        }

        loadedPet.mood = mood;
        loadedPet.isSick = isSick;
      }

      // Restaurar estado de sueño si estaba durmiendo
      if (loadedPet.isSleeping && loadedPet.sleepStartTime && loadedPet.sleepStartEnergy !== null) {
        setIsSleeping(true);
        setAnimation('blink');
        sleepStartEnergyRef.current = loadedPet.sleepStartEnergy;
        sleepStartTimeRef.current = loadedPet.sleepStartTime;

        // Calcular cuánto tiempo ha dormido
        const timeSlept = Date.now() - loadedPet.sleepStartTime;
        const totalSleepTime = 300000; // 5 minutos

        // Si ya completó el ciclo de sueño, actualizar energía al 100%
        if (timeSlept >= totalSleepTime) {
          loadedPet.energy = 100;
        } else {
          // Calcular energía basándose en tiempo dormido offline
          const sleepProgress = Math.min(timeSlept / totalSleepTime, 1);
          const energyToRecover = 100 - loadedPet.sleepStartEnergy;
          loadedPet.energy = Math.min(100, loadedPet.sleepStartEnergy + (energyToRecover * sleepProgress));

          // Continuar el intervalo de sueño desde donde se quedó
          const updateInterval = 1000;
          sleepIntervalRef.current = setInterval(() => {
            setPet(prev => {
              const currentTimeSlept = Date.now() - sleepStartTimeRef.current;
              const currentProgress = Math.min(currentTimeSlept / totalSleepTime, 1);
              const newEnergy = Math.min(100, sleepStartEnergyRef.current + (energyToRecover * currentProgress));

              return {
                ...prev,
                energy: newEnergy
              };
            });
          }, updateInterval);

          // Timeout para el tiempo restante
          const remainingTime = totalSleepTime - timeSlept;
          if (remainingTime > 0) {
            sleepTimeoutRef.current = setTimeout(() => {
              if (sleepIntervalRef.current) {
                clearInterval(sleepIntervalRef.current);
                sleepIntervalRef.current = null;
              }

              setPet(prev => ({
                ...prev,
                energy: 100,
                happiness: Math.min(100, prev.happiness + 10)
              }));

              sleepTimeoutRef.current = null;
            }, remainingTime);
          }
        }
      }

      // Actualizar lastUpdate al tiempo actual
      loadedPet.lastUpdate = Date.now();

      setPet(loadedPet);
      setShowNameInput(false);
    }
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  useEffect(() => {
    if (!showNameInput && pet.name) {
      localStorage.setItem('tamagotchiPet', JSON.stringify(pet));
      localStorage.setItem('tamagotchiInventory', JSON.stringify(inventory));
    }
  }, [pet, inventory, showNameInput]);

  // ==================== SISTEMA DE EVOLUCIÓN ====================
  useEffect(() => {
    // Solo evoluciona si ya nació (no está en etapa egg)
    if (pet.stage === 'egg') return;

    if (pet.level >= 5 && pet.stage === 'baby') {
      setPet(prev => ({ ...prev, stage: 'teen' }));
      showMessage('Tu mascota ha crecido a adolescente');
    } else if (pet.level >= 10 && pet.stage === 'teen') {
      setPet(prev => ({ ...prev, stage: 'adult' }));
      showMessage('Tu mascota es ahora adulta');
    }
  }, [pet.level, pet.stage]);

  // Sistema de nivel basado en experiencia
  useEffect(() => {
    const expNeeded = pet.level * 100;
    if (pet.exp >= expNeeded) {
      setPet(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: prev.exp - expNeeded,
        coins: prev.coins + 10
      }));
      showMessage(`Nivel ${pet.level + 1}! +10 monedas`);
    }
  }, [pet.exp, pet.level]);

  // ==================== SISTEMA DE DETERIORO ====================
  useEffect(() => {
    // No deteriorar si está en etapa de huevo, en selección, muerto, o durmiendo
    if (showNameInput || !pet.isAlive || pet.stage === 'egg') return;

    const decayInterval = setInterval(() => {
      setPet(prev => {
        // No deteriorar si está durmiendo
        if (prev.isSleeping) {
          return { ...prev, lastUpdate: Date.now() };
        }

        // Deterioro de estadísticas
        const newHunger = Math.max(0, prev.hunger - 2);
        const newHappiness = Math.max(0, prev.happiness - 1.5);
        const newEnergy = Math.max(0, prev.energy - 1);
        const newCleanliness = Math.max(0, prev.cleanliness - 0.8);

        // Sistema de salud mejorado
        let newHealth = prev.health;

        // Salud baja si está sucio
        if (newCleanliness < 20) {
          const healthDecay = newHunger < 30 ? 3 : 1.5;
          newHealth = Math.max(0, newHealth - healthDecay);
        }
        // Salud sube si está limpio
        else if (newCleanliness > 50 && newHealth < 100) {
          newHealth = Math.min(100, newHealth + 0.5);
        }

        // Deterioro de salud por hambre = 0
        if (newHunger === 0) {
          newHealth = Math.max(0, newHealth - 2);
        }

        // Rastrear cuándo empieza el estado crítico
        const now = Date.now();
        let newCriticalHungerStart = prev.criticalHungerStart;
        let newCriticalHealthStart = prev.criticalHealthStart;
        let newCriticalComboStart = prev.criticalComboStart;

        // Marcar inicio de hambre crítica
        if (newHunger === 0 && !newCriticalHungerStart) {
          newCriticalHungerStart = now;
        } else if (newHunger > 0) {
          newCriticalHungerStart = null;
        }

        // Marcar inicio de salud crítica
        if (newHealth === 0 && !newCriticalHealthStart) {
          newCriticalHealthStart = now;
        } else if (newHealth > 0) {
          newCriticalHealthStart = null;
        }

        // Marcar inicio de combo crítico
        if (newHunger < 10 && newHealth < 10) {
          if (!newCriticalComboStart) {
            newCriticalComboStart = now;
          }
        } else {
          newCriticalComboStart = null;
        }

        // ===== VERIFICAR CONDICIONES DE MUERTE =====
        let isAlive = true;

        // Muerte por hambre prolongada (2 horas)
        if (newCriticalHungerStart && (now - newCriticalHungerStart) >= 7200000) {
          isAlive = false;
        }

        // Muerte por salud = 0 prolongada (30 minutos)
        if (newCriticalHealthStart && (now - newCriticalHealthStart) >= 1800000) {
          isAlive = false;
        }

        // Muerte por combo crítico (30 minutos)
        if (newCriticalComboStart && (now - newCriticalComboStart) >= 1800000) {
          isAlive = false;
        }

        // ===== DETERMINAR NIVEL DE PELIGRO =====
        let dangerLevel = 'normal';
        if (newHunger === 0 || newHealth === 0) {
          dangerLevel = 'agonizante';
        } else if (newHunger < 10 || newHealth < 10) {
          dangerLevel = 'critico';
        } else if (newHunger < 30 || newHealth < 30) {
          dangerLevel = 'alerta';
        }

        // ===== DETERMINAR MOOD =====
        let mood = 'contento';
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
            { value: newHunger, mood: 'hambriento', threshold: 30 },
            { value: newEnergy, mood: 'cansado', threshold: 30 },
            { value: newHappiness, mood: 'triste', threshold: 40 }
          ];

          const lowStats = stats.filter(stat => stat.value < stat.threshold);
          if (lowStats.length > 0) {
            const lowestStat = lowStats.reduce((prev, current) =>
              current.value < prev.value ? current : prev
            );
            mood = lowestStat.mood;
          }
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
          lastUpdate: Date.now()
        };
      });
    }, 30000); // Cada 30 segundos

    return () => clearInterval(decayInterval);
  }, [showNameInput, pet.isAlive]);

  // ==================== SISTEMA DE EDAD ====================
  // Edad en días reales (24 horas = 1 día)
  // El intervalo se ejecuta cada hora para mantener la edad actualizada
  useEffect(() => {
    if (showNameInput || !pet.isAlive) return;

    const ageInterval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        age: Math.floor((Date.now() - prev.birthDate) / (1000 * 60 * 60 * 24)) // 24 horas = 1 día
      }));
    }, 3600000); // Actualizar cada hora (3600000 ms)

    return () => clearInterval(ageInterval);
  }, [showNameInput, pet.isAlive]);

  // ==================== FUNCIONES DE UTILIDAD ====================
  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 8000);
  }, []);

  const getStatColor = useCallback((value) => {
    if (value > 70) return '#4ecca3';
    if (value > 40) return '#ffd93d';
    return '#ff6b6b';
  }, []);

  const getPetState = useCallback(() => {
    if (!pet.isAlive) return 'dead';
    if (pet.mood === 'enfermo') return 'sick';
    if (pet.mood === 'cansado') return 'tired';
    if (pet.mood === 'triste') return 'sad';
    return 'happy';
  }, [pet.isAlive, pet.mood]);

  // Función para despertar a la mascota
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
      // Limpiar el estado de sueño del pet
      setPet(prev => ({
        ...prev,
        isSleeping: false,
        sleepStartTime: null,
        sleepStartEnergy: null
      }));
    }
  }, [isSleeping]);

  // Funciones para manejar cacas
  const generatePoop = useCallback(() => {
    // Generar posición alrededor del gato, evitando el centro
    // El gato está aproximadamente en el centro (40-60% horizontal, 30-50% vertical)

    // Decidir si va a la izquierda, derecha, arriba o abajo del gato
    const position = Math.random();
    let x, y;

    if (position < 0.33) {
      // Izquierda del gato
      x = Math.random() * 20 + 8; // 8% - 28%
      y = Math.random() * 30 + 35; // 35% - 65%
    } else if (position < 0.66) {
      // Derecha del gato
      x = Math.random() * 20 + 65; // 65% - 85%
      y = Math.random() * 30 + 35; // 35% - 65%
    } else {
      // Abajo del gato
      x = Math.random() * 50 + 25; // 25% - 75%
      y = Math.random() * 15 + 60; // 60% - 75%
    }

    const newPoop = {
      id: Date.now() + Math.random(),
      x,
      y
    };
    setPoops(prev => [...prev, newPoop]);
  }, []);

  const cleanPoop = useCallback((poopId) => {
    setPoops(prev => prev.filter(p => p.id !== poopId));
    setPet(prev => ({ ...prev, coins: prev.coins + 1 }));
    showMessage('+1 moneda!');
  }, [showMessage]);

  // ==================== SISTEMA DE CACAS - GENERACIÓN ====================
  useEffect(() => {
    if (showNameInput || !pet.isAlive || pet.stage === 'egg') return;

    // Generar caca cuando la limpieza ha bajado cierta cantidad
    const cleanlinessDropThreshold = 15; // Genera caca cada vez que baja 15 puntos
    const previousCleanliness = previousCleanlinessRef.current;
    const currentCleanliness = pet.cleanliness;

    // Si la limpieza bajó más del threshold, generar caca
    if (previousCleanliness - currentCleanliness >= cleanlinessDropThreshold) {
      generatePoop();
      previousCleanlinessRef.current = currentCleanliness;
    }

    // Si limpiaron (la limpieza subió), actualizar la referencia
    if (currentCleanliness > previousCleanliness) {
      previousCleanlinessRef.current = currentCleanliness;
      // Limpiar todas las cacas cuando limpian
      setPoops([]);
    }
  }, [pet.cleanliness, pet.isAlive, pet.stage, showNameInput, generatePoop]);

  // ==================== ACCIONES DE CUIDADO ====================
  const feed = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (inventory.food <= 0) return showMessage('Sin comida! Ve a la tienda');

    // Despertar a la mascota si está durmiendo
    clearSleepState();

    // 50% de probabilidad de ensuciarse al comer
    const makesMess = Math.random() < 0.5;
    const cleanlinessReduction = makesMess ? 10 : 0;

    setInventory(prev => ({ ...prev, food: prev.food - 1 }));
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 35),
      happiness: Math.min(100, prev.happiness + 10),
      cleanliness: Math.max(0, prev.cleanliness - cleanlinessReduction),
      exp: prev.exp + 10,
      lastFed: Date.now()
    }));
    setAnimation('jump');

    // Mensaje diferente si se ensució
    if (makesMess) {
      showMessage('Nam nam! *Se ensucia*');
    } else {
      showMessage('Nam nam!');
    }

    setTimeout(() => setAnimation(''), 8000);
  }, [pet.isAlive, inventory.food, showMessage, clearSleepState]);

  const sleep = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (isSleeping) return showMessage('Tu mascota ya está durmiendo');

    // Guardar energía inicial y tiempo de inicio
    const sleepStart = Date.now();
    sleepStartEnergyRef.current = pet.energy;
    sleepStartTimeRef.current = sleepStart;

    // Establecer estado de sueño
    setIsSleeping(true);
    setAnimation('blink');

    // Actualizar el pet con la información de sueño
    setPet(prev => ({
      ...prev,
      isSleeping: true,
      sleepStartTime: sleepStart,
      sleepStartEnergy: prev.energy
    }));

    showMessage('Dulces sueños... (5 min para recuperación completa)');

    // Limpiar intervalos/timeouts anteriores si existen
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
    }
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
    }

    // Intervalo para recuperar energía gradualmente
    // 5 minutos = 300 segundos, actualizamos cada segundo
    // Recuperamos (100 - energía actual) / 300 por segundo
    const totalSleepTime = 300000; // 5 minutos en ms
    const updateInterval = 1000; // Actualizar cada segundo

    sleepIntervalRef.current = setInterval(() => {
      setPet(prev => {
        const timeSlept = Date.now() - sleepStartTimeRef.current;
        const sleepProgress = Math.min(timeSlept / totalSleepTime, 1); // 0 a 1
        const energyToRecover = 100 - sleepStartEnergyRef.current;
        const newEnergy = Math.min(100, sleepStartEnergyRef.current + (energyToRecover * sleepProgress));

        return {
          ...prev,
          energy: newEnergy
        };
      });
    }, updateInterval);

    // Timeout para detener el intervalo después de 5 minutos (pero sigue durmiendo)
    sleepTimeoutRef.current = setTimeout(() => {
      // Detener el intervalo una vez alcanzada la energía máxima
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
        sleepIntervalRef.current = null;
      }

      // Asegurar que la energía esté al 100% y dar bonificación de felicidad
      setPet(prev => ({
        ...prev,
        energy: 100,
        happiness: Math.min(100, prev.happiness + 10)
      }));

      showMessage('Tu mascota está completamente descansada (sigue durmiendo)');
      sleepTimeoutRef.current = null;

      // NO cambiar isSleeping ni animation - sigue durmiendo
    }, totalSleepTime);
  }, [pet.isAlive, pet.energy, isSleeping, showMessage]);

  const clean = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (inventory.soap <= 0) return showMessage('Sin jabón! Ve a la tienda');

    // Despertar a la mascota si está durmiendo
    clearSleepState();

    setInventory(prev => ({ ...prev, soap: prev.soap - 1 }));
    setPet(prev => ({
      ...prev,
      cleanliness: 100,
      happiness: Math.min(100, prev.happiness + 15),
      exp: prev.exp + 8,
      lastCleaned: Date.now()
    }));
    showMessage('¡Qué limpio!');
  }, [pet.isAlive, inventory.soap, showMessage, clearSleepState]);

  const giveMedicine = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (inventory.medicine <= 0) return showMessage('Sin medicina! Ve a la tienda');

    // Despertar a la mascota si está durmiendo
    clearSleepState();

    setInventory(prev => ({ ...prev, medicine: prev.medicine - 1 }));
    setPet(prev => {
      const newHealth = Math.min(100, prev.health + 40);
      const newCleanliness = Math.min(100, prev.cleanliness + 30);

      // Determinar si sigue enfermo después de la medicina
      const stillSick = newHealth < 50 || newCleanliness < 30;

      return {
        ...prev,
        health: newHealth,
        cleanliness: newCleanliness,
        isSick: stillSick,
        mood: stillSick ? 'enfermo' : 'contento',
        exp: prev.exp + 20
      };
    });
    showMessage('Medicina administrada! Tu mascota se siente mejor');
  }, [pet.isAlive, inventory.medicine, showMessage, clearSleepState]);

  const giveTreat = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (inventory.treats <= 0) return showMessage('Sin golosinas! Ve a la tienda');

    // Despertar a la mascota si está durmiendo
    clearSleepState();

    setInventory(prev => ({ ...prev, treats: prev.treats - 1 }));
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      hunger: Math.min(100, prev.hunger + 10),
      exp: prev.exp + 15
    }));
    showMessage('¡Qué rico!');
  }, [pet.isAlive, inventory.treats, showMessage, clearSleepState]);

  const play = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (pet.energy < 30) return showMessage('Tu mascota necesita más energía (mín. 30)');

    // Despertar a la mascota si está durmiendo
    clearSleepState();

    setPet(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 20),
      happiness: Math.min(100, prev.happiness + 15),
      exp: prev.exp + 5
    }));
    setAnimation('jump');
    showMessage('A jugar!');
    setTimeout(() => setAnimation(''), 8000);
    setShowMinigames(true);
  }, [pet.isAlive, pet.energy, showMessage, clearSleepState]);

  // ==================== SISTEMA DE TIENDA ====================
  const buyItem = useCallback((item, price) => {
    if (pet.coins < price) return showMessage('No tienes suficientes monedas');

    setPet(prev => ({ ...prev, coins: prev.coins - price }));
    setInventory(prev => ({ ...prev, [item]: prev[item] + 1 }));
    showMessage(`Has comprado ${item}`);
  }, [pet.coins, showMessage]);

  // ==================== MANEJO DE INPUTS ====================
  const handleNameSubmit = useCallback((name) => {
    setPet(prev => ({ ...prev, name, birthDate: Date.now(), type: 'cat', color: 'white' }));
    setShowNameInput(false);
  }, []);

  // ==================== SISTEMA DE MINI-JUEGOS ====================
  const openMinigames = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (pet.energy < 30) return showMessage('Tu mascota necesita más energía (mín. 30)');
    setShowMinigames(true);
  }, [pet.isAlive, pet.energy, showMessage]);

  const closeMinigames = useCallback(() => {
    setShowMinigames(false);
  }, []);

  const handleMinigameWin = useCallback((reward) => {
    setPet(prev => ({
      ...prev,
      coins: prev.coins + reward.coins,
      exp: prev.exp + reward.exp,
      happiness: Math.min(100, prev.happiness + reward.happiness),
      energy: Math.max(0, prev.energy - 10) // Reducido de 20 a 10
    }));
    showMessage(`Victoria! +${reward.coins} monedas +${reward.exp} XP`);
    setShowMinigames(false);
  }, [showMessage]);

  const handleMinigameLose = useCallback(() => {
    setPet(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 8), // Reducido de 15 a 8
      happiness: Math.max(0, prev.happiness - 5)
    }));
    showMessage('Mejor suerte la proxima vez');
    setShowMinigames(false);
  }, [showMessage]);

  // ==================== JUEGO DE SKATE ====================
  const openSkateGame = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (pet.energy < 20) return showMessage('Tu mascota necesita más energía (mín. 20)');
    setShowSkateGame(true);
  }, [pet.isAlive, pet.energy, showMessage]);

  const handleSkateGameEnd = useCallback((score) => {
    // Recompensa basada en el score
    const coinsEarned = Math.floor(score / 10);
    const expEarned = Math.floor(score / 5);
    const happinessGained = Math.min(30, Math.floor(score / 15));

    setPet(prev => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      exp: prev.exp + expEarned,
      happiness: Math.min(100, prev.happiness + happinessGained),
      energy: Math.max(0, prev.energy - 8) // Reducido de 15 a 8
    }));

    if (score > 0) {
      showMessage(`Score: ${score}! +${coinsEarned} monedas +${expEarned} XP`);
    } else {
      showMessage('Inténtalo de nuevo!');
    }

    setShowSkateGame(false);
  }, [showMessage]);

  // Handler para cuando el huevo eclosiona
  const handleHatch = useCallback(() => {
    setPet(prev => ({
      ...prev,
      stage: 'baby',
      birthDate: Date.now(),
      age: 0 // Resetear edad al nacer
    }));
    showMessage(`¡${pet.name} ha nacido! Bienvenido al mundo!`);
  }, [pet.name, showMessage]);

  // ==================== RENDERIZADO CONDICIONAL ====================
  if (showNameInput) {
    return <NameInput onSubmit={handleNameSubmit} />;
  }

  // Mostrar pantalla de huevo si está en etapa egg
  if (pet.stage === 'egg') {
    return <EggScreen pet={pet} onHatch={handleHatch} />;
  }

  // ==================== RENDERIZADO DE PANTALLAS ====================
  const renderScreen = () => {
    const commonProps = {
      pet,
      inventory,
      message,
      animation
    };

    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            {...commonProps}
            getPetState={getPetState}
            getStatColor={getStatColor}
            onFeed={feed}
            onSleep={sleep}
            onWakeUp={clearSleepState}
            onClean={clean}
            onMedicine={giveMedicine}
            onTreat={giveTreat}
            onPlay={play}
            isSleeping={isSleeping}
            poops={poops}
            onCleanPoop={cleanPoop}
          />
        );

      case 'shop':
        return <ShopScreen {...commonProps} onBuyItem={buyItem} />;

      case 'stats':
        return (
          <div className="stats-wrapper" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <StatsScreen pet={pet} inventory={inventory} />

            <button
              className="reset-button"
              style={{
                background: '#f44336',
                color: 'white',
                padding: '15px 30px',
                border: '4px solid black',
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres reiniciar?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              REINICIAR 🔄
            </button>
          </div>
        );

      default:
        return <HomeScreen {...commonProps} getPetState={getPetState} />;
    }
  };

  // ==================== RENDER PRINCIPAL ====================
  return (
    <div className="app-container">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {showMinigames && (
        <Minigames
          petName={pet.name}
          petType={pet.type}
          coins={pet.coins}
          onClose={closeMinigames}
          onWin={handleMinigameWin}
          onLose={handleMinigameLose}
          onOpenSkateGame={openSkateGame}
        />
      )}

      {showSkateGame && (
        <SkateGame
          onGameEnd={handleSkateGameEnd}
        />
      )}
    </div>
  );
}

export default App;
