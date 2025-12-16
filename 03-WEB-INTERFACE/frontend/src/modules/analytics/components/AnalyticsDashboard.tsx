import React from 'react';
import { Clock, Zap, FolderOpen, Code } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const AnalyticsDashboard: React.FC = () => {
  const stats = [
    {
      label: 'إجمالي المشاريع',
      value: '24',
      icon: FolderOpen,
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'ساعات البرمجة',
      value: '156',
      icon: Clock,
      change: '+8%',
      trend: 'up',
    },
    {
      label: 'استخدام AI',
      value: '89',
      icon: Zap,
      change: '+23%',
      trend: 'up',
    },
    {
      label: 'أسطر الكود',
      value: '12.5K',
      icon: Code,
      change: '+15%',
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} variant="elevated">
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5 text-ide-accent" />
              <Badge variant={stat.trend === 'up' ? 'success' : 'error'} size="sm">
                {stat.change}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-ide-text-secondary">{stat.label}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsDashboard;

