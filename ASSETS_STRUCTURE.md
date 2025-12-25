# 📁 Estructura de Assets para Tamagotchi

## 🎨 Organización de Carpetas

```
public/
└── assets/
    └── pets/
        ├── brown/          # Gato café
        │   ├── idle.png
        │   ├── blink.png
        │   ├── yawn.png
        │   ├── scratch.png
        │   ├── eating.png
        │   ├── sleeping.png
        │   └── playing.png
        │
        ├── white/          # Gato blanco
        │   ├── idle.png
        │   ├── blink.png
        │   ├── yawn.png
        │   ├── scratch.png
        │   ├── eating.png
        │   ├── sleeping.png
        │   └── playing.png
        │
        └── black/          # Gato negro
            ├── idle.png
            ├── blink.png
            ├── yawn.png
            ├── scratch.png
            ├── eating.png
            ├── sleeping.png
            └── playing.png
```

---

## 🎬 Especificaciones de Animaciones

### **Dimensiones Estándar**
- **Ancho por frame**: 32px
- **Alto**: 24px
- **Formato**: PNG con transparencia
- **Disposición**: Tira horizontal (sprite sheet)

### **Animaciones Disponibles**

#### 1. **idle.png** (Reposo)
- **Frames**: 8
- **Descripción**: Animación de respiración suave, el gato quieto
- **Duración por frame**: 150ms
- **Tamaño total**: 256x24px (32px × 8 frames)
- **Probabilidad**: Alta (weight: 3)
- **Tiempo entre animaciones**: 2-4 segundos

#### 2. **blink.png** (Parpadeo)
- **Frames**: 4
- **Descripción**: El gato parpadea
- **Duración por frame**: 200ms
- **Tamaño total**: 128x24px (32px × 4 frames)
- **Probabilidad**: Media (weight: 2)
- **Tiempo entre animaciones**: 3-6 segundos

#### 3. **yawn.png** (Bostezo)
- **Frames**: 6
- **Descripción**: El gato bosteza
- **Duración por frame**: 180ms
- **Tamaño total**: 192x24px (32px × 6 frames)
- **Probabilidad**: Baja (weight: 1)
- **Tiempo entre animaciones**: 5-8 segundos

#### 4. **scratch.png** (Rascarse)
- **Frames**: 6
- **Descripción**: El gato se rasca
- **Duración por frame**: 150ms
- **Tamaño total**: 192x24px (32px × 6 frames)
- **Probabilidad**: Baja (weight: 1)
- **Tiempo entre animaciones**: 4-7 segundos

#### 5. **eating.png** (Comiendo)
- **Frames**: 6
- **Descripción**: El gato come
- **Duración por frame**: 200ms
- **Tamaño total**: 192x24px (32px × 6 frames)
- **Activación**: Solo cuando el usuario alimenta
- **No se reproduce aleatoriamente**

#### 6. **sleeping.png** (Durmiendo)
- **Frames**: 4
- **Descripción**: El gato duerme (respiración lenta)
- **Duración por frame**: 400ms
- **Tamaño total**: 128x24px (32px × 4 frames)
- **Activación**: Solo cuando el usuario activa dormir
- **No se reproduce aleatoriamente**

#### 7. **playing.png** (Jugando)
- **Frames**: 8
- **Descripción**: El gato juega
- **Duración por frame**: 120ms
- **Tamaño total**: 256x24px (32px × 8 frames)
- **Activación**: Solo cuando el usuario juega con el gato
- **No se reproduce aleatoriamente**

---

## 🎨 Colores de Gatos

### Brown (Café) - `color: 'brown'`
- Color principal: `#8b4513`
- Tonos café/marrón
- Identificador: 🟤

### White (Blanco) - `color: 'white'`
- Color principal: `#f8f0e3`
- Tonos blancos/crema
- Identificador: ⚪

### Black (Negro) - `color: 'black'`
- Color principal: `#2d2d2d`
- Tonos negros/gris oscuro
- Identificador: ⚫

---

## 🔧 Cómo Funciona el Sistema

### Sistema de Animaciones Aleatorias

El componente `PixelPet` tiene un sistema inteligente que:

1. **Reproduce animaciones de forma aleatoria** basándose en "pesos" (probabilidades)
2. **Intercala animaciones** con pausas entre ellas
3. **Prioriza animaciones forzadas** (eating, sleeping, playing) cuando el usuario interactúa

### Ejemplo de Flujo:

```
1. Gato en reposo (idle) → espera 2-4 segundos
2. Parpadea (blink) → espera 3-6 segundos
3. Vuelve a reposo (idle) → espera 2-4 segundos
4. Usuario alimenta → fuerza animación (eating)
5. Termina de comer → vuelve a ciclo aleatorio
6. Bosteza (yawn) → espera 5-8 segundos
...y así sucesivamente
```

---

## 📝 Checklist de Creación de Assets

Para cada color de gato (brown, white, black), necesitas crear:

- [ ] idle.png (256x24px, 8 frames)
- [ ] blink.png (128x24px, 4 frames)
- [ ] yawn.png (192x24px, 6 frames)
- [ ] scratch.png (192x24px, 6 frames)
- [ ] eating.png (192x24px, 6 frames)
- [ ] sleeping.png (128x24px, 4 frames)
- [ ] playing.png (256x24px, 8 frames)

**Total**: 21 archivos PNG (7 animaciones × 3 colores)

---

## 🛠️ Agregar Nuevas Animaciones

Para agregar una nueva animación:

1. **Edita `PixelPet.jsx`** y agrega la configuración en `ANIMATIONS_CONFIG`:

```javascript
newAnimation: {
  frames: 6,           // Número de frames
  duration: 180,       // Milisegundos por frame
  weight: 2,           // Probabilidad (0 = solo manual)
  nextDelay: { min: 3000, max: 5000 } // Delay después
}
```

2. **Crea las tiras PNG** para cada color:
   - `/assets/pets/brown/newAnimation.png`
   - `/assets/pets/white/newAnimation.png`
   - `/assets/pets/black/newAnimation.png`

3. **Listo!** El sistema las cargará automáticamente

---

## 💡 Tips para Crear los Sprites

1. **Mantén el mismo tamaño**: Todos los frames deben ser 32x24px
2. **Usa transparencia**: Fondo transparente (alpha channel)
3. **Consistencia**: Mantén el estilo pixel art consistente
4. **Centrado**: El gato debe estar centrado en cada frame
5. **Espaciado**: Asegúrate de que no haya espacios entre frames
6. **Orden**: Los frames van de izquierda a derecha en la tira

---

## 🚀 Rutas de Acceso

El sistema construye las rutas automáticamente:

```javascript
// Para un gato café en idle:
/assets/pets/brown/idle.png

// Para un gato blanco comiendo:
/assets/pets/white/eating.png

// Para un gato negro jugando:
/assets/pets/black/playing.png
```

---

## ✅ Archivo Actual

Actualmente tienes:
- ✅ `/assets/pets/cat-idle.png` (versión antigua)

Necesitas migrar a la nueva estructura y crear los archivos faltantes.
