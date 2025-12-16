import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatRelativeTime } from '@/utils/helpers';

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const UpcomingTasks: React.FC = () => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'مراجعة كود المشروع الجديد',
      dueDate: new Date(Date.now() + 86400000), // غداً
      completed: false,
      priority: 'high',
    },
    {
      id: '2',
      title: 'إنشاء مستند Word للعرض',
      dueDate: new Date(Date.now() + 172800000), // بعد غد
      completed: false,
      priority: 'medium',
    },
    {
      id: '3',
      title: 'اختبار الميزات الجديدة',
      dueDate: new Date(Date.now() + 259200000), // بعد 3 أيام
      completed: true,
      priority: 'low',
    },
  ];

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ide-accent" />
          <h2 className="text-lg font-semibold">المهام القادمة</h2>
        </div>
        <Button variant="ghost" size="sm">
          عرض الكل
        </Button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              task.completed
                ? 'bg-ide-bg border-ide-border opacity-60'
                : 'bg-ide-surface border-ide-border'
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-ide-text-secondary flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  task.completed ? 'line-through text-ide-text-secondary' : ''
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-ide-text-secondary" />
                <span className="text-xs text-ide-text-secondary">
                  {formatRelativeTime(task.dueDate)}
                </span>
                <span className={`text-xs ${priorityColors[task.priority]}`}>
                  {task.priority === 'high' ? 'عالي' : task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingTasks;

