import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import ShopScreen from './components/ShopScreen';
import StatsScreen from './components/StatsScreen';
import NameInput from './components/NameInput';
import PetSelector from './components/PetSelector';
import Minigames from './components/Minigames';
import SkateGame from './components/SkateGame';
import EggScreen from './components/EggScreen';

function App() {
  // ==================== ESTADOS ====================
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showNameInput, setShowNameInput] = useState(true);
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [showMinigames, setShowMinigames] = useState(false);
  const [showSkateGame, setShowSkateGame] = useState(false);
  const [message, setMessage] = useState('');
  const [animation, setAnimation] = useState('');
  const [isSleeping, setIsSleeping] = useState(false);

  // Ref para almacenar el timeout del sueño
  const sleepTimeoutRef = useRef(null);
  const sleepIntervalRef = useRef(null);
  const sleepStartEnergyRef = useRef(0);
  const sleepStartTimeRef = useRef(0);

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
    // Recursos
    coins: 50,
    age: 0,
    // Timestamps
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastCleaned: Date.now(),
    birthDate: Date.now()
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
      // Calcular edad inmediatamente al cargar
      loadedPet.age = Math.floor((Date.now() - loadedPet.birthDate) / (1000 * 60 * 60));
      setPet(loadedPet);
      setShowNameInput(false);
    }
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  useEffect(() => {
    if (!showNameInput && !showPetSelector && pet.name) {
      localStorage.setItem('tamagotchiPet', JSON.stringify(pet));
      localStorage.setItem('tamagotchiInventory', JSON.stringify(inventory));
    }
  }, [pet, inventory, showNameInput, showPetSelector]);

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
    // No deteriorar si está en etapa de huevo, en selección, o muerto
    if (showNameInput || showPetSelector || !pet.isAlive || pet.stage === 'egg') return;

    const decayInterval = setInterval(() => {
      setPet(prev => {
        // Deterioro de estadísticas
        const newHunger = Math.max(0, prev.hunger - 2);
        const newHappiness = Math.max(0, prev.happiness - 1.5);
        const newEnergy = Math.max(0, prev.energy - 1);
        const newCleanliness = Math.max(0, prev.cleanliness - 0.8);

        // Calcular salud basada en otras estadísticas
        const avgStats = (newHunger + newHappiness + newEnergy + newCleanliness) / 4;
        const newHealth = Math.max(0, Math.min(100, avgStats));

        // Determinar estado único basado en el stat más bajo
        let mood = 'contento'; // Estado por defecto
        let isSick = false;

        // Prioridad absoluta: Enfermo (salud crítica o muy sucio)
        if (newHealth < 30 || newCleanliness < 20) {
          mood = 'enfermo';
          isSick = true;
        }
        // Estado positivo especial: Juguetón (cuando está muy bien)
        else if (newHappiness > 80 && newEnergy > 70 && newHunger > 70) {
          mood = 'juguetón';
        }
        // Estados negativos: mostrar el del stat más bajo
        else {
          // Crear array de stats con sus valores y nombres
          const stats = [
            { value: newHunger, mood: 'hambriento', threshold: 30 },
            { value: newEnergy, mood: 'cansado', threshold: 30 },
            { value: newHappiness, mood: 'triste', threshold: 40 }
          ];

          // Filtrar solo los que están por debajo del threshold
          const lowStats = stats.filter(stat => stat.value < stat.threshold);

          if (lowStats.length > 0) {
            // Encontrar el stat con el valor más bajo
            const lowestStat = lowStats.reduce((prev, current) =>
              current.value < prev.value ? current : prev
            );
            mood = lowestStat.mood;
          }
          // Si todos los stats están bien, se queda en 'contento'
        }

        // Si la salud llega a 0, la mascota muere
        const isAlive = newHealth > 0;

        return {
          ...prev,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          cleanliness: newCleanliness,
          health: newHealth,
          isSick,
          mood,
          isAlive
        };
      });
    }, 30000); // Cada 30 segundos

    return () => clearInterval(decayInterval);
  }, [showNameInput, showPetSelector, pet.isAlive]);

  // ==================== SISTEMA DE EDAD ====================
  useEffect(() => {
    if (showNameInput || showPetSelector || !pet.isAlive) return;

    const ageInterval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        age: Math.floor((Date.now() - prev.birthDate) / (1000 * 60 * 60)) // 1 hora real = 1 día
      }));
    }, 60000); // Cada minuto

    return () => clearInterval(ageInterval);
  }, [showNameInput, showPetSelector, pet.isAlive]);

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
    }
  }, [isSleeping]);

  // ==================== ACCIONES DE CUIDADO ====================
  const feed = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (inventory.food <= 0) return showMessage('Sin comida! Ve a la tienda');

    // Despertar a la mascota si está durmiendo
    clearSleepState();

    setInventory(prev => ({ ...prev, food: prev.food - 1 }));
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 35),
      happiness: Math.min(100, prev.happiness + 10),
      exp: prev.exp + 10,
      lastFed: Date.now()
    }));
    setAnimation('jump');
    showMessage('Nam nam!');
    setTimeout(() => setAnimation(''), 8000);
  }, [pet.isAlive, inventory.food, showMessage, clearSleepState]);

  const sleep = useCallback(() => {
    if (!pet.isAlive) return showMessage('Tu mascota ha fallecido...');
    if (isSleeping) return showMessage('Tu mascota ya está durmiendo');

    // Guardar energía inicial y tiempo de inicio
    sleepStartEnergyRef.current = pet.energy;
    sleepStartTimeRef.current = Date.now();

    // Establecer estado de sueño
    setIsSleeping(true);
    setAnimation('blink');
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

    // Timeout para finalizar el sueño después de 5 minutos
    sleepTimeoutRef.current = setTimeout(() => {
      setIsSleeping(false);
      setAnimation('');
      setPet(prev => ({
        ...prev,
        energy: 100,
        happiness: Math.min(100, prev.happiness + 10)
      }));
      showMessage('Tu mascota está completamente descansada');

      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
        sleepIntervalRef.current = null;
      }
      sleepTimeoutRef.current = null;
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
    if (pet.mood !== 'enfermo') return showMessage('La medicina solo se puede usar cuando está enfermo');
    if (inventory.medicine <= 0) return showMessage('Sin medicina! Ve a la tienda');

    // Despertar a la mascota si está durmiendo
    clearSleepState();

    setInventory(prev => ({ ...prev, medicine: prev.medicine - 1 }));
    setPet(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 40),
      cleanliness: Math.min(100, prev.cleanliness + 30),
      exp: prev.exp + 20
    }));
    showMessage('Medicina administrada');
  }, [pet.isAlive, pet.mood, inventory.medicine, showMessage, clearSleepState]);

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
    setPet(prev => ({ ...prev, name, birthDate: Date.now() }));
    setShowNameInput(false);
    setShowPetSelector(true);
  }, []);

  const handlePetSelect = useCallback((type, color) => {
    setPet(prev => ({ ...prev, type, color }));
    setShowPetSelector(false);
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
      energy: Math.max(0, prev.energy - 20)
    }));
    showMessage(`Victoria! +${reward.coins} monedas +${reward.exp} XP`);
    setShowMinigames(false);
  }, [showMessage]);

  const handleMinigameLose = useCallback(() => {
    setPet(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 15),
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
      energy: Math.max(0, prev.energy - 15)
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
      birthDate: Date.now()
    }));
    showMessage(`¡${pet.name} ha nacido! Bienvenido al mundo!`);
  }, [pet.name, showMessage]);

  // ==================== RENDERIZADO CONDICIONAL ====================
  if (showNameInput) {
    return <NameInput onSubmit={handleNameSubmit} />;
  }

  if (showPetSelector) {
    return <PetSelector petName={pet.name} onSelect={handlePetSelect} />;
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
