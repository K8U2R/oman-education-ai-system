import React from 'react';
import { Package, User, Calendar, Code, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Extension } from './ExtensionCard';

interface ExtensionDetailsProps {
  extension: Extension;
  onInstall?: () => void;
  onUninstall?: () => void;
}

const ExtensionDetails: React.FC<ExtensionDetailsProps> = ({
  extension,
  onInstall,
  onUninstall,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-ide-accent/20 rounded-lg flex items-center justify-center">
            <Package className="w-8 h-8 text-ide-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{extension.name}</h1>
            <div className="flex items-center gap-4 text-sm text-ide-text-secondary">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{extension.author}</span>
              </div>
              <Badge variant="info">{extension.category}</Badge>
              <span>v{extension.version}</span>
            </div>
          </div>
        </div>
        {extension.installed ? (
          <Button variant="secondary" onClick={onUninstall}>
            إلغاء التثبيت
          </Button>
        ) : (
          <Button onClick={onInstall}>تثبيت</Button>
        )}
      </div>

      {/* Description */}
      <Card>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          الوصف
        </h2>
        <p className="text-ide-text-secondary">{extension.description}</p>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="elevated">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-5 h-5 text-ide-accent" />
            <h3 className="font-semibold">التقييم</h3>
          </div>
          <p className="text-2xl font-bold">{extension.rating}</p>
        </Card>
        <Card variant="elevated">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-ide-accent" />
            <h3 className="font-semibold">التنزيلات</h3>
          </div>
          <p className="text-2xl font-bold">{extension.downloads}</p>
        </Card>
      </div>
    </div>
  );
};

export default ExtensionDetails;

