import React from 'react';
import { Package, Star, Download, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  rating: number;
  downloads: number;
  installed: boolean;
  category: string;
}

interface ExtensionCardProps {
  extension: Extension;
  onInstall?: () => void;
  onUninstall?: () => void;
  onSettings?: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({
  extension,
  onInstall,
  onUninstall,
  onSettings,
}) => {
  return (
    <Card variant="elevated" className="hover:border-ide-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-ide-accent/20 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-ide-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{extension.name}</h3>
            <p className="text-sm text-ide-text-secondary">{extension.author}</p>
          </div>
        </div>
        {extension.installed && (
          <Badge variant="success" size="sm">مثبت</Badge>
        )}
      </div>

      <p className="text-sm text-ide-text-secondary mb-4 line-clamp-2">
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
        <Badge variant="info" size="sm">{extension.category}</Badge>
        <span className="text-xs">v{extension.version}</span>
      </div>

      <div className="flex gap-2">
        {extension.installed ? (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={onSettings}
            >
              <Settings className="w-4 h-4" />
              إعدادات
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onUninstall}
            >
              إلغاء التثبيت
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={onInstall}
            className="flex-1"
          >
            <Download className="w-4 h-4" />
            تثبيت
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ExtensionCard;

