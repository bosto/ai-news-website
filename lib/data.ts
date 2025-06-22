import { AIAuthor, NewsArticle, NewsCategory, NewsSource } from '@/types';
import apiClient from './api';

export const aiAuthors: AIAuthor[] = [
  {
    id: '1',
    name: 'Claude AI Reporter',
    bio: 'Specialized in analyzing and reporting on machine learning breakthroughs and AI research developments.',
    avatar: '/avatars/claude.jpg',
    specialization: ['Machine Learning', 'AI Research', 'Neural Networks'],
    createdAt: new Date('2024-01-01'),
    articleCount: 25,
  },
  {
    id: '2',
    name: 'GPT News Writer',
    bio: 'Focuses on AI industry news, startup developments, and technology trends in artificial intelligence.',
    avatar: '/avatars/gpt.jpg',
    specialization: ['AI Industry', 'Startups', 'Technology Trends'],
    createdAt: new Date('2024-01-15'),
    articleCount: 18,
  },
  {
    id: '3',
    name: 'Gemini Analyst',
    bio: 'Expert in AI ethics, policy developments, and the societal impact of artificial intelligence.',
    avatar: '/avatars/gemini.jpg',
    specialization: ['AI Ethics', 'Policy', 'Social Impact'],
    createdAt: new Date('2024-02-01'),
    articleCount: 12,
  },
];

export const newsCategories: NewsCategory[] = [
  {
    id: '1',
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Latest developments in ML algorithms and applications',
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'AI Industry',
    slug: 'ai-industry',
    description: 'Business news and market developments in AI',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Research',
    slug: 'research',
    description: 'Academic research and scientific breakthroughs',
    color: '#8b5cf6',
  },
  {
    id: '4',
    name: 'Ethics & Policy',
    slug: 'ethics-policy',
    description: 'AI governance, regulation, and ethical considerations',
    color: '#f59e0b',
  },
  {
    id: '5',
    name: 'Applications',
    slug: 'applications',
    description: 'Real-world AI applications across industries',
    color: '#ef4444',
  },
];

export const newsSources: NewsSource[] = [
  {
    id: '1',
    name: 'OpenAI',
    url: 'https://openai.com/blog',
    logoUrl: '/logos/openai.png',
    isActive: true,
    lastScrapedAt: new Date(),
  },
  {
    id: '2',
    name: 'Google AI',
    url: 'https://ai.googleblog.com',
    logoUrl: '/logos/google-ai.png',
    isActive: true,
    lastScrapedAt: new Date(),
  },
  {
    id: '3',
    name: 'Anthropic',
    url: 'https://www.anthropic.com/news',
    logoUrl: '/logos/anthropic.png',
    isActive: true,
    lastScrapedAt: new Date(),
  },
  {
    id: '4',
    name: 'Meta AI',
    url: 'https://ai.meta.com/blog',
    logoUrl: '/logos/meta-ai.png',
    isActive: true,
    lastScrapedAt: new Date(),
  },
];

export const sampleArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'OpenAI Announces GPT-5: Revolutionary Language Model with Enhanced Reasoning',
    summary: 'OpenAI unveils GPT-5, featuring improved reasoning capabilities, better factual accuracy, and reduced hallucinations.',
    content: `OpenAI today announced the release of GPT-5, the latest iteration of their groundbreaking language model series. This new model represents a significant leap forward in artificial intelligence capabilities, particularly in reasoning and factual accuracy.

Key improvements in GPT-5 include:
- Enhanced logical reasoning and problem-solving abilities
- Significantly reduced hallucinations and improved factual accuracy
- Better understanding of context and nuanced conversations
- Improved performance on complex mathematical and scientific problems

The model has been trained on a more diverse and recent dataset, allowing it to provide more up-to-date information and better understand current events. OpenAI has also implemented new safety measures to ensure responsible AI deployment.

"GPT-5 represents a major milestone in our mission to ensure artificial general intelligence benefits all of humanity," said Sam Altman, CEO of OpenAI. "We're excited to see how developers and researchers will use these enhanced capabilities to solve real-world problems."

The model will be available through OpenAI's API starting next month, with pricing details to be announced soon.`,
    author: aiAuthors[1],
    category: newsCategories[0],
    tags: ['GPT-5', 'OpenAI', 'Language Models', 'AI Research'],
    publishedAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
    readTime: 3,
    isAIGenerated: true,
    imageUrl: '/images/gpt5-announcement.jpg',
    viewCount: 1250,
  },
  {
    id: '2',
    title: 'Google DeepMind Achieves Breakthrough in Protein Folding Prediction',
    summary: 'AlphaFold 3 demonstrates unprecedented accuracy in predicting protein structures, potentially revolutionizing drug discovery.',
    content: `Google DeepMind has announced a major breakthrough with AlphaFold 3, achieving remarkable accuracy in protein structure prediction that could transform drug discovery and biological research.

The new system demonstrates:
- 95% accuracy in protein structure prediction
- Ability to model protein-protein interactions
- Prediction of complex molecular assemblies
- Integration with experimental data for validation

This advancement builds upon the success of AlphaFold 2, which already made over 200 million protein structures freely available to researchers worldwide. The improved accuracy of AlphaFold 3 opens new possibilities for understanding biological processes and developing targeted therapies.

"This breakthrough represents a quantum leap in our ability to understand the molecular machinery of life," said Dr. Demis Hassabis, CEO of Google DeepMind. "We expect this to accelerate drug discovery and help address some of humanity's most pressing health challenges."

The research has been published in Nature and the updated AlphaFold database will be made publicly available to the scientific community.`,
    author: aiAuthors[2],
    category: newsCategories[2],
    tags: ['AlphaFold', 'Google DeepMind', 'Protein Folding', 'Drug Discovery'],
    publishedAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-19'),
    readTime: 4,
    isAIGenerated: true,
    imageUrl: '/images/alphafold3.jpg',
    viewCount: 980,
  },
  {
    id: '3',
    title: 'EU Proposes New AI Regulation Framework for Large Language Models',
    summary: 'European Union introduces comprehensive regulations for AI systems, focusing on transparency and accountability.',
    content: `The European Union has proposed a comprehensive regulatory framework specifically targeting large language models and generative AI systems, marking a significant step in AI governance.

Key provisions include:
- Mandatory disclosure of training data sources
- Requirements for AI-generated content labeling
- Risk assessment protocols for high-impact AI systems
- Transparency obligations for AI model developers

The proposed regulations aim to balance innovation with protection of fundamental rights and democratic values. Companies developing or deploying large language models in the EU will need to comply with strict transparency and accountability requirements.

"This framework ensures that AI development proceeds in a way that respects human rights and democratic principles," said European Commissioner for Internal Market Thierry Breton. "We want to foster innovation while ensuring AI systems are trustworthy and aligned with European values."

The proposal will undergo review by EU member states and the European Parliament, with implementation expected by 2025. Major AI companies including OpenAI, Google, and Microsoft have expressed willingness to work with regulators to ensure compliance.`,
    author: aiAuthors[2],
    category: newsCategories[3],
    tags: ['EU Regulation', 'AI Policy', 'LLM Governance', 'AI Ethics'],
    publishedAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
    readTime: 5,
    isAIGenerated: true,
    imageUrl: '/images/eu-ai-regulation.jpg',
    viewCount: 756,
  },
];

// API-based data fetching functions
export async function getLatestArticles(limit: number = 10): Promise<NewsArticle[]> {
  try {
    const response = await apiClient.getArticles({ limit, sortBy: 'publishedAt', sortOrder: 'desc' });
    return response.data?.articles || sampleArticles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    // Fallback to sample data
    return sampleArticles
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }
}

export async function getArticlesByCategory(categorySlug: string): Promise<NewsArticle[]> {
  try {
    const response = await apiClient.getArticles({ category: categorySlug });
    return response.data?.articles || [];
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    // Fallback to sample data
    return sampleArticles.filter(article => article.category.slug === categorySlug);
  }
}

export async function getArticlesByAuthor(authorId: string): Promise<NewsArticle[]> {
  try {
    const response = await apiClient.getAuthorArticles(authorId);
    return response.data?.articles || [];
  } catch (error) {
    console.error('Error fetching articles by author:', error);
    // Fallback to sample data
    return sampleArticles.filter(article => article.author.id === authorId);
  }
}

export async function searchArticles(query: string): Promise<NewsArticle[]> {
  try {
    const response = await apiClient.getArticles({ search: query });
    return response.data?.articles || [];
  } catch (error) {
    console.error('Error searching articles:', error);
    // Fallback to sample data
    const lowercaseQuery = query.toLowerCase();
    return sampleArticles.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// Legacy sync functions (for backward compatibility)
export function getLatestArticlesSync(limit: number = 10): NewsArticle[] {
  return sampleArticles
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

export function getArticlesByCategorySync(categorySlug: string): NewsArticle[] {
  return sampleArticles.filter(article => article.category.slug === categorySlug);
}

export function getArticlesByAuthorSync(authorId: string): NewsArticle[] {
  return sampleArticles.filter(article => article.author.id === authorId);
}

export function searchArticlesSync(query: string): NewsArticle[] {
  const lowercaseQuery = query.toLowerCase();
  return sampleArticles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.summary.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}