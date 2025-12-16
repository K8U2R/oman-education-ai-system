import React from 'react';
import { Presentation } from 'lucide-react';
import Card from '@/components/ui/Card';

const PowerPointAssistant: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Presentation className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-semibold">Microsoft PowerPoint Assistant</h2>
      </div>
      <p className="text-ide-text-secondary">
        استخدم محادثة AI لإنشاء عروض تقديمية احترافية
      </p>
    </Card>
  );
};

export default PowerPointAssistant;

