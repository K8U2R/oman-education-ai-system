import React from 'react';
import { MessageSquare, Send, Command } from 'lucide-react';
import Card from '@/components/ui/Card';

const Chatbox: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">استخدام صندوق المحادثة</h1>
        <p className="text-ide-text-secondary text-lg">
          تعرف على كيفية استخدام صندوق المحادثة للتفاعل مع AI
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-ide-accent" />
          الوصول إلى صندوق المحادثة
        </h2>
        <p className="mb-4">
          يمكنك الوصول إلى صندوق المحادثة من خلال:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Command className="w-4 h-4 text-ide-accent" />
            <span>اللوحة الجانبية اليسرى</span>
          </li>
          <li className="flex items-center gap-2">
            <Command className="w-4 h-4 text-ide-accent" />
            <span>اختصار لوحة المفاتيح: <kbd className="px-2 py-1 bg-ide-bg border border-ide-border rounded">Ctrl + /</kbd></span>
          </li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Send className="w-6 h-6 text-ide-accent" />
          الأوامر المتاحة
        </h2>
        <div className="space-y-3">
          <div className="p-3 bg-ide-bg rounded-lg border border-ide-border">
            <code className="text-sm">/generate</code>
            <p className="text-sm text-ide-text-secondary mt-1">
              توليد كود بناءً على وصفك
            </p>
          </div>
          <div className="p-3 bg-ide-bg rounded-lg border border-ide-border">
            <code className="text-sm">/explain</code>
            <p className="text-sm text-ide-text-secondary mt-1">
              شرح الكود المحدد
            </p>
          </div>
          <div className="p-3 bg-ide-bg rounded-lg border border-ide-border">
            <code className="text-sm">/fix</code>
            <p className="text-sm text-ide-text-secondary mt-1">
              إصلاح الأخطاء في الكود
            </p>
          </div>
          <div className="p-3 bg-ide-bg rounded-lg border border-ide-border">
            <code className="text-sm">/refactor</code>
            <p className="text-sm text-ide-text-secondary mt-1">
              إعادة هيكلة الكود
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chatbox;

