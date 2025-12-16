import React from 'react';
import { FolderOpen, Users, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatRelativeTime } from '@/utils/helpers';

const SharedProjects: React.FC = () => {
  const projects = [
    {
      id: '1',
      name: 'Project Alpha',
      members: 3,
      lastActive: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      name: 'Project Beta',
      members: 5,
      lastActive: new Date(Date.now() - 7200000),
    },
    {
      id: '3',
      name: 'Project Gamma',
      members: 2,
      lastActive: new Date(Date.now() - 86400000),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="w-5 h-5 text-ide-accent" />
        <h2 className="text-xl font-semibold">المشاريع المشتركة</h2>
      </div>
      <div className="space-y-3">
        {projects.map((project) => (
          <Card key={project.id} variant="elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-ide-accent" />
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-ide-text-secondary mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{project.members} أعضاء</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(project.lastActive)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-md bg-ide-accent/10 text-ide-accent hover:bg-ide-accent/20 transition-colors">
                فتح
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SharedProjects;

