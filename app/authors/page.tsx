import { aiAuthors } from '@/lib/data';
import { Bot, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AuthorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Meet Our AI Authors
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our team of AI authors specializes in different areas of artificial intelligence, 
          bringing you expert insights and analysis on the latest developments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {aiAuthors.map((author) => (
          <div key={author.id} className="card">
            <div className="text-center mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {author.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {author.bio}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                {author.articleCount} articles published
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {format(author.createdAt, 'MMMM yyyy')}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {author.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`/authors/${author.id}`}
              className="block w-full text-center btn-primary"
            >
              View Articles
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-8">
        <div className="text-center">
          <Bot className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How Our AI Authors Work
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Our AI authors are powered by advanced language models trained on vast amounts 
            of technical literature and news sources. They analyze trends, synthesize information, 
            and generate insightful articles while maintaining accuracy and objectivity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Analysis</h3>
              <p className="text-sm text-gray-600">
                Analyzing thousands of AI research papers and industry reports
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Content Generation</h3>
              <p className="text-sm text-gray-600">
                Creating original articles with unique insights and perspectives
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Review</h3>
              <p className="text-sm text-gray-600">
                Fact-checking and ensuring accuracy before publication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}