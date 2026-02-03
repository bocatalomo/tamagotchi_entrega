import React from 'react';
import PixelPet from './PixelPet';
import StatBar from './StatBar';
import Poop from './Poop';
import './HomeScreen-Variation3.css';

const HomeScreenVariation3 = ({
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
      time: '☀️ MORNING',
      borderColor: '#00d4ff',
      textColor: '#00d4ff'
    };
    if (hour >= 15 && hour <= 20) return {
      time: '🌄 AFTERNOON', 
      borderColor: '#ff006e',
      textColor: '#ff006e'
    };
    return {
      time: '🌙 NIGHT',
      borderColor: '#8b00ff',
      textColor: '#8b00ff'
    };
  };

  const timeOfDay = getTimeOfDay();

  const getStatLevel = (value) => {
    if (value < 30) return 'low';
    if (value < 70) return 'medium';
    return 'high';
  };

  const getActionColor = (action, index) => {
    const colors = [
      { border: '#39ff14', shadow: 'rgba(57, 255, 20, 0.8)' },
      { border: '#00d4ff', shadow: 'rgba(0, 212, 255, 0.8)' },
      { border: '#ff006e', shadow: 'rgba(255, 0, 110, 0.8)' },
      { border: '#ffea00', shadow: 'rgba(255, 234, 0, 0.8)' },
      { border: '#8b00ff', shadow: 'rgba(139, 0, 255, 0.8)' },
      { border: '#ff6b35', shadow: 'rgba(255, 107, 53, 0.8)' }
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="home-screen-cyberpunk">
      {/* Header Cyberpunk */}
      <header>
        <div 
          className="time-header-cyberpunk"
          style={{ borderColor: timeOfDay.borderColor }}
        >
          <span 
            className="time-text-cyberpunk"
            style={{ color: timeOfDay.textColor }}
          >
            {timeOfDay.time}
          </span>
        </div>

        {/* Pet header estilo hacker */}
        <div className="pet-header-cyberpunk">
          <h1 className="pet-title-cyberpunk">{pet.name}</h1>
          <div className="level-badge-cyberpunk">
            LVL {pet.level}
          </div>
        </div>
      </header>

      <main>
        {/* Info panels estilo terminal */}
        <section aria-label="System Status">
          <div className="quick-info-cyberpunk">
            <div className="info-terminal-cyberpunk">
              <div className="info-label-cyberpunk">Age</div>
              <div className="info-value-cyberpunk">{pet.age}d</div>
            </div>
            <div className="info-terminal-cyberpunk">
              <div className="info-label-cyberpunk">Credits</div>
              <div className="info-value-cyberpunk">{pet.coins}</div>
            </div>
            <div className="info-terminal-cyberpunk">
              <div className="info-label-cyberpunk">EXP</div>
              <div className="info-value-cyberpunk">{pet.exp}/{pet.level * 100}</div>
            </div>
          </div>
        </section>

        {/* Experience Bar */}
        <section aria-label="Experience Progress">
          <div className="stats-section-cyberpunk">
            <div className="section-header-cyberpunk">
              <h2 className="section-title-cyberpunk">Experience</h2>
            </div>
            <div className="stats-grid-cyberpunk">
              <div className="stat-card-cyberpunk">
                <div className="stat-header-cyberpunk">
                  <span className="stat-name-cyberpunk">Progress</span>
                  <span className="stat-value-cyberpunk">
                    {Math.round((pet.exp / (pet.level * 100)) * 100)}%
                  </span>
                </div>
                <div className="stat-bar-container-cyberpunk">
                  <div
                    className="stat-bar-fill-cyberpunk"
                    style={{ width: `${(pet.exp / (pet.level * 100)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pet Display con HUD */}
        <section aria-label="Pet Avatar">
          <div className="pet-container-cyberpunk">
            <div className="pet-display-cyberpunk">
              {/* Decoraciones de esquina HUD */}
              <div className="corner-decoration corner-tl"></div>
              <div className="corner-decoration corner-tr"></div>
              <div className="corner-decoration corner-bl"></div>
              <div className="corner-decoration corner-br"></div>

              {!pet.isAlive && (
                <div className="death-overlay-cyberpunk">
                  <div className="death-icon-cyberpunk">🥀</div>
                  <p className="death-text-cyberpunk">
                    {pet.name} Has Left the Matrix
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
                aria-label={`${pet.name} Status: ${pet.mood}`}
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
                aria-label={`Waste detected at coordinates ${poop.x}, ${poop.y}`}
              />
            ))}

            {/* Mensaje con efecto glitch */}
            {message && (
              <div className="message-bubble-cyberpunk">
                <div className="message-content-cyberpunk">{message}</div>
              </div>
            )}
          </div>

          {/* Estado actual */}
          <div className="mood-display-cyberpunk">
            <span className="mood-text-cyberpunk">
              {!pet.isAlive ? `STATUS: TERMINATED` : `STATUS: ${pet.mood.toUpperCase()}`}
            </span>
          </div>
        </section>

        {/* Panel de control */}
        <section aria-label="Control Panel">
          <div className="actions-section-cyberpunk">
            <div className="section-header-cyberpunk">
              <h2 className="section-title-cyberpunk">Actions</h2>
            </div>

            <div className="actions-grid-cyberpunk">
              <button
                onClick={onFeed}
                disabled={!pet.isAlive}
                className="action-button-cyberpunk"
                style={{ 
                  borderColor: getActionColor('feed', 0).border,
                  boxShadow: `0 0 20px ${getActionColor('feed', 0).shadow}`
                }}
                aria-label={`Feed ${pet.name}. Food stock: ${inventory.food}`}
              >
                <span className="action-emoji-cyberpunk" aria-hidden="true">🍖</span>
                <span className="action-label-cyberpunk">Feed ({inventory.food})</span>
              </button>

              <button
                onClick={isSleeping ? onWakeUp : onSleep}
                disabled={!pet.isAlive}
                className="action-button-cyberpunk"
                style={{ 
                  borderColor: getActionColor('sleep', 1).border,
                  boxShadow: `0 0 20px ${getActionColor('sleep', 1).shadow}`
                }}
                aria-label={`${isSleeping ? 'Wake' : 'Sleep'} ${pet.name}`}
              >
                <span className="action-emoji-cyberpunk" aria-hidden="true">
                  {isSleeping ? "☀️" : "💤"}
                </span>
                <span className="action-label-cyberpunk">
                  {isSleeping ? "Wake" : "Sleep"}
                </span>
              </button>

              <button
                onClick={onClean}
                disabled={!pet.isAlive}
                className="action-button-cyberpunk"
                style={{ 
                  borderColor: getActionColor('clean', 2).border,
                  boxShadow: `0 0 20px ${getActionColor('clean', 2).shadow}`
                }}
                aria-label={`Clean ${pet.name}. Soap stock: ${inventory.soap}`}
              >
                <span className="action-emoji-cyberpunk" aria-hidden="true">🧼</span>
                <span className="action-label-cyberpunk">Clean ({inventory.soap})</span>
              </button>

              <button
                onClick={onMedicine}
                disabled={!pet.isAlive || inventory.medicine === 0}
                className="action-button-cyberpunk"
                style={{ 
                  borderColor: getActionColor('medicine', 3).border,
                  boxShadow: `0 0 20px ${getActionColor('medicine', 3).shadow}`
                }}
                aria-label={`Administer medicine to ${pet.name}. Med stock: ${inventory.medicine}`}
              >
                <span className="action-emoji-cyberpunk" aria-hidden="true">💊</span>
                <span className="action-label-cyberpunk">Med ({inventory.medicine})</span>
              </button>

              <button
                onClick={onTreat}
                disabled={!pet.isAlive || inventory.treats === 0}
                className="action-button-cyberpunk"
                style={{ 
                  borderColor: getActionColor('treat', 4).border,
                  boxShadow: `0 0 20px ${getActionColor('treat', 4).shadow}`
                }}
                aria-label={`Give treat to ${pet.name}. Treat stock: ${inventory.treats}`}
              >
                <span className="action-emoji-cyberpunk" aria-hidden="true">🍰</span>
                <span className="action-label-cyberpunk">Treat ({inventory.treats})</span>
              </button>

              <button
                onClick={onPlay}
                disabled={!pet.isAlive || pet.energy < 20}
                className="action-button-cyberpunk"
                style={{ 
                  borderColor: getActionColor('play', 5).border,
                  boxShadow: `0 0 20px ${getActionColor('play', 5).shadow}`
                }}
                aria-label={`Play with ${pet.name}. Energy level: ${pet.energy}/100`}
              >
                <span className="action-emoji-cyberpunk" aria-hidden="true">🎮</span>
                <span className="action-label-cyberpunk">Play</span>
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard de estadísticas */}
        <section aria-label="Vital Statistics">
          <div className="stats-section-cyberpunk">
            <div className="section-header-cyberpunk">
              <h2 className="section-title-cyberpunk">Vitals</h2>
            </div>

            <div className="stats-grid-cyberpunk">
              <div className="stat-card-cyberpunk">
                <div className="stat-header-cyberpunk">
                  <span className="stat-name-cyberpunk">Hunger</span>
                  <span className="stat-value-cyberpunk">{pet.hunger}/100</span>
                </div>
                <div className="stat-bar-container-cyberpunk">
                  <div
                    className={`stat-bar-fill-cyberpunk ${getStatLevel(pet.hunger)}`}
                    style={{ width: `${pet.hunger}%` }}
                    aria-label={`Hunger level: ${pet.hunger} percent`}
                  />
                </div>
              </div>

              <div className="stat-card-cyberpunk">
                <div className="stat-header-cyberpunk">
                  <span className="stat-name-cyberpunk">Happiness</span>
                  <span className="stat-value-cyberpunk">{pet.happiness}/100</span>
                </div>
                <div className="stat-bar-container-cyberpunk">
                  <div
                    className={`stat-bar-fill-cyberpunk ${getStatLevel(pet.happiness)}`}
                    style={{ width: `${pet.happiness}%` }}
                    aria-label={`Happiness level: ${pet.happiness} percent`}
                  />
                </div>
              </div>

              <div className="stat-card-cyberpunk">
                <div className="stat-header-cyberpunk">
                  <span className="stat-name-cyberpunk">Energy</span>
                  <span className="stat-value-cyberpunk">{pet.energy}/100</span>
                </div>
                <div className="stat-bar-container-cyberpunk">
                  <div
                    className={`stat-bar-fill-cyberpunk ${getStatLevel(pet.energy)}`}
                    style={{ width: `${pet.energy}%` }}
                    aria-label={`Energy level: ${pet.energy} percent`}
                  />
                </div>
              </div>

              <div className="stat-card-cyberpunk">
                <div className="stat-header-cyberpunk">
                  <span className="stat-name-cyberpunk">Cleanliness</span>
                  <span className="stat-value-cyberpunk">{pet.cleanliness}/100</span>
                </div>
                <div className="stat-bar-container-cyberpunk">
                  <div
                    className={`stat-bar-fill-cyberpunk ${getStatLevel(pet.cleanliness)}`}
                    style={{ width: `${pet.cleanliness}%` }}
                    aria-label={`Cleanliness level: ${pet.cleanliness} percent`}
                  />
                </div>
              </div>

              <div className="stat-card-cyberpunk">
                <div className="stat-header-cyberpunk">
                  <span className="stat-name-cyberpunk">Health</span>
                  <span className="stat-value-cyberpunk">{pet.health}/100</span>
                </div>
                <div className="stat-bar-container-cyberpunk">
                  <div
                    className={`stat-bar-fill-cyberpunk ${getStatLevel(pet.health)}`}
                    style={{ width: `${pet.health}%` }}
                    aria-label={`Health level: ${pet.health} percent`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sistema de alertas */}
        <section aria-label="System Alerts">
          <div className="tips-section-cyberpunk">
            <div className="tip-card-cyberpunk">
              <div className="tip-header-cyberpunk">
                <span className="tip-icon-cyberpunk" aria-hidden="true">⚠️</span>
                <h3 className="tip-title-cyberpunk">System Alert</h3>
              </div>
              <div className="tip-content-cyberpunk">
                {pet.hunger < 30 && "Warning: Low nutrition detected. Initiate feeding protocol immediately."}
                {pet.happiness < 30 && pet.hunger >= 30 && "Alert: Happiness levels critical. Recommend recreational activities."}
                {pet.energy < 30 && pet.hunger >= 30 && pet.happiness >= 30 && "Caution: Energy reserves depleted. Initiate sleep cycle."}
                {pet.cleanliness < 30 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && "Sanitary alert: Contamination levels high. Cleaning required."}
                {pet.health < 50 && pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && "Medical alert: Health systems compromised. Medication advised."}
                {pet.hunger >= 30 && pet.happiness >= 30 && pet.energy >= 30 && pet.cleanliness >= 30 && pet.health >= 50 && "Status: All systems optimal. Pet functioning at peak efficiency."}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeScreenVariation3;