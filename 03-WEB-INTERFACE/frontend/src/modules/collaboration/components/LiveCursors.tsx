import React, { useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import Card from '@/components/ui/Card';

export interface Cursor {
  id: string;
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
}

interface LiveCursorsProps {
  cursors: Cursor[];
  onCursorMove?: (cursor: Cursor) => void;
}

const LiveCursors: React.FC<LiveCursorsProps> = ({ cursors, onCursorMove: _onCursorMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // This would typically be sent via WebSocket
      // For now, we'll just log it
      console.log('Cursor moved:', { x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-ide-accent" />
        <h2 className="text-lg font-semibold">المؤشرات الحية</h2>
        <span className="text-sm text-ide-text-secondary">({cursors.length})</span>
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-64 bg-ide-bg border border-ide-border rounded overflow-hidden"
      >
        {cursors.map((cursor) => (
          <div
            key={cursor.id}
            className="absolute pointer-events-none"
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: cursor.color }}
            />
            <div
              className="absolute top-5 right-1/2 transform translate-x-1/2 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </div>
          </div>
        ))}
        {cursors.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-ide-text-secondary">
            <p>لا توجد مؤشرات نشطة</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveCursors;

