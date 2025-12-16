import React from 'react';
import { FileText, TrendingUp, FileCheck, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';

const OfficeStats: React.FC = () => {
  const stats = [
    {
      label: 'ملفات Office',
      value: '24',
      change: '+5',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      label: 'تم التحليل',
      value: '18',
      change: '+3',
      icon: FileCheck,
      color: 'text-green-500',
    },
    {
      label: 'اختبارات منشأة',
      value: '12',
      change: '+2',
      icon: TrendingUp,
      color: 'text-yellow-500',
    },
    {
      label: 'ساعات العمل',
      value: '45',
      change: '+8',
      icon: Clock,
      color: 'text-purple-500',
    },
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-ide-accent" />
        <h2 className="text-lg font-semibold">إحصائيات Office</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="p-3 bg-ide-bg rounded-lg border border-ide-border">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-ide-text-secondary">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default OfficeStats;

