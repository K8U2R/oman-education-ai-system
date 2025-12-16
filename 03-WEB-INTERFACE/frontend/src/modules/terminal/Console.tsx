import React from 'react';

const Console: React.FC = () => {
  const logs = [
    { level: 'info', message: 'تم بدء التطبيق', timestamp: new Date().toLocaleTimeString() },
    { level: 'warn', message: 'تم اكتشاف استخدام API قديم', timestamp: new Date().toLocaleTimeString() },
    { level: 'error', message: 'فشل تحميل الوحدة', timestamp: new Date().toLocaleTimeString() },
  ];

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-ide-text-secondary';
    }
  };

  return (
    <div className="h-full p-4 font-mono text-sm overflow-auto">
      {logs.map((log, index) => (
        <div key={index} className="mb-1">
          <span className="text-ide-text-secondary">[{log.timestamp}]</span>{' '}
          <span className={getLogColor(log.level)}>[{log.level.toUpperCase()}]</span>{' '}
          <span className="text-ide-text">{log.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Console;

