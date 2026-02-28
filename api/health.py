"""
Vercel Serverless Function: /api/health
Health check endpoint
"""

from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from pathlib import Path

# Agregar el directorio api al path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from modelo import JugadorIA
    MODELO_CARGADO = True
    try:
        model_path = Path(__file__).parent / "models" / "modelo_entrenado.pkl"
        test_ia = JugadorIA(str(model_path))
        MODELO_FUNCIONAL = test_ia.modelo is not None
    except:
        MODELO_FUNCIONAL = False
except:
    MODELO_CARGADO = False
    MODELO_FUNCIONAL = False


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Maneja GET /api/health"""
        try:
            # CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            response = {
                'status': 'ok',
                'modelLoaded': MODELO_FUNCIONAL,
                'databaseConnected': False,  # Sin DB en serverless
                'version': 'serverless-v1.0',
                'platform': 'vercel'
            }

            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'status': 'error',
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
