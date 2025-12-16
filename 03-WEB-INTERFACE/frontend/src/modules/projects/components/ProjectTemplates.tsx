import React from 'react';
import { FileCode, Package, Globe, Database } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: 'react' | 'node' | 'python' | 'other';
  icon: React.ComponentType<{ className?: string }>;
}

interface ProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

const ProjectTemplates: React.FC<ProjectTemplatesProps> = ({ onSelectTemplate }) => {
  const templates: ProjectTemplate[] = [
    {
      id: 'react',
      name: 'React App',
      description: 'تطبيق React مع TypeScript و Vite',
      type: 'react',
      icon: FileCode,
    },
    {
      id: 'node',
      name: 'Node.js API',
      description: 'API server مع Express و TypeScript',
      type: 'node',
      icon: Package,
    },
    {
      id: 'python',
      name: 'Python Project',
      description: 'مشروع Python مع FastAPI',
      type: 'python',
      icon: Database,
    },
    {
      id: 'web',
      name: 'Static Website',
      description: 'موقع ويب ثابت مع HTML/CSS/JS',
      type: 'other',
      icon: Globe,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => {
        const Icon = template.icon;
        return (
          <Card key={template.id} variant="elevated" className="hover:border-ide-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-ide-accent/20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-ide-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-ide-text-secondary mb-3">
                  {template.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectTemplate(template)}
                >
                  استخدام القالب
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectTemplates;

