import React from 'react';
import { Cpu, HardDrive, MemoryStick, Network, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';

const ResourceUsage: React.FC = () => {
  const resources = [
    {
      label: 'CPU',
      value: 45,
      used: '2.3',
      total: '4.0',
      unit: 'GHz',
      icon: Cpu,
      color: 'blue',
      trend: '+2%',
    },
    {
      label: 'الذاكرة',
      value: 62,
      used: '8.2',
      total: '16',
      unit: 'GB',
      icon: MemoryStick,
      color: 'green',
      trend: '+5%',
    },
    {
      label: 'التخزين',
      value: 38,
      used: '152',
      total: '500',
      unit: 'GB',
      icon: HardDrive,
      color: 'yellow',
      trend: '+3%',
    },
    {
      label: 'الشبكة',
      value: 12,
      used: '12',
      total: '100',
      unit: 'Mbps',
      icon: Network,
      color: 'purple',
      trend: '-2%',
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">استخدام الموارد</h3>
        <span className="text-xs text-ide-text-secondary">آخر تحديث: الآن</span>
      </div>
      <div className="space-y-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-ide-accent" />
                  <span className="text-sm font-medium">{resource.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ide-text-secondary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {resource.trend}
                  </span>
                  <span className="text-sm font-semibold">
                    {resource.used}/{resource.total} {resource.unit}
                  </span>
                </div>
              </div>
              <Progress
                value={resource.value}
                variant={resource.value > 80 ? 'error' : resource.value > 60 ? 'warning' : 'default'}
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-ide-text-secondary">
                  {resource.value}% مستخدم
                </span>
                <span className="text-xs text-ide-text-secondary">
                  {((100 - resource.value) / 100 * parseFloat(resource.total)).toFixed(1)} {resource.unit} متاح
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ResourceUsage;

