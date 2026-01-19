import { useState, useEffect } from 'react';
import './EggScreen.css';
import PixelPet from './PixelPet';

const EggScreen = ({ pet, onHatch }) => {
  const [clicks, setClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isCracking, setIsCracking] = useState(false);
  const [animation, setAnimation] = useState('egg-idle');

  const clicksNeeded = 20; // Número de clics necesarios para eclosionar
  const progress = Math.min((clicks / clicksNeeded) * 100, 100);

  useEffect(() => {
    // Cambiar a animación de shake cuando está cerca de eclosionar
    if (clicks >= clicksNeeded * 0.5 && clicks < clicksNeeded) {
      setAnimation('egg-shake');
      setIsShaking(true);
    } else if (clicks < clicksNeeded * 0.5) {
      setAnimation('egg-idle');
      setIsShaking(false);
    }
  }, [clicks, clicksNeeded]);

  useEffect(() => {
    // Iniciar eclosión cuando se alcanza el número de clics
    if (clicks >= clicksNeeded && !isCracking) {
      setIsCracking(true);
      setAnimation('egg-crack');

      // Después de la animación de crack, eclosionar
      setTimeout(() => {
        onHatch();
      }, 1000); // 4 frames * 250ms = 1000ms
    }
  }, [clicks, clicksNeeded, isCracking, onHatch]);

  const handleClick = () => {
    if (!isCracking) {
      setClicks(prev => prev + 1);
    }
  };

  return (
    <div className="egg-screen">
      <div className="egg-container">
        <div className="egg-header">
          <h2 className="egg-title">Tu Huevo Misterioso</h2>
          <p className="egg-subtitle">
            {isCracking ? '¡Está eclosionando!' :
             isShaking ? '¡Está temblando!' :
             'Toca el huevo para ayudarlo a nacer'}
          </p>
        </div>

        <div
          className={`egg-display ${isShaking ? 'shaking' : ''} ${isCracking ? 'cracking' : ''}`}
          onClick={handleClick}
        >
          <PixelPet
            color={pet.color}
            animation={animation}
            mood="contento"
          />
        </div>

        <div className="egg-progress-section">
          <div className="progress-label">
            Progreso de Eclosión
          </div>
          <div className="egg-progress-bar">
            <div
              className="egg-progress-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shine"></div>
            </div>
          </div>
          <div className="progress-text">
            {clicks} / {clicksNeeded} toques
          </div>
        </div>

        <div className="egg-info">
          <div className="info-card-egg">
            <span className="info-icon-egg">💡</span>
            <div className="info-content-egg">
              <div className="info-title-egg">¿Sabías qué?</div>
              <div className="info-text-egg">
                {clicks < clicksNeeded * 0.3 ?
                  'Los huevos de gatito necesitan cuidado y atención para eclosionar.' :
                 clicks < clicksNeeded * 0.7 ?
                  '¡Sigue tocando! Tu gatito está despertando dentro del huevo.' :
                  '¡Casi está listo! Unos toques más y conocerás a tu nuevo amigo.'}
              </div>
            </div>
          </div>
        </div>

        {!isCracking && (
          <div className="egg-stats">
            <div className="egg-stat">
              <span className="stat-icon">🥚</span>
              <span className="stat-label">Color: {
                pet.color === 'white' ? 'Blanco' :
                pet.color === 'brown' ? 'Café' :
                'Negro'
              }</span>
            </div>
            <div className="egg-stat">
              <span className="stat-icon">✨</span>
              <span className="stat-label">Estado: {
                progress < 30 ? 'Durmiendo' :
                progress < 70 ? 'Despertando' :
                progress < 100 ? 'Listo para nacer' :
                'Eclosionando'
              }</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EggScreen;
