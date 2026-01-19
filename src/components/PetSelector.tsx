import './PetSelector.css';

const PetSelector = ({ petName, onSelect }) => {
  const colors = [
    { id: 'brown', name: 'Café', color: '#8b4513', emoji: '🟤' },
    { id: 'white', name: 'Blanco', color: '#f8f0e3', emoji: '⚪' },
    { id: 'black', name: 'Negro', color: '#2d2d2d', emoji: '⚫' }
  ];

  return (
    <div className="container">
      <div className="pet-selector-card">
        <h1 className="title">Elige tu Gatito 🐱</h1>
        <p className="subtitle">Hola {petName}, ¿de qué color quieres a tu gato?</p>

        <div className="pet-type-selector">
          <div className="pet-type-section">
            <h2 className="pet-type-title">🐱 Colores Disponibles</h2>
            <div className="color-grid">
              {colors.map(({ id, name, color: bgColor, emoji }) => (
                <button
                  key={id}
                  className="color-button"
                  onClick={() => onSelect('cat', id)}
                  style={{ '--color-preview': bgColor }}
                >
                  <div className="color-preview" style={{ backgroundColor: bgColor }}>
                    <span style={{ fontSize: '32px' }}>🐱</span>
                  </div>
                  <span className="color-name">{emoji} {name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSelector;
