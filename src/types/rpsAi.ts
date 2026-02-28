/**
 * Tipos TypeScript para la integración con la API de IA
 * ======================================================
 * Define las interfaces para comunicarse con el servidor Flask
 * que expone el modelo de machine learning.
 */

/**
 * Historial de jugadas de una partida
 */
export interface GameHistory {
  player: string[];  // Jugadas del usuario ['piedra', 'tijera', ...]
  ai: string[];      // Jugadas de la IA ['papel', 'piedra', ...]
}

/**
 * Predicción de la IA sobre la próxima jugada
 */
export interface AIPrediction {
  predictedOpponentMove: string;  // Lo que la IA cree que jugará el humano
  aiMove: string;                 // Lo que jugará la IA para ganar
  reasoning?: string;             // Explicación del modelo (debugging)
}

/**
 * Respuesta del endpoint /health
 */
export interface ServerHealth {
  status: string;
  modelLoaded: boolean;
  totalRoundsPlayed: number;
  csvPath?: string;
}

/**
 * Respuesta del endpoint /register-round
 */
export interface RegisterRoundResponse {
  success: boolean;
  roundNumber: number;
}

/**
 * Tipos de jugadas válidas en español
 */
export type RPSChoice = 'piedra' | 'papel' | 'tijera';

/**
 * Tipos de jugadas válidas en inglés (UI React)
 */
export type RPSChoiceEN = 'rock' | 'paper' | 'scissors';

/**
 * Ganador de una ronda
 */
export type RoundWinner = 'player' | 'ai' | 'tie';
