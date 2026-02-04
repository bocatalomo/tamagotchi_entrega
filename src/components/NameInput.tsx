import './NameInput.css';

const NameInput = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.petName.value.trim();
    console.log('NameInput: Form submit, name:', name);
    if (name) {
      console.log('NameInput: Calling onSubmit');
      onSubmit(name);
    } else {
      console.log('NameInput: Name is empty');
    }
  };

  return (
    <div className="container">
      <div className="name-input-card">
        <h1 className="title">Bienvenido a tu Tamagotchi Virtual 🎮</h1>
        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            ¿Cómo se llamará tu mascota?
            <input
              type="text"
              name="petName"
              className="input"
              maxLength={15}
              required
              autoFocus
              placeholder="Nombre..."
            />
          </label>
          <button type="submit" className="start-button">
            ¡Comenzar! ✨
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInput;
