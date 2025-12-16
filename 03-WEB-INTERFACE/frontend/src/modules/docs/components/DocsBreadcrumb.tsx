import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface DocsBreadcrumbProps {
  items: BreadcrumbItem[];
}

const DocsBreadcrumb: React.FC<DocsBreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-ide-text-secondary mb-3 sm:mb-4 chat-text-secondary">
      <Link
        to="/docs"
        className="flex items-center gap-1 hover:text-ide-accent transition-colors chat-accent"
      >
        <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>الرئيسية</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-ide-accent transition-colors chat-accent"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ide-text chat-text-primary">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default DocsBreadcrumb;

