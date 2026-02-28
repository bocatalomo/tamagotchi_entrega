/**
 * Cliente API para el servidor de IA de Piedra, Papel o Tijera
 * ==============================================================
 * Maneja la comunicación con el servidor Flask que expone el modelo de ML.
 * 
 * Características:
 * - Timeout de 3 segundos
 * - Manejo de errores robusto
 * - Mapeo automático entre nomenclatura inglés/español
 * - Logs en desarrollo
 */

import type { 
  GameHistory, 
  AIPrediction, 
  ServerHealth, 
  RegisterRoundResponse,
  RPSChoiceEN,
  RPSChoice,
  RoundWinner
} from '@/types/rpsAi';

// ============================================
// CONFIGURACIÓN
// ============================================

// En producción usa rutas relativas (/api/*), en desarrollo usa servidor local
const API_URL = import.meta.env.VITE_AI_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:5001');
const TIMEOUT_MS = 3000;
const IS_DEV = import.meta.env.DEV;

// ============================================
// MAPEO DE NOMENCLATURA
// ============================================

/**
 * Mapeo de inglés (UI React) a español (API Python)
 */
const CHOICE_MAP: Record<RPSChoiceEN, RPSChoice> = {
  rock: 'piedra',
  paper: 'papel',
  scissors: 'tijera'
};

/**
 * Mapeo de español (API Python) a inglés (UI React)
 */
const REVERSE_CHOICE_MAP: Record<RPSChoice, RPSChoiceEN> = {
  piedra: 'rock',
  papel: 'paper',
  tijera: 'scissors'
};

/**
 * Convierte una jugada de inglés a español
 */
export function toSpanish(choice: RPSChoiceEN): RPSChoice {
  return CHOICE_MAP[choice];
}

/**
 * Convierte una jugada de español a inglés
 */
export function toEnglish(choice: RPSChoice): RPSChoiceEN {
  return REVERSE_CHOICE_MAP[choice];
}

// ============================================
// UTILIDADES HTTP
// ============================================

/**
 * Fetch con timeout automático
 */
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Logger condicional (solo en desarrollo)
 */
function log(...args: unknown[]) {
  if (IS_DEV) {
    console.log('[RPS AI API]', ...args);
  }
}

/**
 * Logger de errores
 */
function logError(...args: unknown[]) {
  console.error('[RPS AI API]', ...args);
}

// ============================================
// ENDPOINTS
// ============================================

/**
 * Verifica si el servidor de IA está disponible
 * 
 * @returns true si el servidor responde y el modelo está cargado
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    log('Verificando salud del servidor...');
    
    const response = await fetchWithTimeout(`${API_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      logError(`Servidor respondió con status ${response.status}`);
      return false;
    }

    const data: ServerHealth = await response.json();
    
    if (data.modelLoaded) {
      log('✅ Servidor disponible, modelo cargado');
      log(`📊 Rondas jugadas: ${data.totalRoundsPlayed}`);
    } else {
      logError('⚠️ Servidor disponible pero modelo NO cargado');
    }

    return data.modelLoaded;

  } catch (error) {
    if (error instanceof Error && error.message === 'Request timeout') {
      logError('⏱️ Timeout al conectar con servidor');
    } else {
      logError('❌ Error al verificar servidor:', error);
    }
    return false;
  }
}

/**
 * Obtiene la predicción de la IA sobre la próxima jugada
 * 
 * @param history - Historial de jugadas (en español)
 * @returns Predicción de la IA o null si hay error
 */
export async function predictNextMove(
  history: GameHistory
): Promise<AIPrediction | null> {
  try {
    log('Solicitando predicción...', { historyLength: history.player.length });

    const response = await fetchWithTimeout(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(`Error en predicción (${response.status}):`, errorData);
      return null;
    }

    const prediction: AIPrediction = await response.json();
    
    log('🤖 Predicción recibida:', {
      predicted: prediction.predictedOpponentMove,
      aiMove: prediction.aiMove,
      reasoning: prediction.reasoning
    });

    return prediction;

  } catch (error) {
    if (error instanceof Error && error.message === 'Request timeout') {
      logError('⏱️ Timeout al solicitar predicción');
    } else {
      logError('❌ Error al obtener predicción:', error);
    }
    return null;
  }
}

/**
 * Registra una ronda jugada en el servidor
 * 
 * @param player - Jugada del jugador (español)
 * @param ai - Jugada de la IA (español)
 * @param winner - Ganador de la ronda
 * @returns true si se registró correctamente
 */
export async function registerRound(
  player: RPSChoice,
  ai: RPSChoice,
  winner: RoundWinner
): Promise<boolean> {
  try {
    log('Registrando ronda:', { player, ai, winner });

    const response = await fetchWithTimeout(`${API_URL}/register-round`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player, ai, winner }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(`Error al registrar ronda (${response.status}):`, errorData);
      return false;
    }

    const data: RegisterRoundResponse = await response.json();
    
    if (data.success) {
      log(`✅ Ronda #${data.roundNumber} registrada`);
    }

    return data.success;

  } catch (error) {
    if (error instanceof Error && error.message === 'Request timeout') {
      logError('⏱️ Timeout al registrar ronda');
    } else {
      logError('❌ Error al registrar ronda:', error);
    }
    return false;
  }
}

/**
 * Reinicia el historial de la IA en el servidor (útil para testing)
 * 
 * @returns true si se reinició correctamente
 */
export async function resetAI(): Promise<boolean> {
  try {
    log('Reiniciando IA...');

    const response = await fetchWithTimeout(`${API_URL}/reset`, {
      method: 'POST',
    });

    if (!response.ok) {
      logError(`Error al reiniciar IA (${response.status})`);
      return false;
    }

    log('✅ IA reiniciada');
    return true;

  } catch (error) {
    logError('❌ Error al reiniciar IA:', error);
    return false;
  }
}
