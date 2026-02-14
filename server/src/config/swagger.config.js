const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tinder Clone API',
      version: '1.0.0',
      description: 'Tinder Clone API with Express & MongoDB',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://chat-x-production.up.railway.app/api',
        description: 'Production server',
      },
    ],
  },
  apis: ['src/routes/*.js'], // Path to your routes files where you write Swagger docs
};
const specs = swaggerJsDoc(options);

module.exports = specs;
