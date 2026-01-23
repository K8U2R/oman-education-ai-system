-- Migration: Create Security Tables
-- Description: إنشاء جداول نظام الأمان المخصص
-- Date: 2026-01

-- ============================================
-- 1. Security Sessions Table - جدول الجلسات
-- ============================================
CREATE TABLE IF NOT EXISTS public.security_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    refresh_token_hash TEXT,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_sessions_user_id ON public.security_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_security_sessions_token_hash ON public.security_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_security_sessions_is_active ON public.security_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_security_sessions_expires_at ON public.security_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_sessions_user_active ON public.security_sessions(user_id, is_active) WHERE is_active = true;

-- Comments
COMMENT ON TABLE public.security_sessions IS 'جدول الجلسات الأمنية';
COMMENT ON COLUMN public.security_sessions.device_info IS 'معلومات الجهاز (نوع، نظام التشغيل، المتصفح)';
COMMENT ON COLUMN public.security_sessions.location IS 'موقع المستخدم (البلد، المدينة، الإحداثيات)';

-- ============================================
-- 2. Security Events Table - جدول الأحداث الأمنية
-- ============================================
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    source VARCHAR(100),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON public.security_events(resolved);
CREATE INDEX IF NOT EXISTS idx_security_events_user_type ON public.security_events(user_id, event_type);

-- Comments
COMMENT ON TABLE public.security_events IS 'جدول الأحداث الأمنية';
COMMENT ON COLUMN public.security_events.event_type IS 'نوع الحدث (login_attempt, password_change, etc.)';
COMMENT ON COLUMN public.security_events.severity IS 'مستوى الخطورة: info, warning, error, critical';
COMMENT ON COLUMN public.security_events.metadata IS 'معلومات إضافية عن الحدث';

-- ============================================
-- 3. Security Settings Table - جدول الإعدادات الأمنية
-- ============================================
CREATE TABLE IF NOT EXISTS public.security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_settings_key ON public.security_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_security_settings_category ON public.security_settings(category);

-- Comments
COMMENT ON TABLE public.security_settings IS 'جدول الإعدادات الأمنية';
COMMENT ON COLUMN public.security_settings.setting_key IS 'مفتاح الإعداد (مثل: max_login_attempts)';
COMMENT ON COLUMN public.security_settings.setting_value IS 'قيمة الإعداد (JSON)';
COMMENT ON COLUMN public.security_settings.category IS 'فئة الإعداد (authentication, session, rate_limiting, etc.)';

-- ============================================
-- 4. Security Route Protection Table - جدول حماية المسارات
-- ============================================
CREATE TABLE IF NOT EXISTS public.security_route_protection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_path VARCHAR(255) NOT NULL UNIQUE,
    route_pattern VARCHAR(255) NOT NULL,
    required_roles TEXT[] DEFAULT '{}',
    required_permissions TEXT[] DEFAULT '{}',
    rate_limit_enabled BOOLEAN DEFAULT false,
    rate_limit_max INTEGER DEFAULT 100,
    rate_limit_window INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_route_protection_route ON public.security_route_protection(route_path);
CREATE INDEX IF NOT EXISTS idx_security_route_protection_active ON public.security_route_protection(is_active);

-- Comments
COMMENT ON TABLE public.security_route_protection IS 'جدول قواعد حماية المسارات';
COMMENT ON COLUMN public.security_route_protection.route_path IS 'مسار المسار (مثل: /admin/users)';
COMMENT ON COLUMN public.security_route_protection.route_pattern IS 'نمط المسار للمطابقة (مثل: /admin/*)';
COMMENT ON COLUMN public.security_route_protection.required_roles IS 'الأدوار المطلوبة للوصول';
COMMENT ON COLUMN public.security_route_protection.required_permissions IS ' المطلوبة للوصول';

-- ============================================
-- 5. Security Alerts Table - جدول التنبيهات الأمنية
-- ============================================
CREATE TABLE IF NOT EXISTS public.security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_required BOOLEAN DEFAULT false,
    action_taken BOOLEAN DEFAULT false,
    action_taken_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_alert_type ON public.security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_is_read ON public.security_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON public.security_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_user_unread ON public.security_alerts(user_id, is_read) WHERE is_read = false;

-- Comments
COMMENT ON TABLE public.security_alerts IS 'جدول التنبيهات الأمنية';
COMMENT ON COLUMN public.security_alerts.alert_type IS 'نوع التنبيه (suspicious_login, password_breach, etc.)';
COMMENT ON COLUMN public.security_alerts.severity IS 'مستوى الخطورة';
COMMENT ON COLUMN public.security_alerts.metadata IS 'معلومات إضافية عن التنبيه';

-- ============================================
-- 6. Triggers - محفزات التحديث التلقائي
-- ============================================
-- Trigger لتحديث updated_at في security_sessions
CREATE TRIGGER update_security_sessions_updated_at 
    BEFORE UPDATE ON public.security_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger لتحديث updated_at في security_settings
CREATE TRIGGER update_security_settings_updated_at 
    BEFORE UPDATE ON public.security_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger لتحديث updated_at في security_route_protection
CREATE TRIGGER update_security_route_protection_updated_at 
    BEFORE UPDATE ON public.security_route_protection 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Initial Security Settings - الإعدادات الأولية
-- ============================================
INSERT INTO public.security_settings (setting_key, setting_value, description, category) VALUES
('max_login_attempts', '{"value": 5}', 'الحد الأقصى لمحاولات تسجيل الدخول', 'authentication'),
('lockout_duration', '{"value": 30, "unit": "minutes"}', 'مدة قفل الحساب بعد تجاوز الحد', 'authentication'),
('password_min_length', '{"value": 8}', 'الحد الأدنى لطول كلمة المرور', 'authentication'),
('password_require_uppercase', '{"value": true}', 'يتطلب حروف كبيرة', 'authentication'),
('password_require_lowercase', '{"value": true}', 'يتطلب حروف صغيرة', 'authentication'),
('password_require_numbers', '{"value": true}', 'يتطلب أرقام', 'authentication'),
('password_require_symbols', '{"value": false}', 'يتطلب رموز', 'authentication'),
('two_factor_enabled', '{"value": false}', 'تفعيل المصادقة الثنائية', 'authentication'),
('session_timeout', '{"value": 30, "unit": "minutes"}', 'انتهاء صلاحية الجلسة', 'session'),
('max_concurrent_sessions', '{"value": 5}', 'الحد الأقصى للجلسات المتزامنة', 'session'),
('rate_limit_enabled', '{"value": true}', 'تفعيل تحديد المعدل', 'rate_limiting'),
('rate_limit_requests', '{"value": 100}', 'عدد الطلبات المسموحة', 'rate_limiting'),
('rate_limit_window', '{"value": 60, "unit": "seconds"}', 'نافذة الوقت بالثواني', 'rate_limiting'),
('alert_on_suspicious_login', '{"value": true}', 'تنبيه عند تسجيل دخول مشبوه', 'alerts'),
('alert_on_password_change', '{"value": true}', 'تنبيه عند تغيير كلمة المرور', 'alerts')
ON CONFLICT (setting_key) DO NOTHING;

