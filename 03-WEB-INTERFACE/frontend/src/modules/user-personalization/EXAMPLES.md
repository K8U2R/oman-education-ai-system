# Usage Examples
# أمثلة الاستخدام

## 📚 نظرة عامة

هذا الدليل يحتوي على أمثلة عملية لاستخدام وحدة التخصيص الشخصي.

---

## 🎯 أمثلة أساسية

### 1. استخدام المكونات الأساسية

```tsx
import { 
  UserPreferencesWrapper, 
  UserSettingsWrapper, 
  UserProfileWrapper 
} from '@/modules/user-personalization';

function SettingsPage() {
  return (
    <div>
      <UserPreferencesWrapper />
      <UserSettingsWrapper />
      <UserProfileWrapper />
    </div>
  );
}
```

### 2. استخدام Hook التخصيص

```tsx
import { useUserPersonalization } from '@/modules/user-personalization';
import { useToast } from '@/modules/user-personalization';

function ThemeToggle() {
  const { preferences, updatePreferences } = useUserPersonalization();
  const { showSuccess } = useToast();

  const toggleTheme = async () => {
    if (preferences) {
      await updatePreferences({
        ...preferences,
        theme: preferences.theme === 'dark' ? 'light' : 'dark',
      });
      showSuccess('تم تغيير الثيم بنجاح');
    }
  };

  return <button onClick={toggleTheme}>تبديل الثيم</button>;
}
```

### 3. استخدام Accessibility Hook

```tsx
import { useAccessibility } from '@/modules/user-personalization';

function AccessibleComponent() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { announce, safeFocus } = useAccessibility({
    enableKeyboardNavigation: true,
    enableScreenReader: true,
    containerRef,
  });

  const handleAction = () => {
    announce('تم تنفيذ الإجراء بنجاح', 'polite');
  };

  return (
    <div ref={containerRef}>
      <button onClick={handleAction}>تنفيذ الإجراء</button>
    </div>
  );
}
```

### 4. استخدام Cache Hook

```tsx
import { useCache } from '@/modules/user-personalization';
import { userPersonalizationService } from '@/services/user/user-personalization-service';

function CachedPreferences() {
  const { data, isLoading, refresh } = useCache({
    key: 'user-preferences',
    fetcher: () => userPersonalizationService.getPreferences(),
    duration: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refresh}>تحديث</button>
    </div>
  );
}
```

### 5. استخدام Keyboard Shortcuts

```tsx
import { useKeyboardShortcuts, createShortcut } from '@/modules/user-personalization';

function ComponentWithShortcuts() {
  const handleSave = () => {
    console.log('Saved!');
  };

  useKeyboardShortcuts([
    createShortcut('s', handleSave, { 
      ctrl: true, 
      description: 'حفظ (Ctrl+S)' 
    }),
  ]);

  return <div>اضغط Ctrl+S للحفظ</div>;
}
```

### 6. استخدام Export/Import

```tsx
import { ExportImport } from '@/modules/user-personalization';
import { useUserPersonalization } from '@/modules/user-personalization';

function ExportImportExample() {
  const { preferences, settings, profile } = useUserPersonalization();

  return (
    <ExportImport
      preferences={preferences}
      settings={settings}
      profile={profile}
    />
  );
}
```

### 7. استخدام Performance Hooks

```tsx
import { useDebouncedCallback, useThrottledCallback } from '@/modules/user-personalization';

function PerformanceExample() {
  const debouncedSearch = useDebouncedCallback((query: string) => {
    console.log('Searching:', query);
  }, 300);

  const throttledScroll = useThrottledCallback(() => {
    console.log('Scrolled');
  }, 100);

  return (
    <div>
      <input onChange={(e) => debouncedSearch(e.target.value)} />
      <div onScroll={throttledScroll}>Scroll me</div>
    </div>
  );
}
```

### 8. استخدام Analytics

```tsx
import { trackPreferenceChange } from '@/modules/user-personalization/utils/analytics';

function AnalyticsExample() {
  const handleThemeChange = (newTheme: string) => {
    trackPreferenceChange('theme', 'dark', newTheme);
    // ... rest of the logic
  };

  return <button onClick={() => handleThemeChange('light')}>Change Theme</button>;
}
```

---

## 🔧 أمثلة متقدمة

### 1. Custom Error Boundary

```tsx
import { PersonalizationErrorBoundary } from '@/modules/user-personalization';

function CustomErrorBoundaryExample() {
  return (
    <PersonalizationErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Custom error handler:', error, errorInfo);
      }}
      fallback={<div>Custom error message</div>}
    >
      <YourComponent />
    </PersonalizationErrorBoundary>
  );
}
```

### 2. Migration Example

```tsx
import { autoMigrate, importPersonalization } from '@/modules/user-personalization';

async function handleImport(file: File) {
  try {
    const data = await importPersonalization(file);
    const migrated = autoMigrate(data);
    // Use migrated data
  } catch (error) {
    console.error('Import failed:', error);
  }
}
```

### 3. Performance Monitoring

```tsx
import { usePerformanceMonitor } from '@/modules/user-personalization';

function MonitoredComponent() {
  const { metrics, startMeasure, endMeasure } = usePerformanceMonitor();

  useEffect(() => {
    startMeasure('component-render');
    return () => {
      endMeasure('component-render');
    };
  }, []);

  return <div>Metrics: {JSON.stringify(metrics)}</div>;
}
```

---

## 📖 المزيد من الأمثلة

راجع ملف `examples/BasicUsage.tsx` لمزيد من الأمثلة الكاملة.

