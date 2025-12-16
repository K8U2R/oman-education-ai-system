import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';

interface PieChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data: _data, title, height = 200 }) => {
  return (
    <div>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div
        className="bg-ide-bg rounded-lg border border-ide-border flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-ide-text-secondary">
          سيتم إضافة الرسم البياني الدائري هنا (recharts)
        </p>
      </div>
    </div>
  );
};

export default PieChart;

