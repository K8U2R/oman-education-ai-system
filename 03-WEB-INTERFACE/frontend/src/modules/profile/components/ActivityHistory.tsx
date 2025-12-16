import React from 'react';
import { Clock, FileText, GitCommit, Zap } from 'lucide-react';

const ActivityHistory: React.FC = () => {
  const activities = [
    {
      id: '1',
      type: 'file',
      action: 'تم تعديل ملف',
      target: 'App.tsx',
      time: 'منذ 5 دقائق',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      id: '2',
      type: 'commit',
      action: 'تم إنشاء commit',
      target: 'feat: add new feature',
      time: 'منذ ساعة',
      icon: GitCommit,
      color: 'text-green-500',
    },
    {
      id: '3',
      type: 'ai',
      action: 'استخدام AI',
      target: 'توليد كود جديد',
      time: 'منذ 3 ساعات',
      icon: Zap,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">سجل النشاطات الأخيرة</h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-md bg-ide-bg border border-ide-border"
            >
              <div className={`${activity.color} bg-opacity-10 p-2 rounded-md`}>
                <Icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-ide-text-secondary">{activity.target}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-ide-text-secondary">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityHistory;

