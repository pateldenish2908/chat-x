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
    // Allow all origins
    callback(null, true);
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
