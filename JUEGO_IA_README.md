# 🤖 Juego con IA - Piedra, Papel o Tijera

Esta versión del juego usa un modelo de **machine learning real** entrenado en Python.

---

## 🎯 Características

- ✅ **IA Inteligente**: Modelo RandomForest entrenado con 789+ rondas reales
- ✅ **Aprendizaje Continuo**: Todas las partidas se guardan y mejoran el modelo
- ✅ **Detección de Patrones**: La IA detecta ciclos, repeticiones y meta-juego
- ✅ **Fallback Automático**: Funciona sin servidor con IA simple local
- ✅ **Indicadores Visuales**: Muestra si la IA está conectada o offline

---

## 🚀 Cómo Jugar

### Paso 1: Iniciar Servidor de IA

**Terminal 1:**
```bash
cd /Users/diego/PycharmProjects/rps-ai-bocatalomo
source .venv/bin/activate
python api.py
```

Deberías ver:
```
============================================================
   🤖 SERVIDOR DE IA - PIEDRA, PAPEL O TIJERA
============================================================
✅ CSV existente: 789 rondas previas
✅ Modelo de IA cargado correctamente

🚀 Servidor corriendo en http://localhost:5001
```

---

### Paso 2: Iniciar App React

**Terminal 2:**
```bash
cd /Users/diego/Downloads/tamagotchi-app-11-backup_20260127_163746
npm run dev
```

Abre en navegador: **http://localhost:5173**

---

### Paso 3: Jugar

1. En la app, haz clic en **"Jugar"**
2. Selecciona **"🤖 Piedra, Papel o Tijera IA"**
3. Verás el indicador **"🤖 IA conectada"** si el servidor está corriendo
4. ¡Juega y desafía a la IA!

---

## 📊 Cómo Funciona

### Flujo de Datos

```
Usuario elige "piedra"
        ↓
React envía historial → Flask API
        ↓
Modelo ML analiza patrones
        ↓
IA decide jugada óptima
        ↓
React muestra resultado
        ↓
Ronda se guarda en CSV
```

### Modelo de IA

El modelo usa **30+ features** para predecir tu próxima jugada:

- 📈 **Lags**: Tus últimas 3 jugadas
- 📊 **Frecuencias**: Qué juegas más (piedra/papel/tijera)
- 🔄 **Ciclos**: Detecta si juegas en patrones (piedra→papel→tijera)
- 🎯 **Meta-juego**: Detecta si intentas contra-predecir a la IA
- 🧠 **Rachas**: Analiza tus victorias/derrotas consecutivas
- 🔢 **Diversidad**: Qué tan aleatorio juegas

---

## 🎮 Modos de Juego

### Con Servidor (Recomendado)

- **IA**: Modelo ML entrenado
- **Dificultad**: Difícil (~50% winrate)
- **Aprendizaje**: Sí (guarda todas las partidas)
- **Indicador**: 🤖 IA conectada

### Sin Servidor (Fallback)

- **IA**: Simple (50% random, 30% counter, 20% pattern)
- **Dificultad**: Fácil (~60% winrate usuario)
- **Aprendizaje**: Solo en sesión actual
- **Indicador**: ⚠️ IA offline

---

## 🔧 Configuración

### Variables de Entorno

Archivo `.env` en la raíz:

```env
VITE_AI_API_URL=http://localhost:5001
```

Para cambiar el puerto del servidor, edita esta variable.

---

## 🐛 Debugging

### Console Logs

La app loguea todo en consola del navegador (F12):

```
[RPS AI API] ✅ Servidor disponible, modelo cargado
[RPS AI API] 📊 Rondas jugadas: 789
[RPS AI API] 🤖 Predicción recibida: { predicted: "piedra", aiMove: "papel" }
[RPS AI API] ✅ Ronda #790 registrada
```

### Verificar Servidor

```bash
# Desde terminal
curl http://localhost:5001/health

# Deberías ver:
# {"status":"ok","modelLoaded":true,"totalRoundsPlayed":789}
```

---

## ⚠️ Problemas Comunes

### "IA offline" aunque el servidor está corriendo

**Solución:**
1. Verifica que el servidor esté en puerto **5001**
2. Revisa la consola del navegador (F12) para errores CORS
3. Asegúrate de que `.env` tiene `VITE_AI_API_URL=http://localhost:5001`
4. Recarga la página (Ctrl+R)

---

### El juego es muy lento

**Posible causa:** La petición a la API tarda mucho.

**Solución:**
1. Verifica que el servidor esté en tu máquina local (no remoto)
2. Revisa logs del servidor Flask para errores
3. El timeout está configurado a 3 segundos en `rpsAiApi.ts`

---

### Errores de TypeScript

**Si ves errores de `@/types/rpsAi` o `@/utils/rpsAiApi`:**

Asegúrate de que `vite.config.js` tiene el alias configurado:

```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

## 📈 Estadísticas

Todas las partidas se guardan en:

```
/Users/diego/PycharmProjects/rps-ai-bocatalomo/data/partidas_web.csv
```

Cada ronda incluye:
- Jugada del usuario
- Jugada de la IA
- Ganador
- Timestamp

**El modelo mejora con más datos acumulados.**

---

## 🎯 Estrategias para Ganar

La IA es inteligente, pero tiene debilidades:

1. **Juega aleatorio**: Si detecta que eres impredecible, la IA pierde ventaja
2. **Cambia de patrón**: Si juegas ciclos, la IA los detecta rápido
3. **No intentes contra-predecir**: La IA detecta meta-juego
4. **Primeras jugadas**: La IA necesita historial, aprovecha las primeras rondas

---

## 🏆 Recompensas

Mismas que el juego original:

- **Ganar** (2 de 3 rondas): 8 monedas, 15 exp, 25 felicidad
- **Perder**: 2 monedas, 5 exp, 5 felicidad (recompensa de consolación)

---

## 🔄 Actualizaciones Futuras

Posibles mejoras:

- [ ] Mostrar confianza de la predicción
- [ ] Modo "entrenamiento" para mejorar el modelo
- [ ] Estadísticas del usuario (winrate personal)
- [ ] Diferentes niveles de dificultad
- [ ] Exportar historial de partidas

---

## 📝 Créditos

- **Modelo de IA**: Diego Sánchez Cano
- **Dataset**: 789 rondas reales contra 10+ personas
- **Algoritmo**: Random Forest Classifier con 30+ features
- **Winrate del modelo**: ~44-50% (versus humanos)

---

## 🤔 Preguntas Frecuentes

### ¿La IA hace trampa?

No. La IA hace su predicción **antes** de que veas el resultado. El servidor Flask procesa tu historial y decide basándose solo en tus patrones previos.

### ¿Puedo jugar sin internet?

Sí. Si el servidor no está disponible, la app usa automáticamente una IA simple local. La experiencia es similar pero menos desafiante.

### ¿Las partidas offline se guardan?

No. Solo las partidas contra el servidor Flask se guardan en el CSV. Las partidas offline solo existen durante la sesión actual.

### ¿Puedo resetear el historial?

Sí. Para resetear el historial del servidor:

```bash
# Borrar CSV
rm /Users/diego/PycharmProjects/rps-ai-bocatalomo/data/partidas_web.csv

# O usar endpoint de reset
curl -X POST http://localhost:5001/reset
```

---

¡Disfruta jugando contra la IA! 🎮🤖
