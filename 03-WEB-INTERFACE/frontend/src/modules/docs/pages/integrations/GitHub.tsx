import React from 'react';
import { Github, Link, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const GitHub: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">تكامل GitHub</h1>
        <p className="text-ide-text-secondary text-lg">
          ربط مشاريعك مع GitHub للتحكم بالإصدارات
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Github className="w-6 h-6 text-ide-accent" />
          الإعداد
        </h2>
        <ol className="space-y-3 list-decimal list-inside mb-4">
          <li>انتقل إلى إعدادات المشروع</li>
          <li>افتح قسم "التكاملات"</li>
          <li>انقر على "ربط مع GitHub"</li>
          <li>قم بتسجيل الدخول إلى GitHub</li>
          <li>اختر المستودع المراد ربطه</li>
        </ol>
        <Button>
          <Link className="w-4 h-4" />
          ربط الآن
        </Button>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-ide-accent" />
          الميزات
        </h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">✓</span>
            <span>مزامنة تلقائية مع GitHub</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">✓</span>
            <span>إنشاء commits من داخل IDE</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">✓</span>
            <span>إدارة الفروع</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">✓</span>
            <span>عرض Pull Requests</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default GitHub;

