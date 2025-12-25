import './StatsScreen.css';

const StatsScreen = ({ pet, inventory }) => {
  const statsData = [
    { category: '🎂 Mascota', items: [
      { label: 'Nombre', value: pet.name },
      { label: 'Tipo', value: pet.type === 'dog' ? '🐕 Perro' : '🐱 Gato' },
      { label: 'Edad', value: `${pet.age || 0} ${(pet.age || 0) === 1 ? 'día' : 'días'}` },
      { label: 'Etapa', value: pet.stage },
      { label: 'Estado', value: pet.isAlive ? (pet.isSick ? '🤒 Enfermo' : '💚 Saludable') : '💀 Fallecido' }
    ]},
    { category: '⭐ Progreso', items: [
      { label: 'Nivel', value: pet.level },
      { label: 'Experiencia', value: `${pet.exp}/${pet.level * 100}` },
      { label: 'Monedas', value: `${pet.coins} 💰` },
      { label: 'Humor', value: pet.mood }
    ]},
    { category: '💪 Estadísticas', items: [
      { label: 'Hambre', value: `${Math.floor(pet.hunger)}/100` },
      { label: 'Felicidad', value: `${Math.floor(pet.happiness)}/100` },
      { label: 'Energía', value: `${Math.floor(pet.energy)}/100` },
      { label: 'Limpieza', value: `${Math.floor(pet.cleanliness)}/100` },
      { label: 'Salud', value: `${Math.floor(pet.health)}/100` }
    ]},
    { category: '🎒 Inventario', items: [
      { label: 'Comida', value: `${inventory.food} 🍖` },
      { label: 'Jabón', value: `${inventory.soap} 🧼` },
      { label: 'Medicina', value: `${inventory.medicine} 💊` },
      { label: 'Premios', value: `${inventory.treats} 🍰` }
    ]}
  ];

  return (
    <div className="stats-screen">
      <div className="stats-header">
        <h2 className="stats-title">Estadísticas</h2>
        <p className="stats-subtitle"> </p>
      </div>

      {statsData.map((section, idx) => (
        <div key={idx} className="stats-section-card">
          <div className="stats-section-header">{section.category}</div>
          <div className="stats-list">
            {section.items.map((item, i) => (
              <div key={i} className="stat-row-stats">
                <span className="stat-label-stats">{item.label}</span>
                <span className="stat-value-stats">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsScreen;
