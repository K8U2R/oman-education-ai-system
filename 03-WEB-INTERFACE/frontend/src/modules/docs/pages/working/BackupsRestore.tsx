import React from 'react';
import { Save, RotateCcw, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const BackupsRestore: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">النسخ الاحتياطي والاستعادة</h1>
        <p className="text-ide-text-secondary text-lg">
          تعرف على كيفية عمل النسخ الاحتياطي واستعادة مشاريعك
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Save className="w-6 h-6 text-ide-accent" />
          النسخ الاحتياطي التلقائي
        </h2>
        <p className="mb-4">
          يقوم FlowForge IDE تلقائياً بإنشاء نسخ احتياطية من مشاريعك في فترات منتظمة.
        </p>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ide-accent" />
            <span>نسخ احتياطي كل ساعة</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ide-accent" />
            <span>احتفظ بـ 30 نسخة احتياطية</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ide-accent" />
            <span>تشفير النسخ الاحتياطية</span>
          </li>
        </ul>
        <Button>إنشاء نسخة احتياطية الآن</Button>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-ide-accent" />
          استعادة المشروع
        </h2>
        <p className="mb-4">
          يمكنك استعادة مشروعك من أي نسخة احتياطية سابقة.
        </p>
        <ol className="space-y-2 list-decimal list-inside mb-4">
          <li>افتح إعدادات المشروع</li>
          <li>انتقل إلى قسم "النسخ الاحتياطية"</li>
          <li>اختر النسخة الاحتياطية المرغوبة</li>
          <li>انقر على "استعادة"</li>
        </ol>
        <Button variant="secondary">عرض النسخ الاحتياطية</Button>
      </Card>
    </div>
  );
};

export default BackupsRestore;

