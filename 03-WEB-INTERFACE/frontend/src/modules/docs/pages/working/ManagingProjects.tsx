import React from 'react';
import { FolderOpen, Settings, Trash2, Archive } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const ManagingProjects: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">إدارة المشاريع</h1>
        <p className="text-ide-text-secondary text-lg">
          تعرف على كيفية إدارة مشاريعك في FlowForge IDE
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-ide-accent" />
          العمليات الأساسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              تعديل المشروع
            </h3>
            <p className="text-sm text-ide-text-secondary mb-3">
              قم بتعديل اسم المشروع، الوصف، والإعدادات
            </p>
            <Button size="sm" variant="outline">تعلم المزيد</Button>
          </div>
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Archive className="w-5 h-5" />
              أرشفة المشروع
            </h3>
            <p className="text-sm text-ide-text-secondary mb-3">
              احفظ المشروع في الأرشيف للرجوع إليه لاحقاً
            </p>
            <Button size="sm" variant="outline">تعلم المزيد</Button>
          </div>
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              حذف المشروع
            </h3>
            <p className="text-sm text-ide-text-secondary mb-3">
              احذف المشروع نهائياً (لا يمكن التراجع)
            </p>
            <Button size="sm" variant="outline" className="text-red-400">
              تعلم المزيد
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4">نصائح الإدارة</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-ide-accent">•</span>
            <span>استخدم أسماء وصفية للمشاريع</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ide-accent">•</span>
            <span>أضف وصفاً لكل مشروع</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ide-accent">•</span>
            <span>نظم المشاريع باستخدام التصنيفات</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ide-accent">•</span>
            <span>قم بأرشفة المشاريع القديمة</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default ManagingProjects;

