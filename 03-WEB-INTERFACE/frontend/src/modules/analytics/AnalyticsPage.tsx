import React from 'react';
import Card from '@/components/ui/Card';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import UsageCharts from './components/UsageCharts';
import PerformanceMetrics from './components/PerformanceMetrics';
import ProjectAnalytics from './components/ProjectAnalytics';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">التحليلات والإحصائيات</h1>
          <p className="text-ide-text-secondary">تتبع أداء مشاريعك واستخدامك</p>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Usage Charts */}
        <Card>
          <UsageCharts />
        </Card>

        {/* Performance Metrics */}
        <Card>
          <PerformanceMetrics />
        </Card>

        {/* Project Analytics */}
        <Card>
          <ProjectAnalytics />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;

