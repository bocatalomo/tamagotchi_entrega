import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

interface UserProfileScreenProps {
  onClose: () => void;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onClose }) => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'preferences'>('profile');
  const [editingField, setEditingField] = useState<string | null>(null);

  if (!userProfile) return null;

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await signOut();
      onClose();
    }
  };

  const renderProfileTab = () => (
    <div className="profile-section">
      <h3 className="section-title">👤 PERFIL</h3>
      
      <div className="info-item">
        <label>Foto de Perfil</label>
        <div className="avatar-section">
          {userProfile.photoURL ? (
            <img src={userProfile.photoURL} alt="Avatar" className="avatar" />
          ) : (
            <div className="avatar-placeholder">👤</div>
          )}
          <button className="edit-btn">📷 Cambiar</button>
        </div>
      </div>

      <div className="info-item">
        <label>Nombre</label>
        <div className="info-value">
          {editingField === 'displayName' ? (
            <input 
              type="text" 
              defaultValue={userProfile.displayName || ''}
              className="tamagotchi-input"
              autoFocus
            />
          ) : (
            <span>{userProfile.displayName || 'Sin nombre'}</span>
          )}
          <button 
            className="edit-btn"
            onClick={() => setEditingField(editingField === 'displayName' ? null : 'displayName')}
          >
            {editingField === 'displayName' ? '💾' : '✏️'}
          </button>
        </div>
      </div>

      <div className="info-item">
        <label>Email</label>
        <div className="info-value">
          <span>{userProfile.email}</span>
          <span className="verified">✅ Verificado</span>
        </div>
      </div>

      <div className="info-item">
        <label>Proveedor</label>
        <div className="info-value">
          <span>{userProfile.provider === 'google' ? '🔵 Google' : '📧 Email'}</span>
        </div>
      </div>

      <div className="info-item">
        <label>Miembro desde</label>
        <div className="info-value">
          <span>{new Date(userProfile.createdAt).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="account-section">
      <h3 className="section-title">🔐 CUENTA</h3>
      
      <div className="menu-item" onClick={() => alert('Función de cambio de contraseña próximamente')}>
        <span className="menu-icon">🔑</span>
        <span className="menu-text">Cambiar Contraseña</span>
        <span className="menu-arrow">→</span>
      </div>

      <div className="menu-item" onClick={() => alert('Función de 2FA próximamente')}>
        <span className="menu-icon">🛡️</span>
        <span className="menu-text">Autenticación de Dos Factores</span>
        <span className="menu-arrow">→</span>
      </div>

      <div className="menu-item" onClick={() => alert('Función de datos próximamente')}>
        <span className="menu-icon">📊</span>
        <span className="menu-text">Mis Estadísticas del Juego</span>
        <span className="menu-arrow">→</span>
      </div>

      <div className="menu-item danger" onClick={handleLogout}>
        <span className="menu-icon">🚪</span>
        <span className="menu-text">Cerrar Sesión</span>
        <span className="menu-arrow">→</span>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="preferences-section">
      <h3 className="section-title">⚙️ PREFERENCIAS</h3>
      
      <div className="menu-item" onClick={() => alert('Función de idioma próximamente')}>
        <span className="menu-icon">🌍</span>
        <span className="menu-text">Idioma</span>
        <span className="menu-arrow">→</span>
        <span className="menu-value">Español</span>
      </div>

      <div className="menu-item" onClick={() => alert('Función de notificaciones próximamente')}>
        <span className="menu-icon">🔔</span>
        <span className="menu-text">Notificaciones</span>
        <span className="menu-arrow">→</span>
        <span className="menu-value">Activadas</span>
      </div>

      <div className="menu-item" onClick={() => alert('Función de tema próximamente')}>
        <span className="menu-icon">🎨</span>
        <span className="menu-text">Tema</span>
        <span className="menu-arrow">→</span>
        <span className="menu-value">Claro</span>
      </div>

      <div className="menu-item" onClick={() => alert('Función de sonido próximamente')}>
        <span className="menu-icon">🔊</span>
        <span className="menu-text">Efectos de Sonido</span>
        <span className="menu-arrow">→</span>
        <span className="menu-value">Activados</span>
      </div>
    </div>
  );

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-container">
        <div className="profile-header">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2 className="profile-title">MI CUENTA</h2>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 PERFIL
          </button>
          <button 
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            🔐 CUENTA
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ PREFS
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'account' && renderAccountTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </div>

        <div className="profile-footer">
          <div className="tamagotchi-version">
            Tamagotchi App v1.0.0
          </div>
          <div className="made-with">
            Hecho con ❤️ y 🎮
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileScreen;