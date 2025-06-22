import { Request, Response } from 'express';
import prisma from '@/utils/database';
import { Prisma } from '@prisma/client';

export const getArticles = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      author,
      tags,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Prisma.ArticleWhereInput = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.category = {
        slug: category as string,
      };
    }

    if (author) {
      where.author = {
        id: author as string,
      };
    }

    if (tags) {
      const tagArray = (tags as string).split(',');
      where.tags = {
        hasSome: tagArray,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { summary: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const orderBy: Prisma.ArticleOrderByWithRelationInput = {
      [sortBy as string]: sortOrder as 'asc' | 'desc',
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              avatar: true,
              specialization: true,
            },
          },
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
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
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
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles',
    });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
            specialization: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            description: true,
          },
        },
        summaries: {
          include: {
            source: {
              select: {
                name: true,
                url: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    // Increment view count
    await prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article',
    });
  }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
            specialization: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            description: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    // Increment view count
    await prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article',
    });
  }
};

export const getRelatedArticles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    const article = await prisma.article.findUnique({
      where: { id },
      select: { categoryId: true, tags: true },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    const relatedArticles = await prisma.article.findMany({
      where: {
        AND: [
          { id: { not: id } },
          { status: 'PUBLISHED' },
          {
            OR: [
              { categoryId: article.categoryId },
              { tags: { hasSome: article.tags } },
            ],
          },
        ],
      },
      take: parseInt(limit as string),
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: relatedArticles,
    });
  } catch (error) {
    console.error('Error fetching related articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch related articles',
    });
  }
};

export const getTrendingArticles = async (req: Request, res: Response) => {
  try {
    const { limit = 10, days = 7 } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const trendingArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: daysAgo,
        },
      },
      take: parseInt(limit as string),
      orderBy: [
        { viewCount: 'desc' },
        { publishedAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: trendingArticles,
    });
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending articles',
    });
  }
};