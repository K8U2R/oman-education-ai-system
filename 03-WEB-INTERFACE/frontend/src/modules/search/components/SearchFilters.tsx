import React from 'react';
import { Filter } from 'lucide-react';
import Checkbox from '@/components/ui/Checkbox';

export interface SearchFilter {
  type: 'file' | 'folder' | 'code' | 'text';
  label: string;
}

interface SearchFiltersProps {
  filters: SearchFilter[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
}) => {
  const handleToggle = (type: string) => {
    if (selectedFilters.includes(type)) {
      onFilterChange(selectedFilters.filter((f) => f !== type));
    } else {
      onFilterChange([...selectedFilters, type]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-ide-accent" />
        <h3 className="text-sm font-semibold">الفلاتر</h3>
      </div>
      {filters.map((filter) => (
        <Checkbox
          key={filter.type}
          label={filter.label}
          checked={selectedFilters.includes(filter.type)}
          onChange={() => handleToggle(filter.type)}
        />
      ))}
    </div>
  );
};

export default SearchFilters;

