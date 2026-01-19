import { useState } from 'react';
import './Achievements.css';

const Achievements = ({ onClose, unlockedAchievements }) => {
  const [selectedTab, setSelectedTab] = useState('all');

  const achievements = [
    // Logros básicos
    {
      id: 'first_steps',
      name: 'Primeros Pasos',
      description: 'Alimenta a tu mascota por primera vez',
      icon: '🍖',
      category: 'basic',
      condition: (stats) => stats.timesFed >= 1,
      reward: { coins: 5, exp: 10 }
    },
    {
      id: 'clean_freak',
      name: 'Pulcritud',
      description: 'Mantén limpieza a 100 durante 5 minutos',
      icon: '✨',
      category: 'basic',
      condition: (stats) => stats.cleanStreak >= 300,
      reward: { coins: 10, exp: 20 }
    },
    {
      id: 'happy_pet',
      name: 'Mascota Feliz',
      description: 'Mantén felicidad a 100 durante 10 minutos',
      icon: '😊',
      category: 'basic',
      condition: (stats) => stats.happyStreak >= 600,
      reward: { coins: 15, exp: 30 }
    },

    // Logros de juegos
    {
      id: 'gaming_streak',
      name: 'Racha Ganadora',
      description: 'Gana 5 mini-juegos seguidos',
      icon: '🎮',
      category: 'games',
      condition: (stats) => stats.winStreak >= 5,
      reward: { coins: 25, exp: 50 }
    },
    {
      id: 'mini_master',
      name: 'Maestro de Mini-Juegos',
      description: 'Gana al menos 1 vez cada mini-juego',
      icon: '🏆',
      category: 'games',
      condition: (stats) => stats.gamesWon.rps && stats.gamesWon.memory && 
                            stats.gamesWon.reaction && stats.gamesWon.guess,
      reward: { coins: 50, exp: 100 }
    },
    {
      id: 'speed_demon',
      name: 'Demonio Veloz',
      description: 'Reacciona en menos de 200ms',
      icon: '⚡',
      category: 'games',
      condition: (stats) => stats.bestReaction < 200,
      reward: { coins: 20, exp: 40 }
    },

    // Logros de riqueza
    {
      id: 'first_hundred',
      name: 'Primer Centenar',
      description: 'Acumula 100 monedas',
      icon: '💰',
      category: 'wealth',
      condition: (stats) => stats.totalCoins >= 100,
      reward: { coins: 10, exp: 20 }
    },
    {
      id: 'rich_pet',
      name: 'Mascota Rica',
      description: 'Acumula 500 monedas',
      icon: '💎',
      category: 'wealth',
      condition: (stats) => stats.totalCoins >= 500,
      reward: { coins: 50, exp: 100 }
    },
    {
      id: 'shopaholic',
      name: 'Comprador Compulsivo',
      description: 'Compra 50 items en la tienda',
      icon: '🏪',
      category: 'wealth',
      condition: (stats) => stats.itemsBought >= 50,
      reward: { coins: 30, exp: 60 }
    },

    // Logros de supervivencia
    {
      id: 'survivor',
      name: 'Superviviente',
      description: 'Mantén a tu mascota viva 30 días',
      icon: '🎂',
      category: 'survival',
      condition: (stats) => stats.petAge >= 30,
      reward: { coins: 40, exp: 80 }
    },
    {
      id: 'elder',
      name: 'Anciano Sabio',
      description: 'Alcanza 100 años de edad',
      icon: '👴',
      category: 'survival',
      condition: (stats) => stats.petAge >= 100,
      reward: { coins: 100, exp: 200 }
    },
    {
      id: 'doctor',
      name: 'Doctor',
      description: 'Cura a tu mascota 10 veces',
      icon: '💊',
      category: 'survival',
      condition: (stats) => stats.timesCured >= 10,
      reward: { coins: 25, exp: 50 }
    },

    // Logros de nivel
    {
      id: 'level_5',
      name: 'Nivel 5',
      description: 'Alcanza el nivel 5',
      icon: '⭐',
      category: 'level',
      condition: (stats) => stats.petLevel >= 5,
      reward: { coins: 20, exp: 40 }
    },
    {
      id: 'level_10',
      name: 'Nivel 10',
      description: 'Alcanza el nivel 10',
      icon: '🌟',
      category: 'level',
      condition: (stats) => stats.petLevel >= 10,
      reward: { coins: 50, exp: 100 }
    },
    {
      id: 'level_25',
      name: 'Nivel 25',
      description: 'Alcanza el nivel 25',
      icon: '✨',
      category: 'level',
      condition: (stats) => stats.petLevel >= 25,
      reward: { coins: 100, exp: 200 }
    },

    // Logros secretos
    {
      id: 'night_owl',
      name: 'Búho Nocturno',
      description: 'Juega entre medianoche y 4am',
      icon: '🦉',
      category: 'secret',
      condition: (stats) => stats.playedAtNight,
      reward: { coins: 15, exp: 30 }
    },
    {
      id: 'perfect_day',
      name: 'Día Perfecto',
      description: 'Todos los stats a 100 al mismo tiempo',
      icon: '💯',
      category: 'secret',
      condition: (stats) => stats.hadPerfectStats,
      reward: { coins: 50, exp: 100 }
    },
    {
      id: 'collector',
      name: 'Coleccionista',
      description: 'Obtén todos los logros',
      icon: '🏅',
      category: 'secret',
      condition: (stats) => stats.achievementCount >= 17, // Total - 1 (este mismo)
      reward: { coins: 200, exp: 500 }
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: '📋' },
    { id: 'basic', name: 'Básicos', icon: '🎯' },
    { id: 'games', name: 'Juegos', icon: '🎮' },
    { id: 'wealth', name: 'Riqueza', icon: '💰' },
    { id: 'survival', name: 'Supervivencia', icon: '❤️' },
    { id: 'level', name: 'Nivel', icon: '⭐' },
    { id: 'secret', name: 'Secretos', icon: '🔒' }
  ];

  const filteredAchievements = selectedTab === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedTab);

  const unlockedCount = achievements.filter(a => 
    unlockedAchievements.includes(a.id)
  ).length;

  const totalRewardsEarned = achievements
    .filter(a => unlockedAchievements.includes(a.id))
    .reduce((acc, a) => ({
      coins: acc.coins + a.reward.coins,
      exp: acc.exp + a.reward.exp
    }), { coins: 0, exp: 0 });

  return (
    <div className="achievements-overlay">
      <div className="achievements-container">
        <div className="achievements-header">
          <h2 className="achievements-title">🏆 Logros</h2>
          <button className="achievements-close" onClick={onClose}>✕</button>
        </div>

        <div className="achievements-stats">
          <div className="achievement-stat">
            <span className="stat-icon">🏆</span>
            <span className="stat-text">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="achievement-stat">
            <span className="stat-icon">💰</span>
            <span className="stat-text">+{totalRewardsEarned.coins}</span>
          </div>
          <div className="achievement-stat">
            <span className="stat-icon">✨</span>
            <span className="stat-text">+{totalRewardsEarned.exp}</span>
          </div>
          <div className="achievement-stat">
            <span className="stat-icon">📊</span>
            <span className="stat-text">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
          </div>
        </div>

        <div className="achievements-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`achievement-tab ${selectedTab === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedTab(cat.id)}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-name">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="achievements-list">
          {filteredAchievements.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            
            return (
              <div 
                key={achievement.id} 
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">
                    {isUnlocked ? achievement.name : '???'}
                  </div>
                  <div className="achievement-description">
                    {isUnlocked || achievement.category !== 'secret' 
                      ? achievement.description 
                      : 'Logro secreto - ¡Descúbrelo!'}
                  </div>
                  <div className="achievement-reward">
                    {isUnlocked && (
                      <>
                        <span className="reward-item">+{achievement.reward.coins}💰</span>
                        <span className="reward-item">+{achievement.reward.exp}✨</span>
                      </>
                    )}
                  </div>
                </div>
                {isUnlocked && (
                  <div className="achievement-badge">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
