import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Book, FileText } from 'lucide-react';

interface DocsSection {
  id: string;
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: DocsSection[];
}

interface DocsSidebarProps {
  sections: DocsSection[];
}

const DocsSidebar: React.FC<DocsSidebarProps> = ({ sections }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const renderSection = (section: DocsSection, level: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const hasChildren = section.children && section.children.length > 0;
    const isActive = location.pathname === `/docs/${section.path || section.id}`;

    return (
      <div key={section.id}>
        <div
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors ${
            isActive
              ? 'bg-ide-accent text-white'
              : 'hover:bg-ide-border text-ide-text chat-text-primary'
          }`}
          style={{ paddingRight: `${level * 12 + 8}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleSection(section.id)}
              className="p-1 rounded hover:bg-ide-accent/20"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          ) : (
            <span className="w-3.5 sm:w-4" />
          )}
          {section.icon || <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          {section.path ? (
            <Link
              to={`/docs/${section.path}`}
              className="flex-1 text-xs sm:text-sm font-medium"
            >
              {section.title}
            </Link>
          ) : (
            <span className="flex-1 text-xs sm:text-sm font-medium">{section.title}</span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mr-4">
            {section.children?.map((child) => renderSection(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-56 sm:w-64 md:w-72 bg-ide-surface border-l border-ide-border p-3 sm:p-4 overflow-y-auto chat-surface chat-scrollbar">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Book className="w-4 h-4 sm:w-5 sm:h-5 text-ide-accent chat-accent" />
        <h2 className="text-base sm:text-lg font-semibold chat-text-primary">التوثيق</h2>
      </div>
      <nav className="space-y-1">
        {sections.map((section) => renderSection(section))}
      </nav>
    </aside>
  );
};

export default DocsSidebar;

