import React, { useState } from 'react';
import { Check, Filter } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import NotificationList from './components/NotificationList';
import NotificationFilters from './components/NotificationFilters';

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">الإشعارات</h1>
            <p className="text-ide-text-secondary">إدارة وإعدادات الإشعارات</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              فلاتر
            </Button>
            <Button variant="outline">
              <Check className="w-4 h-4" />
              تحديد الكل كمقروء
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <NotificationFilters
              filter={filter}
              onFilterChange={setFilter}
            />
          </Card>
        )}

        {/* Notifications List */}
        <Card>
          <NotificationList filter={filter} />
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;

