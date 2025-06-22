import express from 'express';
import {
  getAuthors,
  getAuthorById,
  getAuthorArticles,
  getAuthorStats,
} from '@/controllers/authorsController';

const router = express.Router();

// GET /api/authors - Get all authors with pagination
router.get('/', getAuthors);

// GET /api/authors/:id - Get author by ID
router.get('/:id', getAuthorById);

// GET /api/authors/:id/articles - Get author's articles
router.get('/:id/articles', getAuthorArticles);

// GET /api/authors/:id/stats - Get author statistics
router.get('/:id/stats', getAuthorStats);

export default router;