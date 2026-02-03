import React from 'react';
import { motion } from 'framer-motion';
import GlassStatsCard from './GlassStatsCard';
import NeuroButton from './NeuroButton';
import GlassNav from './GlassNav';
import GlassModal from './GlassModal';
import GameSelectionModal from './GameSelectionModal';
import RetroFuturisticDashboard from './RetroFuturisticDashboard';
import './styles/enhanced-design-system.css';

interface EnhancedDashboardDemoProps {
  pet: {
    name: string;
    stage: string;
    mood: string;
    level: number;
    age: number;
    coins: number;
  };
  stats: {
    hunger: number;
    happiness: number;
    energy: number;
    cleanliness: number;
    health: number;
  };
  inventory: {
    food: number;
    medicine: number;
    treats: number;
    soap: number;
  };
  onActionClick: (action: string) => void;
}

const EnhancedDashboardDemo: React.FC<EnhancedDashboardDemoProps> = ({
  pet,
  stats,
  inventory,
  onActionClick,
}) => {
  const [currentView, setCurrentView] = React.useState<'traditional' | 'enhanced' | 'retro-futuristic'>('enhanced');
  const [showGameModal, setShowGameModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedStat, setSelectedStat] = React.useState<string | null>(null);

  const navItems = [
    { id: 'traditional', label: 'Clásico', icon: '🕹️' },
    { id: 'enhanced', label: 'Moderno', icon: '✨' },
    { id: 'retro-futuristic', label: 'Retro-Futuro', icon: '🚀', notification: true },
  ];

  const mockAchievements = [
    {
      id: 'first-meal',
      title: 'Primera Comida',
      description: 'Alimenta a tu mascota por primera vez',
      icon: '🍖',
      isUnlocked: true,
      rarity: 'common' as const,
    },
    {
      id: 'level-10',
      title: 'Experto',
      description: 'Alcanza el nivel 10',
      icon: '⭐',
      isUnlocked: pet.level >= 10,
      rarity: 'rare' as const,
    },
    {
      id: 'collector',
      title: 'Coleccionista',
      description: 'Acumula 500 monedas',
      icon: '💰',
      isUnlocked: pet.coins >= 500,
      rarity: 'epic' as const,
    },
  ];

  const handleActionClick = (action: string) => {
    onActionClick(action);
    
    // Show specific modals based on action
    if (action === 'play') {
      setShowGameModal(true);
    } else if (action === 'sleep') {
      // Could show sleep confirmation modal
      onActionClick('sleep');
    }
  };

  const getTrendData = (statName: string, value: number) => {
    // Simulate trend data based on stat value
    if (value > 70) return { trend: 'up' as const, value: Math.floor(Math.random() * 10) + 5 };
    if (value < 30) return { trend: 'down' as const, value: Math.floor(Math.random() * 10) + 5 };
    return { trend: 'stable' as const, value: 0 };
  };

  if (currentView === 'retro-futuristic') {
    return (
      <div>
        <GlassNav
          currentScreen={currentView}
          onNavigate={(screen: string) => setCurrentView(screen as any)}
          items={navItems}
        />
        <RetroFuturisticDashboard
          pet={pet}
          stats={stats}
          achievements={mockAchievements}
          onActionClick={handleActionClick}
          onAchievementClick={(achievementId) => console.log('Achievement clicked:', achievementId)}
        />
        <GameSelectionModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
          onGameSelect={(gameId) => {
            console.log('Selected game:', gameId);
            setShowGameModal(false);
            onActionClick(`play-${gameId}`);
          }}
          pet={{...pet, energy: stats.energy}}
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a24 100%),
        radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)
      `,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Navigation */}
        <GlassNav
          currentScreen={currentView}
          onNavigate={(screen: string) => setCurrentView(screen as any)}
          items={navItems}
        />
        <RetroFuturisticDashboard
          pet={pet}
          stats={stats}
          achievements={mockAchievements}
          onActionClick={handleActionClick}
          onAchievementClick={(achievementId) => console.log('Achievement clicked:', achievementId)}
        />
        <GameSelectionModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
          onGameSelect={(gameId) => {
            console.log('Selected game:', gameId);
            setShowGameModal(false);
            onActionClick(`play-${gameId}`);
          }}
          pet={{...pet, energy: stats.energy}}
        />

      <div style={{ 
        paddingTop: '100px', 
        padding: 'var(--spacing-lg)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Pet Info Header */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 'var(--spacing-xl)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)',
            position: 'relative',
          }}
        >
          <motion.h1
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '2rem',
              background: 'var(--neon-gradient-cyan)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 'var(--spacing-md)',
            }}
            animate={{
              textShadow: ['0 0 10px var(--color-neon-cyan)', '0 0 20px var(--color-neon-cyan)', '0 0 10px var(--color-neon-cyan)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {pet.name}
          </motion.h1>
          
          <div style={{ fontSize: '3rem', margin: 'var(--spacing-lg) 0' }}>
            {pet.stage === 'egg' ? '🥚' : pet.stage === 'baby' ? '🐣' : pet.stage === 'teen' ? '🐥' : '🐱'}
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-xl)',
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.7rem',
            color: 'var(--color-text-secondary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span>📊</span>
              <span>Nivel {pet.level}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span>🎂</span>
              <span>{pet.age} días</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span>🪙</span>
              <span>{pet.coins}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span>😊</span>
              <span>{pet.mood}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}>
          {[
            { icon: '🍖', label: 'Hambre', value: stats.hunger, key: 'hunger' },
            { icon: '😊', label: 'Felicidad', value: stats.happiness, key: 'happiness' },
            { icon: '⚡', label: 'Energía', value: stats.energy, key: 'energy' },
            { icon: '🧼', label: 'Limpieza', value: stats.cleanliness, key: 'cleanliness' },
            { icon: '❤️', label: 'Salud', value: stats.health, key: 'health' },
          ].map((stat, index) => {
            const trendData = getTrendData(stat.key, stat.value);
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedStat(stat.key)}
              >
                <GlassStatsCard
                  title={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color="auto"
                  trend={trendData.trend}
                  trendValue={trendData.value}
                  onClick={() => setSelectedStat(stat.key)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)',
          }}
        >
          <NeuroButton
            label="Alimentar"
            icon="🍖"
            variant="success"
            glowEffect={inventory.food > 0}
            onClick={() => handleActionClick('feed')}
            disabled={inventory.food === 0}
          />
          <NeuroButton
            label="Jugar"
            icon="🎮"
            variant="primary"
            glowEffect={stats.energy > 30}
            onClick={() => handleActionClick('play')}
            disabled={stats.energy < 30}
          />
          <NeuroButton
            label="Dormir"
            icon="😴"
            variant="secondary"
            glowEffect
            onClick={() => handleActionClick('sleep')}
          />
          <NeuroButton
            label="Limpiar"
            icon="🧼"
            variant="primary"
            glowEffect={inventory.soap > 0}
            onClick={() => handleActionClick('clean')}
            disabled={inventory.soap === 0}
          />
          <NeuroButton
            label="Medicina"
            icon="💊"
            variant="danger"
            glowEffect={inventory.medicine > 0}
            onClick={() => handleActionClick('medicine')}
            disabled={inventory.medicine === 0}
          />
          <NeuroButton
            label="Golosina"
            icon="🍬"
            variant="secondary"
            glowEffect={inventory.treats > 0}
            onClick={() => handleActionClick('treat')}
            disabled={inventory.treats === 0}
          />
        </motion.div>

        {/* Inventory Display */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            padding: 'var(--spacing-lg)',
          }}
        >
          <h3 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            color: 'var(--color-neon-cyan)',
            marginBottom: 'var(--spacing-md)',
            textAlign: 'center',
          }}>
            🎒 Inventario
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'var(--spacing-md)',
          }}>
            {[
              { item: 'food', name: 'Comida', icon: '🍖', count: inventory.food },
              { item: 'medicine', name: 'Medicina', icon: '💊', count: inventory.medicine },
              { item: 'treats', name: 'Golosinas', icon: '🍬', count: inventory.treats },
              { item: 'soap', name: 'Jabón', icon: '🧼', count: inventory.soap },
            ].map((item) => (
              <motion.div
                key={item.item}
                className="glass-card"
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  opacity: item.count > 0 ? 1 : 0.5,
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>
                  {item.icon}
                </div>
                <div style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.5rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.6rem',
                  color: 'var(--color-neon-amber)',
                }}>
                  x{item.count}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <GameSelectionModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        onGameSelect={(gameId) => {
          console.log('Selected game:', gameId);
          setShowGameModal(false);
          onActionClick(`play-${gameId}`);
        }}
        pet={{...pet, energy: stats.energy}}
      />

      <GlassModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="⚙️ Configuración"
        size="md"
      >
        <div>
          <h3>Settings content here...</h3>
        </div>
      </GlassModal>

      {/* Stat Detail Modal */}
      <GlassModal
        isOpen={!!selectedStat}
        onClose={() => setSelectedStat(null)}
        title={`📊 Detalles de ${selectedStat}`}
        size="sm"
      >
        {selectedStat && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
              {stats[selectedStat as keyof typeof stats] > 70 ? '😊' : 
               stats[selectedStat as keyof typeof stats] > 30 ? '😐' : '😟'}
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Estado actual: {stats[selectedStat as keyof typeof stats]}%
            </p>
          </div>
        )}
      </GlassModal>
    </div>
  );
};

export default EnhancedDashboardDemo;