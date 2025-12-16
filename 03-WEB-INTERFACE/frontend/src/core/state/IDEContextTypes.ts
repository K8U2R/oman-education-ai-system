/**
 * IDE Context Types
 * أنواع IDE Context
 */

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

export interface IDEState {
  files: FileNode[];
  openFiles: string[];
  activeFile: string | null;
  sidebarOpen: boolean;
}

export interface IDEContextType {
  state: IDEState;
  setState: (state: Partial<IDEState>) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  toggleSidebar: () => void;
}

