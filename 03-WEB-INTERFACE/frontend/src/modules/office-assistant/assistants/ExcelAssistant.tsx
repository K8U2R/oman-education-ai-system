import React from 'react';
import { Table } from 'lucide-react';
import Card from '@/components/ui/Card';

const ExcelAssistant: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-semibold">Microsoft Excel Assistant</h2>
      </div>
      <p className="text-ide-text-secondary">
        استخدم محادثة AI لإنشاء وتحليل جداول Excel
      </p>
    </Card>
  );
};

export default ExcelAssistant;

