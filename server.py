#!/usr/bin/env python3
"""
Starmon Photobooth Dev Server
Serves files with proper CORS headers so fetch() works for local assets
and canvas.toBlob() is never tainted.
"""
import http.server
import sys

PORT = 3000

class StarmonHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow same-origin fetch() for local image assets
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # Disable caching during development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        # Clean log format
        sys.stdout.write('  %s\n' % (format % args))
        sys.stdout.flush()

if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), StarmonHandler) as httpd:
        print(f'[OK] Starmon Dev Server running at http://localhost:{PORT}')
        print(f'     CORS headers enabled - canvas export will work correctly')
        print(f'     Press Ctrl+C to stop\n')
        httpd.serve_forever()
