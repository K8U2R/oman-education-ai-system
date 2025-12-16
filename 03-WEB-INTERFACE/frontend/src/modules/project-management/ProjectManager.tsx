import React, { useState } from 'react';
import { FolderOpen, Play, Square, Settings, Package } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface Project {
  name: string;
  path: string;
  type: 'react' | 'node' | 'python' | 'other';
  scripts?: Record<string, string>;
}

const ProjectManager: React.FC = () => {
  const { showSuccess, showInfo } = useErrorHandler();
  const [project] = useState<Project | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleOpenProject = () => {
    showInfo('فتح المشروع', 'جاري فتح المشروع...');
    // This would integrate with file system API
  };

  const handleBuild = async () => {
    if (!project) return;

    setIsBuilding(true);
    try {
      // Simulate build
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showSuccess('نجح البناء', 'تم بناء المشروع بنجاح');
    } catch (error) {
      // Error handled by error service
    } finally {
      setIsBuilding(false);
    }
  };

  const handleRun = async () => {
    if (!project) return;

    setIsRunning(true);
    try {
      // Simulate run
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess('تم التشغيل', 'تم تشغيل المشروع بنجاح');
    } catch (error) {
      // Error handled by error service
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    showInfo('تم الإيقاف', 'تم إيقاف المشروع');
  };

  return (
    <div className="p-4 border-b border-ide-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          إدارة المشروع
        </h3>
        <button
          onClick={handleOpenProject}
          className="p-1.5 rounded hover:bg-ide-border transition-colors"
          aria-label="فتح المشروع"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {project ? (
        <div className="space-y-2">
          <div className="text-xs">
            <p className="text-ide-text-secondary">المشروع:</p>
            <p className="font-medium">{project.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBuild}
              disabled={isBuilding}
              className="flex-1 px-3 py-1.5 text-xs bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <Package className="w-3 h-3" />
              {isBuilding ? 'جاري البناء...' : 'بناء'}
            </button>
            {isRunning ? (
              <button
                onClick={handleStop}
                className="flex-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
              >
                <Square className="w-3 h-3" />
                إيقاف
              </button>
            ) : (
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                تشغيل
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-xs text-ide-text-secondary mb-2">لا يوجد مشروع مفتوح</p>
          <button
            onClick={handleOpenProject}
            className="px-3 py-1.5 text-xs bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors"
          >
            فتح مشروع
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;

