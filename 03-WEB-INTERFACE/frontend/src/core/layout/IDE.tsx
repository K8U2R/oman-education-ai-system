import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import BottomPanel from './BottomPanel';
import Canvas from './Canvas';
import { useIDE } from '@/core/state/useIDE';

const IDE: React.FC = () => {
  const {
    sidebarOpen,
    leftPanelOpen,
    rightPanelOpen,
    bottomPanelOpen,
    leftPanelWidth,
    rightPanelWidth,
    bottomPanelHeight,
  } = useIDE();

  return (
    <div className="flex flex-col h-screen bg-ide-bg text-ide-text overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {sidebarOpen && <Sidebar />}

        {/* Left Panel (File Explorer) */}
        {leftPanelOpen && (
          <div className="flex-shrink-0 border-r border-ide-border" style={{ width: `${leftPanelWidth}px` }}>
            <LeftPanel />
          </div>
        )}

        {/* Center Canvas (Editor) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Canvas />
          {bottomPanelOpen && (
            <div className="flex-shrink-0 border-t border-ide-border" style={{ height: `${bottomPanelHeight}px` }}>
              <BottomPanel />
            </div>
          )}
        </div>

        {/* Right Panel (Properties/Settings) */}
        {rightPanelOpen && (
          <div className="flex-shrink-0 border-l border-ide-border" style={{ width: `${rightPanelWidth}px` }}>
            <RightPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default IDE;

