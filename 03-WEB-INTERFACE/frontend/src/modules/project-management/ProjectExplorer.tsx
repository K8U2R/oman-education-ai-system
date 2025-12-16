import React from 'react';
import { FileText, Folder, Package, Settings as SettingsIcon } from 'lucide-react';

interface ProjectFile {
  name: string;
  path: string;
  type: 'file' | 'folder';
  icon?: React.ReactNode;
}

const ProjectExplorer: React.FC = () => {
  const projectFiles: ProjectFile[] = [
    { name: 'package.json', path: 'package.json', type: 'file', icon: <Package className="w-4 h-4" /> },
    { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file', icon: <SettingsIcon className="w-4 h-4" /> },
    { name: 'src', path: 'src', type: 'folder', icon: <Folder className="w-4 h-4" /> },
    { name: 'public', path: 'public', type: 'folder', icon: <Folder className="w-4 h-4" /> },
  ];

  return (
    <div className="p-2">
      <h3 className="text-xs font-semibold mb-2 px-2">مستكشف المشروع</h3>
      <div className="space-y-1">
        {projectFiles.map((file) => (
          <div
            key={file.path}
            className="flex items-center gap-2 px-2 py-1 hover:bg-ide-border cursor-pointer text-xs rounded"
          >
            {file.icon || (file.type === 'folder' ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />)}
            <span>{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectExplorer;

