import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

interface PersonalInfoProps {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  onUpdate: (updates: Partial<{ name: string; email: string }>) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onUpdate }) => {
  const { showSuccess } = useErrorHandler();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await apiClient.patch<typeof user>(
        API_ENDPOINTS.user.profile,
        { name, email }
      );
      onUpdate(updatedUser);
      showSuccess('تم الحفظ', 'تم تحديث المعلومات الشخصية بنجاح');
    } catch (error) {
      // Error handling is done by useErrorHandler in the component
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="الاسم الكامل"
        value={name}
        onChange={(e) => setName(e.target.value)}
        leftIcon={<span>👤</span>}
      />
      <Input
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<span>📧</span>}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="w-4 h-4" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfo;

