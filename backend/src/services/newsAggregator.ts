import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { OpenAI } from 'openai';
import prisma from '@/utils/database';

export interface ExternalArticle {
  title: string;
  content: string;
  url: string;
  publishedAt: Date;
  sourceName: string;
  sourceId: string;
}

export class NewsAggregator {
  private rssParser: Parser;
  private openai: OpenAI;

  constructor() {
    this.rssParser = new Parser();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async aggregateNews(): Promise<void> {
    try {
      console.log('Starting news aggregation...');
      
      const sources = await prisma.newsSource.findMany({
        where: { isActive: true },
      });

      for (const source of sources) {
        try {
          console.log(`Processing source: ${source.name}`);
          
          let articles: ExternalArticle[] = [];
          
          if (source.rssUrl) {
            articles = await this.fetchFromRSS(source);
          } else {
            articles = await this.scrapeWebsite(source);
          }

          for (const article of articles) {
            await this.processArticle(article);
          }

          // Update last scraped time
          await prisma.newsSource.update({
            where: { id: source.id },
            data: { lastScrapedAt: new Date() },
          });

        } catch (error) {
          console.error(`Error processing source ${source.name}:`, error);
        }
      }

      console.log('News aggregation completed');
    } catch (error) {
      console.error('Error in news aggregation:', error);
      throw error;
    }
  }

  private async fetchFromRSS(source: any): Promise<ExternalArticle[]> {
    try {
      const feed = await this.rssParser.parseURL(source.rssUrl);
      const articles: ExternalArticle[] = [];

      for (const item of feed.items.slice(0, 10)) { // Limit to 10 latest
        if (item.title && item.link && item.pubDate) {
          // Check if we already processed this article
          const existing = await prisma.externalArticle.findUnique({
            where: { url: item.link },
          });

          if (!existing) {
            const content = await this.extractContent(item.link);
            
            articles.push({
              title: item.title,
              content: content || item.contentSnippet || item.content || '',
              url: item.link,
              publishedAt: new Date(item.pubDate),
              sourceName: source.name,
              sourceId: source.id,
            });
          }
        }
      }

      return articles;
    } catch (error) {
      console.error(`Error fetching RSS for ${source.name}:`, error);
      return [];
    }
  }

  private async scrapeWebsite(source: any): Promise<ExternalArticle[]> {
    try {
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Aggregator/1.0)',
        },
      });

      const $ = cheerio.load(response.data);
      const articles: ExternalArticle[] = [];

      // This is a simplified scraper - in production, you'd need specific selectors for each site
      $('article, .post, .news-item').each((i, element) => {
        if (i >= 5) return false; // Limit to 5 articles

        const title = $(element).find('h1, h2, h3, .title').first().text().trim();
        const link = $(element).find('a').first().attr('href');
        const content = $(element).find('p, .content, .summary').first().text().trim();

        if (title && link) {
          const fullUrl = new URL(link, source.url).toString();
          
          articles.push({
            title,
            content: content || title,
            url: fullUrl,
            publishedAt: new Date(),
            sourceName: source.name,
            sourceId: source.id,
          });
        }
      });

      return articles;
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }
  }

  private async extractContent(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Aggregator/1.0)',
        },
      });

      const $ = cheerio.load(response.data);
      
      // Remove unwanted elements
      $('script, style, nav, header, footer, .sidebar, .advertisement').remove();
      
      // Extract main content
      const content = $('article, .content, .post-content, main').first().text().trim();
      
      return content.substring(0, 5000); // Limit content length
    } catch (error) {
      console.error(`Error extracting content from ${url}:`, error);
      return '';
    }
  }

  private async processArticle(article: ExternalArticle): Promise<void> {
    try {
      // Store the external article
      const externalArticle = await prisma.externalArticle.create({
        data: {
          title: article.title,
          content: article.content,
          url: article.url,
          sourceId: article.sourceId,
          publishedAt: article.publishedAt,
        },
      });

      // Generate AI summary
      const summary = await this.generateSummary(article);
      const keyPoints = await this.extractKeyPoints(article);
      const categorySlug = await this.categorizeArticle(article);

      // Find appropriate AI author
      const author = await this.selectAIAuthor(categorySlug);
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!author || !category) {
        console.error('Could not find author or category for article');
        return;
      }

      // Create article slug
      const slug = this.createSlug(article.title);
      
      // Create the main article
      const createdArticle = await prisma.article.create({
        data: {
          title: article.title,
          slug,
          summary,
          content: await this.generateFullContent(article, summary, keyPoints),
          authorId: author.id,
          categoryId: category.id,
          tags: await this.extractTags(article),
          publishedAt: article.publishedAt,
          readTime: this.calculateReadTime(article.content),
          isAIGenerated: true,
          sourceUrl: article.url,
        },
      });

      // Create news summary
      await prisma.newsSummary.create({
        data: {
          originalArticleId: createdArticle.id,
          sourceId: article.sourceId,
          summaryContent: summary,
          keyPoints,
          aiModel: 'gpt-3.5-turbo',
        },
      });

      // Mark external article as processed
      await prisma.externalArticle.update({
        where: { id: externalArticle.id },
        data: { processed: true },
      });

      console.log(`Created article: ${article.title}`);
    } catch (error) {
      console.error('Error processing article:', error);
    }
  }

  private async generateSummary(article: ExternalArticle): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI news summarizer. Create concise, informative summaries of AI-related news articles in 2-3 sentences.',
          },
          {
            role: 'user',
            content: `Summarize this article:\n\nTitle: ${article.title}\n\nContent: ${article.content.substring(0, 2000)}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || article.content.substring(0, 200);
    } catch (error) {
      console.error('Error generating summary:', error);
      return article.content.substring(0, 200);
    }
  }

  private async extractKeyPoints(article: ExternalArticle): Promise<string[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Extract 3-5 key points from the article. Return as a JSON array of strings.',
          },
          {
            role: 'user',
            content: `Extract key points from:\n\nTitle: ${article.title}\n\nContent: ${article.content.substring(0, 1500)}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const result = completion.choices[0]?.message?.content;
      if (result) {
        try {
          return JSON.parse(result);
        } catch {
          return result.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
        }
      }
      
      return ['Key AI development', 'Industry impact', 'Technical advancement'];
    } catch (error) {
      console.error('Error extracting key points:', error);
      return ['Key AI development', 'Industry impact', 'Technical advancement'];
    }
  }

  private async categorizeArticle(article: ExternalArticle): Promise<string> {
    const content = (article.title + ' ' + article.content).toLowerCase();
    
    if (content.includes('research') || content.includes('paper') || content.includes('study')) {
      return 'research';
    } else if (content.includes('ethics') || content.includes('policy') || content.includes('regulation')) {
      return 'ethics-policy';
    } else if (content.includes('industry') || content.includes('business') || content.includes('market')) {
      return 'ai-industry';
    } else if (content.includes('application') || content.includes('deployment') || content.includes('use case')) {
      return 'applications';
    } else {
      return 'machine-learning';
    }
  }

  private async selectAIAuthor(categorySlug: string): Promise<any> {
    const authors = await prisma.aIAuthor.findMany();
    
    // Simple logic to select author based on category
    const authorMap: Record<string, string> = {
      'machine-learning': 'Claude AI Reporter',
      'ai-industry': 'GPT News Writer',
      'research': 'Claude AI Reporter',
      'ethics-policy': 'Gemini Analyst',
      'applications': 'GPT News Writer',
    };

    const preferredAuthorName = authorMap[categorySlug] || 'Claude AI Reporter';
    return authors.find(author => author.name === preferredAuthorName) || authors[0];
  }

  private async generateFullContent(
    article: ExternalArticle, 
    summary: string, 
    keyPoints: string[]
  ): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI journalist. Write a comprehensive news article based on the provided information. Make it engaging and informative.',
          },
          {
            role: 'user',
            content: `Write a news article based on:\n\nTitle: ${article.title}\n\nSummary: ${summary}\n\nKey Points: ${keyPoints.join(', ')}\n\nOriginal Content: ${article.content.substring(0, 1500)}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || article.content;
    } catch (error) {
      console.error('Error generating full content:', error);
      return article.content;
    }
  }

  private async extractTags(article: ExternalArticle): Promise<string[]> {
    const content = (article.title + ' ' + article.content).toLowerCase();
    const commonTags = [
      'AI', 'Machine Learning', 'Deep Learning', 'Neural Networks', 
      'OpenAI', 'Google', 'Microsoft', 'Meta', 'Research', 'Technology'
    ];

    return commonTags.filter(tag => 
      content.includes(tag.toLowerCase())
    ).slice(0, 5);
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}