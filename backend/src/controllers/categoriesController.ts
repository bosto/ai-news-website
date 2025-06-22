import { Request, Response } from 'express';
import prisma from '@/utils/database';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    const categoriesWithCount = categories.map(category => ({
      ...category,
      articleCount: category._count.articles,
      _count: undefined,
    }));

    res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const categoryWithCount = {
      ...category,
      articleCount: category._count.articles,
      _count: undefined,
    };

    res.json({
      success: true,
      data: categoryWithCount,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
    });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const categoryWithCount = {
      ...category,
      articleCount: category._count.articles,
      _count: undefined,
    };

    res.json({
      success: true,
      data: categoryWithCount,
    });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
    });
  }
};

export const getCategoryArticles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          categoryId: id,
          status: 'PUBLISHED',
        },
        skip,
        take: limitNum,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.article.count({
        where: {
          categoryId: id,
          status: 'PUBLISHED',
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        category,
        articles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching category articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category articles',
    });
  }
};

export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          select: {
            viewCount: true,
            publishedAt: true,
            author: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const totalViews = category.articles.reduce((sum, article) => sum + article.viewCount, 0);
    const totalArticles = category.articles.length;
    const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

    // Calculate articles by author
    const authorCounts = category.articles.reduce((acc, article) => {
      const authorName = article.author.name;
      acc[authorName] = (acc[authorName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate articles by month (last 12 months)
    const monthlyStats = category.articles.reduce((acc, article) => {
      const month = article.publishedAt.toISOString().substring(0, 7); // YYYY-MM format
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        totalArticles,
        totalViews,
        avgViews,
        authorCounts,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category stats',
    });
  }
};