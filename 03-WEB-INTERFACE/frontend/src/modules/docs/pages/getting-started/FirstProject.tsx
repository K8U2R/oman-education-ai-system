import React from 'react';
import { Rocket, Code, Play } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const FirstProject: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">إنشاء أول مشروع</h1>
        <p className="text-ide-text-secondary text-lg">
          ابدأ رحلتك مع FlowForge IDE بإنشاء مشروعك الأول
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-ide-accent" />
          خطوات إنشاء المشروع
        </h2>
        <ol className="space-y-4 list-decimal list-inside">
          <li>
            <strong>افتح FlowForge IDE</strong>
            <p className="text-sm text-ide-text-secondary mt-1">
              قم بتسجيل الدخول إلى حسابك
            </p>
          </li>
          <li>
            <strong>انقر على "مشروع جديد"</strong>
            <p className="text-sm text-ide-text-secondary mt-1">
              من القائمة الرئيسية أو لوحة التحكم
            </p>
          </li>
          <li>
            <strong>اختر قالب المشروع</strong>
            <p className="text-sm text-ide-text-secondary mt-1">
              اختر من بين القوالب المتاحة (React, Node.js, Python, etc.)
            </p>
          </li>
          <li>
            <strong>أدخل اسم المشروع</strong>
            <p className="text-sm text-ide-text-secondary mt-1">
              اختر اسماً وصفياً لمشروعك
            </p>
          </li>
          <li>
            <strong>ابدأ التطوير</strong>
            <p className="text-sm text-ide-text-secondary mt-1">
              استخدم محرر الكود ومساعد AI لبدء البناء
            </p>
          </li>
        </ol>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Code className="w-6 h-6 text-ide-accent" />
          مثال: مشروع React بسيط
        </h2>
        <div className="bg-ide-bg p-4 rounded-lg border border-ide-border font-mono text-sm">
          <pre>{`import React from 'react';

function App() {
  return (
    <div>
      <h1>مرحباً بك في FlowForge IDE!</h1>
    </div>
  );
}

export default App;`}</pre>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Play className="w-6 h-6 text-ide-accent" />
          تشغيل المشروع
        </h2>
        <p className="mb-4">
          بعد إنشاء المشروع، يمكنك تشغيله باستخدام:
        </p>
        <div className="bg-ide-bg p-4 rounded-lg border border-ide-border font-mono text-sm mb-4">
          <code>npm run dev</code>
        </div>
        <Button>ابدأ الآن</Button>
      </Card>
    </div>
  );
};

export default FirstProject;

