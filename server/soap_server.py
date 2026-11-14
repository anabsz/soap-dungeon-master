from http.server import BaseHTTPRequestHandler, ThreadingHTTPSServer

HOST = "localhost"
PORT = "8000"
MAX_CONTENT_LENGHT = 1024 * 1024


def run_server():
    print(f"Dungeon Master rodando na em http://{HOST}:{PORT}")

if __name__ == "__main__":
    run_server()
