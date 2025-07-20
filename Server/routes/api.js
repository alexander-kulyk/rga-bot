import express from 'express';
const router = express.Router();

// GET /api - Get API information
router.get('/', (req, res) => {
  res.json({
    message: 'RGA Bot API',
    version: '1.0.0',
    endpoints: {
      wiki: '/api/wiki',
      health: '/health',
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/status - Get API status
router.get('/status', (req, res) => {
  res.json({
    status: 'active',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

// POST /api/test - Test endpoint
router.post('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    receivedData: req.body,
    timestamp: new Date().toISOString(),
  });
});

export default router;
