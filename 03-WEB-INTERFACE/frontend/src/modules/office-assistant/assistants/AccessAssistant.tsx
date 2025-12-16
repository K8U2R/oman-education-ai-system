import React from 'react';
import { Database } from 'lucide-react';
import Card from '@/components/ui/Card';

const AccessAssistant: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl font-semibold">Microsoft Access Assistant</h2>
      </div>
      <p className="text-ide-text-secondary">
        استخدم محادثة AI لإدارة قواعد البيانات
      </p>
    </Card>
  );
};

export default AccessAssistant;

