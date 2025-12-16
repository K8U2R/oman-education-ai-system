import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Star, Download, Package } from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  rating: number;
  downloads: number;
  category: string;
  installed: boolean;
}

interface ExtensionGridProps {
  searchQuery: string;
  category: string;
}

const ExtensionGrid: React.FC<ExtensionGridProps> = ({ searchQuery, category }) => {
  // Mock data
  const extensions: Extension[] = [
    {
      id: '1',
      name: 'React Snippets',
      description: 'مقتطفات كود React مفيدة',
      author: 'FlowForge Team',
      rating: 4.8,
      downloads: 1250,
      category: 'snippets',
      installed: false,
    },
    {
      id: '2',
      name: 'Theme Dark Pro',
      description: 'ثيم داكن احترافي للمحرر',
      author: 'Theme Creator',
      rating: 4.5,
      downloads: 890,
      category: 'themes',
      installed: true,
    },
    {
      id: '3',
      name: 'Git Integration',
      description: 'تكامل Git متقدم',
      author: 'Dev Tools',
      rating: 4.9,
      downloads: 2100,
      category: 'tools',
      installed: false,
    },
  ];

  const filteredExtensions = extensions.filter((ext) => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || ext.category === category;
    return matchesSearch && matchesCategory;
  });

  if (filteredExtensions.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-ide-text-secondary mx-auto mb-4" />
          <p className="text-ide-text-secondary">لا توجد إضافات</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredExtensions.map((extension) => (
        <Card key={extension.id} variant="elevated">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{extension.name}</h3>
            {extension.installed && (
              <Badge variant="success" size="sm">مثبت</Badge>
            )}
          </div>
          <p className="text-sm text-ide-text-secondary mb-4">
            {extension.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-ide-text-secondary mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{extension.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{extension.downloads}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ide-text-secondary">{extension.author}</span>
            <Button size="sm" variant={extension.installed ? 'secondary' : 'primary'}>
              {extension.installed ? 'إلغاء التثبيت' : 'تثبيت'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExtensionGrid;

