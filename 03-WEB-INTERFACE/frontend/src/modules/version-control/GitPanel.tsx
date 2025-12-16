import React, { useState } from 'react';
import { GitBranch, GitCommit, RefreshCw, Plus, Minus } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface GitStatus {
  branch: string;
  changes: {
    added: string[];
    modified: string[];
    deleted: string[];
  };
  commits: number;
}

const GitPanel: React.FC = () => {
  const { showInfo, showSuccess } = useErrorHandler();
  const [status] = useState<GitStatus>({
    branch: 'main',
    changes: {
      added: [],
      modified: [],
      deleted: [],
    },
    commits: 0,
  });
  const [commitMessage, setCommitMessage] = useState('');

  const handleRefresh = () => {
    showInfo('تحديث', 'جاري تحديث حالة Git...');
    // This would call Git API
  };

  const handleStageAll = () => {
    showInfo('إضافة', 'جاري إضافة جميع الملفات...');
    // This would call Git API
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      showInfo('تحذير', 'يرجى إدخال رسالة commit');
      return;
    }
    showSuccess('تم الـ Commit', `تم إنشاء commit: "${commitMessage}"`);
    setCommitMessage('');
    // This would call Git API
  };

  return (
    <div className="h-full flex flex-col bg-ide-surface">
      <div className="p-4 border-b border-ide-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Git
          </h3>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded hover:bg-ide-border transition-colors"
            aria-label="تحديث"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs mb-4">
          <p className="text-ide-text-secondary mb-1">الفرع الحالي:</p>
          <p className="font-medium flex items-center gap-2">
            <GitBranch className="w-3 h-3" />
            {status.branch}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold">التغييرات</h4>
            <button
              onClick={handleStageAll}
              className="text-xs text-ide-accent hover:underline"
            >
              إضافة الكل
            </button>
          </div>

          {status.changes.added.length === 0 &&
          status.changes.modified.length === 0 &&
          status.changes.deleted.length === 0 ? (
            <p className="text-xs text-ide-text-secondary">لا توجد تغييرات</p>
          ) : (
            <div className="space-y-2 text-xs">
              {status.changes.added.map((file) => (
                <div key={file} className="flex items-center gap-2 text-green-400">
                  <Plus className="w-3 h-3" />
                  <span>{file}</span>
                </div>
              ))}
              {status.changes.modified.map((file) => (
                <div key={file} className="flex items-center gap-2 text-yellow-400">
                  <Minus className="w-3 h-3" />
                  <span>{file}</span>
                </div>
              ))}
              {status.changes.deleted.map((file) => (
                <div key={file} className="flex items-center gap-2 text-red-400">
                  <Minus className="w-3 h-3" />
                  <span>{file}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold mb-2">Commit</h4>
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="رسالة commit..."
            className="w-full px-2 py-1.5 text-xs rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-1 focus:ring-ide-accent resize-none"
            rows={3}
          />
          <button
            onClick={handleCommit}
            disabled={!commitMessage.trim()}
            className="mt-2 w-full px-3 py-1.5 text-xs bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <GitCommit className="w-3 h-3" />
            Commit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitPanel;

