const express = require('express');
const cors = require('cors');
const routes = require('./routes/index')
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.config');
const errorHandler = require('./middlewares/error.middleware');


// Middlewares
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: frontendUrl,
  credentials: true, // Allow cookies if you are using them
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
