'use client';

import { newsCategories } from '@/lib/data';
import { NewsCategory } from '@/types';
import clsx from 'clsx';

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (category?: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onCategoryChange(undefined)}
        className={clsx(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          !selectedCategory
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All Categories
      </button>
      
      {newsCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.slug)}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category.slug
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          style={
            selectedCategory === category.slug
              ? { backgroundColor: category.color }
              : undefined
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}