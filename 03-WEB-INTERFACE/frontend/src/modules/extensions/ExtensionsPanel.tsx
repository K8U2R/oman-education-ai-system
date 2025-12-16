import React from 'react';
import { Puzzle, Download, Trash2 } from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
}

const ExtensionsPanel: React.FC = () => {
  const extensions: Extension[] = [
    {
      id: 'prettier',
      name: 'Prettier',
      version: '1.0.0',
      description: 'منسق الكود التلقائي',
      enabled: true,
    },
    {
      id: 'eslint',
      name: 'ESLint',
      version: '1.0.0',
      description: 'فحص جودة الكود',
      enabled: true,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-ide-surface">
      <div className="p-4 border-b border-ide-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Puzzle className="w-4 h-4" />
          الإضافات
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <button className="w-full px-3 py-2 text-xs bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors flex items-center justify-center gap-2">
            <Download className="w-3 h-3" />
            تثبيت إضافة جديدة
          </button>
        </div>

        <div className="space-y-2">
          {extensions.map((ext) => (
            <div
              key={ext.id}
              className="p-3 rounded-md border border-ide-border bg-ide-bg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{ext.name}</h4>
                  <p className="text-xs text-ide-text-secondary mt-1">{ext.description}</p>
                  <p className="text-xs text-ide-text-secondary mt-1">الإصدار: {ext.version}</p>
                </div>
                <button
                  className="p-1.5 rounded hover:bg-ide-border transition-colors"
                  aria-label="حذف"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={ext.enabled}
                    onChange={() => {}}
                    className="w-3 h-3 rounded"
                  />
                  <span>مفعّل</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtensionsPanel;

