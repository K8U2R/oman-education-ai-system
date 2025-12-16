import React from 'react';
import { FolderOpen, Clock, Code } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime } from '@/utils/helpers';
import { Project } from '@/utils/types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onSettings?: () => void;
  onDelete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onSettings,
  onDelete,
}) => {
  const statusColors = {
    active: 'success',
    archived: 'warning',
    deleted: 'error',
  } as const;

  const statusLabels = {
    active: 'نشط',
    archived: 'مؤرشف',
    deleted: 'محذوف',
  };

  return (
    <Card
      variant="elevated"
      className="cursor-pointer hover:border-ide-accent/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-ide-accent" />
          <h3 className="font-semibold text-lg">{project.name}</h3>
        </div>
        <Badge variant={statusColors[project.status]} size="sm">
          {statusLabels[project.status]}
        </Badge>
      </div>

      {project.description && (
        <p className="text-sm text-ide-text-secondary mb-3 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-ide-text-secondary mb-3">
        <div className="flex items-center gap-1">
          <Code className="w-3 h-3" />
          <span>{project.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(project.updatedAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-ide-border">
        <span className="text-xs text-ide-text-secondary">
          {formatRelativeTime(project.createdAt)}
        </span>
        <div className="flex gap-2">
          {onSettings && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettings();
              }}
              className="p-1.5 rounded hover:bg-ide-border transition-colors"
              aria-label="الإعدادات"
            >
              ⚙️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded hover:bg-red-900/20 text-red-400 transition-colors"
              aria-label="حذف"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;

