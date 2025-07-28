//core
import express from 'express';
import 'dotenv/config';
//controllers
import askController from '../controllers/askController.js';

export const router = express.Router();

router.post('/', askController);

export default router;
