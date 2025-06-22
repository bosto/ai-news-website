import express from 'express';
import {
  getArticles,
  getArticleById,
  getArticleBySlug,
  getRelatedArticles,
  getTrendingArticles,
} from '@/controllers/articlesController';

const router = express.Router();

// GET /api/articles - Get all articles with pagination and filtering
router.get('/', getArticles);

// GET /api/articles/trending - Get trending articles
router.get('/trending', getTrendingArticles);

// GET /api/articles/:id - Get article by ID
router.get('/:id', getArticleById);

// GET /api/articles/slug/:slug - Get article by slug
router.get('/slug/:slug', getArticleBySlug);

// GET /api/articles/:id/related - Get related articles
router.get('/:id/related', getRelatedArticles);

export default router;