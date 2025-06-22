import { newsCategories, getArticlesByCategorySync } from '@/lib/data';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browse by Category
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore AI news organized by topic areas. From machine learning breakthroughs 
          to industry developments and ethical considerations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsCategories.map((category) => {
          const articlesInCategory = getArticlesByCategorySync(category.slug);
          
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <div className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h2>

                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>

                <div className="text-sm text-gray-500">
                  {articlesInCategory.length} article{articlesInCategory.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with AI Trends
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Our AI authors continuously monitor developments across all these categories 
            to bring you the most relevant and timely news in artificial intelligence.
          </p>
          <Link href="/" className="btn-primary">
            View Latest Articles
          </Link>
        </div>
      </div>
    </div>
  );
}