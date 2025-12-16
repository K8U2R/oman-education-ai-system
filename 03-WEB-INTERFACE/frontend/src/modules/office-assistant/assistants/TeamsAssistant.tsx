import React from 'react';
import { Users } from 'lucide-react';
import Card from '@/components/ui/Card';

const TeamsAssistant: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Microsoft Teams Assistant</h2>
      </div>
      <p className="text-ide-text-secondary">
        استخدم محادثة AI للتعاون وإدارة الاجتماعات
      </p>
    </Card>
  );
};

export default TeamsAssistant;

