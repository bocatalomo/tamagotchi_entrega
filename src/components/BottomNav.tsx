import './BottomNav.css';

const BottomNav = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Inicio' },
    { id: 'games', icon: '🎮', label: 'Juegos' },
    { id: 'shop', icon: '🏪', label: 'Tienda' },
    { id: 'achievements', icon: '🏆', label: 'Logros' },
    { id: 'stats', icon: '📊', label: 'Stats' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
