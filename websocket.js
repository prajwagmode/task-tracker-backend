const http = require('http');
const WebSocket = require('ws');

// Create HTTP server
const server = http.createServer();

// Attach WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('✅ Client connected via WebSocket');

  ws.on('message', (message) => {
    console.log('📨 Received:', message);
  });

  ws.send('✅ Connected to WebSocket server');
});

// Start server
server.listen(5050, () => {
  console.log('🚀 WebSocket server listening at ws://localhost:5050');
});

// Export WebSocket server to use in other files
module.exports = wss;
