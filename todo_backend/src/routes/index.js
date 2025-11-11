const express = require('express');
const healthController = require('../controllers/health');
const tasksRoutes = require('./tasks');

const router = express.Router();

// Health endpoint (moved to /api/health)
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/api/health', healthController.check.bind(healthController));

// Tasks routes
router.use('/api/tasks', tasksRoutes);

module.exports = router;
