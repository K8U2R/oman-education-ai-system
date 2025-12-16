-- Migration: Create User Personalization Tables
-- تاريخ: 2024-12-14
-- الوصف: إنشاء جداول التخصيص الشخصي للمستخدمين

-- جدول تفضيلات المستخدم
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) NOT NULL DEFAULT 'auto',
    layout VARCHAR(20) NOT NULL DEFAULT 'comfortable',
    language VARCHAR(10) NOT NULL DEFAULT 'ar',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Muscat',
    date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
    time_format VARCHAR(10) NOT NULL DEFAULT '24h',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    animations_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sidebar_collapsed BOOLEAN NOT NULL DEFAULT FALSE,
    custom_colors JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- جدول إعدادات المستخدم
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ai_model_preference VARCHAR(50) NOT NULL DEFAULT 'gemini-pro',
    ai_temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7,
    ai_max_tokens INTEGER NOT NULL DEFAULT 1000,
    auto_save_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    auto_save_interval INTEGER NOT NULL DEFAULT 30,
    code_theme VARCHAR(50) NOT NULL DEFAULT 'vs-dark',
    font_size INTEGER NOT NULL DEFAULT 14,
    font_family VARCHAR(100) NOT NULL DEFAULT 'Consolas, monospace',
    tab_size INTEGER NOT NULL DEFAULT 2,
    word_wrap BOOLEAN NOT NULL DEFAULT TRUE,
    line_numbers BOOLEAN NOT NULL DEFAULT TRUE,
    minimap_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- جدول الملف الشخصي للمستخدم
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    skills JSONB DEFAULT '[]',
    interests JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON user_profiles(display_name);

-- Comments
COMMENT ON TABLE user_preferences IS 'تفضيلات المستخدم (المظهر، اللغة، الإشعارات)';
COMMENT ON TABLE user_settings IS 'إعدادات المستخدم (AI، محرر الكود)';
COMMENT ON TABLE user_profiles IS 'الملف الشخصي للمستخدم (المعلومات، المهارات، الخبرة)';

