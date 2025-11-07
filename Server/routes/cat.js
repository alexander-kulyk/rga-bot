//core
import express from 'express';
//controllers
import {
  getCats,
  getCatById,
  createCat,
  updateCat,
  deleteCat,
} from '../controllers/catController.js';

const router = express.Router();

// GET /api/cats - Get all cats
router.get('/', getCats);

// GET /api/cats/:id - Get a single cat by ID
router.get('/:id', getCatById);

// POST /api/cats - Create a new cat
router.post('/', createCat);

// PUT /api/cats/:id - Update a cat
router.put('/:id', updateCat);

// DELETE /api/cats/:id - Delete a cat
router.delete('/:id', deleteCat);

export default router;
