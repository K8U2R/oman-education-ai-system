import React from 'react';
import { BarChart3 } from 'lucide-react';

const UsageCharts: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-ide-accent" />
        <h2 className="text-xl font-semibold">رسوم الاستخدام</h2>
      </div>
      <div className="h-64 bg-ide-bg rounded-lg border border-ide-border flex items-center justify-center">
        <p className="text-ide-text-secondary">سيتم إضافة الرسوم البيانية هنا</p>
      </div>
    </div>
  );
};

export default UsageCharts;

