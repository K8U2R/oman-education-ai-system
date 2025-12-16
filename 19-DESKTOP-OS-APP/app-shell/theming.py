"""
نظام الثيمات والوضع الليلي
Theming System and Dark Mode
"""

from typing import Dict, Any
from PySide6.QtGui import QColor, QPalette
from PySide6.QtCore import QObject, Signal


class ThemeManager(QObject):
    """مدير الثيمات"""
    
    theme_changed = Signal(str)  # إشارة تغيير الثيمة
    
    def __init__(self):
        super().__init__()
        self.current_theme = "dark"
        self.themes = {
            "dark": {
                "name": "الوضع الليلي",
                "colors": {
                    "background": "#1e1e1e",
                    "surface": "#252526",
                    "surface_hover": "#2d2d30",
                    "primary": "#007acc",
                    "primary_hover": "#0098ff",
                    "text": "#cccccc",
                    "text_secondary": "#858585",
                    "border": "#3e3e42",
                    "success": "#4ec9b0",
                    "warning": "#dcdcaa",
                    "error": "#f48771",
                    "info": "#4fc1ff"
                }
            },
            "light": {
                "name": "الوضع النهاري",
                "colors": {
                    "background": "#ffffff",
                    "surface": "#f3f3f3",
                    "surface_hover": "#e8e8e8",
                    "primary": "#0078d4",
                    "primary_hover": "#106ebe",
                    "text": "#1e1e1e",
                    "text_secondary": "#6e6e6e",
                    "border": "#d0d0d0",
                    "success": "#107c10",
                    "warning": "#ffaa44",
                    "error": "#d13438",
                    "info": "#0078d4"
                }
            }
        }
    
    def get_theme(self, theme_name: str = None) -> Dict[str, Any]:
        """الحصول على ثيمة محددة"""
        if theme_name is None:
            theme_name = self.current_theme
        return self.themes.get(theme_name, self.themes["dark"])
    
    def set_theme(self, theme_name: str):
        """تعيين الثيمة الحالية"""
        if theme_name in self.themes:
            self.current_theme = theme_name
            self.theme_changed.emit(theme_name)
    
    def get_color(self, color_name: str, theme: str = None) -> str:
        """الحصول على لون محدد من الثيمة"""
        theme_data = self.get_theme(theme)
        return theme_data["colors"].get(color_name, "#000000")
    
    def apply_to_palette(self, palette: QPalette, theme: str = None):
        """تطبيق الثيمة على QPalette"""
        if theme is None:
            theme = self.current_theme
        
        theme_data = self.get_theme(theme)
        colors = theme_data["colors"]
        
        # تطبيق الألوان على الـ Palette
        palette.setColor(QPalette.Window, QColor(colors["background"]))
        palette.setColor(QPalette.WindowText, QColor(colors["text"]))
        palette.setColor(QPalette.Base, QColor(colors["surface"]))
        palette.setColor(QPalette.AlternateBase, QColor(colors["surface_hover"]))
        palette.setColor(QPalette.ToolTipBase, QColor(colors["surface"]))
        palette.setColor(QPalette.ToolTipText, QColor(colors["text"]))
        palette.setColor(QPalette.Text, QColor(colors["text"]))
        palette.setColor(QPalette.Button, QColor(colors["surface"]))
        palette.setColor(QPalette.ButtonText, QColor(colors["text"]))
        palette.setColor(QPalette.BrightText, QColor(colors["error"]))
        palette.setColor(QPalette.Link, QColor(colors["primary"]))
        palette.setColor(QPalette.Highlight, QColor(colors["primary"]))
        palette.setColor(QPalette.HighlightedText, QColor(colors["text"]))

