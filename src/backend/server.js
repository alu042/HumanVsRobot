const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const { router, wss } = require('./api');
// require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// HTTPS redirection middleware
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Use API routes
app.use('/api', router);

// WebSocket connection handling
server.on('upgrade', (request, socket, head) => {
  // Only handle upgrades for the WebSocket path
  if (request.url === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../build')));

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
