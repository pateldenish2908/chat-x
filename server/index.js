const config = require('./src/config/env');
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

const PORT = config.PORT;
const serverInstance = server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.NODE_ENV} mode`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  serverInstance.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
