import React, { useState } from 'react';
import { Settings as SettingsIcon, Monitor, Moon, Sun, Code, Keyboard } from 'lucide-react';
import { useTheme } from '@/core/theme/useTheme';
import { useIDE } from '@/core/state/useIDE';

const SettingsPanel: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { editorTheme, fontSize, wordWrap, setEditorTheme, setFontSize, setWordWrap } = useIDE();
  const [activeTab, setActiveTab] = useState<'appearance' | 'editor' | 'keyboard'>('appearance');

  const tabs = [
    { id: 'appearance' as const, label: 'المظهر', icon: Monitor },
    { id: 'editor' as const, label: 'المحرر', icon: Code },
    { id: 'keyboard' as const, label: 'لوحة المفاتيح', icon: Keyboard },
  ];

  return (
    <div className="h-full flex flex-col bg-ide-surface">
      <div className="flex items-center gap-2 p-4 border-b border-ide-border">
        <SettingsIcon className="w-5 h-5" />
        <h2 className="text-lg font-semibold">الإعدادات</h2>
      </div>

      <div className="flex border-b border-ide-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-ide-text border-b-2 border-ide-accent'
                  : 'text-ide-text-secondary hover:text-ide-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">الثيم</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 p-3 rounded-md border-2 flex flex-col items-center gap-2 ${
                    theme === 'dark'
                      ? 'border-ide-accent bg-ide-accent/10'
                      : 'border-ide-border hover:border-ide-accent/50'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs">داكن</span>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 p-3 rounded-md border-2 flex flex-col items-center gap-2 ${
                    theme === 'light'
                      ? 'border-ide-accent bg-ide-accent/10'
                      : 'border-ide-border hover:border-ide-accent/50'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs">فاتح</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ثيم المحرر</label>
              <select
                value={editorTheme}
                onChange={(e) => setEditorTheme(e.target.value)}
                className="ide-input"
              >
                <option value="vs-dark">Dark (VS Code)</option>
                <option value="vs">Light (VS Code)</option>
                <option value="hc-black">High Contrast Dark</option>
                <option value="hc-light">High Contrast Light</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                حجم الخط: {fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wordWrap}
                  onChange={(e) => setWordWrap(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">تفاف النص (Word Wrap)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'keyboard' && (
          <div className="space-y-4">
            <div className="text-sm text-ide-text-secondary">
              <p className="mb-2">اختصارات لوحة المفاتيح:</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>حفظ الملف</span>
                  <kbd className="px-2 py-1 bg-ide-bg border border-ide-border rounded">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between">
                  <span>فتح ملف</span>
                  <kbd className="px-2 py-1 bg-ide-bg border border-ide-border rounded">Ctrl+O</kbd>
                </div>
                <div className="flex justify-between">
                  <span>بحث</span>
                  <kbd className="px-2 py-1 bg-ide-bg border border-ide-border rounded">Ctrl+F</kbd>
                </div>
                <div className="flex justify-between">
                  <span>لوحة الأوامر</span>
                  <kbd className="px-2 py-1 bg-ide-bg border border-ide-border rounded">Ctrl+P</kbd>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;

