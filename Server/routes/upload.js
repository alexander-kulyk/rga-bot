import express from 'express';
//other
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import loadDocxController from '../controllers/loadDocxController.js';

const router = express.Router();

router.post('/', uploadMiddleware.single('file'), loadDocxController());

export default router;
