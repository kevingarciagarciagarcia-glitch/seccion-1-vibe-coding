// App de prueba — Node.js HTTP puro (sin dependencias)
const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const now = new Date().toISOString();

  console.log(`[${now}] ${req.method} ${req.url}`);

  // Health check interno
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: now }));
    return;
  }

  // Respuesta principal
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Hello from Taller DAE backend!",
      path: req.url,
      method: req.method,
      timestamp: now,
      environment: "development",
    })
  );
});

server.listen(PORT, () => {
  console.log(`App de prueba corriendo en http://0.0.0.0:${PORT}`);
});
