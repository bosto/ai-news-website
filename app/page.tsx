'use client';

import { useState, useEffect } from 'react';
import { getLatestArticlesSync, getArticlesByCategorySync } from '@/lib/data';
import { NewsArticle } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import { TrendingUp, Sparkles, Users, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const fetchedArticles = selectedCategory 
        ? getArticlesByCategorySync(selectedCategory)
        : getLatestArticlesSync();
      setArticles(fetchedArticles);
      setLoading(false);
    };

    fetchArticles();
  }, [selectedCategory]);

  const handleCategoryChange = (category?: string) => {
    setSelectedCategory(category);
  };

  const stats = [
    { name: 'AI Articles Published', value: '1,200+', icon: BookOpen },
    { name: 'AI Authors', value: '25', icon: Users },
    { name: 'Monthly Readers', value: '150K+', icon: TrendingUp },
    { name: 'AI Companies Covered', value: '50+', icon: Sparkles },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Latest AI News by AI Authors
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated with cutting-edge AI developments, research breakthroughs, and industry insights 
          written by AI authors and summarized from leading AI companies worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.name}</div>
            </div>
          );
        })}
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="article-card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category or check back later for new content.
              </p>
            </div>
          )}
        </>
      )}

      <div className="mt-12 text-center">
        <button className="btn-primary">
          Load More Articles
        </button>
      </div>
    </div>
  );
}