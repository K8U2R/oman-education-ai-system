import React from 'react';
import { CheckCircle } from 'lucide-react';

const QuickStart: React.FC = () => {
  const steps = [
    {
      title: 'إنشاء مشروع جديد',
      description: 'انقر على "مشروع جديد" من القائمة الرئيسية واختر نوع المشروع.',
    },
    {
      title: 'تكوين المشروع',
      description: 'أدخل اسم المشروع واختر التقنيات التي تريد استخدامها.',
    },
    {
      title: 'بدء التطوير',
      description: 'استخدم محرر الكود ومساعد AI لبدء بناء تطبيقك.',
    },
    {
      title: 'بناء وتشغيل',
      description: 'استخدم أزرار البناء والتشغيل لاختبار تطبيقك.',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 chat-animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 chat-text-primary">دليل البدء السريع</h1>
        <p className="text-ide-text-secondary chat-text-secondary text-sm sm:text-base">
          ابدأ في استخدام FlowForge IDE في دقائق
        </p>
      </div>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 chat-text-primary">الخطوات الأساسية</h2>
        <div className="space-y-3 sm:space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface chat-surface chat-animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ide-accent flex items-center justify-center text-white font-bold text-sm sm:text-base chat-accent">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2 chat-text-primary">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    {step.title}
                  </h3>
                  <p className="text-ide-text-secondary chat-text-secondary text-sm sm:text-base">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">الخطوات التالية</h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-4 sm:p-6">
          <p className="text-ide-text-secondary mb-4">
            الآن بعد أن أنشأت مشروعك الأول، يمكنك:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ide-text-secondary">
            <li>استكشاف المزيد من الميزات في قسم "العمل في FlowForge"</li>
            <li>تعلم أفضل الممارسات في قسم "أفضل الممارسات"</li>
            <li>إعداد التكاملات في قسم "التكاملات"</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default QuickStart;

