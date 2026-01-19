import { useEffect } from 'react';
import './Poop.css';

const Poop = ({ id, x, y, onClean }) => {
  useEffect(() => {
    // Animación de entrada
    const element = document.getElementById(`poop-${id}`);
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'scale(0)';
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }, 50);
    }
  }, [id]);

  const handleClick = (e) => {
    e.stopPropagation();
    const element = document.getElementById(`poop-${id}`);
    if (element) {
      element.style.transform = 'scale(0)';
      element.style.opacity = '0';
      setTimeout(() => {
        onClean(id);
      }, 200);
    }
  };

  return (
    <div
      id={`poop-${id}`}
      className="poop"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={handleClick}
    >
      <img
        src="/caca.png"
        alt="poop"
        className="poop-image"
      />
    </div>
  );
};

export default Poop;
