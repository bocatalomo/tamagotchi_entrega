import React, { useState, useEffect } from 'react';
import HomeScreenSelector from './HomeScreenSelector';

// Mock data para demostración
const mockPet = {
  name: "Luna",
  level: 5,
  age: 12,
  coins: 150,
  exp: 350,
  isAlive: true,
  stage: "baby",
  mood: "Feliz",
  type: "cat",
  color: "purple",
  hunger: 75,
  happiness: 80,
  energy: 60,
  cleanliness: 85,
  health: 90
};

const mockInventory = {
  food: 8,
  soap: 5,
  medicine: 3,
  treats: 6
};

const mockPoops = [
  { id: 1, x: 50, y: 100 },
  { id: 2, x: 150, y: 120 }
];

const DesignDemo = () => {
  const [pet, setPet] = useState(mockPet);
  const [message, setMessage] = useState("¡Hola! Estoy muy feliz hoy.");
  const [animation, setAnimation] = useState("idle");
  const [isSleeping, setIsSleeping] = useState(false);
  const [poops, setPoops] = useState(mockPoops);

  // Simular cambios en las stats
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - Math.random() * 2),
        happiness: Math.max(0, prev.happiness - Math.random() * 1),
        energy: Math.max(0, prev.energy - Math.random() * 1.5),
        cleanliness: Math.max(0, prev.cleanliness - Math.random() * 0.8),
        health: Math.max(0, prev.health - Math.random() * 0.5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPetState = () => {
    if (!pet.isAlive) return 'dead';
    if (pet.hunger < 30) return 'hungry';
    if (pet.happiness < 30) return 'sad';
    if (pet.energy < 30) return 'tired';
    if (pet.health < 30) return 'sick';
    if (isSleeping) return 'sleeping';
    return 'happy';
  };

  const getStatColor = (value) => {
    if (value < 30) return '#ff4444';
    if (value < 70) return '#ffaa00';
    return '#00ff88';
  };

  const handleFeed = () => {
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      happiness: Math.min(100, prev.happiness + 10),
      exp: prev.exp + 10
    }));
    setMessage("¡Ñam! Gracias por la comida.");
    setAnimation("eat");
    setTimeout(() => setAnimation("idle"), 2000);
  };

  const handleSleep = () => {
    setIsSleeping(true);
    setMessage("Zzz... Estoy durmiendo...");
    setAnimation("sleep");
  };

  const handleWakeUp = () => {
    setIsSleeping(false);
    setPet(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40)
    }));
    setMessage("¡Buenos días! Me siento renovado.");
    setAnimation("idle");
  };

  const handleClean = () => {
    setPet(prev => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + 30),
      happiness: Math.min(100, prev.happiness + 15),
      exp: prev.exp + 8
    }));
    setMessage("¡Qué limpio estoy! Me encanta sentirme fresco.");
    setAnimation("happy");
    setTimeout(() => setAnimation("idle"), 2000);
  };

  const handleMedicine = () => {
    setPet(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 40),
      happiness: Math.min(100, prev.happiness + 5)
    }));
    setMessage("La medicina sabe un poco rara, pero me siento mejor.");
    setAnimation("idle");
  };

  const handleTreat = () => {
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      exp: prev.exp + 5
    }));
    setMessage("¡Wow! ¡Mi postre favorito! ¡Eres el mejor!");
    setAnimation("jump");
    setTimeout(() => setAnimation("idle"), 2000);
  };

  const handlePlay = () => {
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 20),
      exp: prev.exp + 15
    }));
    setMessage("¡Esto fue muy divertido! ¡Juguemos otra vez!");
    setAnimation("play");
    setTimeout(() => setAnimation("idle"), 2000);
  };

  const handleCleanPoop = (id) => {
    setPoops(prev => prev.filter(p => p.id !== id));
    setPet(prev => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + 10),
      coins: prev.coins + 1
    }));
    setMessage("¡Gracias por limpiar! +1 moneda 💰");
    setAnimation("happy");
    setTimeout(() => setAnimation("idle"), 1500);
  };

  return (
    <HomeScreenSelector
      pet={pet}
      message={message}
      animation={animation}
      getPetState={getPetState}
      inventory={mockInventory}
      getStatColor={getStatColor}
      onFeed={handleFeed}
      onSleep={handleSleep}
      onWakeUp={handleWakeUp}
      onClean={handleClean}
      onMedicine={handleMedicine}
      onTreat={handleTreat}
      onPlay={handlePlay}
      isSleeping={isSleeping}
      poops={poops}
      onCleanPoop={handleCleanPoop}
    />
  );
};

export default DesignDemo;