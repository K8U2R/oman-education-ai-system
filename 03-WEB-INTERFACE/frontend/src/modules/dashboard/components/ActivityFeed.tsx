import React from 'react';
import { Activity, GitCommit, FileText, Zap, Users, FileCheck, Wrench } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatRelativeTime } from '@/utils/helpers';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: '1',
      type: 'commit',
      message: 'تم إنشاء commit جديد',
      details: 'feat: add new feature',
      time: new Date(Date.now() - 300000), // منذ 5 دقائق
      icon: GitCommit,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      project: 'مشروع React',
    },
    {
      id: '2',
      type: 'file',
      message: 'تم تعديل ملف',
      details: 'App.tsx',
      time: new Date(Date.now() - 900000), // منذ 15 دقيقة
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      project: 'مشروع React',
    },
    {
      id: '3',
      type: 'ai',
      message: 'تم استخدام AI',
      details: 'توليد كود جديد',
      time: new Date(Date.now() - 3600000), // منذ ساعة
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      project: 'مشروع Node.js',
    },
    {
      id: '4',
      type: 'collaboration',
      message: 'عضو جديد انضم',
      details: 'أحمد محمد',
      time: new Date(Date.now() - 7200000), // منذ ساعتين
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      project: 'مشروع Python',
    },
    {
      id: '5',
      type: 'office',
      message: 'تم تحليل ملف Office',
      details: 'document.docx',
      time: new Date(Date.now() - 10800000), // منذ 3 ساعات
      icon: FileCheck,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      project: 'مشروع Office',
    },
    {
      id: '6',
      type: 'build',
      message: 'تم بناء المشروع',
      details: 'Build successful',
      time: new Date(Date.now() - 14400000), // منذ 4 ساعات
      icon: Wrench,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      project: 'مشروع React',
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-ide-accent" />
          <h2 className="text-xl font-semibold">سجل النشاطات</h2>
        </div>
        <Button variant="ghost" size="sm">
          عرض الكل
        </Button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-ide-border transition-colors"
            >
              <div className={`${activity.bgColor} ${activity.color} p-2 rounded-md flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                {activity.details && (
                  <p className="text-xs text-ide-text-secondary mt-0.5">{activity.details}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-ide-text-secondary">{activity.project}</span>
                  <span className="text-xs text-ide-text-secondary">•</span>
                  <span className="text-xs text-ide-text-secondary">
                    {formatRelativeTime(activity.time)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityFeed;

