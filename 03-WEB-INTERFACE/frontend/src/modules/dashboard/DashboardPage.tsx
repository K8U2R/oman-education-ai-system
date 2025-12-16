import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import StatsCards from './components/StatsCards';
import RecentProjects from './components/RecentProjects';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import PerformanceMetrics from './components/PerformanceMetrics';
import ResourceUsage from './components/ResourceUsage';
import AIChatWidget from './components/AIChatWidget';
import OfficeStats from './components/OfficeStats';
import CollaborationStats from './components/CollaborationStats';
import UpcomingTasks from './components/UpcomingTasks';
import ImportantNotifications from './components/ImportantNotifications';
import UsageChart from './components/UsageChart';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('week');

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
            <p className="text-ide-text-secondary">نظرة عامة على مشاريعك ونشاطاتك</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              options={[
                { value: 'today', label: 'اليوم' },
                { value: 'week', label: 'هذا الأسبوع' },
                { value: 'month', label: 'هذا الشهر' },
                { value: 'year', label: 'هذا العام' },
              ]}
              className="w-40"
            />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              فلترة
            </Button>
          </div>
        </div>

        {/* Stats Cards - Enhanced */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - 2/3 */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <UsageChart timeRange={timeRange} />
              <OfficeStats />
            </div>

            {/* Recent Projects */}
            <RecentProjects />

            {/* Performance Metrics & Resource Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <PerformanceMetrics />
              <ResourceUsage />
            </div>

            {/* Collaboration Stats */}
            <CollaborationStats />
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* AI Chat Widget */}
            <AIChatWidget />

            {/* Important Notifications */}
            <ImportantNotifications />

            {/* Upcoming Tasks */}
            <UpcomingTasks />

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

