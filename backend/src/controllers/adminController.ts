import { Request, Response } from 'express';
import prisma from '@/utils/database';
import { AuthenticatedRequest } from '@/middleware/auth';
import { cronJobs } from '@/services/cronJobs';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalArticles,
      totalAuthors,
      totalCategories,
      totalViews,
      recentArticles,
      topCategories,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.aIAuthor.count(),
      prisma.category.count(),
      prisma.article.aggregate({
        _sum: { viewCount: true },
      }),
      prisma.article.findMany({
        take: 5,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { articles: true } },
        },
        orderBy: {
          articles: { _count: 'desc' },
        },
        take: 5,
      }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalArticles,
          totalAuthors,
          totalCategories,
          totalViews: totalViews._sum.viewCount || 0,
        },
        recentArticles,
        topCategories: topCategories.map(cat => ({
          ...cat,
          articleCount: cat._count.articles,
          _count: undefined,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });
  }
};

export const createArticle = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      summary,
      content,
      authorId,
      categoryId,
      tags,
      sourceUrl,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (!title || !summary || !content || !authorId || !categoryId) {
      return res.status(400).json({
        success: false,
        error: 'Title, summary, content, author, and category are required',
      });
    }

    // Create slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);

    // Calculate read time
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary,
        content,
        authorId,
        categoryId,
        tags: tags || [],
        publishedAt: new Date(),
        readTime,
        isAIGenerated: false,
        sourceUrl,
        imageUrl,
        status: 'PUBLISHED',
      },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create article',
    });
  }
};

export const updateArticle = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      content,
      authorId,
      categoryId,
      tags,
      sourceUrl,
      imageUrl,
      status,
    } = req.body;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    // Update slug if title changed
    let slug = article.slug;
    if (title && title !== article.title) {
      slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 50);
    }

    // Recalculate read time if content changed
    let readTime = article.readTime;
    if (content && content !== article.content) {
      const wordCount = content.split(/\s+/).length;
      readTime = Math.ceil(wordCount / 200);
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(summary && { summary }),
        ...(content && { content, readTime }),
        ...(authorId && { authorId }),
        ...(categoryId && { categoryId }),
        ...(tags && { tags }),
        ...(sourceUrl !== undefined && { sourceUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(status && { status }),
      },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle,
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update article',
    });
  }
};

export const deleteArticle = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    await prisma.article.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete article',
    });
  }
};

export const triggerNewsAggregation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Trigger news aggregation in the background
    cronJobs.triggerNewsAggregation().catch(error => {
      console.error('Error in triggered news aggregation:', error);
    });

    res.json({
      success: true,
      message: 'News aggregation triggered successfully',
    });
  } catch (error) {
    console.error('Error triggering news aggregation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger news aggregation',
    });
  }
};

export const getNewsSources = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sources = await prisma.newsSource.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: sources,
    });
  } catch (error) {
    console.error('Error fetching news sources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news sources',
    });
  }
};

export const updateNewsSource = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, rssUrl, logoUrl, isActive } = req.body;

    const source = await prisma.newsSource.findUnique({
      where: { id },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        error: 'News source not found',
      });
    }

    const updatedSource = await prisma.newsSource.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(rssUrl !== undefined && { rssUrl }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      success: true,
      message: 'News source updated successfully',
      data: updatedSource,
    });
  } catch (error) {
    console.error('Error updating news source:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update news source',
    });
  }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};