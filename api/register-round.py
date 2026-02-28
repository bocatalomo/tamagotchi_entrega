"""
Vercel Serverless Function: /api/register-round
Registra una ronda jugada (en esta versión serverless, solo retorna éxito)
"""

from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Maneja POST /api/register-round"""
        try:
            # CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            # Leer body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())

            # En serverless sin DB, solo confirmamos recepción
            # El historial se mantiene en memoria durante la sesión
            
            response = {
                'success': True,
                'message': 'Ronda registrada en sesión',
                'round': data
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
