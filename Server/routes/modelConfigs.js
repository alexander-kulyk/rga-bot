//core
import express from 'express';
//controllers
import {
  getModelConfigs,
  updateModelConfig,
} from '../controllers/modelConfigController.js';

const router = express.Router();

// GET /api/model-configs - Get all model configurations
router.get('/', getModelConfigs);

// PUT /api/model-configs - Update or create model configuration
router.put('/', updateModelConfig);

export default router;
