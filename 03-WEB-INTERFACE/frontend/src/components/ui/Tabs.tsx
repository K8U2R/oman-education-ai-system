import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  children?: (activeTab: string) => React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  className,
  children,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (onChange) {
      onChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const variants = {
    default: 'border-b-2 border-transparent hover:border-ide-accent/50',
    pills: 'rounded-md',
    underline: 'border-b-2 border-transparent hover:border-ide-accent/50',
  };

  const activeVariants = {
    default: 'border-ide-accent text-ide-accent',
    pills: 'bg-ide-accent/10 text-ide-accent',
    underline: 'border-ide-accent text-ide-accent',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex border-b border-ide-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={clsx(
              'px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors',
              variants[variant],
              activeTab === tab.id && activeVariants[variant],
              tab.disabled && 'opacity-50 cursor-not-allowed',
              !tab.disabled && 'hover:text-ide-accent'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {children && <div className="mt-4">{children(activeTab)}</div>}
    </div>
  );
};

export default Tabs;

