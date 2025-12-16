/* eslint-disable react-refresh/only-export-components */
import React, { createContext, ReactNode } from 'react';
import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface IDEState {
  // Layout state
  leftPanelWidth: number;
  rightPanelWidth: number;
  bottomPanelHeight: number;
  sidebarOpen: boolean;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;

  // File state
  openFiles: string[];
  activeFile: string | null;
  fileTree: FileNode[];

  // Editor state
  editorTheme: string;
  fontSize: number;
  wordWrap: boolean;

  // Actions
  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;
  setBottomPanelHeight: (height: number) => void;
  toggleSidebar: () => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  setFileTree: (tree: FileNode[]) => void;
  createFile: (path: string, name: string) => void;
  createFolder: (path: string, name: string) => void;
  renameFile: (oldPath: string, newName: string) => void;
  deleteFile: (path: string) => void;
  setEditorTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  setWordWrap: (wrap: boolean) => void;
  activeSidebarView: 'files' | 'git' | 'extensions' | 'settings';
  setActiveSidebarView: (view: 'files' | 'git' | 'extensions' | 'settings') => void;
}

export const useIDEStore = create<IDEState>((set) => ({
  // Initial state
  leftPanelWidth: 280,
  rightPanelWidth: 300,
  bottomPanelHeight: 200,
  sidebarOpen: true,
  leftPanelOpen: true,
  rightPanelOpen: true,
  bottomPanelOpen: true,
  openFiles: [],
  activeFile: null,
  fileTree: [],
  editorTheme: 'vs-dark',
  fontSize: 14,
  wordWrap: false,
  activeSidebarView: 'files' as 'files' | 'git' | 'extensions' | 'settings',

  // Actions
  setLeftPanelWidth: (width) => set({ leftPanelWidth: width }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),
  setActiveSidebarView: (view: 'files' | 'git' | 'extensions' | 'settings') =>
    set({ activeSidebarView: view }),
  openFile: (path) =>
    set((state) => ({
      openFiles: state.openFiles.includes(path) ? state.openFiles : [...state.openFiles, path],
      activeFile: path,
    })),
  closeFile: (path) =>
    set((state) => {
      const newOpenFiles = state.openFiles.filter((f) => f !== path);
      return {
        openFiles: newOpenFiles,
        activeFile: state.activeFile === path ? (newOpenFiles[newOpenFiles.length - 1] || null) : state.activeFile,
      };
    }),
  setActiveFile: (path) => set({ activeFile: path }),
  setFileTree: (tree) => set({ fileTree: tree }),
  setEditorTheme: (theme) => set({ editorTheme: theme }),
  setFontSize: (size) => set({ fontSize: size }),
  setWordWrap: (wrap) => set({ wordWrap: wrap }),
  createFile: (path, name) => {
    const newFile: FileNode = {
      name,
      path: path ? `${path}/${name}` : name,
      type: 'file',
    };
    set((state) => ({ fileTree: [...state.fileTree, newFile] }));
  },
  createFolder: (path, name) => {
    const newFolder: FileNode = {
      name,
      path: path ? `${path}/${name}` : name,
      type: 'folder',
      children: [],
    };
    set((state) => ({ fileTree: [...state.fileTree, newFolder] }));
  },
  renameFile: (oldPath, newName) => {
    const updateFileTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.path === oldPath) {
          const pathParts = oldPath.split('/');
          pathParts[pathParts.length - 1] = newName;
          return {
            ...node,
            name: newName,
            path: pathParts.join('/'),
          };
        }
        if (node.children) {
          return { ...node, children: updateFileTree(node.children) };
        }
        return node;
      });
    };
    set((state) => ({ fileTree: updateFileTree(state.fileTree) }));
  },
  deleteFile: (path) => {
    const removeFromTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => {
        if (node.path === path) return false;
        if (node.children) {
          node.children = removeFromTree(node.children);
        }
        return true;
      });
    };
    set((state) => ({ fileTree: removeFromTree(state.fileTree) }));
  },
}));

const IDEContext = createContext<typeof useIDEStore | undefined>(undefined);

export const IDEProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <IDEContext.Provider value={useIDEStore}>{children}</IDEContext.Provider>;
};

// Hook is exported from './useIDE' to avoid react-refresh warnings

