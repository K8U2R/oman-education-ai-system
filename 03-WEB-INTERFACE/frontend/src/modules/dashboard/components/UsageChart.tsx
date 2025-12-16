import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import Card from '@/components/ui/Card';
import LineChart from './Charts/LineChart';

interface UsageChartProps {
  timeRange: 'today' | 'week' | 'month' | 'year';
}

const UsageChart: React.FC<UsageChartProps> = ({ timeRange: _timeRange }) => {
  // Mock data - سيتم استبدالها ببيانات حقيقية
  const chartData = {
    labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    datasets: [
      {
        label: 'استخدام AI',
        data: [12, 19, 15, 25, 22, 18, 24],
        color: 'rgb(66, 133, 244)',
      },
      {
        label: 'ساعات البرمجة',
        data: [8, 10, 12, 9, 11, 13, 10],
        color: 'rgb(52, 211, 153)',
      },
    ],
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-ide-accent" />
          <h2 className="text-lg font-semibold">مخطط الاستخدام</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-ide-text-secondary">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>+23% من الفترة السابقة</span>
        </div>
      </div>
      <div className="h-64">
        <LineChart data={chartData} />
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-ide-border">
        {chartData.datasets.map((dataset, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dataset.color }}
            />
            <span className="text-sm text-ide-text-secondary">{dataset.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UsageChart;

