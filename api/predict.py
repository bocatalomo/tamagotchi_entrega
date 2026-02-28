"""
Vercel Serverless Function: /api/predict
Predice la próxima jugada de la IA
"""

from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from pathlib import Path

# Agregar el directorio api al path para importar modelo
sys.path.insert(0, str(Path(__file__).parent))

try:
    from modelo import JugadorIA, PIERDE_CONTRA
    MODELO_CARGADO = True
except Exception as e:
    print(f"Error cargando modelo: {e}")
    MODELO_CARGADO = False

# Instancia global de la IA (se mantiene entre invocaciones en la misma instancia)
_ia_instance = None

def get_ia():
    """Obtiene o crea la instancia de IA"""
    global _ia_instance
    if _ia_instance is None:
        model_path = Path(__file__).parent / "models" / "modelo_entrenado.pkl"
        _ia_instance = JugadorIA(str(model_path))
    return _ia_instance


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Maneja POST /api/predict"""
        try:
            # CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            if not MODELO_CARGADO:
                response = {
                    'success': False,
                    'error': 'Modelo no disponible'
                }
                self.wfile.write(json.dumps(response).encode())
                return

            # Leer body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())

            history = data.get('history', [])
            
            ia = get_ia()
            
            # Registrar historial
            ia.historial = []
            for round_data in history:
                ia.registrar_ronda(
                    round_data['playerMove'],
                    round_data['aiMove'],
                    round_data.get('playerTime', 0.5),
                    round_data.get('aiTime', 0.5)
                )

            # Predecir próxima jugada del oponente
            prediccion_oponente = ia.predecir_jugada_oponente()
            
            # Decidir qué jugar la IA (lo que gana a la predicción)
            jugada_ia = PIERDE_CONTRA[prediccion_oponente]

            response = {
                'success': True,
                'aiMove': jugada_ia,
                'prediction': prediccion_oponente
            }

            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': False,
                'error': str(e)
            }
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        """Maneja OPTIONS para CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
