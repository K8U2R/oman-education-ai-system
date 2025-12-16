import React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type BuildStatus = 'success' | 'error' | 'building' | 'idle';

const ProjectStatus: React.FC = () => {
  const [status] = React.useState<BuildStatus>('success');

  const statusConfig = {
    success: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-900/20',
      text: 'نجح البناء',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-900/20',
      text: 'فشل البناء',
    },
    building: {
      icon: Loader2,
      color: 'text-blue-500',
      bg: 'bg-blue-900/20',
      text: 'جاري البناء...',
    },
    idle: {
      icon: CheckCircle2,
      color: 'text-ide-text-secondary',
      bg: 'bg-ide-surface',
      text: 'جاهز',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`p-4 ${config.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${config.color} ${status === 'building' ? 'animate-spin' : ''}`} />
        <h3 className="text-sm font-semibold">{config.text}</h3>
      </div>
      <p className="text-xs text-ide-text-secondary mb-2">
        المشروع جاهز للتطوير
      </p>
      <button className="w-full py-1.5 px-3 bg-ide-accent text-white text-xs rounded-md hover:bg-ide-accent-hover transition-colors">
        بناء المشروع
      </button>
    </div>
  );
};

export default ProjectStatus;

