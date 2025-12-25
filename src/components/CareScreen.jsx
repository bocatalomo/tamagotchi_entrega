import StatBar from './StatBar';
import ActionButton from './ActionButton';
import './CareScreen.css';

const CareScreen = ({
  pet,
  inventory,
  getStatColor,
  onFeed,
  onSleep,
  onClean,
  onMedicine,
  onTreat,
  onPlay
}) => {
  const getStatIcon = (stat) => {
    if (stat >= 80) return '😊';
    if (stat >= 50) return '😐';
    if (stat >= 20) return '😟';
    return '😰';
  };

  return (
    <div className="care-screen">
      <div className="care-header">
        <h2 className="care-title">💝 Cuidados de {pet.name}</h2>
        <p className="care-subtitle">Mantén a tu mascota feliz y saludable</p>
      </div>

      {/* Estado general */}
      <div className="health-status">
        <div className="status-card">
          <div className="status-icon">
            {pet.isAlive ? (pet.isSick ? '🤒' : '💚') : '💀'}
          </div>
          <div className="status-info">
            <div className="status-label">Estado</div>
            <div className="status-value">
              {!pet.isAlive ? 'Fallecido' : pet.isSick ? 'Enfermo' : 'Saludable'}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-section">
        <div className="section-header">
          <span className="section-icon">📊</span>
          <span className="section-title">Estadísticas</span>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-emoji">{getStatIcon(pet.hunger)}</span>
              <span className="stat-name">Hambre</span>
            </div>
            <StatBar 
              label=""
              value={pet.hunger} 
              icon="🍖" 
              color={getStatColor(pet.hunger)} 
            />
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-emoji">{getStatIcon(pet.happiness)}</span>
              <span className="stat-name">Felicidad</span>
            </div>
            <StatBar 
              label=""
              value={pet.happiness} 
              icon="😊" 
              color={getStatColor(pet.happiness)} 
            />
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-emoji">{getStatIcon(pet.energy)}</span>
              <span className="stat-name">Energía</span>
            </div>
            <StatBar 
              label=""
              value={pet.energy} 
              icon="⚡" 
              color={getStatColor(pet.energy)} 
            />
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-emoji">{getStatIcon(pet.cleanliness)}</span>
              <span className="stat-name">Limpieza</span>
            </div>
            <StatBar 
              label=""
              value={pet.cleanliness} 
              icon="✨" 
              color={getStatColor(pet.cleanliness)} 
            />
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-emoji">{getStatIcon(pet.health)}</span>
              <span className="stat-name">Salud</span>
            </div>
            <StatBar 
              label=""
              value={pet.health} 
              icon="❤️" 
              color={getStatColor(pet.health)} 
            />
          </div>
        </div>
      </div>

      {/* Acciones de cuidado */}
      <div className="actions-section">
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <span className="section-title">Acciones</span>
        </div>

        <div className="actions-grid-care">
          <ActionButton 
            onClick={onFeed} 
            disabled={!pet.isAlive} 
            emoji="🍖" 
            label={`Alimentar (${inventory.food})`} 
          />
          
          <ActionButton 
            onClick={onSleep} 
            disabled={!pet.isAlive} 
            emoji="💤" 
            label="Dormir" 
          />
          
          <ActionButton
            onClick={onClean}
            disabled={!pet.isAlive || inventory.soap === 0}
            emoji="🧼"
            label={`Limpiar (${inventory.soap})`}
          />
          
          <ActionButton 
            onClick={onMedicine} 
            disabled={!pet.isAlive || inventory.medicine === 0} 
            emoji="💊" 
            label={`Medicina (${inventory.medicine})`} 
          />
          
          <ActionButton
            onClick={onTreat}
            disabled={!pet.isAlive || inventory.treats === 0}
            emoji="🍰"
            label={`Premio (${inventory.treats})`}
          />

          <ActionButton
            onClick={onPlay}
            disabled={!pet.isAlive || pet.energy < 20}
            emoji="🎮"
            label="Jugar"
          />
        </div>
      </div>

      {/* Consejos */}
      <div className="tips-section">
        <div className="tip-card">
          <span className="tip-icon">💡</span>
          <div className="tip-content">
            <div className="tip-title">Consejo</div>
            <div className="tip-text">
              {pet.hunger < 30 && "¡Tu mascota tiene hambre! Aliméntala pronto."}
              {pet.happiness < 30 && pet.hunger >= 30 && "Juega con tu mascota para hacerla feliz."}
              {pet.energy < 30 && pet.hunger >= 30 && pet.happiness >= 30 && "Tu mascota necesita descansar."}
              {pet.cleanliness < 30 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && "¡Es hora de un baño!"}
              {pet.health < 50 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && "La salud está baja. Considera usar medicina."}
              {pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && pet.health >= 50 && "¡Tu mascota está muy bien cuidada! 🌟"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareScreen;
