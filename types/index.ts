export interface AIAuthor {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  specialization: string[];
  createdAt: Date;
  articleCount: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: AIAuthor;
  category: NewsCategory;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
  isAIGenerated: boolean;
  sourceUrl?: string;
  imageUrl?: string;
  viewCount: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  logoUrl?: string;
  isActive: boolean;
  lastScrapedAt?: Date;
}

export interface NewsSummary {
  id: string;
  originalArticleId: string;
  originalSource: NewsSource;
  summaryContent: string;
  keyPoints: string[];
  generatedAt: Date;
  aiModel: string;
}

export type NewsFilter = {
  category?: string;
  author?: string;
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  isAIGenerated?: boolean;
};