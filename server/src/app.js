const express = require('express');
const cors = require('cors');
const routes = require('./routes/index')
const config = require('./config/env');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.config');
const errorHandler = require('./middlewares/error.middleware');


// Middlewares
const allowedOrigins = [config.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());


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
