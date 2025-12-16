import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';

interface ProfileHeaderProps {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin';
    createdAt: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <Card variant="elevated">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-ide-accent/20 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-ide-accent" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
          <div className="space-y-1 text-sm text-ide-text-secondary">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>عضو منذ {new Date(user.createdAt).toLocaleDateString('ar')}</span>
            </div>
          </div>
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' 
                ? 'bg-purple-900/20 text-purple-400' 
                : 'bg-blue-900/20 text-blue-400'
            }`}>
              {user.role === 'admin' ? 'مدير' : 'مستخدم'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;

