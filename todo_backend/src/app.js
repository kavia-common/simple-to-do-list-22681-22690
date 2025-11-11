const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

// CORS: allow Next.js frontend at localhost:3000 by default; support override via CORS_ORIGIN
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: function (origin, callback) {
    // Allow no-origin requests like curl or same-origin
    if (!origin) return callback(null, true);
    const allowed = [allowedOrigin, 'http://localhost:3000'];
    if (allowed.includes(origin) || allowedOrigin === '*') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set('trust proxy', true);

// Swagger UI at /docs with dynamic server URL
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;            // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Standardize error output
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message || 'Error';
  if (status === 500) {
    // log stack for 500s
    // eslint-disable-next-line no-console
    console.error(err.stack);
  }
  res.status(status).json({
    status: 'error',
    message,
  });
});

module.exports = app;
