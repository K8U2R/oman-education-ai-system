import React from 'react';
import { FolderOpen } from 'lucide-react';
import Card from '@/components/ui/Card';

const ProjectAnalytics: React.FC = () => {
  const projects = [
    { name: 'Project 1', files: 45, commits: 12, lastActive: 'منذ ساعتين' },
    { name: 'Project 2', files: 32, commits: 8, lastActive: 'منذ يوم' },
    { name: 'Project 3', files: 67, commits: 15, lastActive: 'منذ 3 أيام' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="w-5 h-5 text-ide-accent" />
        <h2 className="text-xl font-semibold">تحليلات المشاريع</h2>
      </div>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <Card key={index} variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">{project.name}</h3>
                <div className="flex gap-4 text-sm text-ide-text-secondary">
                  <span>{project.files} ملف</span>
                  <span>{project.commits} commit</span>
                  <span>{project.lastActive}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectAnalytics;

