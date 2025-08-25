//core
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
// middlewares
import rateLimiter from './middlewares/rateLimiter.js';
import logger from './middlewares/logger.js';
//routes
import modelConfigsRoutes from './routes/modelConfigs.js';
import fileOptionsRoutes from './routes/fileOptions.js';
import uploadRoutes from './routes/upload.js';
import wikiRoutes from './routes/wiki.js';
import askRoutes from './routes/ask.js';

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
app.use('/api/model-configs', modelConfigsRoutes);
app.use('/api/file-options', fileOptionsRoutes);

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
