//core
import express from 'express';
//controllers
import fileOptionsController from '../controllers/fileOptionsController.js';

const router = express.Router();

// GET /api/file-options - Get all file options
router.get('/', fileOptionsController);

export default router;
