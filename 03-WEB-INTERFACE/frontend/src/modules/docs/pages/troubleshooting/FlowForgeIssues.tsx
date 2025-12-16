import React from 'react';
import { Bug, RefreshCw, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const FlowForgeIssues: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">مشاكل FlowForge</h1>
        <p className="text-ide-text-secondary text-lg">
          حلول للمشاكل العامة في FlowForge IDE
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Bug className="w-6 h-6 text-red-500" />
          التطبيق بطيء
        </h2>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">•</span>
            <span>أغلق التبويبات غير المستخدمة</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">•</span>
            <span>امسح ذاكرة التخزين المؤقت</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">•</span>
            <span>أعد تحميل الصفحة</span>
          </li>
        </ul>
        <Button variant="secondary">
          <RefreshCw className="w-4 h-4" />
          إعادة التحميل
        </Button>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-ide-accent" />
          مسح البيانات
        </h2>
        <p className="mb-4">
          إذا استمرت المشاكل، يمكنك مسح بيانات التطبيق:
        </p>
        <ol className="space-y-2 list-decimal list-inside mb-4">
          <li>افتح إعدادات المتصفح</li>
          <li>اذهب إلى "البيانات والخصوصية"</li>
          <li>اختر "مسح بيانات الموقع"</li>
          <li>أعد تسجيل الدخول</li>
        </ol>
        <Button variant="outline" className="text-red-400">
          تحذير: هذا سيحذف جميع البيانات المحلية
        </Button>
      </Card>
    </div>
  );
};

export default FlowForgeIssues;

