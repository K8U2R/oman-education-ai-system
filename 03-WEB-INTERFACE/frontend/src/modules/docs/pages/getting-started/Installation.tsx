import React from 'react';
import { Download, Terminal, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';

const Installation: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">تثبيت FlowForge IDE</h1>
        <p className="text-ide-text-secondary text-lg">
          دليل شامل لتثبيت FlowForge IDE على نظامك
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Download className="w-6 h-6 text-ide-accent" />
          المتطلبات الأساسية
        </h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Node.js 18+ أو أحدث</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>npm 9+ أو yarn أو pnpm</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>متصفح حديث (Chrome, Firefox, Safari, Edge)</span>
          </li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-ide-accent" />
          التثبيت عبر npm
        </h2>
        <div className="bg-ide-bg p-4 rounded-lg border border-ide-border font-mono text-sm">
          <code>npm install -g flowforge-ide</code>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4">التحقق من التثبيت</h2>
        <div className="bg-ide-bg p-4 rounded-lg border border-ide-border font-mono text-sm">
          <code>flowforge --version</code>
        </div>
        <p className="text-sm text-ide-text-secondary mt-2">
          يجب أن ترى رقم الإصدار المثبت
        </p>
      </Card>
    </div>
  );
};

export default Installation;

