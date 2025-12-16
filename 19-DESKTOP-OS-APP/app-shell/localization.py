"""
إدارة الترجمة البسيطة للتطبيق المكتبي
Simple localization manager for the desktop app
"""

from typing import Dict


class LocalizationManager:
    """مدير الترجمة"""

    def __init__(self, language: str = "ar"):
        self.language = language if language in {"ar", "en"} else "ar"
        self.translations: Dict[str, Dict[str, str]] = {
            "ar": {
                "window_title": "نظام التعليم الذكي العُماني - لوحة التحكم",
                "tab_dashboard": "📊 لوحة التحكم",
                "tab_controls": "🎮 مركز التحكم",
                "tab_metrics": "📈 المقاييس",
                "tab_logs": "📝 السجلات",
                "menu_file": "ملف",
                "menu_settings": "إعدادات",
                "menu_theme": "الثيمة",
                "menu_language": "اللغة",
                "action_permissions": "فحص الأذونات",
                "action_check_updates": "التحقق من التحديثات",
                "menu_help": "مساعدة",
                "action_exit": "خروج",
                "action_dark": "الوضع الليلي",
                "action_light": "الوضع النهاري",
                "action_about": "حول",
                "action_close": "إغلاق",
                "action_lang_ar": "العربية",
                "action_lang_en": "English",
                "status_ready": "جاهز",
                "about_title": "حول التطبيق",
                "about_body": (
                    "نظام التعليم الذكي العُماني\n\n"
                    "تطبيق سطح المكتب لإدارة وتشغيل جميع أنظمة المشروع\n\n"
                    "الإصدار: 1.0.0"
                ),
                "loading": "جاري تحميل {tab}...",
                "update_title": "التحديثات",
                "update_available": "تحديث متاح: الإصدار {version} ({channel})",
                "update_notes": "ملاحظات الإصدار:",
                "update_download": "تحميل التحديث",
                "update_no_updates": "أنت على آخر إصدار.",
                "update_error_title": "خطأ في التحديث",
                "update_error_body": "حدث خطأ أثناء التحقق أو التحميل: {error}",
                "update_downloaded_title": "تم التحميل",
                "update_downloaded_body": "تم تحميل التحديث إلى:\n{path}",
            },
            "en": {
                "window_title": "Oman Education AI System - Control Panel",
                "tab_dashboard": "📊 Dashboard",
                "tab_controls": "🎮 Control Center",
                "tab_metrics": "📈 Metrics",
                "tab_logs": "📝 Logs",
                "menu_file": "File",
                "menu_settings": "Settings",
                "menu_theme": "Theme",
                "menu_language": "Language",
                "action_permissions": "Permissions Check",
                "action_check_updates": "Check for Updates",
                "menu_help": "Help",
                "action_exit": "Exit",
                "action_dark": "Dark mode",
                "action_light": "Light mode",
                "action_about": "About",
                "action_close": "Close",
                "action_lang_ar": "Arabic",
                "action_lang_en": "English",
                "status_ready": "Ready",
                "about_title": "About",
                "about_body": (
                    "Oman Education AI System\n\n"
                    "Desktop app to manage and run all project systems\n\n"
                    "Version: 1.0.0"
                ),
                "loading": "Loading {tab}...",
                "update_title": "Updates",
                "update_available": "Update available: version {version} ({channel})",
                "update_notes": "Release notes:",
                "update_download": "Download update",
                "update_no_updates": "You are on the latest version.",
                "update_error_title": "Update error",
                "update_error_body": "An error occurred while checking or downloading: {error}",
                "update_downloaded_title": "Downloaded",
                "update_downloaded_body": "Update downloaded to:\n{path}",
            },
        }

    def set_language(self, language: str):
        """تعيين اللغة الحالية"""
        if language in {"ar", "en"}:
            self.language = language

    def get(self, key: str) -> str:
        """الحصول على نص مترجم"""
        return self.translations.get(self.language, {}).get(
            key, self.translations["ar"].get(key, key)
        )

    def format(self, key: str, **kwargs) -> str:
        """الحصول على نص مترجم مع تنسيق"""
        template = self.get(key)
        try:
            return template.format(**kwargs)
        except Exception:
            return template

