import React from 'react';
import { Settings, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';

const Configuration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">تكوين FlowForge IDE</h1>
        <p className="text-ide-text-secondary text-lg">
          تعرف على كيفية تكوين FlowForge IDE حسب احتياجاتك
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-ide-accent" />
          ملف التكوين
        </h2>
        <p className="mb-4">
          يمكنك تكوين FlowForge IDE من خلال ملف <code className="bg-ide-bg px-2 py-1 rounded">.flowforgerc</code>
        </p>
        <div className="bg-ide-bg p-4 rounded-lg border border-ide-border font-mono text-sm">
          <pre>{`{
  "theme": "dark",
  "editor": {
    "fontSize": 14,
    "tabSize": 2
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4"
  }
}`}</pre>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-ide-accent" />
          متغيرات البيئة
        </h2>
        <div className="space-y-3">
          <div>
            <code className="bg-ide-bg px-2 py-1 rounded text-sm">VITE_API_URL</code>
            <p className="text-sm text-ide-text-secondary mt-1">
              عنوان API الخلفي
            </p>
          </div>
          <div>
            <code className="bg-ide-bg px-2 py-1 rounded text-sm">VITE_AI_API_KEY</code>
            <p className="text-sm text-ide-text-secondary mt-1">
              مفتاح API للذكاء الاصطناعي
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Configuration;

