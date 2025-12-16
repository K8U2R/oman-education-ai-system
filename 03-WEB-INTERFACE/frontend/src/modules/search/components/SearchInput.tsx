import React, { useState } from 'react';
import { Search, X, Command } from 'lucide-react';
import Input from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showShortcut?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'ابحث...',
  showShortcut = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          searchQuery && (
            <button
              onClick={handleClear}
              className="p-1 rounded hover:bg-ide-border transition-colors"
              aria-label="مسح"
            >
              <X className="w-4 h-4" />
            </button>
          )
        }
      />
      {showShortcut && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-ide-text-secondary">
          <kbd className="px-1.5 py-0.5 bg-ide-bg border border-ide-border rounded">
            <Command className="w-3 h-3 inline" />
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-ide-bg border border-ide-border rounded">K</kbd>
        </div>
      )}
    </div>
  );
};

export default SearchInput;

