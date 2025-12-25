import './StatBar.css';

const StatBar = ({ label, value, icon, color }) => (
  <div className="stat-row">
    <span className="stat-label">{icon} {label}</span>
    <div className="stat-bar-bg">
      <div 
        className="stat-bar-fill"
        style={{
          width: `${value}%`,
          backgroundColor: color
        }}
      />
    </div>
    <span className="stat-value">{Math.round(value)}</span>
  </div>
);

export default StatBar;
