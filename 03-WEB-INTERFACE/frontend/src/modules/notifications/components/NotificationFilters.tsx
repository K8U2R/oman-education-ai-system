import React from 'react';
import Tabs, { Tab } from '@/components/ui/Tabs';

interface NotificationFiltersProps {
  filter: 'all' | 'unread' | 'read';
  onFilterChange: (filter: 'all' | 'unread' | 'read') => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  onFilterChange,
}) => {
  const tabs: Tab[] = [
    { id: 'all', label: 'الكل' },
    { id: 'unread', label: 'غير مقروء' },
    { id: 'read', label: 'مقروء' },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTab={filter}
      onChange={(tabId) => onFilterChange(tabId as 'all' | 'unread' | 'read')}
    />
  );
};

export default NotificationFilters;

