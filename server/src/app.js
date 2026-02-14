const express = require('express');
const cors = require('cors');
const routes = require('./routes/index')
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.config');
const errorHandler = require('./middlewares/error.middleware');


// Middlewares
<<<<<<< HEAD
// Allow requests from your frontend (Next.js)
// app.use(cors({
//   origin: 'http://localhost:3000',  // <-- your frontend URL
//   credentials: true   // <-- if you're using cookies, sessions, auth headers
// }));

// app.use(cors({
//   origin: "*",
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// }));

app.use(cors({
  origin: "*",
=======
app.use(cors({
  origin: "http://localhost:3000",
>>>>>>> main
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
