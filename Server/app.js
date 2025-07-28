//core
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import middlewares
import rateLimiter from './middlewares/rateLimiter.js';
import logger from './middlewares/logger.js';

// Import routes
import wikiRoutes from './routes/wiki.js';
import askRoutes from './routes/ask.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Built-in middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // HTTP request logger
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom middlewares
app.use(logger); // Custom logger middleware
app.use(rateLimiter); // Rate limiting middleware

app.use('/api/wiki', wikiRoutes);
app.use('/api/ask', askRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware (should be last)
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

export default app;
