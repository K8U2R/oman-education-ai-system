import React, { useState } from 'react';
import { Palette, Moon, Sun } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useTheme } from '@/core/theme/useTheme';

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('#4285f4');

  const themes = [
    { id: 'dark', label: 'داكن', icon: Moon },
    { id: 'light', label: 'فاتح', icon: Sun },
    { id: 'auto', label: 'تلقائي', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-ide-accent" />
          المظهر
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">الثيم</label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <Card
                    key={themeOption.id}
                    variant={theme === themeOption.id ? 'elevated' : 'default'}
                    className={`cursor-pointer hover:border-ide-accent/50 transition-colors ${
                      theme === themeOption.id ? 'border-ide-accent' : ''
                    }`}
                    onClick={() => setTheme(themeOption.id as 'dark' | 'light' | 'auto')}
                  >
                    <div className="text-center">
                      <Icon className="w-8 h-8 mx-auto mb-2 text-ide-accent" />
                      <p className="text-sm font-medium">{themeOption.label}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">لون التمييز</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-16 h-16 rounded-lg border border-ide-border cursor-pointer"
              />
              <Input
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#4285f4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;

