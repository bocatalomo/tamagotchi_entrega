# 🥚 Tamagotchi Virtual - Proyecto Vite + React

Una aplicación web progresiva (PWA) de mascota virtual estilo Tamagotchi, creada con Vite y React.

## 🎮 Características

- ✨ **PWA completa**: Instalable en iPhone y funciona offline
- 🎨 **Diseño retro**: Estilo pixel-art con fuente Press Start 2P
- 🐣 **Sistema de evolución**: Desde huevo hasta adulto
- 📊 **Estados dinámicos**: Hambre, felicidad, energía y limpieza
- 💾 **Persistencia**: Guarda el progreso automáticamente
- 📱 **Responsive**: Optimizado para móviles

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:5173
```

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Preview del build
npm run preview
```

## 📱 Desplegar en Vercel

### Opción 1: Desde la terminal

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

### Opción 2: Desde GitHub

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. ¡Vercel detectará Vite automáticamente!

## 📲 Instalar en iPhone

1. Abre Safari y navega a tu URL de Vercel
2. Toca el botón "Compartir" (cuadrado con flecha)
3. Selecciona "Añadir a pantalla de inicio"
4. ¡Listo! Ya tienes tu Tamagotchi como app

## 🎯 Cómo Jugar

### Cuida tu mascota usando los botones:

- **🍖 Alimentar**: Aumenta el hambre (+20)
- **🎮 Jugar**: Aumenta la felicidad (+25)
- **💤 Dormir**: Recupera energía (+30)
- **🧼 Limpiar**: Restaura limpieza (100%)

### Evolución de la mascota:

- 🥚 **Huevo** (0-1 año)
- 🐣 **Bebé** (1-5 años)
- 🐥 **Niño** (5-10 años)
- 😊 **Adulto** (10+ años)

### ⚠️ Ten cuidado:

- Los estados decrecen automáticamente cada 30 segundos
- Si hambre o felicidad llegan a 0, ¡tu mascota morirá!
- Cada minuto real = 1 año de edad virtual

## 🛠️ Estructura del Proyecto

```
tamagotchi-app/
├── public/
│   ├── icon-192.png          # Icono PWA pequeño
│   ├── icon-512.png          # Icono PWA grande
│   └── manifest.json         # (generado automáticamente)
├── src/
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos del juego
│   ├── index.css             # Estilos globales
│   └── main.jsx              # Punto de entrada
├── index.html                # HTML base
├── vite.config.js            # Configuración Vite + PWA
├── generate-icons.py         # Script para generar iconos
└── package.json
```

## 🎨 Personalización

### Cambiar colores del gradiente:

En `src/App.css`, línea 2:

```css
background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
```

### Ajustar velocidad del juego:

En `src/App.jsx`, busca estos valores:

```javascript
// Línea ~50 - Decremento cada 30 segundos
const decrement = Math.floor(timePassed / 30);

// Línea ~57 - Edad: cada 60 segundos = 1 año
const newAge = prev.age + Math.floor(timePassed / 60);
```

### Añadir nuevas acciones:

```javascript
const medicine = () => {
  setPet(prev => ({
    ...prev,
    health: Math.min(100, prev.health + 50)
  }));
  showMessage('¡Medicina! 💊');
};
```

## 🔧 Tecnologías Usadas

- **React 18**: Framework UI
- **Vite**: Build tool ultra-rápido
- **vite-plugin-pwa**: PWA con service workers
- **LocalStorage**: Persistencia de datos
- **CSS3**: Animaciones y gradientes
- **Vercel**: Hosting gratuito

## 📦 Comandos NPM

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

## 🐛 Solución de Problemas

### La app no guarda el progreso

- Verifica que no estés en modo incógnito
- Comprueba que el navegador permita localStorage

### Los iconos no aparecen

- Ejecuta `python3 generate-icons.py` para regenerarlos
- Verifica que estén en `/public`

### La PWA no se instala en iPhone

- Asegúrate de usar **Safari** (no Chrome)
- Verifica que la URL sea HTTPS (Vercel lo hace automático)
- Limpia la caché del navegador

### Error al importar vite-plugin-pwa

```bash
npm install -D vite-plugin-pwa
```

## 🎁 Regalar la App

Esta app es perfecta como regalo porque:

1. ✅ Es personalizada y única
2. ✅ No requiere pago ni suscripciones
3. ✅ Funciona para siempre (sin expiración)
4. ✅ Se puede jugar offline
5. ✅ Se actualiza automáticamente

### Pasos para regalar:

1. Despliega en Vercel
2. Comparte el link con tu amigo
3. Ayúdale a instalarlo en su iPhone
4. ¡Disfruta viendo cómo cuida su mascota! 🎉

## 📝 Licencia

Este proyecto es de código abierto y libre de usar.

## 🌟 Créditos

Creado con ❤️ usando Vite + React
Fuente: Press Start 2P (Google Fonts)

---

¡Disfruta cuidando de tu Tamagotchi virtual! 🎮✨
