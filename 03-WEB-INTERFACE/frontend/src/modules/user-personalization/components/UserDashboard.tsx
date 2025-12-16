import React, { useState, useEffect, useCallback } from 'react';
import { User, Settings, Palette, BarChart3, Clock, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userPersonalizationService, type UserPreferences, type UserSettings, type UserProfile } from '@/services/user/user-personalization-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import Card from '@/components/ui/Card';

interface UserStats {
  total_projects: number;
  total_chats: number;
  total_files: number;
  last_activity: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats] = useState<UserStats>({
    total_projects: 0,
    total_chats: 0,
    total_files: 0,
    last_activity: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [prefs, sett, prof] = await Promise.all([
        userPersonalizationService.getPreferences().catch(() => null),
        userPersonalizationService.getSettings().catch(() => null),
        userPersonalizationService.getProfile().catch(() => null),
      ]);
      setPreferences(prefs);
      setSettings(sett);
      setProfile(prof);
    } catch (error) {
      handleError(error, 'فشل تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-ide-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-ide-text">لوحة التحكم الشخصية</h1>
      </div>

      {/* بطاقات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:bg-ide-border transition-colors"
          onClick={() => navigate('/settings?tab=preferences')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-ide-accent/20 rounded-lg">
              <Palette className="w-6 h-6 text-ide-accent" />
            </div>
            <div>
              <p className="text-sm text-ide-text-secondary">التفضيلات</p>
              <p className="text-lg font-semibold text-ide-text">
                {preferences?.theme || 'غير محدد'}
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="cursor-pointer hover:bg-ide-border transition-colors"
          onClick={() => navigate('/settings?tab=user-settings')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-ide-accent/20 rounded-lg">
              <Settings className="w-6 h-6 text-ide-accent" />
            </div>
            <div>
              <p className="text-sm text-ide-text-secondary">الإعدادات</p>
              <p className="text-lg font-semibold text-ide-text">
                {settings?.ai_model_preference || 'غير محدد'}
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="cursor-pointer hover:bg-ide-border transition-colors"
          onClick={() => navigate('/settings?tab=profile')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-ide-accent/20 rounded-lg">
              <User className="w-6 h-6 text-ide-accent" />
            </div>
            <div>
              <p className="text-sm text-ide-text-secondary">الملف الشخصي</p>
              <p className="text-lg font-semibold text-ide-text">
                {profile?.display_name || 'غير محدد'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-ide-accent/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-ide-accent" />
            </div>
            <div>
              <p className="text-sm text-ide-text-secondary">الإحصائيات</p>
              <p className="text-lg font-semibold text-ide-text">
                {stats.total_projects} مشروع
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-ide-text-secondary">المشاريع</p>
              <p className="text-2xl font-bold text-ide-text">{stats.total_projects}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-ide-text-secondary">المحادثات</p>
              <p className="text-2xl font-bold text-ide-text">{stats.total_chats}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-ide-text-secondary">آخر نشاط</p>
              <p className="text-sm font-semibold text-ide-text">
                {new Date(stats.last_activity).toLocaleDateString('ar')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* الإعدادات السريعة */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-ide-text">إعدادات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/settings?tab=preferences')}
            className="p-4 bg-ide-surface border border-ide-border rounded-lg hover:bg-ide-border transition-colors text-right"
          >
            <Palette className="w-5 h-5 text-ide-accent mb-2" />
            <h3 className="font-semibold text-ide-text">التفضيلات</h3>
            <p className="text-sm text-ide-text-secondary">تخصيص المظهر والسلوك</p>
          </button>

          <button
            onClick={() => navigate('/settings?tab=user-settings')}
            className="p-4 bg-ide-surface border border-ide-border rounded-lg hover:bg-ide-border transition-colors text-right"
          >
            <Settings className="w-5 h-5 text-ide-accent mb-2" />
            <h3 className="font-semibold text-ide-text">الإعدادات</h3>
            <p className="text-sm text-ide-text-secondary">تخصيص AI والمحرر</p>
          </button>

          <button
            onClick={() => navigate('/settings?tab=profile')}
            className="p-4 bg-ide-surface border border-ide-border rounded-lg hover:bg-ide-border transition-colors text-right"
          >
            <User className="w-5 h-5 text-ide-accent mb-2" />
            <h3 className="font-semibold text-ide-text">الملف الشخصي</h3>
            <p className="text-sm text-ide-text-secondary">تحديث معلوماتك الشخصية</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;

