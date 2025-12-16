import React from 'react';
import { Terminal, X, Plus } from 'lucide-react';
import Tabs, { Tab } from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';

interface TerminalTab {
  id: string;
  label: string;
  active: boolean;
}

interface TerminalTabsProps {
  tabs: TerminalTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
}

const TerminalTabs: React.FC<TerminalTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onNewTab,
}) => {
  const tabItems: Tab[] = tabs.map((tab) => ({
    id: tab.id,
    label: (
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4" />
        <span>{tab.label}</span>
        {onTabClose && tabs.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="p-0.5 rounded hover:bg-ide-border transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    ),
  }));

  return (
    <div className="flex items-center justify-between border-b border-ide-border">
      <Tabs
        tabs={tabItems}
        activeTab={activeTab}
        onChange={onTabChange}
        variant="underline"
      />
      {onNewTab && (
        <Button size="sm" variant="ghost" onClick={onNewTab}>
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default TerminalTabs;

