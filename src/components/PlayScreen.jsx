import './PlayScreen.css';

const PlayScreen = ({
  pet,
  onPlay,
  onOpenMinigames,
  onOpenAchievements,
  onOpenSkateGame,
  unlockedAchievements = []
}) => {
  const totalAchievements = 18; // Actualizar si cambias el número de logros

  // Funciones por defecto si no se pasan
  const handleOpenMinigames = () => {
    if (onOpenMinigames) {
      onOpenMinigames();
    } else {
      alert('🎮 Mini-juegos próximamente disponibles');
    }
  };

  const handleOpenAchievements = () => {
    if (onOpenAchievements) {
      onOpenAchievements();
    } else {
      alert('🏆 Sistema de logros próximamente disponible');
    }
  };

  const handleOpenSkateGame = () => {
    if (onOpenSkateGame) {
      onOpenSkateGame();
    } else {
      alert('🛹 Juego de skate próximamente disponible');
    }
  };

  const gameStats = [
    { icon: '🎮', label: 'Mini-Juegos', value: '4 disponibles' },
    { icon: '🏆', label: 'Logros', value: `${unlockedAchievements.length}/${totalAchievements}` },
    { icon: '⚡', label: 'Energía', value: `${pet.energy}/100` }
  ];

  return (
    <div className="play-screen">
      <div className="play-header">
        <h2 className="play-title">🎮 Juega con {pet.name}</h2>
      </div>

      {/* Stats de juego */}
      <div className="game-stats">
        {gameStats.map((stat, index) => (
          <div key={index} className="game-stat-card">
            <div className="game-stat-icon">{stat.icon}</div>
            <div className="game-stat-info">
              <div className="game-stat-label">{stat.label}</div>
              <div className="game-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini-juegos */}
      <div className="minigames-section">
        

        <button
          onClick={handleOpenMinigames}
          disabled={!pet.isAlive || pet.energy < 30}
          className="minigames-card"
        >
          <div className="card-decoration">
            <span className="deco-star">⭐</span>
            <span className="deco-star">⭐</span>
            <span className="deco-star">⭐</span>
          </div>
          
          <div className="minigames-icon">🎮</div>
          
          <div className="minigames-content">
            <div className="minigames-title">Mini-Juegos con {pet.name}</div>
            <div className="minigames-description">
              4 juegos diferentes • Gana monedas y experiencia
            </div>
          </div>

          <div className="minigames-games">
            <span className="mini-game-badge">✊ PPT</span>
            <span className="mini-game-badge">🧠 Memoria</span>
            <span className="mini-game-badge">⚡ Reflejos</span>
            <span className="mini-game-badge">🔢 Adivina</span>
          </div>

          {pet.energy < 30 && pet.isAlive && (
            <div className="energy-warning">
              ⚠️ Necesitas más energía (mín. 30)
            </div>
          )}

          {!pet.isAlive && (
            <div className="energy-warning">
              💀 Tu mascota debe estar viva
            </div>
          )}
        </button>
      </div>

      {/* Skate Game */}
      <div className="skate-game-section">
        <button
          onClick={handleOpenSkateGame}
          disabled={!pet.isAlive || pet.energy < 20}
          className="skate-game-card"
        >
          <div className="card-decoration">
            <span className="deco-star">🛹</span>
            <span className="deco-star">⚡</span>
            <span className="deco-star">🛹</span>
          </div>

          <div className="skate-game-icon">🛹</div>

          <div className="skate-game-content">
            <div className="skate-game-title">Skate Jump</div>
            <div className="skate-game-description">
              ¡Salta entre plataformas! • Doble salto • Velocidad creciente
            </div>
          </div>

          <div className="skate-game-features">
            <span className="feature-badge">🎯 Salto</span>
            <span className="feature-badge">⚡ Doble Salto</span>
            <span className="feature-badge">🏆 Puntuación</span>
          </div>

          {pet.energy < 20 && pet.isAlive && (
            <div className="energy-warning">
              ⚠️ Necesitas más energía (mín. 20)
            </div>
          )}

          {!pet.isAlive && (
            <div className="energy-warning">
              💀 Tu mascota debe estar viva
            </div>
          )}
        </button>
      </div>

      {/* Logros */}
      <div className="achievements-section">
        

        <button onClick={handleOpenAchievements} className="achievements-card">
          <div className="achievements-icon">🏆</div>
          
          <div className="achievements-content">
            <div className="achievements-title">Colección de Logros</div>
            <div className="achievements-progress">
              <div className="progress-bar-play">
                <div 
                  className="progress-fill-play"
                  style={{ width: `${(unlockedAchievements.length / totalAchievements) * 100}%` }}
                >
                  <div className="progress-shine"></div>
                </div>
              </div>
              <div className="progress-text">
                {unlockedAchievements.length} de {totalAchievements} desbloqueados
              </div>
            </div>
          </div>

          <div className="achievements-badge">
            {Math.round((unlockedAchievements.length / totalAchievements) * 100)}%
          </div>
        </button>

        {/* Últimos logros desbloqueados */}
        {unlockedAchievements.length > 0 && (
          <div className="recent-achievements">
            <div className="recent-title">Logros recientes</div>
            <div className="recent-badges">
              {unlockedAchievements.slice(-3).reverse().map((id, index) => (
                <div key={index} className="recent-badge">
                  🏅
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      

      {/* Información */}
      <div className="play-info-section">
        <div className="info-card-play">
          <span className="info-icon-play">💡</span>
          <div className="info-content-play">
            <div className="info-title-play">¿Sabías qué?</div>
            <div className="info-text-play">
              Los mini-juegos son la mejor forma de ganar monedas. 
              ¡Cada victoria te da entre 7-12 monedas y experiencia extra!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayScreen;
