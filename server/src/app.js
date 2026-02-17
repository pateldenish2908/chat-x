const express = require('express');
const cors = require('cors');
const routes = require('./routes/index')
const config = require('./config/env');
const app = express();
app.set('etag', false);
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.config');
const errorHandler = require('./middlewares/error.middleware');


// Middlewares

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow if no origin (Postman, Mobile apps)
    if (!origin) return callback(null, true);

    // 2. Define whitelist
    const whitelist = [
      config.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ].filter(Boolean);

    // 3. Normalize for comparison
    const normalizedTarget = origin.replace(/\/$/, "");
    const isWhitelisted = whitelist.some(url => url.replace(/\/$/, "") === normalizedTarget);

    // 4. In development, be more permissive with local IPs
    const isLocalDev = config.NODE_ENV === 'development' && (
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('http://192.168.') || // Common local network IP
      origin.startsWith('http://10.')       // Alternative local network IP
    );

    if (isWhitelisted || isLocalDev) {
      return callback(null, true);
    } else {
      console.error(`🛑 CORS Permission Denied for Origin: ${origin}`);
      console.log(`Allowed Origins:`, whitelist);
      return callback(new Error(`CORS Blocked: ${origin} not allowed.`), false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Use all routes from common router
app.use('/api', routes);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handling middleware (should be last)
app.use(errorHandler.errorMiddleware);
module.exports = app;
