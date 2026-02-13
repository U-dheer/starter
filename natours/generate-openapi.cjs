const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Natours API',
      version: '1.0.0',
      description: 'API for Natours application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['../routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

fs.writeFileSync(
  path.join(__dirname, 'apis/openapi.json'),
  JSON.stringify(swaggerSpec, null, 2),
);

console.log('OpenAPI spec generated at natours/apis/openapi.json');
