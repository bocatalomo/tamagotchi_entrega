"""
Vercel Serverless Function: /api/stats
Retorna estadísticas de la IA (en memoria, no persistente)
"""

from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Maneja GET /api/stats"""
        try:
            # CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            # En serverless sin DB, retornamos stats del modelo pre-entrenado
            response = {
                'totalRounds': 789,  # Rondas del entrenamiento
                'modelAccuracy': 0.45,  # Accuracy del modelo entrenado
                'lastUpdated': datetime.utcnow().isoformat() + 'Z',
                'platform': 'vercel-serverless',
                'note': 'Stats from pre-trained model. Session data is in-memory only.'
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
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
