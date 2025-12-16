import React from 'react';
import { TrendingUp } from 'lucide-react';
import Progress from '@/components/ui/Progress';

const PerformanceMetrics: React.FC = () => {
  const metrics = [
    { label: 'سرعة البناء', value: 85, unit: '%' },
    { label: 'استخدام الذاكرة', value: 62, unit: '%' },
    { label: 'استخدام CPU', value: 45, unit: '%' },
    { label: 'سرعة التحميل', value: 92, unit: '%' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-ide-accent" />
        <h2 className="text-xl font-semibold">مقاييس الأداء</h2>
      </div>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{metric.label}</span>
              <span className="text-sm text-ide-text-secondary">
                {metric.value}{metric.unit}
              </span>
            </div>
            <Progress value={metric.value} variant="default" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;

