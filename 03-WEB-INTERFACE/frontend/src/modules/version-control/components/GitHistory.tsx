import React from 'react';
import { History, User, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatRelativeTime } from '@/utils/helpers';

interface Commit {
  id: string;
  message: string;
  author: string;
  date: Date;
  hash: string;
}

const GitHistory: React.FC = () => {
  // Mock data
  const commits: Commit[] = [
    {
      id: '1',
      message: 'feat: add new feature',
      author: 'أحمد محمد',
      date: new Date(),
      hash: 'a1b2c3d',
    },
    {
      id: '2',
      message: 'fix: resolve bug',
      author: 'فاطمة علي',
      date: new Date(Date.now() - 3600000),
      hash: 'e4f5g6h',
    },
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-ide-accent" />
        <h3 className="text-lg font-semibold">سجل Commits</h3>
      </div>
      <div className="space-y-3">
        {commits.map((commit) => (
          <div
            key={commit.id}
            className="p-3 rounded-lg border border-ide-border hover:bg-ide-surface transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium mb-1">{commit.message}</h4>
                <div className="flex items-center gap-4 text-xs text-ide-text-secondary">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{commit.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatRelativeTime(commit.date)}</span>
                  </div>
                </div>
              </div>
              <code className="text-xs text-ide-accent">{commit.hash}</code>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GitHistory;

