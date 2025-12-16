"""
النافذة الرئيسية للتطبيق
Main Window
"""

from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTabWidget, QStatusBar, QMenuBar, QMenu, QMessageBox
)
from PySide6.QtCore import Qt, Signal, QTimer
from PySide6.QtGui import QAction, QKeySequence

from app_config import AppConfig
from theming import ThemeManager
from localization import LocalizationManager
from permissions_dialog import PermissionsDialog
from updater import Updater
from update_dialog import UpdateDialog
from pathlib import Path

# استيراد وحدات UI (Lazy Loading - سيتم تحميلها عند الحاجة)
import sys
ui_modules_path = Path(__file__).parent.parent / "ui_modules"
sys.path.insert(0, str(ui_modules_path.parent))


class MainWindow(QMainWindow):
    """النافذة الرئيسية"""
    
    def __init__(self, config: AppConfig, theme_manager: ThemeManager, localization: LocalizationManager, project_root: Path):
        super().__init__()
        self.config = config
        self.theme_manager = theme_manager
        self.localization = localization
        self.project_root = project_root
        self.tray_manager = None
        self.tab_keys = ["dashboard", "controls", "metrics", "logs"]
        self.updater = Updater(self.project_root, self.config)
        
        self.setup_ui()
        self.setup_menu()
        self.setup_statusbar()
        self.setup_connections()
        
        # تطبيق الإعدادات
        self.apply_config()
    
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        self.setWindowTitle(self.localization.get("window_title"))
        
        # النافذة المركزية
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        layout = QVBoxLayout(central_widget)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        
        # تبويبات
        self.tabs = QTabWidget()
        self.tabs.setTabPosition(QTabWidget.North)
        
        # تحميل كسول للوحدات - تحميل فقط عند الحاجة
        self.tabs.currentChanged.connect(self.on_tab_changed)
        
        # إنشاء placeholder للتبويبات
        self.tab_widgets = {}
        self.tabs.addTab(self.create_placeholder(self.localization.get("tab_dashboard")), self.localization.get("tab_dashboard"))
        self.tabs.addTab(self.create_placeholder(self.localization.get("tab_controls")), self.localization.get("tab_controls"))
        self.tabs.addTab(self.create_placeholder(self.localization.get("tab_metrics")), self.localization.get("tab_metrics"))
        self.tabs.addTab(self.create_placeholder(self.localization.get("tab_logs")), self.localization.get("tab_logs"))
        
        layout.addWidget(self.tabs)
    
    def setup_menu(self):
        """إعداد القوائم"""
        menubar = self.menuBar()
        
        # قائمة الملف
        file_menu = menubar.addMenu(self.localization.get("menu_file"))
        
        exit_action = QAction(self.localization.get("action_exit"), self)
        exit_action.setShortcut(QKeySequence.Quit)
        exit_action.triggered.connect(self.close)
        file_menu.addAction(exit_action)
        
        # قائمة الإعدادات
        settings_menu = menubar.addMenu(self.localization.get("menu_settings"))
        
        theme_menu = settings_menu.addMenu(self.localization.get("menu_theme"))
        dark_action = QAction(self.localization.get("action_dark"), self)
        dark_action.triggered.connect(lambda: self.change_theme("dark"))
        theme_menu.addAction(dark_action)
        
        light_action = QAction(self.localization.get("action_light"), self)
        light_action.triggered.connect(lambda: self.change_theme("light"))
        theme_menu.addAction(light_action)

        # قائمة اللغة
        language_menu = settings_menu.addMenu(self.localization.get("menu_language"))
        lang_ar_action = QAction(self.localization.get("action_lang_ar"), self, checkable=True)
        lang_en_action = QAction(self.localization.get("action_lang_en"), self, checkable=True)
        current_lang = self.config.get("window.language", "ar")
        lang_ar_action.setChecked(current_lang == "ar")
        lang_en_action.setChecked(current_lang == "en")
        lang_ar_action.triggered.connect(lambda: self.change_language("ar"))
        lang_en_action.triggered.connect(lambda: self.change_language("en"))
        language_menu.addAction(lang_ar_action)
        language_menu.addAction(lang_en_action)
        self.lang_actions = {"ar": lang_ar_action, "en": lang_en_action}

        # فحص الأذونات
        permissions_action = QAction("فحص الأذونات", self)
        permissions_action.triggered.connect(self.show_permissions)
        settings_menu.addAction(permissions_action)
        self.permissions_action = permissions_action
        
        # قائمة المساعدة
        help_menu = menubar.addMenu(self.localization.get("menu_help"))
        
        about_action = QAction(self.localization.get("action_about"), self)
        about_action.triggered.connect(self.show_about)
        help_menu.addAction(about_action)

        # التحقق من التحديثات
        update_action = QAction(self.localization.get("action_check_updates"), self)
        update_action.triggered.connect(self.check_updates)
        help_menu.addAction(update_action)
        self.action_check_updates = update_action

        # الاحتفاظ بالمراجع للتحديث اللغوي
        self.menubar = menubar
        self.file_menu = file_menu
        self.settings_menu = settings_menu
        self.theme_menu = theme_menu
        self.language_menu = language_menu
        self.help_menu = help_menu
        self.action_exit = exit_action
        self.action_dark = dark_action
        self.action_light = light_action
        self.action_about = about_action
    
    def setup_statusbar(self):
        """إعداد شريط الحالة"""
        self.statusbar = QStatusBar()
        self.setStatusBar(self.statusbar)
        self.statusbar.showMessage(self.localization.get("status_ready"))
    
    def setup_connections(self):
        """إعداد الاتصالات"""
        self.theme_manager.theme_changed.connect(self.on_theme_changed)
    
    def apply_config(self):
        """تطبيق الإعدادات"""
        width = self.config.get("window.width", 1400)
        height = self.config.get("window.height", 900)
        self.resize(width, height)
        
        min_width = self.config.get("window.min_width", 1000)
        min_height = self.config.get("window.min_height", 700)
        self.setMinimumSize(min_width, min_height)
    
    def change_theme(self, theme_name: str):
        """تغيير الثيمة"""
        self.theme_manager.set_theme(theme_name)
        self.config.set("window.theme", theme_name)

    def change_language(self, language: str):
        """تغيير اللغة وتحديث النصوص"""
        self.localization.set_language(language)
        self.config.set("window.language", language)
        # تحديث حالة أزرار اللغة
        if hasattr(self, "lang_actions"):
            for lang, action in self.lang_actions.items():
                action.setChecked(lang == language)
        self.refresh_texts()
    
    def on_theme_changed(self, theme_name: str):
        """معالجة تغيير الثيمة"""
        palette = self.palette()
        self.theme_manager.apply_to_palette(palette)
        self.setPalette(palette)

    def refresh_texts(self):
        """تحديث النصوص بعد تغيير اللغة"""
        # عنوان النافذة
        self.setWindowTitle(self.localization.get("window_title"))

        # القوائم
        if hasattr(self, "menubar"):
            self.file_menu.setTitle(self.localization.get("menu_file"))
            self.settings_menu.setTitle(self.localization.get("menu_settings"))
            self.theme_menu.setTitle(self.localization.get("menu_theme"))
            self.language_menu.setTitle(self.localization.get("menu_language"))
            self.help_menu.setTitle(self.localization.get("menu_help"))

            self.action_exit.setText(self.localization.get("action_exit"))
            self.action_dark.setText(self.localization.get("action_dark"))
            self.action_light.setText(self.localization.get("action_light"))
            self.action_about.setText(self.localization.get("action_about"))
            if hasattr(self, "action_check_updates"):
                self.action_check_updates.setText(self.localization.get("action_check_updates"))
            if hasattr(self, "lang_actions"):
                self.lang_actions["ar"].setText(self.localization.get("action_lang_ar"))
                self.lang_actions["en"].setText(self.localization.get("action_lang_en"))
            if hasattr(self, "permissions_action"):
                self.permissions_action.setText(self.localization.get("action_permissions"))

        # تبويبات
        tab_labels = [
            self.localization.get("tab_dashboard"),
            self.localization.get("tab_controls"),
            self.localization.get("tab_metrics"),
            self.localization.get("tab_logs"),
        ]
        for idx, label in enumerate(tab_labels):
            if idx < self.tabs.count():
                self.tabs.setTabText(idx, label)

        # شريط الحالة
        if hasattr(self, "statusbar"):
            self.statusbar.showMessage(self.localization.get("status_ready"))
    
    def set_close_to_tray(self, enabled: bool, tray_manager):
        """تعيين إغلاق إلى أيقونة النظام"""
        self.tray_manager = tray_manager
        self.close_to_tray = enabled
    
    def closeEvent(self, event):
        """معالجة حدث الإغلاق"""
        if hasattr(self, 'close_to_tray') and self.close_to_tray and self.tray_manager:
            event.ignore()
            self.hide()
            if self.tray_manager:
                self.tray_manager.set_tooltip("نظام التعليم الذكي العُماني\nانقر نقراً مزدوجاً لإظهار النافذة")
        else:
            # إيقاف جميع الخدمات قبل الإغلاق
            if hasattr(self, 'controls'):
                self.controls.stop_all_services()
            event.accept()
    
    def create_placeholder(self, tab_name: str) -> QWidget:
        """إنشاء placeholder للتبويب"""
        from PySide6.QtWidgets import QLabel
        placeholder = QLabel(self.localization.format("loading", tab=tab_name))
        placeholder.setAlignment(Qt.AlignCenter)
        placeholder.setStyleSheet("color: #858585; font-size: 14px;")
        return placeholder
    
    def on_tab_changed(self, index: int):
        """معالجة تغيير التبويب - تحميل كسول"""
        tab_names = ["dashboard", "controls", "metrics", "logs"]
        if index < len(tab_names):
            tab_name = tab_names[index]
            if tab_name not in self.tab_widgets:
                self.load_tab_widget(tab_name, index)
    
    def load_tab_widget(self, tab_name: str, index: int):
        """تحميل وidget التبويب"""
        try:
            if tab_name == "dashboard":
                from ui_modules.dashboard import DashboardWidget
                widget = DashboardWidget(self.config, self.project_root)
            elif tab_name == "controls":
                from ui_modules.controls_center import ControlsCenterWidget
                widget = ControlsCenterWidget(self.config, self.project_root, self.tray_manager)
            elif tab_name == "metrics":
                from ui_modules.metrics_panel import MetricsPanelWidget
                widget = MetricsPanelWidget(self.config, self.project_root)
            elif tab_name == "logs":
                from ui_modules.logs_viewer import LogsViewerWidget
                widget = LogsViewerWidget(self.config, self.project_root)
            else:
                return
            
            self.tab_widgets[tab_name] = widget
            self.tabs.removeTab(index)
            self.tabs.insertTab(index, widget, self.tabs.tabText(index))
            self.tabs.setCurrentIndex(index)
        except Exception as e:
            print(f"خطأ في تحميل التبويب {tab_name}: {e}")
    
    def show_about(self):
        """عرض معلومات حول التطبيق"""
        QMessageBox.about(
            self,
            self.localization.get("about_title"),
            self.localization.get("about_body")
        )

    def show_permissions(self):
        """عرض نافذة فحص الأذونات"""
        required_ports = [svc.get("port") for svc in self.config.get("services", {}).values() if svc.get("enabled", True) and svc.get("port")]
        required_ports = [p for p in required_ports if p]
        writable_paths = [
            self.project_root / "logs",
            self.project_root / "19-DESKTOP-OS-APP" / "sessions",
        ]
        dlg = PermissionsDialog(self.project_root, required_ports, writable_paths, self)
        dlg.exec()

    def check_updates(self):
        """التحقق من وجود تحديثات"""
        try:
            has_update, manifest = self.updater.check_for_update()
        except Exception as e:
            QMessageBox.warning(
                self,
                self.localization.get("update_error_title"),
                self.localization.format("update_error_body", error=str(e)),
            )
            return

        if not has_update:
            QMessageBox.information(
                self,
                self.localization.get("update_title"),
                self.localization.get("update_no_updates"),
            )
            return

        dlg = UpdateDialog(self.updater, manifest, self.localization, self)
        dlg.exec()

