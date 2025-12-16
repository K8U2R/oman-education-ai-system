import React, { useState } from 'react';
import { Mail, UserPlus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { useIDE } from '@/core/state/useIDE';

interface InviteModalProps {
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
  const { showSuccess } = useErrorHandler();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);

  const { activeProjectId } = useIDE();

  const handleInvite = async () => {
    if (!email || !activeProjectId) return;

    setIsInviting(true);
    try {
      await apiClient.post(
        API_ENDPOINTS.projects.get(activeProjectId) + '/invite',
        { email, role }
      );
      showSuccess('تم الإرسال', 'تم إرسال دعوة بنجاح');
      setEmail('');
      onClose();
    } catch (error) {
      // Error handling is done by useErrorHandler in the component
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="دعوة عضو جديد"
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          leftIcon={<Mail className="w-4 h-4" />}
        />
        <Select
          label="الدور"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: 'member', label: 'عضو' },
            { value: 'admin', label: 'مدير' },
          ]}
        />
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleInvite} isLoading={isInviting}>
            <UserPlus className="w-4 h-4" />
            إرسال دعوة
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteModal;

