//core
import express from 'express';
// Import wiki controller
import { fetchAndChunkWikiContent } from '../controllers/wikiController.js';

export const router = express.Router();

// POST /api/wiki/fetch-and-chunk - Fetch all wiki content and create chunks
router.post('/fetch-and-chunk', fetchAndChunkWikiContent);

export default router;
