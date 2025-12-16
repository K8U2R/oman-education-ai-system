import React from 'react';

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'snippets', label: 'مقتطفات' },
    { id: 'themes', label: 'ثيمات' },
    { id: 'tools', label: 'أدوات' },
    { id: 'languages', label: 'لغات' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-ide-accent text-white'
              : 'bg-ide-bg border border-ide-border text-ide-text hover:bg-ide-border'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;

