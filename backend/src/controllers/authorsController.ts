import { Request, Response } from 'express';
import prisma from '@/utils/database';

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [authors, total] = await Promise.all([
      prisma.aIAuthor.findMany({
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { articles: true },
          },
        },
      }),
      prisma.aIAuthor.count(),
    ]);

    // Transform data to include article count
    const authorsWithCount = authors.map(author => ({
      ...author,
      articleCount: author._count.articles,
      _count: undefined,
    }));

    res.json({
      success: true,
      data: {
        authors: authorsWithCount,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch authors',
    });
  }
};

export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await prisma.aIAuthor.findUnique({
      where: { id },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          take: 10,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found',
      });
    }

    const authorWithCount = {
      ...author,
      articleCount: author._count.articles,
      _count: undefined,
    };

    res.json({
      success: true,
      data: authorWithCount,
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch author',
    });
  }
};

export const getAuthorArticles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Check if author exists
    const author = await prisma.aIAuthor.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found',
      });
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          authorId: id,
          status: 'PUBLISHED',
        },
        skip,
        take: limitNum,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
        },
      }),
      prisma.article.count({
        where: {
          authorId: id,
          status: 'PUBLISHED',
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        author,
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
    console.error('Error fetching author articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch author articles',
    });
  }
};

export const getAuthorStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await prisma.aIAuthor.findUnique({
      where: { id },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          select: {
            viewCount: true,
            publishedAt: true,
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found',
      });
    }

    const totalViews = author.articles.reduce((sum, article) => sum + article.viewCount, 0);
    const totalArticles = author.articles.length;
    const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

    // Calculate articles by category
    const categoryCounts = author.articles.reduce((acc, article) => {
      const categoryName = article.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate articles by month (last 12 months)
    const monthlyStats = author.articles.reduce((acc, article) => {
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
        categoryCounts,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error('Error fetching author stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch author stats',
    });
  }
};