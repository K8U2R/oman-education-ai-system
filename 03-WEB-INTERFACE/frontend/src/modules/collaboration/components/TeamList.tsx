import React from 'react';
import { User, Shield } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const TeamList: React.FC = () => {
  const teamMembers = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'owner',
      avatar: undefined,
      status: 'online' as const,
    },
    {
      id: '2',
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      role: 'admin',
      avatar: undefined,
      status: 'away' as const,
    },
    {
      id: '3',
      name: 'خالد سعيد',
      email: 'khalid@example.com',
      role: 'member',
      avatar: undefined,
      status: 'offline' as const,
    },
  ];

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

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-ide-accent" />
        <h2 className="text-xl font-semibold">أعضاء الفريق</h2>
      </div>
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-lg border border-ide-border hover:bg-ide-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar
                name={member.name}
                size="md"
                status={member.status}
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
            <div className="flex gap-2">
              <button className="p-2 rounded hover:bg-ide-border transition-colors">
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;

