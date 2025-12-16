import React from 'react';
import { AlertCircle, Key, Mail } from 'lucide-react';
import Card from '@/components/ui/Card';

const LoginIssues: React.FC = () => {
  const issues = [
    {
      problem: 'نسيت كلمة المرور',
      solution: 'استخدم رابط "نسيت كلمة المرور" لإعادة تعيينها',
      icon: Key,
    },
    {
      problem: 'البريد الإلكتروني غير مسجل',
      solution: 'تأكد من إدخال البريد الإلكتروني الصحيح أو قم بإنشاء حساب جديد',
      icon: Mail,
    },
    {
      problem: 'حساب غير مفعّل',
      solution: 'تحقق من بريدك الإلكتروني وقم بتفعيل الحساب',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">مشاكل تسجيل الدخول</h1>
        <p className="text-ide-text-secondary text-lg">
          حلول للمشاكل الشائعة في تسجيل الدخول
        </p>
      </div>

      {issues.map((issue, index) => {
        const Icon = issue.icon;
        return (
          <Card key={index}>
            <div className="flex items-start gap-3">
              <Icon className="w-6 h-6 text-ide-accent flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">{issue.problem}</h2>
                <p className="text-ide-text-secondary">{issue.solution}</p>
              </div>
            </div>
          </Card>
        );
      })}

      <Card>
        <h2 className="text-2xl font-semibold mb-4">لم تجد الحل؟</h2>
        <p className="mb-4">
          إذا استمرت المشكلة، يرجى التواصل مع فريق الدعم
        </p>
        <Button>اتصل بالدعم</Button>
      </Card>
    </div>
  );
};

export default LoginIssues;

