import React from 'react';
import { Users, MessageSquare, Share2, GitBranch } from 'lucide-react';
import Card from '@/components/ui/Card';

const CollaborationStats: React.FC = () => {
  const stats = [
    {
      label: 'أعضاء الفريق',
      value: '8',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'رسائل التعاون',
      value: '142',
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      label: 'مشاريع مشتركة',
      value: '6',
      icon: Share2,
      color: 'text-yellow-500',
    },
    {
      label: 'Commits المشتركة',
      value: '89',
      icon: GitBranch,
      color: 'text-purple-500',
    },
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-ide-accent" />
        <h2 className="text-lg font-semibold">إحصائيات التعاون</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="text-center p-4 bg-ide-bg rounded-lg border border-ide-border"
            >
              <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-ide-text-secondary">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CollaborationStats;

