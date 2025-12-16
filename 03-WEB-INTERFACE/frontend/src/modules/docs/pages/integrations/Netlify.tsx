import React from 'react';
import { Cloud, Rocket, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Netlify: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">تكامل Netlify</h1>
        <p className="text-ide-text-secondary text-lg">
          نشر مشاريعك مباشرة على Netlify
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-6 h-6 text-ide-accent" />
          الإعداد
        </h2>
        <ol className="space-y-3 list-decimal list-inside mb-4">
          <li>أنشئ حساب Netlify</li>
          <li>احصل على Access Token</li>
          <li>افتح إعدادات المشروع</li>
          <li>أدخل Token في قسم Netlify</li>
          <li>اختر موقع النشر</li>
        </ol>
        <Button>
          <Rocket className="w-4 h-4" />
          نشر الآن
        </Button>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-ide-accent" />
          النشر التلقائي
        </h2>
        <p className="mb-4">
          يمكنك تفعيل النشر التلقائي عند كل commit:
        </p>
        <div className="p-3 bg-ide-bg rounded border border-ide-border">
          <code className="text-sm">auto_deploy: true</code>
        </div>
      </Card>
    </div>
  );
};

export default Netlify;

