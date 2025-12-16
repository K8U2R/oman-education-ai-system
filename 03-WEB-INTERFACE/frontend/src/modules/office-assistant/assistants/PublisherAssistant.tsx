import React from 'react';
import { BookOpen } from 'lucide-react';
import Card from '@/components/ui/Card';

const PublisherAssistant: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6 text-pink-500" />
        <h2 className="text-xl font-semibold">Microsoft Publisher Assistant</h2>
      </div>
      <p className="text-ide-text-secondary">
        استخدم محادثة AI لإنشاء المنشورات والتصاميم
      </p>
    </Card>
  );
};

export default PublisherAssistant;

