import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { saveTamagotchi } from '../services/tamagotchiService';
import { pageVariants } from '../utils/animationVariants';
import './UserProfile.css';

const MAX_PHOTO_SIZE = 1024 * 1024; // 1MB limit

interface UserProfileScreenProps {
  onClose: () => void;
  pet?: any;
  inventory?: any;
}

interface UserStats {
  tamagotchisRaised: number;
  totalCoinsEarned: number;
  totalPlayTime: number;
  achievements: number;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onClose, pet, inventory }) => {
  const { user, userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'stats'>('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.displayName || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userStats] = useState<UserStats>({
    tamagotchisRaised: 3,
    totalCoinsEarned: 500,
    totalPlayTime: 120,
    achievements: 5
  });

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      if (pet && inventory) {
        await saveTamagotchi(pet, inventory);
      }
      await signOut();
      onClose();
    }
  };

  const handlePhotoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE) {
      setError('La imagen debe ser menor a 1MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user) throw new Error('Usuario no autenticado');

      const photoRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);

      await updateDoc(doc(db, 'users', user.uid), { photoURL });
      setSuccess('Foto de perfil actualizada');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al subir la foto');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const handleNameChange = async () => {
    if (!newName.trim() || newName === userProfile?.displayName) {
      setEditingName(false);
      return;
    }

    try {
      if (!user) throw new Error('Usuario no autenticado');
      await updateDoc(doc(db, 'users', user.uid), { displayName: newName.trim() });
      setSuccess('Nombre actualizado');
      setTimeout(() => setSuccess(null), 3000);
      setEditingName(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el nombre');
      setTimeout(() => setError(null), 3000);
    }
  };

  const formatPlayTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      className="user-profile-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="user-profile-container"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="profile-header">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2 className="profile-title">MI CUENTA</h2>
        </div>

        {error && (
          <motion.div
            className="notification danger"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            className="notification success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {success}
          </motion.div>
        )}

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 PERFIL
          </button>
          <button
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 STATS
          </button>
          <button
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            🔐 CUENTA
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h3 className="section-title">👤 PERFIL</h3>

              <div className="info-item">
                <label>Foto de Perfil</label>
                <div className="avatar-section">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Avatar" className="avatar" />
                  ) : (
                    <div className="avatar-placeholder">👤</div>
                  )}
                  <div className="avatar-actions">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      className="edit-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Subiendo...' : '📷 Cambiar'}
                    </button>
                    {userProfile?.photoURL && (
                      <button
                        className="edit-btn danger"
                        onClick={async () => {
                          try {
                            await updateDoc(doc(db, 'users', user!.uid), { photoURL: '' });
                            setSuccess('Foto eliminada');
                            setTimeout(() => setSuccess(null), 3000);
                          } catch (err: any) {
                            setError(err.message);
                            setTimeout(() => setError(null), 3000);
                          }
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-item">
                <label>Nombre</label>
                <div className="info-value">
                  {editingName ? (
                    <div className="name-edit">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="name-input"
                        maxLength={20}
                      />
                      <button className="save-btn" onClick={handleNameChange}>💾</button>
                      <button className="cancel-btn" onClick={() => setEditingName(false)}>✕</button>
                    </div>
                  ) : (
                    <>
                      <span>{userProfile?.displayName || 'Sin nombre'}</span>
                      <button className="edit-btn" onClick={() => { setNewName(userProfile?.displayName || ''); setEditingName(true); }}>
                        ✏️
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="info-item">
                <label>Email</label>
                <div className="info-value">
                  <span>{userProfile?.email}</span>
                  <span className="verified">✅</span>
                </div>
              </div>

              <div className="info-item">
                <label>Proveedor</label>
                <div className="info-value">
                  <span>{userProfile?.provider === 'google' ? '🔵 Google' : '📧 Email'}</span>
                </div>
              </div>

              <div className="info-item">
                <label>Miembro desde</label>
                <div className="info-value">
                  <span>{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('es-ES') : 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <h3 className="section-title">📊 ESTADÍSTICAS</h3>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🥚</div>
                  <div className="stat-value">{userStats.tamagotchisRaised}</div>
                  <div className="stat-label">Tamagotchis criados</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🪙</div>
                  <div className="stat-value">{userStats.totalCoinsEarned}</div>
                  <div className="stat-label">Monedas totales</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-value">{formatPlayTime(userStats.totalPlayTime)}</div>
                  <div className="stat-label">Tiempo de juego</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-value">{userStats.achievements}</div>
                  <div className="stat-label">Logros</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
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

              <div className="menu-item danger" onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                <span className="menu-text">Cerrar Sesión</span>
                <span className="menu-arrow">→</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-footer">
          <div className="tamagotchi-version">Tamagotchi App v1.0.0</div>
          <div className="made-with">Hecho con ❤️ y 🎮</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileScreen;
