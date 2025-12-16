import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useIDE } from '@/core/state/useIDE';

interface SearchResult {
  file: string;
  line: number;
  content: string;
  match: string;
}

interface SearchPanelProps {
  query?: string;
  onResultClick?: (file: string, line: number) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ query: initialQuery, onResultClick }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { openFile, setActiveFile } = useIDE();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setResults([
        {
          file: 'src/App.tsx',
          line: 10,
          content: 'function App() {',
          match: 'App',
        },
        {
          file: 'src/main.tsx',
          line: 5,
          content: 'import App from "./App"',
          match: 'App',
        },
      ]);
      setIsSearching(false);
    }, 500);
  };

  const handleResultClick = (file: string, line: number) => {
    openFile(file);
    setActiveFile(file);
    onResultClick?.(file, line);
  };

  return (
    <div className="p-4">
      {!initialQuery && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ابحث في الملفات..."
            className="flex-1 px-2 py-1.5 text-xs rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-1 focus:ring-ide-accent"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-1.5 text-xs bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors"
          >
            بحث
          </button>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {isSearching ? (
          <p className="text-xs text-ide-text-secondary text-center py-4">جاري البحث...</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-ide-text-secondary text-center py-4">لا توجد نتائج</p>
        ) : (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                onClick={() => handleResultClick(result.file, result.line)}
                className="p-2 rounded-md border border-ide-border bg-ide-bg hover:bg-ide-border cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3 h-3 text-ide-accent" />
                  <span className="text-xs font-medium">{result.file}</span>
                  <span className="text-xs text-ide-text-secondary">:{result.line}</span>
                </div>
                <p className="text-xs text-ide-text-secondary font-mono">{result.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;

