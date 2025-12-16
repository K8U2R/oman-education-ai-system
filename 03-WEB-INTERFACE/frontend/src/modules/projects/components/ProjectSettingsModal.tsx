import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Project } from '@/utils/types';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

interface ProjectSettingsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (project: Partial<Project>) => void;
}

const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
}) => {
  const { showSuccess } = useErrorHandler();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [type, setType] = useState(project.type);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProject = await apiClient.patch<Project>(
        API_ENDPOINTS.projects.update(project.id),
        { name, description, type }
      );
      
      if (onSave) {
        onSave(updatedProject);
      }
      showSuccess('تم الحفظ', 'تم تحديث إعدادات المشروع بنجاح');
      onClose();
    } catch (error) {
      // Error handling is done by useErrorHandler in the component
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إعدادات المشروع"
      size="lg"
    >
      <div className="space-y-4">
        <Input
          label="اسم المشروع"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="الوصف"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <Select
          label="نوع المشروع"
          value={type}
          onChange={(e) => setType(e.target.value as Project['type'])}
          options={[
            { value: 'react', label: 'React' },
            { value: 'node', label: 'Node.js' },
            { value: 'python', label: 'Python' },
            { value: 'other', label: 'أخرى' },
          ]}
        />
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            حفظ
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectSettingsModal;

