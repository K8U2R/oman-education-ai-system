import React from 'react';

interface EditorMinimapProps {
  content: string;
  scrollPosition: number;
  onScrollToLine?: (line: number) => void;
}

const EditorMinimap: React.FC<EditorMinimapProps> = ({
  content,
  scrollPosition,
  onScrollToLine: _onScrollToLine,
}) => {
  const lines = content.split('\n');
  const totalLines = lines.length;

  return (
    <div className="w-12 bg-ide-bg border-l border-ide-border overflow-hidden relative">
      <div
        className="absolute top-0 right-0 w-full bg-ide-accent/20 border border-ide-accent/50"
        style={{
          height: `${(100 / totalLines) * 20}%`,
          top: `${(scrollPosition / totalLines) * 100}%`,
        }}
      />
      <div className="text-[2px] font-mono text-ide-text-secondary opacity-50 p-1">
        {lines.slice(0, 100).map((line, index) => (
          <div key={index} className="h-[1px]">
            {line.substring(0, 20)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorMinimap;

