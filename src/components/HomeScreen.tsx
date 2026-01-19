import PixelPet from './PixelPet';
import StatBar from './StatBar';
import ActionButton from './ActionButton';
import Poop from './Poop';
import './HomeScreen.css';

const HomeScreen = ({
  pet,
  message,
  animation,
  getPetState,
  inventory,
  getStatColor,
  onFeed,
  onSleep,
  onWakeUp,
  onClean,
  onMedicine,
  onTreat,
  onPlay,
  isSleeping,
  poops,
  onCleanPoop
}) => {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    // Mañana: 6:00 - 14:00
    if (hour >= 6 && hour <= 14) return {
      time: '☀️ Mañana',
      gradient: 'linear-gradient(135deg, #ffd1dc 0%, #ffb3d9 100%)'
    };
    // Tarde: 15:00 - 20:00
    if (hour >= 15 && hour <= 20) return {
      time: '🌄 Tarde',
      gradient: 'linear-gradient(135deg, #ffe5e0 0%, #ffc9e0 100%)'
    };
    // Noche: 21:00 - 5:00
    return {
      time: '🌙 Noche',
      gradient: 'linear-gradient(135deg, #c9a0dc 0%, #a66999 100%)'
    };
  };

  const timeOfDay = getTimeOfDay();

  return (
    <div className="home-screen">
      {/* Header con información de tiempo */}
      <div className="time-header" style={{ background: timeOfDay.gradient }}>
        <span className="time-text">{timeOfDay.time}</span>
      </div>

      {/* Nombre y nivel */}
      <div className="pet-header">
        <h1 className="pet-title">{pet.name}</h1>
        <div className="level-badge">
          Nivel {pet.level}
        </div>
      </div>

      

      {/* Info rápida */}
      <div className="quick-info">
        <div className="info-bubble">
          <span className="info-value">Edad: {pet.age}  días</span>
        </div>
        <div className="info-bubble">
          <span className="info-value">Monedas: {pet.coins}</span>
        </div>
        <div className="info-bubble">
          <span className="info-value">XP: {pet.exp}/{pet.level * 100}</span>
        </div>
      </div>

      {/* Barra de XP */}
      <div className="exp-bar-home">
        <div className="exp-bar-label">Experiencia</div>
        <div className="exp-bar-container">
          <div
            className="exp-bar-fill"
            style={{ width: `${(pet.exp / (pet.level * 100)) * 100}%` }}
          >
            <div className="exp-bar-shine"></div>
          </div>
        </div>
      </div>

      {/* Contenedor principal de la mascota */}
      <div className="pet-container" style={{ position: 'relative' }}>

        {/* Display de la mascota */}
        <div className="pet-display-home">
          {!pet.isAlive && (
            <div className="death-overlay-home">
              <div className="death-icon">🥀</div>
              <p className="death-text">{pet.name} ha abandonado este mundo...</p>
            </div>
          )}

          {/* El estado enfermo ya se muestra en el mood, no necesitamos indicador adicional */}

          <PixelPet
            stage={pet.stage}
            state={getPetState()}
            animation={animation}
            type={pet.type}
            color={pet.color}
            mood={pet.mood}
          />
        </div>

        {/* Cacas dentro del contenedor */}
        {poops && poops.map(poop => (
          <Poop
            key={poop.id}
            id={poop.id}
            x={poop.x}
            y={poop.y}
            onClean={onCleanPoop}
          />
        ))}

        {/* Mensaje de la mascota */}
        {message && (
          <div className="message-bubble">
            <div className="bubble-content">{message}</div>
            <div className="bubble-tail"></div>
          </div>
        )}
      </div>

      {/* Estado único de la mascota */}
      <div className="status-row">
        <div className="mood-display-full">
          <span className="mood-text">
            {!pet.isAlive ? 'Fallecido' : pet.mood}
          </span>
        </div>
      </div>

      

      

      {/* Acciones de cuidado */}
      <div className="actions-section-home">
        <div className="section-header-home">
          <span className="section-title">Acciones</span>
        </div>

        <div className="actions-grid-home">
          <ActionButton
            onClick={onFeed}
            disabled={!pet.isAlive}
            emoji="🍖"
            label={`Alimentar (${inventory.food})`}
          />

          <ActionButton
            onClick={isSleeping ? onWakeUp : onSleep}
            disabled={!pet.isAlive}
            emoji={isSleeping ? "☀️" : "💤"}
            label={isSleeping ? "Despertar" : "Dormir"}
          />

          <ActionButton
            onClick={onClean}
            disabled={!pet.isAlive}
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

      {/* Estadísticas compactas */}
      <div className="stats-section-home">
        <div className="section-header-home">
          <span className="section-title">Estadisticas</span>
        </div>

        <div className="stats-grid-compact">
          <div className="stat-card-compact">
            <div className="stat-header-compact">
              <span className="stat-name-small">Hambre</span>
            </div>
            <StatBar
              label=""
              value={pet.hunger}
              icon=""
              color={getStatColor(pet.hunger)}
            />
          </div>

          <div className="stat-card-compact">
            <div className="stat-header-compact">
              <span className="stat-name-small">Felicidad</span>
            </div>
            <StatBar
              label=""
              value={pet.happiness}
              icon=""
              color={getStatColor(pet.happiness)}
            />
          </div>

          <div className="stat-card-compact">
            <div className="stat-header-compact">
              <span className="stat-name-small">Energia</span>
            </div>
            <StatBar
              label=""
              value={pet.energy}
              icon=""
              color={getStatColor(pet.energy)}
            />
          </div>

          <div className="stat-card-compact">
            <div className="stat-header-compact">
              <span className="stat-name-small">Limpieza</span>
            </div>
            <StatBar
              label=""
              value={pet.cleanliness}
              icon=""
              color={getStatColor(pet.cleanliness)}
            />
          </div>

          <div className="stat-card-compact">
            <div className="stat-header-compact">
              <span className="stat-name-small">Salud</span>
            </div>
            <StatBar
              label=""
              value={pet.health}
              icon=""
              color={getStatColor(pet.health)}
            />
          </div>
        </div>
      </div>

      

      {/* Consejos */}
      <div className="tips-section-home">
        <div className="tip-card-home">
          <div className="tip-content">
            <div className="tip-title">Consejo</div>
            <div className="tip-text">
              {pet.hunger < 30 && "Tu mascota tiene hambre. Aliméntala pronto."}
              {pet.happiness < 30 && pet.hunger >= 30 && "Juega con tu mascota para hacerla feliz."}
              {pet.energy < 30 && pet.hunger >= 30 && pet.happiness >= 30 && "Tu mascota necesita descansar."}
              {pet.cleanliness < 30 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && "Es hora de un baño."}
              {pet.health < 50 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && "La salud está baja. Considera usar medicina."}
              {pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && pet.health >= 50 && "Tu mascota está muy bien cuidada."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
