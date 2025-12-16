import React from 'react';
import { Plus, FolderOpen, Settings, Sparkles, FileCheck, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const QuickActions: React.FC = () => {
  const actions = [
    {
      label: 'مشروع جديد',
      icon: Plus,
      to: '/projects/new',
      variant: 'primary' as const,
      description: 'إنشاء مشروع جديد',
    },
    {
      label: 'فتح مشروع',
      icon: FolderOpen,
      to: '/projects',
      variant: 'secondary' as const,
      description: 'استعراض المشاريع',
    },
    {
      label: 'مساعد Office',
      icon: FileCheck,
      to: '/office',
      variant: 'secondary' as const,
      description: 'إنشاء ملفات Office',
    },
    {
      label: 'محادثة AI',
      icon: Sparkles,
      to: '/ai-chat',
      variant: 'secondary' as const,
      description: 'التحدث مع AI',
    },
    {
      label: 'التعاون',
      icon: Users,
      to: '/collaboration',
      variant: 'outline' as const,
      description: 'إدارة الفريق',
    },
    {
      label: 'التحليلات',
      icon: BarChart3,
      to: '/analytics',
      variant: 'outline' as const,
      description: 'عرض الإحصائيات',
    },
    {
      label: 'الإعدادات',
      icon: Settings,
      to: '/settings',
      variant: 'outline' as const,
      description: 'تعديل الإعدادات',
    },
  ];

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">الإجراءات السريعة</h2>
      <div className="grid grid-cols-1 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} to={action.to}>
              <Button
                variant={action.variant}
                size="sm"
                className="w-full justify-start h-auto py-2.5"
              >
                <Icon className="w-4 h-4" />
                <div className="flex flex-col items-start mr-2">
                  <span className="font-medium">{action.label}</span>
                  {action.description && (
                    <span className="text-xs opacity-75">{action.description}</span>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;

