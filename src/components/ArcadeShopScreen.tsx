/**
 * ArcadeShopScreen - Pantalla de la tienda del Tamagotchi
 * Extraído de App.tsx como parte del refactoring de clean code
 */

import ArcadeButton from './ArcadeButton';
import { PetState, Inventory } from '../types';
import { SHOP_ITEMS } from '../constants';

interface ArcadeShopScreenProps {
  pet: PetState;
  inventory: Inventory;
  onBuyItem: (itemId: string, price: number) => void;
  onClose: () => void;
}

const ArcadeShopScreen: React.FC<ArcadeShopScreenProps> = ({
  pet,
  inventory,
  onBuyItem,
  onClose,
}) => {
  const getItemCount = (itemId: string): number => {
    const counts: Record<string, keyof Inventory> = {
      food: 'food',
      medicine: 'medicine',
      treats: 'treats',
      soap: 'soap',
    };
    const key = counts[itemId];
    return key ? inventory[key] : 0;
  };

  return (
    <div className="arcade-shop-container">
      <div className="arcade-shop-header">
        <h2 className="arcade-section-title">🛒 TIENDA ARCADE</h2>
        <ArcadeButton variant="joystick" size="small" onClick={onClose}>
          ✕
        </ArcadeButton>
      </div>

      <div className="arcade-coin-display">
        <span>🪙</span>
        <span className="arcade-coin-count">{pet.coins}</span>
      </div>

      <div className="arcade-shop-grid">
        {SHOP_ITEMS.map((item) => {
          const count = getItemCount(item.id);
          return (
            <ArcadeButton
              key={item.id}
              variant="secondary"
              size="medium"
              onClick={() => onBuyItem(item.id, item.price)}
              disabled={pet.coins < item.price}
              className="arcade-shop-item"
              aria-label={`Comprar ${item.name} por ${item.price} monedas`}
            >
              <div className="shop-item-icon">{item.emoji}</div>
              <div className="shop-item-name">{item.name}</div>
              <div className="shop-item-price">{item.price} 🪙</div>
              <div className="shop-item-count">x{count}</div>
            </ArcadeButton>
          );
        })}
      </div>
    </div>
  );
};

export default ArcadeShopScreen;
