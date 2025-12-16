import React from 'react';
import { Code, Search } from 'lucide-react';
import Card from '@/components/ui/Card';

const CodeView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">استخدام عرض الكود</h1>
        <p className="text-ide-text-secondary text-lg">
          تعرف على ميزات محرر الكود في FlowForge IDE
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Code className="w-6 h-6 text-ide-accent" />
          الميزات الأساسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <h3 className="font-semibold mb-2">تمييز الصياغة</h3>
            <p className="text-sm text-ide-text-secondary">
              دعم كامل لجميع لغات البرمجة الشائعة
            </p>
          </div>
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <h3 className="font-semibold mb-2">الإكمال التلقائي</h3>
            <p className="text-sm text-ide-text-secondary">
              اقتراحات ذكية أثناء الكتابة
            </p>
          </div>
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <h3 className="font-semibold mb-2">البحث والاستبدال</h3>
            <p className="text-sm text-ide-text-secondary">
              بحث متقدم مع دعم Regex
            </p>
          </div>
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <h3 className="font-semibold mb-2">تعدد المؤشرات</h3>
            <p className="text-sm text-ide-text-secondary">
              تحرير عدة مواقع في نفس الوقت
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-ide-accent" />
          الاختصارات الشائعة
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-ide-bg rounded">
            <span>البحث</span>
            <kbd className="px-2 py-1 bg-ide-surface border border-ide-border rounded">Ctrl + F</kbd>
          </div>
          <div className="flex justify-between items-center p-2 bg-ide-bg rounded">
            <span>الاستبدال</span>
            <kbd className="px-2 py-1 bg-ide-surface border border-ide-border rounded">Ctrl + H</kbd>
          </div>
          <div className="flex justify-between items-center p-2 bg-ide-bg rounded">
            <span>الانتقال إلى السطر</span>
            <kbd className="px-2 py-1 bg-ide-surface border border-ide-border rounded">Ctrl + G</kbd>
          </div>
          <div className="flex justify-between items-center p-2 bg-ide-bg rounded">
            <span>تنسيق الكود</span>
            <kbd className="px-2 py-1 bg-ide-surface border border-ide-border rounded">Shift + Alt + F</kbd>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CodeView;

