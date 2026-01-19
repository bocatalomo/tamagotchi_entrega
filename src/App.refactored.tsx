import React, { useState, useCallback } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import ShopScreen from './components/ShopScreen';
import StatsScreen from './components/StatsScreen';
import NameInput from './components/NameInput';
import Minigames from './components/Minigames';
import SkateGame from './components/SkateGame';
import EggScreen from './components/EggScreen';
import { GameProvider, useGame } from './contexts/GameContext';
import { useGameLoop, usePetSleep, usePetPoops, usePetUtils } from './hooks';

const AppContent: React.FC = () => {
  const { state, dispatch } = useGame();
  const { pet, inventory, message, animation } = state;
  
  const [currentScreen, setCurrentScreen] = useState<'home' | 'shop' | 'stats'>('home');
  const [showNameInput, setShowNameInput] = useState(true);
  const [showMinigames, setShowMinigames] = useState(false);
  const [showSkateGame, setShowSkateGame] = useState(false);

  const { getStatColor, getPetState } = usePetUtils(pet);
  const { isSleeping, startSleep, wakeUp } = usePetSleep();
  const { poops, cleanPoop, checkAndGeneratePoop } = usePetPoops();
  
  // Sistema de juego
  useGameLoop(pet, (newPet) => dispatch({ type: 'SET_PET', payload: newPet }));

  // Verificar y generar cacas
  React.useEffect(() => {
    checkAndGeneratePoop(pet.cleanliness, pet.isAlive, pet.stage);
  }, [pet.cleanliness, pet.isAlive, pet.stage, checkAndGeneratePoop]);

  // Funciones de acción
  const handleFeed = useCallback(() => {
    if (!pet.isAlive) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota ha fallecido...' });
    if (inventory.food <= 0) return dispatch({ type: 'SET_MESSAGE', payload: 'Sin comida! Ve a la tienda' });
    
    dispatch({ type: 'UPDATE_INVENTORY', payload: { food: inventory.food - 1 } });
    dispatch({ type: 'FEED_PET' });
    dispatch({ type: 'SET_ANIMATION', payload: 'jump' });
    dispatch({ type: 'SET_MESSAGE', payload: 'Nam nam!' });
    wakeUp();
    
    setTimeout(() => dispatch({ type: 'SET_ANIMATION', payload: '' }), 8000);
  }, [pet.isAlive, inventory.food, wakeUp]);

  const handleSleep = useCallback(() => {
    if (!pet.isAlive) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota ha fallecido...' });
    if (isSleeping) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota ya está durmiendo' });
    
    startSleep(pet.energy, (newPet) => dispatch({ type: 'SET_PET', payload: newPet }));
    dispatch({ type: 'SET_ANIMATION', payload: 'blink' });
    dispatch({ type: 'SET_MESSAGE', payload: 'Dulces sueños... (5 min para recuperación completa)' });
  }, [pet.isAlive, isSleeping, pet.energy, startSleep]);

  const handleClean = useCallback(() => {
    if (!pet.isAlive) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota ha fallecido...' });
    if (inventory.soap <= 0) return dispatch({ type: 'SET_MESSAGE', payload: 'Sin jabón! Ve a la tienda' });
    
    dispatch({ type: 'UPDATE_INVENTORY', payload: { soap: inventory.soap - 1 } });
    dispatch({ type: 'CLEAN_PET' });
    dispatch({ type: 'SET_MESSAGE', payload: '¡Qué limpio!' });
    wakeUp();
  }, [pet.isAlive, inventory.soap, wakeUp]);

  const handleMedicine = useCallback(() => {
    if (!pet.isAlive) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota ha fallecido...' });
    if (inventory.medicine <= 0) return dispatch({ type: 'SET_MESSAGE', payload: 'Sin medicina! Ve a la tienda' });
    
    dispatch({ type: 'UPDATE_INVENTORY', payload: { medicine: inventory.medicine - 1 } });
    dispatch({ type: 'HEAL_PET' });
    dispatch({ type: 'SET_MESSAGE', payload: 'Medicina administrada! Tu mascota se siente mejor' });
    wakeUp();
  }, [pet.isAlive, inventory.medicine, wakeUp]);

  const handleTreat = useCallback(() => {
    if (!pet.isAlive) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota ha fallecido...' });
    if (inventory.treats <= 0) return dispatch({ type: 'SET_MESSAGE', payload: 'Sin golosinas! Ve a la tienda' });
    
    dispatch({ type: 'UPDATE_INVENTORY', payload: { treats: inventory.treats - 1 } });
    dispatch({ type: 'GIVE_TREAT' });
    dispatch({ type: 'SET_MESSAGE', payload: '¡Qué rico!' });
    wakeUp();
  }, [pet.isAlive, inventory.treats, wakeUp]);

  const handlePlay = useCallback(() => {
    if (!pet.isAlive) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota ha fallecido...' });
    if (pet.energy < 30) return dispatch({ type: 'SET_MESSAGE', payload: 'Tu mascota necesita más energía (mín. 30)' });
    
    dispatch({ type: 'PLAY_WITH_PET' });
    dispatch({ type: 'SET_ANIMATION', payload: 'jump' });
    dispatch({ type: 'SET_MESSAGE', payload: 'A jugar!' });
    setShowMinigames(true);
    wakeUp();
    
    setTimeout(() => dispatch({ type: 'SET_ANIMATION', payload: '' }), 8000);
  }, [pet.isAlive, pet.energy, wakeUp]);

  const handleBuyItem = useCallback((item: string, price: number) => {
    if (pet.coins < price) return dispatch({ type: 'SET_MESSAGE', payload: 'No tienes suficientes monedas' });
    
    dispatch({ type: 'BUY_ITEM', payload: { item, price } });
    dispatch({ type: 'SET_MESSAGE', payload: `Has comprado ${item}` });
  }, [pet.coins]);

  const handleNameSubmit = useCallback((name: string) => {
    dispatch({ type: 'UPDATE_PET', payload: { name, birthDate: Date.now(), type: 'cat', color: 'white' } });
    setShowNameInput(false);
  }, []);

  const handleMinigameWin = useCallback((reward: any) => {
    dispatch({ type: 'UPDATE_PET', payload: {
      coins: pet.coins + reward.coins,
      exp: pet.exp + reward.exp,
      happiness: Math.min(100, pet.happiness + reward.happiness),
      energy: Math.max(0, pet.energy - 10)
    }});
    dispatch({ type: 'SET_MESSAGE', payload: `Victoria! +${reward.coins} monedas +${reward.exp} XP` });
    setShowMinigames(false);
  }, [pet]);

  const handleMinigameLose = useCallback(() => {
    dispatch({ type: 'UPDATE_PET', payload: {
      energy: Math.max(0, pet.energy - 8),
      happiness: Math.max(0, pet.happiness - 5)
    }});
    dispatch({ type: 'SET_MESSAGE', payload: 'Mejor suerte la proxima vez' });
    setShowMinigames(false);
  }, [pet]);

  const handleSkateGameEnd = useCallback((score: number) => {
    const coinsEarned = Math.floor(score / 10);
    const expEarned = Math.floor(score / 5);
    const happinessGained = Math.min(30, Math.floor(score / 15));

    dispatch({ type: 'UPDATE_PET', payload: {
      coins: pet.coins + coinsEarned,
      exp: pet.exp + expEarned,
      happiness: Math.min(100, pet.happiness + happinessGained),
      energy: Math.max(0, pet.energy - 8)
    }});

    if (score > 0) {
      dispatch({ type: 'SET_MESSAGE', payload: `Score: ${score}! +${coinsEarned} monedas +${expEarned} XP` });
    } else {
      dispatch({ type: 'SET_MESSAGE', payload: 'Inténtalo de nuevo!' });
    }

    setShowSkateGame(false);
  }, [pet]);

  const handleHatch = useCallback(() => {
    dispatch({ type: 'UPDATE_PET', payload: {
      stage: 'baby',
      birthDate: Date.now(),
      age: 0
    }});
    dispatch({ type: 'SET_MESSAGE', payload: `¡${pet.name} ha nacido! Bienvenido al mundo!` });
  }, [pet.name]);

  // Renderizado condicional
  if (showNameInput) {
    return <NameInput onSubmit={handleNameSubmit} />;
  }

  if (pet.stage === 'egg') {
    return <EggScreen pet={pet} onHatch={handleHatch} />;
  }

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
            onFeed={handleFeed}
            onSleep={handleSleep}
            onWakeUp={wakeUp}
            onClean={handleClean}
            onMedicine={handleMedicine}
            onTreat={handleTreat}
            onPlay={handlePlay}
            isSleeping={isSleeping}
            poops={poops}
            onCleanPoop={cleanPoop}
          />
        );

      case 'shop':
        return <ShopScreen {...commonProps} onBuyItem={handleBuyItem} />;

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

  return (
    <div className="app-container">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {showMinigames && (
        <Minigames
          petName={pet.name}
          coins={pet.coins}
          onClose={() => setShowMinigames(false)}
          onWin={handleMinigameWin}
          onLose={handleMinigameLose}
          onOpenSkateGame={() => setShowSkateGame(true)}
        />
      )}

      {showSkateGame && (
        <SkateGame onGameEnd={handleSkateGameEnd} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;