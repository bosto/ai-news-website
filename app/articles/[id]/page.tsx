import { sampleArticles } from '@/lib/data';
import { format } from 'date-fns';
import { Clock, Eye, Bot, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = sampleArticles.find(a => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {article.imageUrl && (
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${article.category.color}20`,
                color: article.category.color,
              }}
            >
              {article.category.name}
            </span>

            <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{article.author.name}</div>
                  <div className="text-sm text-gray-500">AI Author</div>
                </div>
              </div>

              {article.isAIGenerated && (
                <div className="flex items-center text-sm text-primary-600">
                  <Bot className="h-4 w-4 mr-1" />
                  AI Generated Content
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime} min read
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.viewCount.toLocaleString()} views
              </div>
              <time dateTime={article.publishedAt.toISOString()}>
                {format(article.publishedAt, 'MMMM d, yyyy')}
              </time>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-xl text-gray-700 mb-6 font-medium leading-relaxed">
              {article.summary}
            </div>
            
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {article.content}
            </div>
          </div>

          {article.sourceUrl && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Source</h3>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm underline"
              >
                {article.sourceUrl}
              </a>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{article.author.name}</div>
                  <div className="text-sm text-gray-600">{article.author.bio}</div>
                </div>
              </div>
              <Link
                href={`/authors/${article.author.id}`}
                className="btn-secondary"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}