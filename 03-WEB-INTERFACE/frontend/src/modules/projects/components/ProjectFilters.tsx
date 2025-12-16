import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

const ProjectFilters: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const types = ['all', 'react', 'node', 'python', 'other'];
  const statuses = ['all', 'active', 'archived'];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">النوع</label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedType === type
                  ? 'bg-ide-accent text-white'
                  : 'bg-ide-bg border border-ide-border text-ide-text hover:bg-ide-border'
              }`}
            >
              {type === 'all' ? 'الكل' : type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">الحالة</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedStatus === status
                  ? 'bg-ide-accent text-white'
                  : 'bg-ide-bg border border-ide-border text-ide-text hover:bg-ide-border'
              }`}
            >
              {status === 'all' ? 'الكل' :
               status === 'active' ? 'نشط' :
               status === 'archived' ? 'مؤرشف' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm">تطبيق الفلاتر</Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedType('all');
            setSelectedStatus('all');
          }}
        >
          <X className="w-4 h-4" />
          إعادة تعيين
        </Button>
      </div>
    </div>
  );
};

export default ProjectFilters;

