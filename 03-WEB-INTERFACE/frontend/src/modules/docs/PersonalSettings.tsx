import React from 'react';
import { Settings, Moon, Bell, Code, Eye } from 'lucide-react';

const PersonalSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">الإعدادات الشخصية</h1>
        <p className="text-ide-text-secondary">
          تعلم كيفية تخصيص مظهر FlowForge IDE وصوته وطريقة عرض المعلومات أثناء العمل.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <p className="text-ide-text-secondary mb-4">
          تتيح لك الإعدادات الشخصية تعديل طريقة عمل FlowForge بسهولة. هناك خمسة أقسام في
          الإعدادات الشخصية (يجب عدم الخلط بينها وبين إعدادات المشروع):
        </p>
        <ul className="list-disc list-inside space-y-2 text-ide-text-secondary">
          <li>الإعدادات العامة الشخصية</li>
          <li>الاشتراكات والرموز</li>
          <li>التطبيقات</li>
          <li>السحابة</li>
          <li>المعرفة</li>
        </ul>
      </div>

      {/* Access Settings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          الوصول إلى الإعدادات الشخصية
        </h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
          <p className="text-ide-text-secondary mb-4">
            للوصول إلى إعداداتك الشخصية، اتبع الخطوات التالية:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-ide-text-secondary">
            <li>قم بتسجيل الدخول إلى مشروع FlowForge.</li>
            <li>انقر على <strong className="text-ide-text">صورتك الشخصية</strong> في الزاوية اليمنى العليا من الشاشة.</li>
            <li>انقر على <strong className="text-ide-text">الإعدادات</strong>.</li>
          </ol>
          <p className="text-ide-text-secondary mt-4">
            سيتم نقلك إلى الإعدادات العامة الشخصية. يمكنك أيضاً التنقل إلى مناطق أخرى من
            الإعدادات الشخصية باستخدام قائمة التنقل اليسرى.
          </p>
        </div>
      </section>

      {/* General Settings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          الإعدادات العامة الشخصية
        </h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
          <p className="text-ide-text-secondary mb-4">
            تمنحك الإعدادات العامة أدوات بسيطة لتعديل طريقة عمل FlowForge أثناء البناء. يمكنك
            اختيار الثيم، وإدارة الإشعارات، وإظهار أو إخفاء تفاصيل الرموز، وضبط طريقة ظهور
            الكود في المحرر. هذه التعديلات الصغيرة تساعد في إنشاء مساحة عمل تطابق تفضيلاتك
            وتحافظ على كل شيء مريحاً وسهلاً.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Theme */}
            <div className="border border-ide-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-ide-accent" />
                <h3 className="font-semibold">الثيم</h3>
              </div>
              <p className="text-sm text-ide-text-secondary">
                التبديل بين الثيمات الفاتحة والداكنة باستخدام قائمة الثيم المنسدلة.
              </p>
            </div>

            {/* Token Usage */}
            <div className="border border-ide-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-ide-accent" />
                <h3 className="font-semibold">استخدام الرموز</h3>
              </div>
              <p className="text-sm text-ide-text-secondary">
                إظهار أو إخفاء استخدام الرموز في المحادثة.
              </p>
            </div>

            {/* Notifications */}
            <div className="border border-ide-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-ide-accent" />
                <h3 className="font-semibold">الإشعارات الصوتية</h3>
              </div>
              <p className="text-sm text-ide-text-secondary">
                تشغيل أو إيقاف الإشعارات الصوتية عند انتهاء FlowForge من الرد.
              </p>
            </div>

            {/* Line Wrapping */}
            <div className="border border-ide-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-ide-accent" />
                <h3 className="font-semibold">تفاف الأسطر</h3>
              </div>
              <p className="text-sm text-ide-text-secondary">
                تفعيل أو تعطيل تفاف الأسطر للأسطر الطويلة من الكود في المحرر.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscriptions & Tokens */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">الاشتراكات والرموز</h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
          <p className="text-ide-text-secondary">
            يمكنك استخدام هذه الصفحة لمراجعة تفاصيل الرموز والفواتير. تعرض الاستخدام الحالي،
            الرصيد المتبقي، وتاريخ تحديث الرموز. يمكنك أيضاً ترقية خطتك أو تعديل إعدادات
            الفواتير من نفس الشاشة.
          </p>
        </div>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">التطبيقات</h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
          <p className="text-ide-text-secondary">
            في هذه الصفحة، يمكنك إدارة اتصالاتك بالتطبيقات الخارجية مثل Supabase و Netlify
            و Figma و GitHub.
          </p>
        </div>
      </section>

      {/* Cloud */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">السحابة</h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
          <p className="text-ide-text-secondary">
            تتيح لك هذه الصفحة عرض إحصائيات الاستخدام الشهرية المضمنة وجميع النطاقات المخصصة
            المشتراة من خلال FlowForge المرتبطة بحسابك.
          </p>
        </div>
      </section>

      {/* Knowledge */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">المعرفة</h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
          <p className="text-ide-text-secondary mb-4">
            تمنحك المعرفة طبقة ثابتة من التعليمات الخلفية <strong className="text-ide-text">في جميع مشاريعك</strong> التي يتبعها FlowForge.
            تمنح FlowForge إحساساً موثوقاً بالسياق، مما يسمح لك بتضمين أشياء مثل الأهداف،
            توقعات الأسلوب، المصطلحات، القيود، وعادات سير العمل.
          </p>
          <p className="text-ide-text-secondary">
            بدلاً من تكرار هذه التفاصيل في كل طلب، يمكنك وضعها في المعرفة حتى يتمكن النموذج
            من استخدامها تلقائياً. إذا كنت تريد تعيين معرفة لمشروع محدد لا ينطبق على مشاريعك
            الأخرى، يمكنك إضافة معرفة المشروع مباشرة في إعدادات المشروع.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PersonalSettings;

