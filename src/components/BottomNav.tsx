import React from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  screen?: string;
}

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onShowProfile?: () => void;
}

const navItems: NavItem[] = [
  { id: 'home', icon: '🏠', label: 'Casa', screen: 'home' },
  { id: 'shop', icon: '🛒', label: 'Tienda', screen: 'shop' },
  { id: 'stats', icon: '📊', label: 'Stats', screen: 'stats' },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onShowProfile,
}) => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          className={`nav-button ${currentScreen === item.screen ? 'active' : ''}`}
          onClick={() => item.screen && onNavigate(item.screen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={item.label}
          aria-current={currentScreen === item.screen ? 'page' : undefined}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </motion.button>
      ))}

      {onShowProfile && (
        <motion.button
          className="nav-button"
          onClick={onShowProfile}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Perfil"
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Perfil</span>
        </motion.button>
      )}
    </nav>
  );
};

export default BottomNav;
