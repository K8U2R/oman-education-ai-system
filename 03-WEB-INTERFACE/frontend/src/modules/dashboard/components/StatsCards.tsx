import React from 'react';
import { FolderOpen, Code, Zap, Clock, TrendingUp, TrendingDown, Users, FileText, GitBranch, Database } from 'lucide-react';
import Card from '@/components/ui/Card';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const StatsCards: React.FC = () => {
  const stats: StatCard[] = [
    {
      title: 'المشاريع',
      value: '24',
      change: '+3 هذا الشهر',
      changeType: 'up',
      icon: <FolderOpen className="w-6 h-6" />,
      color: 'text-blue-500',
      description: '18 نشط',
    },
    {
      title: 'الملفات',
      value: '1,248',
      change: '+45 هذا الشهر',
      changeType: 'up',
      icon: <Code className="w-6 h-6" />,
      color: 'text-green-500',
      description: '156 تم التعديل',
    },
    {
      title: 'استخدام AI',
      value: '1.2K',
      change: '+23% من الشهر الماضي',
      changeType: 'up',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-500',
      description: '234 طلب هذا الشهر',
    },
    {
      title: 'ساعات العمل',
      value: '156',
      change: '+12 هذا الأسبوع',
      changeType: 'up',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-purple-500',
      description: 'متوسط 22 ساعة/أسبوع',
    },
    {
      title: 'أعضاء الفريق',
      value: '8',
      change: '+2 هذا الشهر',
      changeType: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'text-indigo-500',
      description: '6 نشطون',
    },
    {
      title: 'Commits',
      value: '89',
      change: '+15 هذا الأسبوع',
      changeType: 'up',
      icon: <GitBranch className="w-6 h-6" />,
      color: 'text-cyan-500',
      description: '12 اليوم',
    },
    {
      title: 'ملفات Office',
      value: '24',
      change: '+5 هذا الشهر',
      changeType: 'up',
      icon: <FileText className="w-6 h-6" />,
      color: 'text-pink-500',
      description: '18 تم التحليل',
    },
    {
      title: 'قواعد البيانات',
      value: '6',
      change: '+1 هذا الشهر',
      changeType: 'up',
      icon: <Database className="w-6 h-6" />,
      color: 'text-orange-500',
      description: '4 نشطة',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} variant="elevated" className="hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-ide-text-secondary mb-1">{stat.title}</p>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              {stat.description && (
                <p className="text-xs text-ide-text-secondary mb-2">{stat.description}</p>
              )}
              <div className={`flex items-center gap-1 text-xs ${
                stat.changeType === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.changeType === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;

