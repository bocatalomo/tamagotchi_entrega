// Sistema de Eventos Aleatorios
export const randomEvents = [
  {
    id: 'found_coin',
    name: 'Moneda Encontrada',
    description: '¡Tu mascota encontró una moneda brillante en el suelo!',
    icon: '💰',
    rarity: 'common',
    effects: { coins: 10 },
    probability: 0.15
  },
  {
    id: 'visitor',
    name: 'Visita Amigable',
    description: '¡Un amigo vino a jugar! Tu mascota está muy feliz.',
    icon: '👋',
    rarity: 'common',
    effects: { happiness: 20, energy: -10 },
    probability: 0.12
  },
  {
    id: 'nap_time',
    name: 'Siesta Espontánea',
    description: 'Tu mascota se quedó dormida al sol.',
    icon: '😴',
    rarity: 'common',
    effects: { energy: 30, hunger: -15 },
    probability: 0.10
  },
  {
    id: 'rain',
    name: 'Día Lluvioso',
    description: '¡Llueve! Tu mascota se ensució un poco.',
    icon: '🌧️',
    rarity: 'common',
    effects: { cleanliness: -20, happiness: -10 },
    probability: 0.08
  },
  {
    id: 'treasure',
    name: 'Tesoro Enterrado',
    description: '¡Tu mascota desenterró un pequeño tesoro!',
    icon: '💎',
    rarity: 'rare',
    effects: { coins: 50, happiness: 30 },
    probability: 0.05
  },
  {
    id: 'snack',
    name: 'Snack Secreto',
    description: 'Tu mascota encontró comida escondida.',
    icon: '🍪',
    rarity: 'common',
    effects: { hunger: 25, happiness: 15 },
    probability: 0.10
  },
  {
    id: 'energy_burst',
    name: 'Ráfaga de Energía',
    description: '¡Tu mascota se siente súper activa!',
    icon: '⚡',
    rarity: 'uncommon',
    effects: { energy: 40, happiness: 20 },
    probability: 0.07
  },
  {
    id: 'bad_dream',
    name: 'Pesadilla',
    description: 'Tu mascota tuvo una pesadilla...',
    icon: '😰',
    rarity: 'uncommon',
    effects: { happiness: -25, energy: -15 },
    probability: 0.06
  },
  {
    id: 'gift',
    name: 'Regalo Misterioso',
    description: '¡Alguien dejó un regalo para tu mascota!',
    icon: '🎁',
    rarity: 'rare',
    effects: { coins: 30, item: 'food', happiness: 25 },
    probability: 0.04
  },
  {
    id: 'rainbow',
    name: 'Arcoíris',
    description: '¡Un hermoso arcoíris aparece en el cielo!',
    icon: '🌈',
    rarity: 'rare',
    effects: { happiness: 50, exp: 20 },
    probability: 0.03
  },
  {
    id: 'shooting_star',
    name: 'Estrella Fugaz',
    description: 'Tu mascota vio una estrella fugaz y pidió un deseo.',
    icon: '⭐',
    rarity: 'epic',
    effects: { coins: 100, exp: 50, happiness: 40 },
    probability: 0.01
  },
  {
    id: 'birthday',
    name: 'Cumpleaños Sorpresa',
    description: '¡Es un día especial! Fiesta de cumpleaños.',
    icon: '🎂',
    rarity: 'epic',
    effects: { coins: 75, exp: 100, happiness: 50, item: 'treat' },
    probability: 0.01
  },
  {
    id: 'spa_day',
    name: 'Día de Spa',
    description: 'Tu mascota visitó un spa de mascotas gratis.',
    icon: '💆',
    rarity: 'uncommon',
    effects: { cleanliness: 50, happiness: 30, health: 20 },
    probability: 0.05
  },
  {
    id: 'lottery',
    name: 'Lotería',
    description: '¡Tu mascota ganó la lotería local!',
    icon: '🎰',
    rarity: 'legendary',
    effects: { coins: 250, exp: 150 },
    probability: 0.005
  },
  {
    id: 'meteor',
    name: 'Meteorito',
    description: 'Un pequeño meteorito cayó cerca. ¡Qué susto!',
    icon: '☄️',
    rarity: 'rare',
    effects: { happiness: -30, energy: -20, coins: 80 },
    probability: 0.02
  }
];

export const getRandomEvent = () => {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  // Ordenar eventos por probabilidad (más común primero)
  const sortedEvents = [...randomEvents].sort((a, b) => b.probability - a.probability);
  
  for (const event of sortedEvents) {
    cumulativeProbability += event.probability;
    if (random <= cumulativeProbability) {
      return event;
    }
  }
  
  return null; // No hay evento
};

export const shouldTriggerEvent = (timeSinceLastEvent) => {
  // Evento aleatorio cada 5-15 minutos aproximadamente
  const minInterval = 300000; // 5 minutos en ms
  const maxInterval = 900000; // 15 minutos en ms
  
  if (timeSinceLastEvent < minInterval) {
    return false;
  }
  
  // Probabilidad aumenta con el tiempo
  const elapsedFactor = Math.min((timeSinceLastEvent - minInterval) / (maxInterval - minInterval), 1);
  const baseProbability = 0.1; // 10% base
  const adjustedProbability = baseProbability + (elapsedFactor * 0.4); // Hasta 50% si ha pasado mucho tiempo
  
  return Math.random() < adjustedProbability;
};

export const rarityColors = {
  common: '#95a3a6',
  uncommon: '#4ecca3',
  rare: '#ff6b9d',
  epic: '#ffd93d',
  legendary: '#ff8c42'
};

export const rarityLabels = {
  common: 'Común',
  uncommon: 'Poco Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario'
};
