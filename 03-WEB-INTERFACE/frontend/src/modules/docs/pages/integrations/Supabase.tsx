import React from 'react';
import { Database, Key, Link } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Supabase: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">تكامل Supabase</h1>
        <p className="text-ide-text-secondary text-lg">
          ربط مشروعك مع Supabase لقاعدة البيانات
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Database className="w-6 h-6 text-ide-accent" />
          الإعداد
        </h2>
        <ol className="space-y-3 list-decimal list-inside mb-4">
          <li>أنشئ مشروع Supabase جديد</li>
          <li>احصل على API Key و URL</li>
          <li>افتح إعدادات المشروع في FlowForge</li>
          <li>أدخل بيانات Supabase</li>
          <li>اختبر الاتصال</li>
        </ol>
        <Button>
          <Link className="w-4 h-4" />
          ربط الآن
        </Button>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Key className="w-6 h-6 text-ide-accent" />
          المتغيرات المطلوبة
        </h2>
        <div className="space-y-2">
          <div className="p-3 bg-ide-bg rounded border border-ide-border">
            <code className="text-sm">SUPABASE_URL</code>
            <p className="text-xs text-ide-text-secondary mt-1">
              عنوان URL لمشروع Supabase
            </p>
          </div>
          <div className="p-3 bg-ide-bg rounded border border-ide-border">
            <code className="text-sm">SUPABASE_ANON_KEY</code>
            <p className="text-xs text-ide-text-secondary mt-1">
              المفتاح العام لـ Supabase
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Supabase;

