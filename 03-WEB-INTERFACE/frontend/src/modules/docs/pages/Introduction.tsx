import React from 'react';
import { Rocket, Code, Zap, Shield } from 'lucide-react';

const Introduction: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 chat-animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 chat-text-primary">مرحباً بك في FlowForge IDE</h1>
        <p className="text-ide-text-secondary text-base sm:text-lg chat-text-secondary">
          بيئة تطوير متكاملة حديثة للتعليم والبناء العملي
        </p>
      </div>

      <div className="bg-ide-surface border border-ide-border rounded-lg p-4 sm:p-6 chat-surface">
        <p className="text-ide-text-secondary mb-4 chat-text-secondary">
          FlowForge IDE هي منصة تطوير ويب متقدمة تجمع بين قوة محرر الكود الحديث، الذكاء
          الاصطناعي، وإدارة المشاريع في مكان واحد. مصممة خصيصاً للتعليم والبناء العملي.
        </p>
      </div>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 chat-text-primary">المميزات الرئيسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface chat-surface chat-animate-scale-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-ide-accent chat-accent" />
              <h3 className="text-lg sm:text-xl font-semibold chat-text-primary">محرر كود متقدم</h3>
            </div>
            <p className="text-ide-text-secondary chat-text-secondary text-sm sm:text-base">
              محرر كود قوي مبني على Monaco Editor مع دعم كامل للغة العربية، تمييز الصياغة،
              والإكمال التلقائي.
            </p>
          </div>

          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface chat-surface chat-animate-scale-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-ide-accent chat-accent" />
              <h3 className="text-lg sm:text-xl font-semibold chat-text-primary">ذكاء اصطناعي مدمج</h3>
            </div>
            <p className="text-ide-text-secondary chat-text-secondary text-sm sm:text-base">
              مساعد ذكاء اصطناعي متقدم يساعدك في كتابة الكود، شرحه، وإصلاح الأخطاء.
            </p>
          </div>

          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface chat-surface chat-animate-scale-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-ide-accent chat-accent" />
              <h3 className="text-lg sm:text-xl font-semibold chat-text-primary">إدارة المشاريع</h3>
            </div>
            <p className="text-ide-text-secondary chat-text-secondary text-sm sm:text-base">
              أدوات شاملة لإدارة المشاريع، البناء، والتشغيل مباشرة من الواجهة.
            </p>
          </div>

          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface chat-surface chat-animate-scale-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-ide-accent chat-accent" />
              <h3 className="text-lg sm:text-xl font-semibold chat-text-primary">آمن وموثوق</h3>
            </div>
            <p className="text-ide-text-secondary chat-text-secondary text-sm sm:text-base">
              نظام كشف الأخطاء المتقدم، النسخ الاحتياطي التلقائي، وإدارة الإصدارات.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 chat-text-primary">ابدأ الآن</h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-4 sm:p-6 chat-surface">
          <p className="text-ide-text-secondary mb-4 chat-text-secondary text-sm sm:text-base">
            جاهز للبدء؟ اتبع دليل البدء السريع لإنشاء مشروعك الأول في دقائق.
          </p>
          <a
            href="/docs/getting-started/quickstart"
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors text-sm sm:text-base chat-accent"
          >
            ابدأ الآن →
          </a>
        </div>
      </section>
    </div>
  );
};

export default Introduction;

