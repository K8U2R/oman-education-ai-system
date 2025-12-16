import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamList from './components/TeamList';
import SharedProjects from './components/SharedProjects';
import InviteModal from './components/InviteModal';

const CollaborationPage: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-8 h-8 text-ide-accent" />
              <h1 className="text-3xl font-bold">التعاون</h1>
            </div>
            <p className="text-ide-text-secondary">إدارة الفريق والمشاريع المشتركة</p>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus className="w-4 h-4" />
            دعوة عضو
          </Button>
        </div>

        {/* Team List */}
        <Card>
          <TeamList />
        </Card>

        {/* Shared Projects */}
        <Card>
          <SharedProjects />
        </Card>

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal onClose={() => setShowInviteModal(false)} />
        )}
      </div>
    </div>
  );
};

export default CollaborationPage;

