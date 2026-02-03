import React from 'react';
import PixelPet from './PixelPet';
import StatBar from './StatBar';
import Poop from './Poop';
import './HomeScreen-Variation2.css';

const HomeScreenVariation2 = ({
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
      time: '☀️ Buenos días',
      bgColor: '#f0f9ff',
      textColor: '#0284c7'
    };
    if (hour >= 15 && hour <= 20) return {
      time: '🌄 Buenas tardes', 
      bgColor: '#fdf4ff',
      textColor: '#c026d3'
    };
    return {
      time: '🌙 Buenas noches',
      bgColor: '#fffbeb',
      textColor: '#d97706'
    };
  };

  const timeOfDay = getTimeOfDay();

  const getStatLevel = (value) => {
    if (value < 30) return 'low';
    if (value < 70) return 'medium';
    return 'high';
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      
      <div className="home-screen-minimalist">
        {/* Header simple y accesible */}
        <header>
          <div 
            className="time-header-minimalist"
            style={{ backgroundColor: timeOfDay.bgColor }}
          >
            <span 
              className="time-text-minimalist"
              style={{ color: timeOfDay.textColor }}
            >
              {timeOfDay.time}
            </span>
          </div>

          {/* Nombre y nivel */}
          <div className="pet-header-minimalist">
            <h1 className="pet-title-minimalist">{pet.name}</h1>
            <div className="level-badge-minimalist">
              Nivel {pet.level}
            </div>
          </div>
        </header>

        <main id="main-content">
          {/* Información rápida */}
          <section aria-label="Información general">
            <div className="quick-info-minimalist">
              <div className="info-card-minimalist">
                <div className="info-label-minimalist">Edad</div>
                <div className="info-value-minimalist">{pet.age} días</div>
              </div>
              <div className="info-card-minimalist">
                <div className="info-label-minimalist">Monedas</div>
                <div className="info-value-minimalist">{pet.coins}</div>
              </div>
              <div className="info-card-minimalist">
                <div className="info-label-minimalist">Experiencia</div>
                <div className="info-value-minimalist">{pet.exp}/{pet.level * 100}</div>
              </div>
            </div>
          </section>

          {/* Barra de experiencia */}
          <section aria-label="Progreso de nivel">
            <div className="stats-section-minimalist">
              <div className="section-header-minimalist">
                <h2 className="section-title-minimalist">Experiencia</h2>
              </div>
              <div className="stats-grid-minimalist">
                <div className="stat-card-minimalist">
                  <div className="stat-header-minimalist">
                    <span className="stat-name-minimalist">Progreso</span>
                    <span className="stat-value-minimalist">
                      {Math.round((pet.exp / (pet.level * 100)) * 100)}%
                    </span>
                  </div>
                  <div className="stat-bar-container-minimalist">
                    <div
                      className="stat-bar-fill-minimalist"
                      style={{ width: `${(pet.exp / (pet.level * 100)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contenedor principal de la mascota */}
          <section aria-label="Tu mascota">
            <div className="pet-container-minimalist">
              <div className="pet-display-minimalist">
                {!pet.isAlive && (
                  <div className="death-overlay-minimalist">
                    <div className="death-icon-minimalist">🥀</div>
                    <p className="death-text-minimalist">
                      {pet.name} ha abandonado este mundo...
                    </p>
                  </div>
                )}

                <PixelPet
                  stage={pet.stage}
                  state={getPetState()}
                  animation={animation}
                  type={pet.type}
                  color={pet.color}
                  mood={pet.mood}
                  aria-label={`${pet.name}, estado: ${pet.mood}`}
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
                  aria-label={`Caca en posición ${poop.x}, ${poop.y}`}
                />
              ))}

              {/* Mensaje de la mascota */}
              {message && (
                <div className="message-bubble-minimalist">
                  <div className="message-content-minimalist">{message}</div>
                </div>
              )}
            </div>

            {/* Estado actual */}
            <div className="mood-display-minimalist">
              <span className="mood-text-minimalist">
                {!pet.isAlive ? 'Fallecido' : pet.mood}
              </span>
            </div>
          </section>

          {/* Acciones de cuidado */}
          <section aria-label="Acciones de cuidado">
            <div className="actions-section-minimalist">
              <div className="section-header-minimalist">
                <h2 className="section-title-minimalist">Acciones</h2>
              </div>

              <div className="actions-grid-minimalist">
                <button
                  onClick={onFeed}
                  disabled={!pet.isAlive}
                  className="action-button-minimalist"
                  aria-label={`Alimentar a ${pet.name}. Tienes ${inventory.food} alimentos disponibles`}
                >
                  <span className="action-emoji-minimalist" aria-hidden="true">🍖</span>
                  <span className="action-label-minimalist">Alimentar ({inventory.food})</span>
                </button>

                <button
                  onClick={isSleeping ? onWakeUp : onSleep}
                  disabled={!pet.isAlive}
                  className="action-button-minimalist"
                  aria-label={`${isSleeping ? 'Despertar' : 'Dormir'} a ${pet.name}`}
                >
                  <span className="action-emoji-minimalist" aria-hidden="true">
                    {isSleeping ? "☀️" : "💤"}
                  </span>
                  <span className="action-label-minimalist">{isSleeping ? "Despertar" : "Dormir"}</span>
                </button>

                <button
                  onClick={onClean}
                  disabled={!pet.isAlive}
                  className="action-button-minimalist"
                  aria-label={`Limpiar a ${pet.name}. Tienes ${inventory.soap} jabones disponibles`}
                >
                  <span className="action-emoji-minimalist" aria-hidden="true">🧼</span>
                  <span className="action-label-minimalist">Limpiar ({inventory.soap})</span>
                </button>

                <button
                  onClick={onMedicine}
                  disabled={!pet.isAlive || inventory.medicine === 0}
                  className="action-button-minimalist"
                  aria-label={`Dar medicina a ${pet.name}. Tienes ${inventory.medicine} medicamentos disponibles`}
                >
                  <span className="action-emoji-minimalist" aria-hidden="true">💊</span>
                  <span className="action-label-minimalist">Medicina ({inventory.medicine})</span>
                </button>

                <button
                  onClick={onTreat}
                  disabled={!pet.isAlive || inventory.treats === 0}
                  className="action-button-minimalist"
                  aria-label={`Dar premio a ${pet.name}. Tienes ${inventory.treats} premios disponibles`}
                >
                  <span className="action-emoji-minimalist" aria-hidden="true">🍰</span>
                  <span className="action-label-minimalist">Premio ({inventory.treats})</span>
                </button>

                <button
                  onClick={onPlay}
                  disabled={!pet.isAlive || pet.energy < 20}
                  className="action-button-minimalist"
                  aria-label={`Jugar con ${pet.name}. Energía actual: ${pet.energy} de 100`}
                >
                  <span className="action-emoji-minimalist" aria-hidden="true">🎮</span>
                  <span className="action-label-minimalist">Jugar</span>
                </button>
              </div>
            </div>
          </section>

          {/* Estadísticas detalladas */}
          <section aria-label="Estadísticas de salud">
            <div className="stats-section-minimalist">
              <div className="section-header-minimalist">
                <h2 className="section-title-minimalist">Estadísticas</h2>
              </div>

              <div className="stats-grid-minimalist">
                <div className="stat-card-minimalist">
                  <div className="stat-header-minimalist">
                    <span className="stat-name-minimalist">Hambre</span>
                    <span className="stat-value-minimalist">{pet.hunger}/100</span>
                  </div>
                  <div className="stat-bar-container-minimalist">
                    <div
                      className={`stat-bar-fill-minimalist ${getStatLevel(pet.hunger)}`}
                      style={{ width: `${pet.hunger}%` }}
                      aria-label={`Hambre: ${pet.hunger} por ciento`}
                    />
                  </div>
                </div>

                <div className="stat-card-minimalist">
                  <div className="stat-header-minimalist">
                    <span className="stat-name-minimalist">Felicidad</span>
                    <span className="stat-value-minimalist">{pet.happiness}/100</span>
                  </div>
                  <div className="stat-bar-container-minimalist">
                    <div
                      className={`stat-bar-fill-minimalist ${getStatLevel(pet.happiness)}`}
                      style={{ width: `${pet.happiness}%` }}
                      aria-label={`Felicidad: ${pet.happiness} por ciento`}
                    />
                  </div>
                </div>

                <div className="stat-card-minimalist">
                  <div className="stat-header-minimalist">
                    <span className="stat-name-minimalist">Energía</span>
                    <span className="stat-value-minimalist">{pet.energy}/100</span>
                  </div>
                  <div className="stat-bar-container-minimalist">
                    <div
                      className={`stat-bar-fill-minimalist ${getStatLevel(pet.energy)}`}
                      style={{ width: `${pet.energy}%` }}
                      aria-label={`Energía: ${pet.energy} por ciento`}
                    />
                  </div>
                </div>

                <div className="stat-card-minimalist">
                  <div className="stat-header-minimalist">
                    <span className="stat-name-minimalist">Limpieza</span>
                    <span className="stat-value-minimalist">{pet.cleanliness}/100</span>
                  </div>
                  <div className="stat-bar-container-minimalist">
                    <div
                      className={`stat-bar-fill-minimalist ${getStatLevel(pet.cleanliness)}`}
                      style={{ width: `${pet.cleanliness}%` }}
                      aria-label={`Limpieza: ${pet.cleanliness} por ciento`}
                    />
                  </div>
                </div>

                <div className="stat-card-minimalist">
                  <div className="stat-header-minimalist">
                    <span className="stat-name-minimalist">Salud</span>
                    <span className="stat-value-minimalist">{pet.health}/100</span>
                  </div>
                  <div className="stat-bar-container-minimalist">
                    <div
                      className={`stat-bar-fill-minimalist ${getStatLevel(pet.health)}`}
                      style={{ width: `${pet.health}%` }}
                      aria-label={`Salud: ${pet.health} por ciento`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Consejos */}
          <section aria-label="Consejos">
            <div className="tips-section-minimalist">
              <div className="tip-card-minimalist">
                <div className="tip-header-minimalist">
                  <span className="tip-icon-minimalist" aria-hidden="true">💡</span>
                  <h3 className="tip-title-minimalist">Consejo</h3>
                </div>
                <div className="tip-content-minimalist">
                  {pet.hunger < 30 && "Tu mascota tiene hambre. Aliméntala pronto para mantener su salud."}
                  {pet.happiness < 30 && pet.hunger >= 30 && "Juega con tu mascota para aumentar su felicidad."}
                  {pet.energy < 30 && pet.hunger >= 30 && pet.happiness >= 30 && "Tu mascota necesita descansar. Déjala dormir para recuperar energía."}
                  {pet.cleanliness < 30 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && "Es hora de un baño. Mantén a tu mascota limpia para prevenir enfermedades."}
                  {pet.health < 50 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && "La salud está baja. Considera usar medicina para mejorarla."}
                  {pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && pet.health >= 50 && "¡Excelente! Tu mascota está muy bien cuidada y saludable."}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default HomeScreenVariation2;