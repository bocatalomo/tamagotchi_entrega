import './ActionButton.css';

const ActionButton = ({ onClick, disabled, emoji, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`action-button ${disabled ? 'disabled' : ''}`}
  >
    <span className="action-emoji">{emoji}</span>
    <span className="action-label">{label}</span>
  </button>
);

export default ActionButton;
