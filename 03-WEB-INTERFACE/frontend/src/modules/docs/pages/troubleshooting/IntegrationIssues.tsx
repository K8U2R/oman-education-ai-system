import React from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const IntegrationIssues: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">مشاكل التكامل</h1>
        <p className="text-ide-text-secondary text-lg">
          حلول للمشاكل الشائعة في التكاملات
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          التكامل لا يعمل
        </h2>
        <ol className="space-y-2 list-decimal list-inside mb-4">
          <li>تحقق من صحة API Keys</li>
          <li>تأكد من تفعيل التكامل في الخدمة الخارجية</li>
          <li>تحقق من صلاحيات الحساب</li>
          <li>أعد ربط التكامل</li>
        </ol>
        <Button variant="secondary">
          <RefreshCw className="w-4 h-4" />
          إعادة الربط
        </Button>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-ide-accent" />
          خطأ في الإعدادات
        </h2>
        <p className="mb-4">
          تأكد من إدخال جميع البيانات المطلوبة بشكل صحيح:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">•</span>
            <span>URLs صحيحة وموجودة</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">•</span>
            <span>API Keys صالحة وغير منتهية</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ide-accent">•</span>
            <span>الصلاحيات المطلوبة مفعّلة</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default IntegrationIssues;

