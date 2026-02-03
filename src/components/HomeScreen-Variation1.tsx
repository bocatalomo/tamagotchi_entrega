import React from 'react';
import PixelPet from './PixelPet';
import StatBar from './StatBar';
import Poop from './Poop';
import './HomeScreen-Variation1.css';

const HomeScreenVariation1 = ({
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
    if (hour >= 6 && hour <= 14) return {
      time: '☀️ Mañana',
      gradient: 'linear-gradient(135deg, #00e5ff 0%, #2979ff 100%)'
    };
    if (hour >= 15 && hour <= 20) return {
      time: '🌄 Tarde', 
      gradient: 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)'
    };
    return {
      time: '🌙 Noche',
      gradient: 'linear-gradient(135deg, #76ff03 0%, #64dd17 100%)'
    };
  };

  const timeOfDay = getTimeOfDay();

  return (
    <div className="home-screen-neon-enhanced">
      {/* Header con efecto neón */}
      <div className="time-header-neon" style={{ background: timeOfDay.gradient }}>
        <span className="time-text-neon">{timeOfDay.time}</span>
      </div>

      {/* Nombre y nivel con estilo neon */}
      <div className="pet-header-neon">
        <h1 className="pet-title-neon">{pet.name}</h1>
        <div className="level-badge-neon">
          Nivel {pet.level}
        </div>
      </div>

      {/* Info rápida con burbujas mejoradas */}
      <div className="quick-info-neon">
        <div className="info-bubble-neon">
          <span className="info-value-neon">Edad: {pet.age} días</span>
        </div>
        <div className="info-bubble-neon">
          <span className="info-value-neon">Monedas: {pet.coins}</span>
        </div>
        <div className="info-bubble-neon">
          <span className="info-value-neon">XP: {pet.exp}/{pet.level * 100}</span>
        </div>
      </div>

      {/* Barra de XP mejorada */}
      <div className="stats-section-neon">
        <div className="section-header-neon">
          <span className="section-title-neon">Experiencia</span>
        </div>
        <div className="stats-grid-neon">
          <div className="stat-card-neon">
            <div className="stat-name-neon">Progreso del Nivel</div>
            <div className="stat-bar-container-neon">
              <div
                className="stat-bar-fill-neon"
                style={{ width: `${(pet.exp / (pet.level * 100)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal de la mascota */}
      <div className="pet-container-neon">
        <div className="pet-display-neon">
          {!pet.isAlive && (
            <div className="death-overlay-home">
              <div className="death-icon">🥀</div>
              <p className="death-text">{pet.name} ha abandonado este mundo...</p>
            </div>
          )}

          <PixelPet
            stage={pet.stage}
            state={getPetState()}
            animation={animation}
            type={pet.type}
            color={pet.color}
            mood={pet.mood}
          />
        </div>

        {/* Cacas */}
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
          <div className="message-bubble-neon">
            <div className="bubble-content-neon">{message}</div>
          </div>
        )}
      </div>

      {/* Estado de la mascota */}
      <div className="mood-display-neon">
        <span className="mood-text-neon">
          {!pet.isAlive ? 'Fallecido' : pet.mood}
        </span>
      </div>

      {/* Acciones de cuidado con botones mejorados */}
      <div className="actions-section-neon">
        <div className="section-header-neon">
          <span className="section-title-neon">Acciones</span>
        </div>

        <div className="actions-grid-neon">
          <button
            onClick={onFeed}
            disabled={!pet.isAlive}
            className="action-button-neon"
            aria-label={`Alimentar a ${pet.name}, tienes ${inventory.food} alimentos`}
          >
            <span className="action-emoji-neon">🍖</span>
            <span className="action-label-neon">Alimentar ({inventory.food})</span>
          </button>

          <button
            onClick={isSleeping ? onWakeUp : onSleep}
            disabled={!pet.isAlive}
            className="action-button-neon"
            aria-label={`${isSleeping ? 'Despertar' : 'Dormir'} a ${pet.name}`}
          >
            <span className="action-emoji-neon">{isSleeping ? "☀️" : "💤"}</span>
            <span className="action-label-neon">{isSleeping ? "Despertar" : "Dormir"}</span>
          </button>

          <button
            onClick={onClean}
            disabled={!pet.isAlive}
            className="action-button-neon"
            aria-label={`Limpiar a ${pet.name}, tienes ${inventory.soap} jabones`}
          >
            <span className="action-emoji-neon">🧼</span>
            <span className="action-label-neon">Limpiar ({inventory.soap})</span>
          </button>

          <button
            onClick={onMedicine}
            disabled={!pet.isAlive || inventory.medicine === 0}
            className="action-button-neon"
            aria-label={`Dar medicina a ${pet.name}, tienes ${inventory.medicine} medicamentos`}
          >
            <span className="action-emoji-neon">💊</span>
            <span className="action-label-neon">Medicina ({inventory.medicine})</span>
          </button>

          <button
            onClick={onTreat}
            disabled={!pet.isAlive || inventory.treats === 0}
            className="action-button-neon"
            aria-label={`Dar premio a ${pet.name}, tienes ${inventory.treats} premios`}
          >
            <span className="action-emoji-neon">🍰</span>
            <span className="action-label-neon">Premio ({inventory.treats})</span>
          </button>

          <button
            onClick={onPlay}
            disabled={!pet.isAlive || pet.energy < 20}
            className="action-button-neon"
            aria-label={`Jugar con ${pet.name}, energía actual: ${pet.energy}`}
          >
            <span className="action-emoji-neon">🎮</span>
            <span className="action-label-neon">Jugar</span>
          </button>
        </div>
      </div>

      {/* Estadísticas compactas */}
      <div className="stats-section-neon">
        <div className="section-header-neon">
          <span className="section-title-neon">Estadísticas</span>
        </div>

        <div className="stats-grid-neon">
          <div className="stat-card-neon">
            <div className="stat-name-neon">Hambre</div>
            <StatBar
              label=""
              value={pet.hunger}
              icon=""
              color={getStatColor(pet.hunger)}
            />
          </div>

          <div className="stat-card-neon">
            <div className="stat-name-neon">Felicidad</div>
            <StatBar
              label=""
              value={pet.happiness}
              icon=""
              color={getStatColor(pet.happiness)}
            />
          </div>

          <div className="stat-card-neon">
            <div className="stat-name-neon">Energía</div>
            <StatBar
              label=""
              value={pet.energy}
              icon=""
              color={getStatColor(pet.energy)}
            />
          </div>

          <div className="stat-card-neon">
            <div className="stat-name-neon">Limpieza</div>
            <StatBar
              label=""
              value={pet.cleanliness}
              icon=""
              color={getStatColor(pet.cleanliness)}
            />
          </div>

          <div className="stat-card-neon">
            <div className="stat-name-neon">Salud</div>
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
      <div className="tips-section-neon">
        <div className="tip-card-neon">
          <div className="tip-content">
            <div className="tip-title-neon">Consejo</div>
            <div className="tip-text-neon">
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

export default HomeScreenVariation1;