import React from 'react';
import { TrendingUp, Cpu, HardDrive, Activity, Zap, Network, Database } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const PerformanceMetrics: React.FC = () => {
  const metrics = [
    {
      label: 'استخدام CPU',
      value: 45,
      color: 'bg-blue-500',
      icon: Cpu,
      status: 'normal' as const,
      trend: '+2%',
    },
    {
      label: 'استخدام الذاكرة',
      value: 62,
      color: 'bg-green-500',
      icon: HardDrive,
      status: 'normal' as const,
      trend: '+5%',
    },
    {
      label: 'النشاط',
      value: 78,
      color: 'bg-yellow-500',
      icon: Activity,
      status: 'warning' as const,
      trend: '+8%',
    },
    {
      label: 'استخدام AI',
      value: 34,
      color: 'bg-purple-500',
      icon: Zap,
      status: 'normal' as const,
      trend: '+12%',
    },
    {
      label: 'الشبكة',
      value: 23,
      color: 'bg-cyan-500',
      icon: Network,
      status: 'normal' as const,
      trend: '-3%',
    },
    {
      label: 'قاعدة البيانات',
      value: 15,
      color: 'bg-orange-500',
      icon: Database,
      status: 'normal' as const,
      trend: '+1%',
    },
  ];

  const getStatusColor = (status: 'normal' | 'warning' | 'error') => {
    switch (status) {
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-ide-accent" />
          <h2 className="text-xl font-semibold">مقاييس الأداء</h2>
        </div>
        <Badge variant="success" size="sm">
          جميع الأنظمة طبيعية
        </Badge>
      </div>
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-ide-text-secondary" />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(metric.status)}`}>
                    {metric.trend}
                  </span>
                  <span className="text-sm font-semibold">{metric.value}%</span>
                </div>
              </div>
              <div className="w-full bg-ide-bg rounded-full h-2">
                <div
                  className={`${metric.color} h-2 rounded-full transition-all ${
                    metric.status === 'warning' ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PerformanceMetrics;

