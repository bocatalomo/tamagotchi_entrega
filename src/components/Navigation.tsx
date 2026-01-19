import './Navigation.css';
import LogoutButton from './LogoutButton';

const Navigation = ({ currentScreen, onNavigate, notifications = {} as any, onShowProfile }) => {
  const navItems = [
    {
      id: 'home',
      icon: '🏠',
      label: 'Inicio',
      badge: notifications.home || 0
    },
    {
      id: 'shop',
      icon: '🏪',
      label: 'Tienda',
      badge: notifications.shop || 0
    },
    {
      id: 'stats',
      icon: '📊',
      label: 'Stats',
      badge: notifications.stats || 0
    }
  ];

  return (
    <nav className="bottom-navigation">
      <div className="nav-container">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <div className="nav-icon-wrapper">
              <span className="nav-icon">{item.icon}</span>
              {item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        <button 
          className="nav-item profile-btn"
          onClick={onShowProfile}
          title="Mi Cuenta"
        >
          <div className="nav-icon-wrapper">
            <span className="nav-icon">👤</span>
          </div>
          <span className="nav-label">CUENTA</span>
        </button>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navigation;
