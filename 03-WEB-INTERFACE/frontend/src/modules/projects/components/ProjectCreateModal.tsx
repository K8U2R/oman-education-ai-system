import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProjectsStore } from '@/store/projects-store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ProjectCreateModalProps {
  onClose: () => void;
}

const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({ onClose }) => {
  const { addProject } = useProjectsStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<'react' | 'node' | 'python' | 'other'>('react');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject = {
      id: `project-${Date.now()}`,
      name: name.trim(),
      type,
      path: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      description: description.trim() || undefined,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-ide-surface border border-ide-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-ide-border">
          <h2 className="text-xl font-semibold">إنشاء مشروع جديد</h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-ide-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="اسم المشروع"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسم المشروع"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">النوع</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full px-4 py-2.5 rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent"
            >
              <option value="react">React</option>
              <option value="node">Node.js</option>
              <option value="python">Python</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الوصف (اختياري)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف المشروع..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">إنشاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateModal;

