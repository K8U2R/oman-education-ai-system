import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';

interface DocsSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const DocsSearch: React.FC<DocsSearchProps> = ({
  onSearch,
  placeholder = 'ابحث في التوثيق...',
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
    </div>
  );
};

export default DocsSearch;

