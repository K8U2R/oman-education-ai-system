import React from 'react';
import { GitBranch, FileDiff, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface GitStatusProps {
  branch?: string;
  modified?: number;
  staged?: number;
  untracked?: number;
}

const GitStatus: React.FC<GitStatusProps> = ({
  branch = 'main',
  modified = 0,
  staged = 0,
  untracked = 0,
}) => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-ide-accent" />
        <h3 className="text-lg font-semibold">حالة Git</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">الفرع الحالي</span>
          <Badge variant="info">{branch}</Badge>
        </div>
        {modified > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileDiff className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">ملفات معدلة</span>
            </div>
            <Badge variant="warning">{modified}</Badge>
          </div>
        )}
        {staged > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileDiff className="w-4 h-4 text-green-500" />
              <span className="text-sm">ملفات في Staging</span>
            </div>
            <Badge variant="success">{staged}</Badge>
          </div>
        )}
        {untracked > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm">ملفات غير متتبعة</span>
            </div>
            <Badge variant="info">{untracked}</Badge>
          </div>
        )}
        {modified === 0 && staged === 0 && untracked === 0 && (
          <p className="text-sm text-ide-text-secondary text-center py-4">
            لا توجد تغييرات
          </p>
        )}
      </div>
    </Card>
  );
};

export default GitStatus;

