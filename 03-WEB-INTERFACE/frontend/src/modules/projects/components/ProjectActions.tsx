import React from 'react';
import { MoreVertical, Edit, Trash2, Archive, Download } from 'lucide-react';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import { Project } from '@/utils/types';

interface ProjectActionsProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onDownload?: () => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  project,
  onEdit,
  onDelete,
  onArchive,
  onDownload,
}) => {
  const options: DropdownOption[] = [
    {
      label: 'تعديل',
      value: 'edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit,
    },
    {
      label: 'تحميل',
      value: 'download',
      icon: <Download className="w-4 h-4" />,
      onClick: onDownload,
    },
    {
      label: project.status === 'archived' ? 'إلغاء الأرشفة' : 'أرشفة',
      value: 'archive',
      icon: <Archive className="w-4 h-4" />,
      onClick: onArchive,
    },
    {
      label: 'حذف',
      value: 'delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      disabled: project.status === 'deleted',
    },
  ];

  return (
    <Dropdown
      options={options}
      trigger={
        <button className="p-2 rounded hover:bg-ide-border transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      }
    />
  );
};

export default ProjectActions;

