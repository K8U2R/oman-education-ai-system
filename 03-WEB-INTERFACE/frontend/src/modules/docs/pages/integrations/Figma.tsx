import React from 'react';
import { Figma as FigmaIcon, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Figma: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">تكامل Figma</h1>
        <p className="text-ide-text-secondary text-lg">
          استيراد التصاميم من Figma وتحويلها إلى كود
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FigmaIcon className="w-6 h-6 text-ide-accent" />
          الإعداد
        </h2>
        <ol className="space-y-3 list-decimal list-inside mb-4">
          <li>افتح ملف Figma الخاص بك</li>
          <li>انسخ رابط الملف</li>
          <li>في FlowForge، افتح "استيراد من Figma"</li>
          <li>الصق الرابط</li>
          <li>اختر المكونات المراد استيرادها</li>
        </ol>
        <Button>
          <Download className="w-4 h-4" />
          استيراد الآن
        </Button>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4">الميزات المدعومة</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">✓</span>
            <span>استيراد المكونات</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">✓</span>
            <span>تحويل التصاميم إلى React Components</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">✓</span>
            <span>استخراج الألوان والخطوط</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Figma;

