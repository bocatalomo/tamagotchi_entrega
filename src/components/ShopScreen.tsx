import './ShopScreen.css';

const ShopScreen = ({ pet, inventory, onBuyItem }) => {
  const shopItems = [
    {
      id: 'food',
      icon: '🍖',
      name: '3 Comidas',
      price: 5,
      description: 'Pack de 3 comidas nutritivas',
      stock: inventory.food
    },
    {
      id: 'soap',
      icon: '🧼',
      name: 'Jabón',
      price: 6,
      description: 'Para mantener limpia a tu mascota',
      stock: inventory.soap
    },
    {
      id: 'medicine',
      icon: '💊',
      name: 'Medicina',
      price: 15,
      description: 'Cura enfermedades y recupera salud',
      stock: inventory.medicine
    },
    {
      id: 'treats',
      icon: '🍰',
      name: 'Premio Especial',
      price: 10,
      description: 'Golosina que da felicidad',
      stock: inventory.treats
    }
  ];

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <h2 className="shop-title">🏪 Tienda</h2>
      </div>

      <div className="wallet-card">
        <div className="wallet-icon">💰</div>
        <div className="wallet-info">
          <div className="wallet-label">Tu dinero</div>
          <div className="wallet-amount">{pet.coins} monedas</div>
        </div>
      </div>

      <div className="shop-grid">
        {shopItems.map(item => (
          <button
            key={item.id}
            onClick={() => onBuyItem(item.id, item.price)}
            disabled={pet.coins < item.price}
            className="shop-item-card"
          >
            <div className="item-badge">En stock: {item.stock}</div>
            <div className="item-icon">{item.icon}</div>
            <div className="item-name">{item.name}</div>
            <div className="item-description">{item.description}</div>
            <div className="item-price">
              <span className="price-icon">💰</span>
              <span className="price-value">{item.price}</span>
            </div>
            {pet.coins < item.price && (
              <div className="insufficient-funds">Sin fondos</div>
            )}
          </button>
        ))}
      </div>

      <div className="shop-tip">
        <span className="tip-icon-shop">💡</span>
        <div className="tip-content-shop">
          <div className="tip-title-shop">Consejo</div>
          <div className="tip-text-shop">
            Gana monedas jugando mini-juegos o con el botón "Jugar" en Cuidados
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;
