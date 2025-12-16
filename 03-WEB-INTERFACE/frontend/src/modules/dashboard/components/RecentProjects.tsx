import React from 'react';
import { FolderOpen, Clock, MoreVertical, Code, GitBranch, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const RecentProjects: React.FC = () => {
  const projects = [
    {
      id: '1',
      name: 'مشروع React',
      type: 'React',
      lastModified: new Date(Date.now() - 7200000), // منذ ساعتين
      status: 'active',
      fileCount: 45,
      commitCount: 23,
      teamMembers: 3,
      progress: 75,
    },
    {
      id: '2',
      name: 'مشروع Node.js',
      type: 'Node.js',
      lastModified: new Date(Date.now() - 86400000), // منذ يوم
      status: 'active',
      fileCount: 32,
      commitCount: 18,
      teamMembers: 2,
      progress: 60,
    },
    {
      id: '3',
      name: 'مشروع Python',
      type: 'Python',
      lastModified: new Date(Date.now() - 259200000), // منذ 3 أيام
      status: 'archived',
      fileCount: 28,
      commitCount: 15,
      teamMembers: 1,
      progress: 90,
    },
    {
      id: '4',
      name: 'مشروع Office',
      type: 'Office',
      lastModified: new Date(Date.now() - 3600000), // منذ ساعة
      status: 'active',
      fileCount: 12,
      commitCount: 8,
      teamMembers: 4,
      progress: 45,
    },
  ];

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    return 'الآن';
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          المشاريع الأخيرة
        </h2>
        <Link to="/projects">
          <Button variant="ghost" size="sm">
            عرض الكل
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block"
          >
            <div className="flex items-center justify-between p-4 rounded-md hover:bg-ide-border transition-colors cursor-pointer border border-ide-border">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-ide-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-6 h-6 text-ide-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{project.name}</p>
                    <Badge
                      variant={project.status === 'active' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {project.status === 'active' ? 'نشط' : 'مؤرشف'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ide-text-secondary mb-2">
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {project.fileCount} ملف
                    </span>
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {project.commitCount} commit
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.teamMembers} عضو
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(project.lastModified)}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-ide-text-secondary">التقدم</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-ide-bg rounded-full h-1.5">
                      <div
                        className="bg-ide-accent h-1.5 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => e.preventDefault()}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default RecentProjects;

