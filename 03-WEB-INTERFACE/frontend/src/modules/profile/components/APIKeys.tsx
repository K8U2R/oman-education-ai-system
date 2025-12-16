import React, { useState } from 'react';
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { copyToClipboard } from '@/utils/helpers';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  masked: boolean;
}

const APIKeys: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [keys, setKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'sk_live_1234567890abcdef',
      createdAt: new Date(),
      lastUsed: new Date(),
      masked: true,
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substr(2, 32)}`,
      createdAt: new Date(),
      masked: false,
    };

    setKeys([...keys, newKey]);
    setNewKeyName('');
    setShowCreateModal(false);
    showSuccess('تم الإنشاء', 'تم إنشاء مفتاح API جديد');
  };

  const handleCopy = async (key: string) => {
    const success = await copyToClipboard(key);
    if (success) {
      showSuccess('تم النسخ', 'تم نسخ المفتاح إلى الحافظة');
    }
  };

  const handleToggleMask = (id: string) => {
    setKeys(keys.map((k) => (k.id === id ? { ...k, masked: !k.masked } : k)));
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
    showSuccess('تم الحذف', 'تم حذف المفتاح');
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Key className="w-5 h-5" />
          مفاتيح API
        </h3>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          إنشاء مفتاح جديد
        </Button>
      </div>

      <div className="space-y-3">
        {keys.map((apiKey) => (
          <Card key={apiKey.id} variant="elevated">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{apiKey.name}</h4>
                  <span className="text-xs text-ide-text-secondary">
                    {new Date(apiKey.createdAt).toLocaleDateString('ar')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-ide-bg px-2 py-1 rounded border border-ide-border">
                    {apiKey.masked ? maskKey(apiKey.key) : apiKey.key}
                  </code>
                  <button
                    onClick={() => handleCopy(apiKey.key)}
                    className="p-1 rounded hover:bg-ide-border transition-colors"
                    aria-label="نسخ"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleMask(apiKey.id)}
                    className="p-1 rounded hover:bg-ide-border transition-colors"
                    aria-label="إظهار/إخفاء"
                  >
                    {apiKey.masked ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {apiKey.lastUsed && (
                  <p className="text-xs text-ide-text-secondary mt-2">
                    آخر استخدام: {new Date(apiKey.lastUsed).toLocaleDateString('ar')}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(apiKey.id)}
                className="p-2 rounded hover:bg-red-900/20 text-red-400 transition-colors"
                aria-label="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="إنشاء مفتاح API جديد"
        >
          <div className="space-y-4">
            <Input
              label="اسم المفتاح"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="مثال: Production Key"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateKey}>إنشاء</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default APIKeys;

