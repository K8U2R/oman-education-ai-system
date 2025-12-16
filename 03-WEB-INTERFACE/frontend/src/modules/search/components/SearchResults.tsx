import React from 'react';
import { FileText, Code, Folder, Search } from 'lucide-react';
import Card from '@/components/ui/Card';

export interface SearchResult {
  id: string;
  type: 'file' | 'folder' | 'code' | 'text';
  title: string;
  path: string;
  snippet?: string;
  matches?: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onSelect?: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query: _query,
  onSelect,
}) => {
  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'folder':
        return <Folder className="w-4 h-4" />;
      case 'code':
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 text-ide-text-secondary mx-auto mb-4" />
        <p className="text-ide-text-secondary">لا توجد نتائج</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result) => (
        <Card
          key={result.id}
          variant="elevated"
          className="cursor-pointer hover:border-ide-accent/50 transition-colors"
          onClick={() => onSelect?.(result)}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">{getIcon(result.type)}</div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">{result.title}</h3>
              <p className="text-xs text-ide-text-secondary mb-2">{result.path}</p>
              {result.snippet && (
                <p className="text-sm text-ide-text-secondary line-clamp-2">
                  {result.snippet}
                </p>
              )}
              {result.matches && (
                <span className="text-xs text-ide-accent">
                  {result.matches} تطابق
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;

