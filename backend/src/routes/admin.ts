import express from 'express';
import {
  getDashboardStats,
  createArticle,
  updateArticle,
  deleteArticle,
  triggerNewsAggregation,
  getNewsSources,
  updateNewsSource,
  getUsers,
} from '@/controllers/adminController';
import { authenticate, authorize } from '@/middleware/auth';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Article management
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

// News aggregation
router.post('/news/aggregate', triggerNewsAggregation);

// News sources
router.get('/news-sources', getNewsSources);
router.put('/news-sources/:id', updateNewsSource);

// User management
router.get('/users', getUsers);

export default router;