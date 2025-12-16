import { SearchResult } from '../components/SearchResults';

class SearchService {
  async search(query: string, filters: string[] = []): Promise<SearchResult[]> {
    // filters will be used when implementing advanced search
    void filters;
    // TODO: Replace with actual API call
    // Mock data for now
    return [
      {
        id: '1',
        type: 'file',
        title: 'App.tsx',
        path: '/src/App.tsx',
        snippet: `// ${query} found in this file`,
        matches: 1,
      },
      {
        id: '2',
        type: 'code',
        title: 'useAuth hook',
        path: '/src/hooks/useAuth.ts',
        snippet: `export function useAuth() { ${query} }`,
        matches: 1,
      },
    ];
  }

  async searchInFile(_filePath: string, _query: string): Promise<SearchResult[]> {
    // TODO: Replace with actual API call
    return [];
  }

  saveToHistory(query: string): void {
    const history = this.getHistory();
    const newHistory = [query, ...history.filter((q) => q !== query)].slice(0, 10);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  }

  getHistory(): string[] {
    try {
      return JSON.parse(localStorage.getItem('search_history') || '[]');
    } catch {
      return [];
    }
  }

  clearHistory(): void {
    localStorage.removeItem('search_history');
  }
}

export const searchService = new SearchService();

