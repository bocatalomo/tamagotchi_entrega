/**
 * ArcadeStatsScreen - Pantalla de estadísticas del Tamagotchi
 * Extraído de App.tsx como parte del refactoring de clean code
 */

import ArcadeButton from './ArcadeButton';
import { PetState, Inventory } from '../types';
import { STAGE, EXP } from '../constants';

interface ArcadeStatsScreenProps {
  pet: PetState;
  inventory: Inventory;
  onReset: () => void;
  onClose: () => void;
}

const STAGE_NAMES: Record<string, string> = {
  egg: 'Huevo',
  baby: 'Bebé',
  teen: 'Joven',
  adult: 'Adulto',
};

const ArcadeStatsScreen: React.FC<ArcadeStatsScreenProps> = ({
  pet,
  inventory,
  onReset,
  onClose,
}) => {
  const stats = [
    { label: 'Nombre', value: pet.name },
    { label: 'Etapa', value: STAGE_NAMES[pet.stage] || pet.stage },
    { label: 'Nivel', value: pet.level },
    { label: 'Experiencia', value: `${pet.exp}/${pet.level * EXP.PER_LEVEL}` },
    { label: 'Edad', value: `${pet.age} días` },
    { label: 'Monedas', value: pet.coins },
    { label: 'Comida', value: inventory.food },
    { label: 'Medicina', value: inventory.medicine },
    { label: 'Golosinas', value: inventory.treats },
    { label: 'Jabón', value: inventory.soap },
  ];

  return (
    <div className="arcade-stats-container">
      <div className="arcade-stats-header">
        <h2 className="arcade-section-title">📊 ESTADÍSTICAS ARCADE</h2>
        <ArcadeButton variant="joystick" size="small" onClick={onClose}>
          ✕
        </ArcadeButton>
      </div>

      <div className="arcade-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="arcade-stat-row">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <ArcadeButton
        variant="primary"
        size="medium"
        onClick={onReset}
        className="arcade-reset-button"
        aria-label="Reiniciar el juego"
      >
        🔄 Reiniciar Juego
      </ArcadeButton>
    </div>
  );
};

export default ArcadeStatsScreen;
