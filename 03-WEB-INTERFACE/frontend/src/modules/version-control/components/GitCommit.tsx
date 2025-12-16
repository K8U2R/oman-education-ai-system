import React, { useState } from 'react';
import { GitCommit, Send } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const GitCommit: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [amend, setAmend] = useState(false);

  const handleCommit = async () => {
    if (!message.trim()) return;

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showSuccess('تم الـ Commit', 'تم إنشاء commit بنجاح');
    setMessage('');
    setDescription('');
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <GitCommit className="w-5 h-5 text-ide-accent" />
        <h3 className="text-lg font-semibold">إنشاء Commit</h3>
      </div>
      <div className="space-y-4">
        <Input
          label="رسالة Commit"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="feat: add new feature"
          required
        />
        <Input
          label="الوصف (اختياري)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          placeholder="وصف تفصيلي للتغييرات..."
        />
        <Checkbox
          label="Amend previous commit"
          checked={amend}
          onChange={setAmend}
        />
        <div className="flex justify-end">
          <Button onClick={handleCommit} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
            Commit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GitCommit;

