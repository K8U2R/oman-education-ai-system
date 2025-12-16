import React from 'react';
import { FileText, GitBranch, Puzzle, Settings as SettingsIcon } from 'lucide-react';
import { useIDE } from '@/core/state/useIDE';

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useIDE();

  if (!sidebarOpen) return null;

  const items = [
    { icon: FileText, label: 'الملفات', id: 'files' },
    { icon: GitBranch, label: 'Git', id: 'git' },
    { icon: Puzzle, label: 'الإضافات', id: 'extensions' },
    { icon: SettingsIcon, label: 'الإعدادات', id: 'settings' },
  ];

  return (
    <aside className="w-16 bg-ide-surface border-r border-ide-border flex flex-col items-center py-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className="p-3 rounded-md hover:bg-ide-border transition-colors group relative"
            aria-label={item.label}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
            <span className="absolute right-full mr-2 px-2 py-1 bg-ide-surface border border-ide-border rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;

