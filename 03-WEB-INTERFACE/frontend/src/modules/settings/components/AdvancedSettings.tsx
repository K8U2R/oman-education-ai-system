import React, { useState } from 'react';
import { Settings, Trash2, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const AdvancedSettings: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [enableDebug, setEnableDebug] = useState(false);
  const [enableAnalytics, setEnableAnalytics] = useState(true);

  const handleExportData = () => {
    // TODO: Implement data export
    showSuccess('تم التصدير', 'تم تصدير البيانات بنجاح');
  };

  const handleClearCache = () => {
    // TODO: Implement cache clearing
    showSuccess('تم المسح', 'تم مسح الذاكرة المؤقتة بنجاح');
  };

  const handleResetSettings = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      // TODO: Implement settings reset
      showSuccess('تم الإعادة', 'تم إعادة تعيين الإعدادات بنجاح');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-ide-accent" />
          الإعدادات المتقدمة
        </h2>
        <div className="space-y-4">
          <Checkbox
            label="تفعيل وضع التطوير (Debug Mode)"
            checked={enableDebug}
            onChange={(e) => setEnableDebug(e.target.checked)}
          />
          <Checkbox
            label="تفعيل التحليلات"
            checked={enableAnalytics}
            onChange={(e) => setEnableAnalytics(e.target.checked)}
          />
        </div>
      </div>

      <Card variant="elevated">
        <h3 className="font-semibold mb-4">إدارة البيانات</h3>
        <div className="space-y-3">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4" />
            تصدير البيانات
          </Button>
          <Button variant="outline" onClick={handleClearCache}>
            مسح الذاكرة المؤقتة
          </Button>
          <Button variant="outline" className="text-red-400" onClick={handleResetSettings}>
            <Trash2 className="w-4 h-4" />
            إعادة تعيين الإعدادات
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedSettings;

