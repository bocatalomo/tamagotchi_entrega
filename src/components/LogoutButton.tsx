import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LogoutButton.css';

const LogoutButton: React.FC = () => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) return null;

  return (
    <button onClick={handleLogout} className="logout-button">
      CERRAR SESIÓN
    </button>
  );
};

export default LogoutButton;