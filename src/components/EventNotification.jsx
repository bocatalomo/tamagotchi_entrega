import { useEffect, useState } from 'react';
import './EventNotification.css';
import { rarityColors, rarityLabels } from '../utils/events';

const EventNotification = ({ event, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto-cierre después de 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!event) return null;

  const rarityColor = rarityColors[event.rarity] || '#95a3a6';

  return (
    <div className={`event-notification ${isVisible ? 'visible' : ''}`}>
      <div 
        className="event-card"
        style={{ borderColor: rarityColor }}
      >
        <div className="event-rarity" style={{ backgroundColor: rarityColor }}>
          {rarityLabels[event.rarity]}
        </div>
        
        <button className="event-close" onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}>
          ✕
        </button>

        <div className="event-content">
          <div className="event-icon">{event.icon}</div>
          <div className="event-info">
            <div className="event-name">{event.name}</div>
            <div className="event-description">{event.description}</div>
            
            <div className="event-effects">
              {event.effects.coins && (
                <span className="effect-item positive">+{event.effects.coins} 💰</span>
              )}
              {event.effects.exp && (
                <span className="effect-item positive">+{event.effects.exp} ✨</span>
              )}
              {event.effects.happiness && (
                <span className={`effect-item ${event.effects.happiness > 0 ? 'positive' : 'negative'}`}>
                  {event.effects.happiness > 0 ? '+' : ''}{event.effects.happiness} 😊
                </span>
              )}
              {event.effects.energy && (
                <span className={`effect-item ${event.effects.energy > 0 ? 'positive' : 'negative'}`}>
                  {event.effects.energy > 0 ? '+' : ''}{event.effects.energy} ⚡
                </span>
              )}
              {event.effects.hunger && (
                <span className={`effect-item ${event.effects.hunger > 0 ? 'positive' : 'negative'}`}>
                  {event.effects.hunger > 0 ? '+' : ''}{event.effects.hunger} 🍖
                </span>
              )}
              {event.effects.cleanliness && (
                <span className={`effect-item ${event.effects.cleanliness > 0 ? 'positive' : 'negative'}`}>
                  {event.effects.cleanliness > 0 ? '+' : ''}{event.effects.cleanliness} ✨
                </span>
              )}
              {event.effects.health && (
                <span className="effect-item positive">+{event.effects.health} ❤️</span>
              )}
              {event.effects.item && (
                <span className="effect-item special">
                  +1 {event.effects.item === 'food' ? '🍖' : '🍰'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventNotification;
