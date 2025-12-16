import React from 'react';
import { BarChart3 } from 'lucide-react';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data: _data, title, height = 200 }) => {
  return (
    <div>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div
        className="bg-ide-bg rounded-lg border border-ide-border flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-ide-text-secondary">
          سيتم إضافة الرسم البياني العمودي هنا (recharts)
        </p>
      </div>
    </div>
  );
};

export default BarChart;

