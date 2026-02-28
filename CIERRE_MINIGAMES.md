# Cierre de Minigames al Hacer Clic Fuera

## ✨ Mejoras Implementadas

Se ha mejorado la experiencia de usuario en la sección de minigames permitiendo cerrar el modal de forma más intuitiva.

### 🎯 Características

#### 1. **Clic en Overlay (Fondo Oscuro)**
Al hacer clic en el fondo oscuro fuera del contenedor de minigames:
- **Desde el menú de juegos**: Cierra inmediatamente y vuelve a la pantalla principal (home)
- **Durante un juego activo**: Muestra confirmación antes de cerrar

#### 2. **Tecla ESC**
Presionando la tecla ESC en el teclado:
- **Desde el menú de juegos**: Cierra inmediatamente
- **Durante un juego activo**: Muestra confirmación antes de cerrar

#### 3. **Confirmación Condicional**
Si el usuario está jugando activamente, se muestra un diálogo de confirmación:
```
"¿Salir del juego? Perderás el progreso actual."
```
- **Aceptar**: Cierra el modal y vuelve a home
- **Cancelar**: Permanece en el juego

#### 4. **Indicadores Visuales**
- El overlay (fondo oscuro) muestra cursor `pointer` para indicar que es clickeable
- El contenedor del juego mantiene cursor `default` para indicar que no cierra al hacer clic

### 📝 Archivos Modificados

#### 1. `src/components/Minigames.tsx`
**Cambios**:
- Agregado import de `useEffect`
- Creada función `handleOverlayClick()` para manejar clics en el overlay
- Agregado `useEffect` para manejar la tecla ESC
- Agregado `onClick={handleOverlayClick}` al overlay
- Agregado `onClick={(e) => e.stopPropagation()}` al contenedor para prevenir propagación

**Líneas modificadas**: ~1, 40-201, 243, 281

#### 2. `src/App.tsx`
**Cambios**:
- Modificado el callback `onClose` para incluir `setCurrentScreen('home')`
- Ahora al cerrar los minigames siempre vuelve a la pantalla principal

**Líneas modificadas**: ~1069-1072

#### 3. `src/components/Minigames.css`
**Cambios**:
- Agregado `cursor: pointer` al `.minigame-overlay`
- Agregado `cursor: default` al `.minigame-container`

**Líneas modificadas**: ~14, 28

### 🎮 Casos de Uso

#### Caso 1: Usuario explora menú de juegos
```
1. Usuario abre minigames desde pantalla "play"
2. Ve el menú de juegos disponibles
3. Cambia de opinión y hace clic en el fondo oscuro
4. ✅ Se cierra inmediatamente y vuelve a home
```

#### Caso 2: Usuario está jugando
```
1. Usuario abre minigames
2. Selecciona "Piedra, Papel o Tijera"
3. Está a mitad del juego
4. Hace clic accidentalmente en el fondo oscuro
5. ⚠️ Aparece confirmación: "¿Salir del juego? Perderás el progreso actual."
6. Usuario elige:
   - Cancelar → Continúa jugando
   - Aceptar → Vuelve a home (pierde progreso)
```

#### Caso 3: Usuario presiona ESC
```
1. Usuario abre minigames
2. Presiona tecla ESC
3. Si está en menú: ✅ Cierra inmediatamente
4. Si está jugando: ⚠️ Muestra confirmación
```

#### Caso 4: Usuario hace clic dentro del contenedor
```
1. Usuario abre minigames
2. Hace clic en cualquier parte DENTRO del contenedor blanco
3. ✅ No pasa nada (el clic no cierra el modal)
4. Solo los clics en botones/juegos tienen efecto
```

### 🔧 Detalles Técnicos

#### Prevención de Propagación
```typescript
<div className="minigame-overlay" onClick={handleOverlayClick}>
  <div className="minigame-container" onClick={(e) => e.stopPropagation()}>
    {/* Contenido */}
  </div>
</div>
```
El `stopPropagation()` previene que los clics dentro del contenedor lleguen al overlay.

#### Detección de Clic Directo
```typescript
const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.target === e.currentTarget) {
    // Solo ejecutar si el clic fue en el overlay directamente
  }
};
```
Solo cierra si `e.target === e.currentTarget`, es decir, si el clic fue directamente en el overlay y no en un elemento hijo.

#### Listener de ESC con Cleanup
```typescript
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Lógica de cierre
    }
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [gameState, onClose]);
```
El listener se agrega al montar y se remueve al desmontar para evitar memory leaks.

### ✅ Testing

Para probar la funcionalidad:

1. **Clic en overlay desde menú**
   ```bash
   npm run dev
   # Abrir http://localhost:5173
   # Login → Ir a "play" → Abrir minigames
   # Hacer clic en fondo oscuro
   # Verificar que vuelve a home
   ```

2. **Clic en overlay durante juego**
   ```bash
   # Abrir minigames → Seleccionar un juego
   # Hacer clic en fondo oscuro
   # Verificar que muestra confirmación
   ```

3. **Tecla ESC**
   ```bash
   # Abrir minigames
   # Presionar ESC
   # Verificar comportamiento según estado
   ```

4. **Clic dentro del contenedor**
   ```bash
   # Abrir minigames
   # Hacer clic en el contenedor blanco (no en botones)
   # Verificar que NO cierra
   ```

### 🎨 Experiencia de Usuario

**Antes**: 
- Solo se podía cerrar con el botón ✕
- No había forma rápida de cerrar desde el teclado
- El overlay no era clickeable

**Después**:
- ✅ Clic en overlay cierra el modal
- ✅ Tecla ESC cierra el modal
- ✅ Confirmación inteligente durante juegos activos
- ✅ Cursor pointer indica que el overlay es clickeable
- ✅ Siempre vuelve a la pantalla home al cerrar

### 🐛 Solución de Problemas

**Problema**: El modal se cierra al hacer clic en cualquier parte
- **Causa**: Falta el `stopPropagation()` en el contenedor
- **Solución**: Verificar que `onClick={(e) => e.stopPropagation()}` esté en `.minigame-container`

**Problema**: No muestra confirmación durante juego
- **Causa**: `gameState` no está en 'playing'
- **Solución**: Verificar que el juego setea correctamente `setGameState('playing')`

**Problema**: Tecla ESC no funciona
- **Causa**: Listener no está registrado o hay otro listener que consume el evento
- **Solución**: Verificar que el `useEffect` con el listener esté correctamente implementado

### 📊 Beneficios

1. **Mejor UX**: Los usuarios pueden cerrar el modal de forma más intuitiva
2. **Accesibilidad**: Soporte para teclado (ESC)
3. **Prevención de errores**: Confirmación antes de perder progreso
4. **Consistencia**: Comportamiento similar a otros modales web modernos
5. **Feedback visual**: Cursor pointer indica interactividad

---

✨ **Implementado**: Febrero 2026
🎮 **Versión**: Compatible con tamagotchi-app v1.0+
