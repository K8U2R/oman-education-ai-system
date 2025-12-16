import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { useIDE } from '@/core/state/useIDE';

export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PermissionsManagerProps {
  permissions: Permission[];
  onUpdate?: (permissions: Permission[]) => void;
}

const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  permissions,
  onUpdate,
}) => {
  const { showSuccess } = useErrorHandler();
  const [localPermissions, setLocalPermissions] = useState(permissions);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string) => {
    setLocalPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const { activeProjectId } = useIDE();

  const handleSave = async () => {
    if (!activeProjectId) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedPermissions = await apiClient.put<Permission[]>(
        API_ENDPOINTS.projects.get(activeProjectId) + '/permissions',
        localPermissions
      );
      
      if (onUpdate) {
        onUpdate(updatedPermissions);
      }
      showSuccess('تم الحفظ', 'تم تحديث الصلاحيات بنجاح');
    } catch (error) {
      // Error handling is done by useErrorHandler in the component
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-ide-accent" />
        <h2 className="text-lg font-semibold">إدارة الصلاحيات</h2>
      </div>
      <div className="space-y-4">
        {localPermissions.map((permission) => (
          <div key={permission.id} className="flex items-start gap-3">
            <Checkbox
              checked={permission.enabled}
              onChange={() => handleToggle(permission.id)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{permission.name}</h3>
                {permission.id === 'admin' && (
                  <Lock className="w-4 h-4 text-ide-text-secondary" />
                )}
              </div>
              <p className="text-sm text-ide-text-secondary">
                {permission.description}
              </p>
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-4 border-t border-ide-border">
          <Button onClick={handleSave} isLoading={isSaving}>
            حفظ التغييرات
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PermissionsManager;

