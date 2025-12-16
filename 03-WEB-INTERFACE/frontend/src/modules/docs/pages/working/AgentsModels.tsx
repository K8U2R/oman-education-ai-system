import React from 'react';
import { Bot, Cpu, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const AgentsModels: React.FC = () => {
  const models = [
    { name: 'GPT-4', provider: 'OpenAI', description: 'أقوى نموذج من OpenAI' },
    { name: 'Claude', provider: 'Anthropic', description: 'نموذج متقدم من Anthropic' },
    { name: 'Gemini', provider: 'Google', description: 'نموذج Google الذكي' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">العوامل والنماذج</h1>
        <p className="text-ide-text-secondary text-lg">
          تعرف على كيفية استخدام العوامل AI والنماذج في FlowForge IDE
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Bot className="w-6 h-6 text-ide-accent" />
          ما هي العوامل؟
        </h2>
        <p className="mb-4">
          العوامل هي مساعدات AI ذكية تساعدك في تطوير الكود، إصلاح الأخطاء، وإعادة هيكلة الكود.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <Zap className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-semibold mb-1">توليد الكود</h3>
            <p className="text-sm text-ide-text-secondary">
              اطلب من AI إنشاء كود بناءً على وصفك
            </p>
          </div>
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <Cpu className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="font-semibold mb-1">إصلاح الأخطاء</h3>
            <p className="text-sm text-ide-text-secondary">
              اكتشف وأصلح الأخطاء تلقائياً
            </p>
          </div>
          <div className="p-4 bg-ide-bg rounded-lg border border-ide-border">
            <Bot className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-semibold mb-1">إعادة الهيكلة</h3>
            <p className="text-sm text-ide-text-secondary">
              حسّن جودة الكود تلقائياً
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4">النماذج المتاحة</h2>
        <div className="space-y-3">
          {models.map((model, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-ide-border"
            >
              <div>
                <h3 className="font-semibold">{model.name}</h3>
                <p className="text-sm text-ide-text-secondary">{model.description}</p>
              </div>
              <Badge variant="info">{model.provider}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AgentsModels;

