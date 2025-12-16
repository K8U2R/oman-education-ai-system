import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Clock, FileText, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import { OfficeAppType } from '../OfficeAssistantPage';
import { officeService } from '../services/office-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { OfficeAnalytics } from '../types/analytics';

interface OfficeAnalyticsProps {
  appType: OfficeAppType;
}

const OfficeAnalytics: React.FC<OfficeAnalyticsProps> = ({ appType }) => {
  const [analytics, setAnalytics] = useState<OfficeAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await officeService.getAnalytics(appType);
        setAnalytics(data);
      } catch (error) {
        handleError(error, 'خطأ في تحميل التحليلات');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [appType, handleError]);

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-ide-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <p className="text-center py-12 text-ide-text-secondary">
          لا توجد بيانات تحليلية متاحة
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {analytics.usage.totalFiles.toLocaleString()}
          </h3>
          <p className="text-sm text-ide-text-secondary">إجمالي الملفات</p>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {analytics.usage.totalEdits.toLocaleString()}
          </h3>
          <p className="text-sm text-ide-text-secondary">إجمالي التعديلات</p>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {analytics.performance.averageProcessingTime.toFixed(1)}s
          </h3>
          <p className="text-sm text-ide-text-secondary">متوسط وقت المعالجة</p>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {analytics.performance.successRate}%
          </h3>
          <p className="text-sm text-ide-text-secondary">معدل النجاح</p>
        </Card>
      </div>

      {/* Insights */}
      {analytics.insights && analytics.insights.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">رؤى وتحليلات</h3>
          <div className="space-y-3">
            {analytics.insights.map((insight: string, index: number) => (
              <div
                key={index}
                className="p-4 bg-ide-bg border border-ide-border rounded-md"
              >
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default OfficeAnalytics;

