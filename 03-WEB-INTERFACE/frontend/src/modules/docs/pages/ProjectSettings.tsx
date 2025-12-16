import React from 'react';
import { Settings, Database, Key, Globe } from 'lucide-react';

const ProjectSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">إعدادات المشروع</h1>
        <p className="text-ide-text-secondary">
          تعلم كيفية تكوين إعدادات المشروع الخاصة بك
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          نظرة عامة
        </h2>
        <div className="bg-ide-surface border border-ide-border rounded-lg p-4 sm:p-6">
          <p className="text-ide-text-secondary mb-4">
            إعدادات المشروع تختلف عن الإعدادات الشخصية. الإعدادات الشخصية تطبق على جميع
            مشاريعك، بينما إعدادات المشروع خاصة بمشروع واحد فقط.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">الأقسام الرئيسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-6 h-6 text-ide-accent" />
              <h3 className="text-xl font-semibold">قاعدة البيانات</h3>
            </div>
            <p className="text-ide-text-secondary">
              تكوين اتصالات قاعدة البيانات وإعداداتها للمشروع.
            </p>
          </div>

          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface">
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-6 h-6 text-ide-accent" />
              <h3 className="text-xl font-semibold">المفاتيح والبيئة</h3>
            </div>
            <p className="text-ide-text-secondary">
              إدارة متغيرات البيئة والمفاتيح الخاصة بالمشروع.
            </p>
          </div>

          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-ide-accent" />
              <h3 className="text-xl font-semibold">النطاقات</h3>
            </div>
            <p className="text-ide-text-secondary">
              تكوين النطاقات المخصصة والاستضافة للمشروع.
            </p>
          </div>

          <div className="border border-ide-border rounded-lg p-4 sm:p-6 bg-ide-surface">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-6 h-6 text-ide-accent" />
              <h3 className="text-xl font-semibold">معرفة المشروع</h3>
            </div>
            <p className="text-ide-text-secondary">
              إضافة معرفة خاصة بالمشروع لا تنطبق على المشاريع الأخرى.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectSettings;

