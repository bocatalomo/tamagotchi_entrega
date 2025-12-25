# 📁 Estructura del Proyecto - Tamagotchi

## 🏗️ Organización de Carpetas

```
tamagotchi-app/
├── src/
│   ├── components/          # 🧩 Componentes React
│   │   ├── PixelPet.jsx            # Sprite animado de la mascota
│   │   ├── PixelPet.css
│   │   ├── Minigames.jsx           # Sistema de mini-juegos con IA
│   │   ├── Minigames.css
│   │   ├── Achievements.jsx        # Sistema de logros (18 achievements)
│   │   ├── Achievements.css
│   │   ├── EventNotification.jsx   # Notificaciones de eventos aleatorios
│   │   ├── EventNotification.css
│   │   ├── StatBar.jsx             # Barra de estadísticas
│   │   ├── StatBar.css
│   │   ├── ActionButton.jsx        # Botón de acción reutilizable
│   │   ├── ActionButton.css
│   │   ├── NameInput.jsx           # Pantalla de nombre inicial
│   │   ├── NameInput.css
│   │   ├── PetSelector.jsx         # Pantalla de selección de mascota
│   │   └── PetSelector.css
│   │
│   ├── utils/               # 🛠️ Utilidades y lógica
│   │   └── events.js               # Sistema de eventos aleatorios (15 eventos)
│   │
│   ├── assets/              # 🎨 Assets (vacía por ahora)
│   │
│   ├── styles/              # 💅 Estilos globales (vacía por ahora)
│   │
│   ├── App.jsx              # 🎮 Componente principal
│   ├── App.css              # Estilos del componente principal
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Punto de entrada
│
├── public/
├── package.json
└── vite.config.js
```

---

## 🧩 Componentes Explicados

### 📊 Componentes de UI

#### `PixelPet.jsx`
- **Propósito**: Renderiza el sprite pixel art de la mascota
- **Props**: `stage`, `state`, `animation`, `type`, `color`
- **Características**: 
  - Canvas 16x16 escalado a 128x128
  - Sprites para perros y gatos
  - 5 colores diferentes
  - Animaciones: idle, bounce, shake, sleep

#### `StatBar.jsx`
- **Propósito**: Barra de estadística reutilizable
- **Props**: `label`, `value`, `icon`, `color`
- **Uso**: Hambre, Felicidad, Energía, Limpieza, Salud

#### `ActionButton.jsx`
- **Propósito**: Botón de acción estilizado
- **Props**: `onClick`, `disabled`, `emoji`, `label`
- **Uso**: Alimentar, Jugar, Dormir, Limpiar, Medicina, Premio

---

### 🎮 Componentes de Pantallas

#### `NameInput.jsx`
- **Propósito**: Primera pantalla - ingreso de nombre
- **Props**: `onSubmit(name)`
- **Características**: Validación, max 15 caracteres

#### `PetSelector.jsx`
- **Propósito**: Segunda pantalla - selección de mascota
- **Props**: `petName`, `onSelect(type, color)`
- **Características**: 2 tipos × 5 colores = 10 combinaciones

---

### 🎯 Componentes de Juego

#### `Minigames.jsx`
- **Propósito**: Sistema completo de mini-juegos
- **Props**: `petName`, `petType`, `onClose`, `onWin(reward)`, `onLose()`
- **Juegos incluidos**:
  1. Piedra, Papel o Tijera (IA predictiva)
  2. Memoria (IA probabilística)
  3. Tiempo de Reacción (IA simulada)
  4. Adivina el Número (IA algorítmica)

#### `Achievements.jsx`
- **Propósito**: Sistema de logros
- **Props**: `onClose`, `unlockedAchievements`, `totalCoins`, `totalGames`, `petAge`, `petLevel`
- **Características**: 18 logros en 6 categorías

#### `EventNotification.jsx`
- **Propósito**: Notificación emergente de eventos
- **Props**: `event`, `onClose`
- **Características**: Auto-cierre, animaciones, efectos visuales

---

## 🛠️ Utilidades

### `utils/events.js`

**Exports:**
- `randomEvents[]` - Array de 15 eventos con diferentes rarezas
- `getRandomEvent()` - Selecciona un evento basado en probabilidades
- `shouldTriggerEvent(timeSinceLastEvent)` - Determina si debe ocurrir evento
- `rarityColors{}` - Colores por rareza
- `rarityLabels{}` - Etiquetas por rareza

**Rareza de eventos:**
- Común (40-50%)
- Poco Común (30-35%)
- Raro (15-20%)
- Épico (5-10%)
- Legendario (<1%)

---

## 📝 App.jsx - Componente Principal

### Responsabilidades:
1. **Estado global** del juego
2. **Lógica de negocio**:
   - Sistema de tiempo y decrementos
   - Salud y enfermedad
   - Niveles y experiencia
   - Inventario
3. **Coordinación** entre componentes
4. **Persistencia** (localStorage)

### Estado Principal:
```javascript
{
  name: '',
  type: 'dog' | 'cat',
  color: 'brown' | 'white' | 'black' | 'orange' | 'gray',
  hunger: 0-100,
  happiness: 0-100,
  energy: 0-100,
  cleanliness: 0-100,
  health: 0-100,
  age: 0+,
  coins: 0+,
  level: 1+,
  exp: 0+,
  isSick: boolean,
  mood: 'happy' | 'sad' | 'tired' | 'playful' | 'sick',
  stage: 'egg' | 'baby' | 'child' | 'adult'
}
```

---

## 🔄 Flujo de la Aplicación

```
1. Inicio
   ↓
2. NameInput → Usuario ingresa nombre
   ↓
3. PetSelector → Usuario elige tipo y color
   ↓
4. Game (App.jsx) → Juego principal
   ├─ PixelPet (mascota animada)
   ├─ StatBar × 5 (stats)
   ├─ ActionButton × 6 (acciones)
   ├─ Inventario
   ├─ Tienda
   ├─ Minigames (modal)
   ├─ Achievements (modal)
   └─ EventNotification (notificación)
```

---

## 🎨 Convenciones de Estilo

### Archivos CSS:
- Cada componente tiene su propio CSS
- Variables CSS en `App.css`:
  ```css
  --pixel-primary: #5b3e9e
  --pixel-secondary: #2d1b69
  --pixel-accent: #ff6b9d
  --pixel-success: #4ecca3
  --pixel-warning: #ffd93d
  --pixel-danger: #ff6b6b
  --pixel-border: #8b6fbd
  --pixel-bg-dark: #1a0f33
  --pixel-text: #f8f0e3
  ```

### Nomenclatura:
- **Componentes**: PascalCase (ej: `PixelPet.jsx`)
- **Archivos CSS**: mismo nombre que el componente
- **Utilidades**: camelCase (ej: `events.js`)
- **Clases CSS**: kebab-case (ej: `action-button`)

---

## 📦 Imports/Exports

### Componentes:
```javascript
// Export default
export default ComponentName;

// Import
import ComponentName from './components/ComponentName';
```

### Utilidades:
```javascript
// Named exports
export const functionName = () => {};
export const constantName = 'value';

// Import
import { functionName, constantName } from './utils/fileName';
```

---

## 🚀 Cómo Añadir un Nuevo Componente

### Paso 1: Crear archivos
```bash
cd src/components
touch NewComponent.jsx NewComponent.css
```

### Paso 2: Estructura básica
```javascript
// NewComponent.jsx
import './NewComponent.css';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div className="new-component">
      {/* JSX aquí */}
    </div>
  );
};

export default NewComponent;
```

### Paso 3: Importar en App.jsx
```javascript
import NewComponent from './components/NewComponent';
```

### Paso 4: Usar
```javascript
<NewComponent prop1="value" prop2={state} />
```

---

## 🧪 Testing

Para verificar que todo funciona:

```bash
npm run dev
```

Verifica:
1. ✅ Todas las pantallas cargan
2. ✅ Componentes se renderizan
3. ✅ No hay errores en consola
4. ✅ Estilos se aplican correctamente

---

## 📚 Próximas Mejoras Sugeridas

### Componentes por Crear:
1. `Shop.jsx` - Separar la tienda
2. `Inventory.jsx` - Separar el inventario
3. `InfoBar.jsx` - Barra de nivel/monedas
4. `DailyMissions.jsx` - Misiones diarias
5. `Statistics.jsx` - Pantalla de estadísticas

### Utilidades por Crear:
1. `utils/sounds.js` - Sistema de sonidos
2. `utils/storage.js` - Gestión de localStorage
3. `utils/gameLogic.js` - Lógica de juego
4. `utils/constants.js` - Constantes del juego

### Assets:
1. `assets/sounds/` - Efectos de sonido
2. `assets/images/` - Imágenes adicionales
3. `assets/fonts/` - Fuentes personalizadas

---

## 🔧 Mantenimiento

### Agregar nuevo logro:
Edita `components/Achievements.jsx` → Array `achievements`

### Agregar nuevo evento:
Edita `utils/events.js` → Array `randomEvents`

### Agregar nuevo mini-juego:
Edita `components/Minigames.jsx` → Array `games` y crea componente del juego

### Cambiar colores:
Edita `App.css` → Variables CSS al inicio

---

¡El proyecto ahora está completamente organizado y listo para escalar! 🎮✨
