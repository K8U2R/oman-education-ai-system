import React, { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface DocsTOCProps {
  items: TOCItem[];
}

const DocsTOC: React.FC<DocsTOCProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map((item) => {
        const element = document.getElementById(item.id);
        return element ? { id: item.id, top: element.getBoundingClientRect().top } : null;
      }).filter(Boolean) as Array<{ id: string; top: number }>;

      const current = headings
        .filter((h) => h.top <= 100)
        .sort((a, b) => b.top - a.top)[0];

      if (current) {
        setActiveId(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-56 sm:w-64 md:w-72 bg-ide-surface border-r border-ide-border p-3 sm:p-4 chat-surface chat-scrollbar">
      <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 chat-text-primary">
        <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        جدول المحتويات
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`block w-full text-right text-xs sm:text-sm py-1 px-2 rounded transition-colors ${
              activeId === item.id
                ? 'bg-ide-accent text-white'
                : 'text-ide-text-secondary hover:bg-ide-border hover:text-ide-text chat-text-secondary'
            }`}
            style={{ paddingRight: `${item.level * 12}px` }}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DocsTOC;

