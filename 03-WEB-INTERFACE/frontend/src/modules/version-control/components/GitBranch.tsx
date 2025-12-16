import React, { useState } from 'react';
import { GitBranch, Plus, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const GitBranch: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [branches] = useState(['main', 'develop', 'feature/new-feature']);
  const [currentBranch] = useState('main');
  const [newBranchName, setNewBranchName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    showSuccess('تم الإنشاء', `تم إنشاء الفرع ${newBranchName} بنجاح`);
    setNewBranchName('');
    setShowCreate(false);
  };

  const handleSwitchBranch = async (branch: string) => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    showSuccess('تم التبديل', `تم التبديل إلى الفرع ${branch}`);
  };

  const handleDeleteBranch = async (branch: string) => {
    if (branch === currentBranch) {
      showSuccess('خطأ', 'لا يمكن حذف الفرع الحالي');
      return;
    }

    if (window.confirm(`هل أنت متأكد من حذف الفرع ${branch}؟`)) {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      showSuccess('تم الحذف', `تم حذف الفرع ${branch}`);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold">الفروع</h3>
        </div>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="w-4 h-4" />
          فرع جديد
        </Button>
      </div>

      {showCreate && (
        <div className="mb-4 p-3 bg-ide-bg rounded-lg border border-ide-border">
          <Input
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="اسم الفرع الجديد"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateBranch();
              }
            }}
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleCreateBranch}>
              إنشاء
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowCreate(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {branches.map((branch) => (
          <div
            key={branch}
            className="flex items-center justify-between p-2 rounded hover:bg-ide-border transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{branch}</span>
              {branch === currentBranch && (
                <Badge variant="success" size="sm">حالي</Badge>
              )}
            </div>
            <div className="flex gap-2">
              {branch !== currentBranch && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSwitchBranch(branch)}
                >
                  التبديل
                </Button>
              )}
              {branch !== currentBranch && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400"
                  onClick={() => handleDeleteBranch(branch)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GitBranch;

