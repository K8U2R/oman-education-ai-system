import React from 'react';
import { Mail } from 'lucide-react';
import Card from '@/components/ui/Card';

const OutlookAssistant: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold">Microsoft Outlook Assistant</h2>
      </div>
      <p className="text-ide-text-secondary">
        استخدم محادثة AI لإدارة البريد الإلكتروني والتقويم
      </p>
    </Card>
  );
};

export default OutlookAssistant;

