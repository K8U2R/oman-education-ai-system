import React from 'react';
import FileExplorer from '@/modules/file-explorer/FileExplorer';
import FileOperations from '@/modules/file-explorer/FileOperations';
import ProjectStatus from '@/modules/file-explorer/ProjectStatus';
import ProjectManager from '@/modules/project-management/ProjectManager';
import AIChat from '@/modules/ai-assistant/AIChat';

const LeftPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-ide-surface">
      {/* Project Manager */}
      <div className="border-b border-ide-border">
        <ProjectManager />
      </div>

      {/* Project Status */}
      <div className="border-b border-ide-border">
        <ProjectStatus />
      </div>

      {/* File Operations */}
      <FileOperations />

      {/* File Explorer */}
      <div className="flex-1 overflow-auto">
        <FileExplorer />
      </div>

      {/* AI Chat */}
      <div className="border-t border-ide-border">
        <AIChat />
      </div>
    </div>
  );
};

export default LeftPanel;

