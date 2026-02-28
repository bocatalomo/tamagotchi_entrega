# API de IA - Vercel Serverless Functions

Esta carpeta contiene las funciones serverless de Vercel que implementan la API de IA para el juego de Piedra, Papel o Tijera.

## 📁 Estructura

```
api/
├── predict.py         # POST /api/predict - Obtiene predicción de la IA
├── register-round.py  # POST /api/register-round - Registra ronda jugada
├── health.py          # GET /api/health - Health check
├── stats.py           # GET /api/stats - Estadísticas
├── modelo.py          # Clase JugadorIA con modelo ML
├── requirements.txt   # Dependencias Python
└── models/
    └── modelo_entrenado.pkl  # Modelo RandomForest pre-entrenado (9MB)
```

## 🚀 Endpoints

### GET /api/health

Verifica el estado del servicio.

**Respuesta:**
```json
{
  "status": "ok",
  "modelLoaded": true,
  "databaseConnected": false,
  "version": "serverless-v1.0",
  "platform": "vercel"
}
```

### POST /api/predict

Obtiene la predicción de la IA basada en el historial de juego.

**Request:**
```json
{
  "history": [
    {
      "playerMove": "piedra",
      "aiMove": "papel",
      "playerTime": 0.5,
      "aiTime": 0.3
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "aiMove": "tijera",
  "prediction": "papel"
}
```

### POST /api/register-round

Registra una ronda jugada (en esta versión serverless, solo confirma recepción).

**Request:**
```json
{
  "playerMove": "piedra",
  "aiMove": "papel",
  "winner": "ai",
  "playerTime": 0.5,
  "aiTime": 0.3
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Ronda registrada en sesión",
  "round": { ... }
}
```

### GET /api/stats

Retorna estadísticas del modelo (datos del modelo pre-entrenado).

**Respuesta:**
```json
{
  "totalRounds": 789,
  "modelAccuracy": 0.45,
  "lastUpdated": "2026-02-28T...",
  "platform": "vercel-serverless",
  "note": "Stats from pre-trained model. Session data is in-memory only."
}
```

## 🔧 Configuración

### Runtime

Python 3.9 (configurado en `vercel.json`)

### Dependencias

- numpy==1.24.3
- pandas==2.0.3
- scikit-learn==1.3.0

## ⚠️ Limitaciones

### Sin Persistencia Global

A diferencia de la versión con Render.com + PostgreSQL, esta versión serverless:

- ❌ No persiste el historial entre deployments
- ❌ No aprende de partidas de otros usuarios
- ✅ Usa el modelo pre-entrenado (789 rondas)
- ✅ Mantiene historial en memoria durante la sesión
- ✅ Funciona perfectamente para jugar

### Cold Start

Las funciones serverless de Vercel tienen "cold start":

- Primera petición puede tardar 1-3 segundos
- Peticiones subsecuentes son rápidas (<500ms)
- Después de ~5 min sin uso, se "duerme" nuevamente

## 🧪 Probar Localmente

```bash
# Instalar Vercel CLI
npm i -g vercel

# Correr en modo dev (simula serverless)
vercel dev

# Las funciones estarán disponibles en:
# http://localhost:3000/api/health
# http://localhost:3000/api/predict
# etc.
```

## 📦 Deploy

El deploy se hace automáticamente al hacer push a GitHub si el repositorio está conectado a Vercel.

Manualmente:

```bash
vercel --prod
```

## 🎯 Modelo de IA

El modelo es un **RandomForest** entrenado con:

- 789+ rondas de juego
- 33 features (lags, frecuencias, patrones cíclicos, etc.)
- ~45% de accuracy (mejor que random 33%)

Detecta:
- Patrones secuenciales (jugador repite)
- Ciclos (piedra→papel→tijera)
- Meta-juego (jugador contra-predice)
- Frecuencias globales y recientes
- Reacciones a victorias/derrotas

## 📚 Referencias

- Documentación completa: `~/Desktop/DEPLOYMENT_AHORA.md`
- Modelo original: `~/PycharmProjects/rps-ai-bocatalomo/`
- Cliente API: `src/utils/rpsAiApi.ts`
