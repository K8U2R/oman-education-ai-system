import React, { useState } from 'react';
import { Plus, Grid, List, Search, Filter } from 'lucide-react';
import { useProjectsStore } from '@/store/projects-store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProjectGrid from './components/ProjectGrid';
import ProjectList from './components/ProjectList';
import ProjectFilters from './components/ProjectFilters';
import ProjectCreateModal from './components/ProjectCreateModal';

type ViewMode = 'grid' | 'list';

const ProjectsPage: React.FC = () => {
  const { projects } = useProjectsStore();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">المشاريع</h1>
            <p className="text-ide-text-secondary">إدارة جميع مشاريعك في مكان واحد</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            مشروع جديد
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ide-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مشروع..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent"
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              فلاتر
            </Button>
            <div className="flex gap-2 border border-ide-border rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-ide-accent text-white' : 'text-ide-text-secondary hover:bg-ide-border'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-ide-accent text-white' : 'text-ide-text-secondary hover:bg-ide-border'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-ide-border">
              <ProjectFilters />
            </div>
          )}
        </Card>

        {/* Projects Display */}
        {projects.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-ide-text-secondary mb-4">لا توجد مشاريع بعد</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                إنشاء مشروع جديد
              </Button>
            </div>
          </Card>
        ) : (
          viewMode === 'grid' ? (
            <ProjectGrid projects={projects} searchQuery={searchQuery} />
          ) : (
            <ProjectList projects={projects} searchQuery={searchQuery} />
          )
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <ProjectCreateModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

