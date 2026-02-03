import React, { useState } from 'react';
import HomeScreen from './HomeScreen';
import HomeScreenVariation1 from './HomeScreen-Variation1';
import HomeScreenVariation2 from './HomeScreen-Variation2';
import HomeScreenVariation3 from './HomeScreen-Variation3';
import './HomeScreenSelector.css';

const HomeScreenSelector = (props) => {
  const [selectedDesign, setSelectedDesign] = useState('original');

  const designs = [
    {
      id: 'original',
      name: 'Original',
      description: 'Diseño base actual',
      component: HomeScreen,
      features: ['Estilo cozy rosa', 'Layout compacto', 'Animaciones básicas']
    },
    {
      id: 'neon-enhanced',
      name: 'Neon Enhanced',
      description: 'High Contrast WCAG AA+',
      component: HomeScreenVariation1,
      features: ['Contraste WCAG AA+', 'Efectos neón', 'Botones 48x48px+', 'Focus states visibles']
    },
    {
      id: 'minimalist',
      name: 'Soft Minimalist',
      description: 'Accessibility First',
      component: HomeScreenVariation2,
      features: ['Diseño limpio', 'Alta legibilidad', 'ARIA labels', 'Skip links']
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Pro',
      description: 'Dark Mode Futurista',
      component: HomeScreenVariation3,
      features: ['Tema oscuro', 'Efectos HUD', 'Animaciones avanzadas', 'Estilo terminal']
    }
  ];

  const SelectedComponent = designs.find(d => d.id === selectedDesign)?.component || HomeScreen;

  return (
    <div className="design-selector-container">
      {/* Panel de selección */}
      <div className="design-panel">
        <div className="design-header">
          <h2 className="design-title">🎨 Variaciones de Diseño</h2>
          <p className="design-subtitle">Selecciona una variación para ver mejoras de accesibilidad y UX</p>
        </div>

        <div className="design-grid">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setSelectedDesign(design.id)}
              className={`design-card ${selectedDesign === design.id ? 'active' : ''}`}
              aria-label={`Seleccionar diseño ${design.name}: ${design.description}`}
              aria-pressed={selectedDesign === design.id}
            >
              <div className="design-card-header">
                <h3 className="design-name">{design.name}</h3>
                <span className="design-status">
                  {selectedDesign === design.id ? '✅ Activo' : '→ Ver'}
                </span>
              </div>
              
              <p className="design-description">{design.description}</p>
              
              <div className="design-features">
                {design.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Info de accesibilidad del diseño actual */}
        <div className="accessibility-info">
          <h3 className="accessibility-title">
            ♿ Características de Accesibilidad - {designs.find(d => d.id === selectedDesign)?.name}
          </h3>
          
          {selectedDesign === 'original' && (
            <div className="accessibility-features">
              <div className="feature-item">
                <span className="feature-status warning">⚠️ Parcial</span>
                <span className="feature-text">Contraste de texto: Variable</span>
              </div>
              <div className="feature-item">
                <span className="feature-status warning">⚠️ Mejorable</span>
                <span className="feature-text">Tamaño de botones: Variable</span>
              </div>
              <div className="feature-item">
                <span className="feature-status warning">⚠️ Limitado</span>
                <span className="feature-text">States de focus: Básicos</span>
              </div>
            </div>
          )}

          {selectedDesign === 'neon-enhanced' && (
            <div className="accessibility-features">
              <div className="feature-item">
                <span className="feature-status success">✅ Excelente</span>
                <span className="feature-text">Contraste WCAG AA+ 4.5:1+</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Cumple</span>
                <span className="feature-text">Botones 48x48px mínimo</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Visible</span>
                <span className="feature-text">Focus states con outline neón</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Reducido</span>
                <span className="feature-text">Respeta prefers-reduced-motion</span>
              </div>
            </div>
          )}

          {selectedDesign === 'minimalist' && (
            <div className="accessibility-features">
              <div className="feature-item">
                <span className="feature-status success">✅ Excelente</span>
                <span className="feature-text">Contraste WCAG AA+ garantizado</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Cumple</span>
                <span className="feature-text">Touch targets 44x44px+</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Completo</span>
                <span className="feature-text">ARIA labels y landmarks</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Optimizado</span>
                <span className="feature-text">Skip link y navegación</span>
              </div>
            </div>
          )}

          {selectedDesign === 'cyberpunk' && (
            <div className="accessibility-features">
              <div className="feature-item">
                <span className="feature-status success">✅ Excelente</span>
                <span className="feature-text">Contraste alto en tema oscuro</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Accesible</span>
                <span className="feature-text">Botones con área amplia</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Visible</span>
                <span className="feature-text">Focus states diferenciados</span>
              </div>
              <div className="feature-item">
                <span className="feature-status success">✅ Respetuoso</span>
                <span className="feature-text">Soporte para reduced motion</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vista previa del diseño seleccionado */}
      <div className="design-preview">
        <div className="preview-header">
          <h3 className="preview-title">
            Vista Previa: {designs.find(d => d.id === selectedDesign)?.name}
          </h3>
          <span className="preview-badge">Modo demostración</span>
        </div>
        
        <div className="preview-content">
          <SelectedComponent {...props} />
        </div>
      </div>
    </div>
  );
};

export default HomeScreenSelector;