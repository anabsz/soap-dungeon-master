from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from soap_handler import process_request

HOST = "localhost"
PORT = 8000
MAX_CONTENT_LENGTH = 1024 * 1024
WSDL_PATH = Path(__file__).parent / "wsdl" / "dungeon_master.wsdl"



class DungeonMasterHandler(BaseHTTPRequestHandler):
    def send_text(self, status, message):
        body = message.encode("UTF-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.add_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def add_cors_headers(self):
        self.send_header(
            "Access-Control-Allow-Origin",
            "http://localhost:5173"
        )
        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS"
        )
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, SOAPAction"
        )

    def do_OPTIONS(self):
        self.send_response(204)
        self.add_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_text(200, "O servidor Dungeon Master está rodando!")
            return

        if self.path == "/dungeon-master?wsdl":
            self.send_wsdl()
            return  

        self.send_text(404, "Rota não encontrada.")

    def do_POST(self):
        if self.path != "/soap":
            self.send_text(404, "Rota não encontrada.")
            return

        content_type = self.headers.get("Content-Type", "")
        if not content_type.startswith("text/xml"):
            self.send_text(415, "Content-Type esperado: text/xml.")
            return

        content_length = self.headers.get("Content-Length")
        if content_length is None:
            self.send_text(411, "Content-Length is required.")
            return

        try:
            length = int(content_length)
        except ValueError:
            self.send_text(400, "Invalid Content-Length.")
            return

        if length < 0:
            self.send_text(400, "Invalid Content-Length.")
            return

        if length > MAX_CONTENT_LENGTH:
            self.send_text(413, "Request body too large.")
            return

        raw_body = self.rfile.read(length)
        status, response = process_request(raw_body)
        self.send_xml(status, response)

    def send_xml(self, status, xml_body):
        self.send_response(status)
        self.send_header("Content-Type", "text/xml; charset=utf-8")
        self.send_header("Content-Length", str(len(xml_body)))
        self.add_cors_headers()
        self.end_headers()
        self.wfile.write(xml_body)

    def send_wsdl(self):
        try:
            wsdl_content = WSDL_PATH.read_bytes()
        except FileNotFoundError:
            self.send_text(500, "Arquivo WSDL não encontrado.")
            return
        self.send_xml(200, wsdl_content)
        

def run_server():
    server = ThreadingHTTPServer((HOST, PORT), DungeonMasterHandler)
    print(f"Dungeon Master rodando na em http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando servidor...")
    finally:
        server.server_close()

if __name__ == "__main__":
    run_server()
