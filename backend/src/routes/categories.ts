import express from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryArticles,
  getCategoryStats,
} from '@/controllers/categoriesController';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', getCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', getCategoryById);

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', getCategoryBySlug);

// GET /api/categories/:id/articles - Get category's articles
router.get('/:id/articles', getCategoryArticles);

// GET /api/categories/:id/stats - Get category statistics
router.get('/:id/stats', getCategoryStats);

export default router;