# Sistema de Persistencia y Decay del Tamagotchi

## 📋 Resumen

El sistema de persistencia del tamagotchi ha sido completamente rediseñado para garantizar:
1. **Un tamagotchi por usuario**: Cada cuenta solo puede tener un tamagotchi activo a la vez
2. **Decay continuo offline**: El tamagotchi envejece incluso cuando la app está cerrada
3. **Guardado automático en Firestore**: Los datos se guardan cada 30 segundos automáticamente
4. **Sin localStorage**: Firestore es la única fuente de verdad

## 🏗️ Arquitectura

### Archivos Principales

#### 1. `src/utils/decayCalculator.ts`
**Propósito**: Calcular el deterioro acumulado cuando la app estuvo cerrada.

**Función principal**: `calculateOfflineDecay(pet, timeElapsedMs)`
- Calcula cuántos ciclos de decay ocurrieron (cada 30 segundos)
- Aplica decay acumulado a todos los stats (hunger, happiness, energy, cleanliness, health)
- Verifica si el pet debe morir por tiempo crítico
- Recalcula mood, dangerLevel, e isSick
- Retorna el estado actualizado y si murió

**Ejemplo de uso**:
```typescript
const data = await loadTamagotchi();
const timeElapsed = Date.now() - data.pet.lastUpdate;
const result = calculateOfflineDecay(data.pet, timeElapsed);

if (result.died) {
  console.log(`Murió por: ${result.deathReason}`);
}
setPet(result.pet);
```

#### 2. `src/hooks/useAutoSave.ts`
**Propósito**: Guardar automáticamente el estado en Firestore cada 30 segundos.

**Características**:
- Guarda cada 30 segundos si hay cambios
- Guarda al cambiar de pestaña (visibilitychange)
- Guarda antes de cerrar la página (beforeunload)
- Detecta cambios mediante hash del estado
- Maneja errores silenciosamente

**Ejemplo de uso**:
```typescript
const { saveNow, lastSaveTime } = useAutoSave(pet, inventory, {
  disabled: !user, // Solo guardar si hay usuario autenticado
  onSaveSuccess: () => console.log('Guardado'),
  onSaveError: (error) => console.error(error),
});

// Guardar manualmente si es necesario
await saveNow();
```

#### 3. `src/services/tamagotchiService.ts`
**Modificaciones**:
- `createTamagotchi()` ahora valida que no exista ya un tamagotchi
- Lanza error si intentas crear un segundo tamagotchi
- Todas las funciones usan Firestore como única fuente

**Validación agregada**:
```typescript
const existingTamagotchi = await hasTamagotchi();
if (existingTamagotchi) {
  throw new Error('Ya tienes un tamagotchi. Solo puedes tener uno a la vez.');
}
```

### Flujo de Datos

#### Al Abrir la App
```
1. Usuario se autentica (AuthContext)
2. useEffect detecta usuario autenticado
3. loadPetFromFirestore() se ejecuta
4. Carga datos desde Firestore
5. Calcula tiempo offline: Date.now() - pet.lastUpdate
6. Aplica calculateOfflineDecay() con tiempo transcurrido
7. Si murió offline, muestra notificación
8. Actualiza estado local con decay aplicado
9. useAutoSave inicia guardado periódico
```

#### Durante el Juego
```
1. Usuario hace acción (feed, play, clean, etc.)
2. Estado local se actualiza inmediatamente
3. useAutoSave detecta cambio
4. Cada 30 segundos, guarda en Firestore automáticamente
5. Decay en tiempo real (useEffect cada 30s) actualiza stats
6. useAutoSave guarda los cambios periódicamente
```

#### Al Cerrar la App
```
1. Usuario cierra pestaña/navegador
2. beforeunload event se dispara
3. useAutoSave ejecuta saveNow() una última vez
4. Estado se guarda con lastUpdate = Date.now()
5. App se cierra
```

#### Al Reabrir la App (después de horas/días)
```
1. loadPetFromFirestore() carga datos
2. pet.lastUpdate = [hace 2 horas]
3. calculateOfflineDecay calcula:
   - timeElapsed = 2 horas = 7,200,000 ms
   - decayCycles = 7,200,000 / 30,000 = 240 ciclos
   - hunger -= 2 * 240 = -480 → 0 (murió de hambre)
4. Verifica tiempo crítico:
   - Si hunger = 0 por más de 2 horas → muerte
5. Retorna { died: true, deathReason: 'starvation' }
6. Muestra notificación de muerte
7. Usuario puede resetear y crear nuevo tamagotchi
```

## 🎮 Reglas del Decay

### Decay por Ciclo (cada 30 segundos)
- **Hunger**: -2
- **Happiness**: -1.5
- **Energy**: -1
- **Cleanliness**: -0.8
- **Health**: Variable según limpieza y hambre

### Decay de Salud
- Si `cleanliness < 20` y `hunger < 30`: health -= 3
- Si `cleanliness < 20`: health -= 1.5
- Si `hunger = 0`: health -= 2 adicional
- Si `cleanliness > 50` y `health < 100`: health += 0.5 (recuperación)

### Condiciones de Muerte
- **Hambre = 0 por 2 horas** (7,200,000 ms) → Muerte por hambre
- **Salud = 0 por 30 minutos** (1,800,000 ms) → Muerte por salud
- **Hambre < 10 Y Salud < 10 por 30 minutos** → Muerte por combo

### Estados de Peligro
- **Normal**: hunger > 30 && health > 30
- **Alerta**: hunger < 30 || health < 30
- **Crítico**: hunger < 10 || health < 10
- **Agonizante**: hunger = 0 || health = 0

## 🔒 Validaciones

### Un Tamagotchi por Usuario
```typescript
// En createTamagotchi()
const existingTamagotchi = await hasTamagotchi();
if (existingTamagotchi) {
  throw new Error('Ya tienes un tamagotchi');
}
```

### Autenticación Requerida
- Todas las operaciones requieren `user.uid`
- Sin usuario autenticado, no se puede guardar ni cargar
- AuthBypass solo en desarrollo (`VITE_DISABLE_AUTH=1`)

## 🗑️ Eliminar Tamagotchi

Para crear un nuevo tamagotchi, primero debes eliminar el actual:

```typescript
// En App.tsx
const resetGame = async () => {
  const success = await deleteTamagotchi();
  if (success) {
    setPet(initialPetState);
    setFlowState('naming');
  }
};
```

## 🧪 Testing

### Casos de Prueba Recomendados

1. **Decay Offline Corto (5 minutos)**
   - Crear tamagotchi con stats altos
   - Cerrar app por 5 minutos
   - Reabrir y verificar decay mínimo

2. **Decay Offline Largo (2 horas con stats bajos)**
   - Crear tamagotchi
   - Reducir hunger a 10
   - Cerrar app por 2 horas
   - Verificar que murió al reabrir

3. **Auto-guardado**
   - Abrir DevTools → Network
   - Hacer acción (feed)
   - Esperar 30 segundos
   - Verificar llamada a Firestore

4. **Un Tamagotchi por Usuario**
   - Crear tamagotchi
   - Intentar crear otro desde otra pestaña
   - Verificar error

5. **Guardado al Cerrar**
   - Hacer cambios
   - Cerrar pestaña inmediatamente
   - Reabrir en menos de 30s
   - Verificar que los cambios se guardaron

## 📊 Monitoreo

### Logs en Consola

El sistema muestra logs detallados:
- 🔄 `loadPetFromFirestore: Iniciado`
- ⏱️ `Tiempo offline: X minutos`
- 💀 `El tamagotchi murió mientras estaba offline (razón: X)`
- 💾 `Auto-save: Guardando estado en Firestore...`
- ✅ `Auto-save: Estado guardado exitosamente`
- 👁️ `Auto-save: App oculta, guardando estado...`

### Debugging

Para verificar el funcionamiento:

```javascript
// En consola del navegador
// Ver último guardado
console.log('Último guardado:', new Date(lastSaveTime));

// Forzar guardado inmediato
saveNow();

// Ver estado actual del pet
console.log('Pet:', pet);
console.log('Tiempo desde última actualización:', 
  (Date.now() - pet.lastUpdate) / 1000 / 60, 'minutos');
```

## 🚫 localStorage Eliminado

**Antes**: El sistema guardaba en localStorage Y Firestore.
**Ahora**: Solo Firestore.

**Razones**:
- Evitar inconsistencias entre fuentes de datos
- Firestore es la única fuente de verdad
- Cada usuario tiene sus datos en su cuenta
- No hay conflictos entre dispositivos

**Migración**: Si un usuario tenía datos en localStorage, se perderán. Se debe crear un nuevo tamagotchi.

## ⚠️ Consideraciones

1. **Conexión a Internet**: El usuario DEBE tener conexión para jugar. Sin internet, no se puede cargar ni guardar.

2. **Múltiples Pestañas**: Si un usuario abre la app en 2 pestañas simultáneamente, pueden sobrescribirse los datos. Posible mejora futura: agregar detección de múltiples pestañas.

3. **Latencia de Firestore**: El auto-save puede fallar si hay problemas de red. Los errores se logean pero no se muestran al usuario para no interrumpir el juego.

4. **Tamaño de Documentos**: Cada guardado completo incluye pet + inventory. Con el uso actual, esto es ~1-2KB por guardado. A 30 segundos por guardado = ~120 escrituras/hora = ~2,880 escrituras/día por usuario activo.

## 🔮 Mejoras Futuras

- [ ] Modo offline con sincronización al reconectar
- [ ] Detección de múltiples pestañas
- [ ] Guardado diferencial (solo cambios)
- [ ] Compresión de datos históricos
- [ ] Estadísticas de uso (tiempo jugado, acciones por día)
- [ ] Backups automáticos
- [ ] Rollback a estado anterior
