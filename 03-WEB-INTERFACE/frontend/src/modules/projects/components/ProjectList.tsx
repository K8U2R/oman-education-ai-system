import React from 'react';
import { FolderOpen, MoreVertical, Clock } from 'lucide-react';
import { useProjectsStore, Project } from '@/store/projects-store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ProjectListProps {
  projects: Project[];
  searchQuery: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, searchQuery }) => {
  const { setActiveProject } = useProjectsStore();

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <div className="space-y-2">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 rounded-md hover:bg-ide-border transition-colors cursor-pointer"
            onClick={() => setActiveProject(project)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-ide-accent/20 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-ide-accent" />
              </div>
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex items-center gap-2 text-sm text-ide-text-secondary">
                  <span>{project.type}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(project.updatedAt).toLocaleDateString('ar')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs ${
                project.status === 'active' ? 'bg-green-900/20 text-green-400' :
                project.status === 'archived' ? 'bg-yellow-900/20 text-yellow-400' :
                'bg-red-900/20 text-red-400'
              }`}>
                {project.status === 'active' ? 'نشط' :
                 project.status === 'archived' ? 'مؤرشف' : 'محذوف'}
              </span>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProjectList;

