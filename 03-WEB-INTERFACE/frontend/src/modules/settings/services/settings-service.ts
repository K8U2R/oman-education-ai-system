import { localStorageService } from '@/services/storage/localStorage-service';

export interface Settings {
  general: {
    language: string;
    timezone: string;
    notifications: boolean;
  };
  editor: {
    fontSize: number;
    fontFamily: string;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  ai: {
    provider: string;
    apiKey: string;
    model: string;
    temperature: number;
  };
  appearance: {
    theme: 'dark' | 'light' | 'auto';
    accentColor: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
  advanced: {
    debugMode: boolean;
    analytics: boolean;
  };
}

const DEFAULT_SETTINGS: Settings = {
  general: {
    language: 'ar',
    timezone: 'Asia/Muscat',
    notifications: true,
  },
  editor: {
    fontSize: 14,
    fontFamily: 'Fira Code',
    tabSize: 2,
    wordWrap: true,
    minimap: false,
  },
  ai: {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
  },
  appearance: {
    theme: 'dark',
    accentColor: '#4285f4',
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
  },
  advanced: {
    debugMode: false,
    analytics: true,
  },
};

class SettingsService {
  private readonly STORAGE_KEY = 'flowforge_settings';

  getSettings(): Settings {
    const stored = localStorageService.get<Settings>(this.STORAGE_KEY);
    return stored || DEFAULT_SETTINGS;
  }

  updateSettings(settings: Partial<Settings>): void {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorageService.set(this.STORAGE_KEY, updated);
  }

  updateSection<K extends keyof Settings>(
    section: K,
    values: Partial<Settings[K]>
  ): void {
    const current = this.getSettings();
    const updated = {
      ...current,
      [section]: { ...current[section], ...values },
    };
    localStorageService.set(this.STORAGE_KEY, updated);
  }

  resetSettings(): void {
    localStorageService.remove(this.STORAGE_KEY);
  }

  exportSettings(): string {
    return JSON.stringify(this.getSettings(), null, 2);
  }

  importSettings(json: string): void {
    try {
      const settings = JSON.parse(json) as Settings;
      localStorageService.set(this.STORAGE_KEY, settings);
    } catch (error) {
      throw new Error('Invalid settings format');
    }
  }
}

export const settingsService = new SettingsService();

