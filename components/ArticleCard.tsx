import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, Eye, Bot } from 'lucide-react';
import { NewsArticle } from '@/types';

interface ArticleCardProps {
  article: NewsArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      {article.imageUrl && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${article.category.color}20`,
              color: article.category.color,
            }}
          >
            {article.category.name}
          </span>
          
          {article.isAIGenerated && (
            <div className="flex items-center text-xs text-primary-600">
              <Bot className="h-3 w-3 mr-1" />
              AI Generated
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link href={`/articles/${article.id}`} className="hover:text-primary-600 transition-colors">
            {article.title}
          </Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-2">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">{article.author.name}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime} min read
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {article.viewCount.toLocaleString()}
            </div>
            <time dateTime={article.publishedAt.toISOString()}>
              {format(article.publishedAt, 'MMM d, yyyy')}
            </time>
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}