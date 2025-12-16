import React from 'react';
import { StickyNote } from 'lucide-react';
import Card from '@/components/ui/Card';

const OneNoteAssistant: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold">Microsoft OneNote Assistant</h2>
      </div>
      <p className="text-ide-text-secondary">
        استخدم محادثة AI لتدوين الملاحظات والتنظيم
      </p>
    </Card>
  );
};

export default OneNoteAssistant;

