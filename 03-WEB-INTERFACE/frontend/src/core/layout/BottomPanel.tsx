import React, { useState } from 'react';
import Terminal from '@/modules/terminal/Terminal';
import Console from '@/modules/terminal/Console';

const BottomPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'console'>('terminal');

  return (
    <div className="h-full flex flex-col bg-ide-surface">
      {/* Tabs */}
      <div className="flex border-b border-ide-border">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'terminal'
              ? 'text-ide-text border-b-2 border-ide-accent'
              : 'text-ide-text-secondary hover:text-ide-text'
          }`}
          onClick={() => setActiveTab('terminal')}
        >
          الطرفية
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'console'
              ? 'text-ide-text border-b-2 border-ide-accent'
              : 'text-ide-text-secondary hover:text-ide-text'
          }`}
          onClick={() => setActiveTab('console')}
        >
          الكونسول
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'terminal' && <Terminal />}
        {activeTab === 'console' && <Console />}
      </div>
    </div>
  );
};

export default BottomPanel;

