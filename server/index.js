/* eslint-disable no-undef */
require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/config/socket');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to DB and start server
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
