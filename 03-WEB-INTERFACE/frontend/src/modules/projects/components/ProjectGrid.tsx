import React from 'react';
import { FolderOpen, MoreVertical, Clock } from 'lucide-react';
import { useProjectsStore, Project } from '@/store/projects-store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ProjectGridProps {
  projects: Project[];
  searchQuery: string;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, searchQuery }) => {
  const { setActiveProject } = useProjectsStore();

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProjects.map((project) => (
        <Card
          key={project.id}
          variant="elevated"
          className="hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setActiveProject(project)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-ide-accent/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-ide-accent" />
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
          <p className="text-sm text-ide-text-secondary mb-4">{project.type}</p>

          <div className="flex items-center justify-between text-xs text-ide-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(project.updatedAt).toLocaleDateString('ar')}</span>
            </div>
            <span className={`px-2 py-1 rounded ${
              project.status === 'active' ? 'bg-green-900/20 text-green-400' :
              project.status === 'archived' ? 'bg-yellow-900/20 text-yellow-400' :
              'bg-red-900/20 text-red-400'
            }`}>
              {project.status === 'active' ? 'نشط' :
               project.status === 'archived' ? 'مؤرشف' : 'محذوف'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectGrid;

