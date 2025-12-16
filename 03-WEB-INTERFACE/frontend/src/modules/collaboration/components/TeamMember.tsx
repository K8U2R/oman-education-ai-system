import React from 'react';
import { MoreVertical } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  joinedAt: Date;
}

interface TeamMemberProps {
  member: TeamMember;
  onEdit?: () => void;
  onRemove?: () => void;
  onChangeRole?: (role: TeamMember['role']) => void;
  canEdit?: boolean;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  member,
  onEdit,
  onRemove,
  onChangeRole,
  canEdit = false,
}) => {
  const roleLabels = {
    owner: 'مالك',
    admin: 'مدير',
    member: 'عضو',
  };

  const roleColors = {
    owner: 'error',
    admin: 'warning',
    member: 'info',
  } as const;

  const options: DropdownOption[] = [
    {
      label: 'تعديل',
      value: 'edit',
      onClick: onEdit,
    },
    {
      label: 'تغيير الدور',
      value: 'role',
      onClick: () => {
        // Cycle through roles
        const roles: TeamMember['role'][] = ['member', 'admin', 'owner'];
        const currentIndex = roles.indexOf(member.role);
        const nextRole = roles[(currentIndex + 1) % roles.length];
        onChangeRole?.(nextRole);
      },
    },
    {
      label: 'إزالة',
      value: 'remove',
      onClick: onRemove,
      disabled: member.role === 'owner',
    },
  ];

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-ide-border hover:bg-ide-surface transition-colors">
      <div className="flex items-center gap-3">
        <Avatar
          name={member.name}
          size="md"
          status={member.status}
          src={member.avatar}
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{member.name}</span>
            <Badge variant={roleColors[member.role]} size="sm">
              {roleLabels[member.role]}
            </Badge>
          </div>
          <p className="text-sm text-ide-text-secondary">{member.email}</p>
        </div>
      </div>
      {canEdit && (
        <Dropdown
          options={options}
          trigger={
            <button className="p-2 rounded hover:bg-ide-border transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          }
        />
      )}
    </div>
  );
};

export default TeamMember;

