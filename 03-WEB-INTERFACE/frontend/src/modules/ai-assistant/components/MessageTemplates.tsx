import React from 'react';
import { FileText, Code, FileSpreadsheet, FolderOpen } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  text: string;
  icon: React.ReactNode;
  category: 'project' | 'office' | 'code' | 'general';
}

const templates: Template[] = [
  {
    id: 'react-project',
    name: 'مشروع React جديد',
    text: 'أنشئ مشروع React جديد مع TypeScript و Tailwind CSS',
    icon: <Code className="w-4 h-4" />,
    category: 'project',
  },
  {
    id: 'word-doc',
    name: 'مستند Word',
    text: 'أنشئ مستند Word جديد',
    icon: <FileText className="w-4 h-4" />,
    category: 'office',
  },
  {
    id: 'excel-table',
    name: 'جدول Excel',
    text: 'أنشئ جدول Excel جديد',
    icon: <FileSpreadsheet className="w-4 h-4" />,
    category: 'office',
  },
  {
    id: 'code-help',
    name: 'مساعدة في الكود',
    text: 'ساعدني في كتابة كود',
    icon: <Code className="w-4 h-4" />,
    category: 'code',
  },
  {
    id: 'view-projects',
    name: 'عرض المشاريع',
    text: 'عرض المشاريع الخاصة بي',
    icon: <FolderOpen className="w-4 h-4" />,
    category: 'general',
  },
];

interface MessageTemplatesProps {
  onSelect: (text: string) => void;
}

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-ide-accent" />
        <h3 className="text-lg font-semibold">قوالب سريعة</h3>
        <p className="text-sm text-ide-text-secondary mr-auto">اختر قالباً للبدء بسرعة</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.text)}
            className="p-4 text-right rounded-xl border border-ide-border/50 bg-gradient-to-br from-ide-surface to-ide-surface/80 hover:from-ide-accent/10 hover:to-ide-accent/5 hover:border-ide-accent/50 transition-all group shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-ide-accent group-hover:scale-110 transition-transform">
                {template.icon}
              </div>
              <h4 className="font-semibold text-ide-text">{template.name}</h4>
            </div>
            <p className="text-sm text-ide-text-secondary">{template.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MessageTemplates;

