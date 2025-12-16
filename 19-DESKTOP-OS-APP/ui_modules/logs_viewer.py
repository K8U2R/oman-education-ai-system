"""
عارض السجلات
Logs Viewer Widget
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QTextEdit, QPushButton, QComboBox, QGroupBox,
    QLineEdit, QCheckBox, QFileDialog, QMessageBox
)
from PySide6.QtCore import Qt, QTimer, QRegularExpression
from PySide6.QtGui import QFont, QTextCharFormat, QColor, QTextCursor, QSyntaxHighlighter, QTextDocument

from pathlib import Path
import sys
import os
from datetime import datetime
import re

# إضافة مسارات app-shell للوصول إلى AppConfig
project_root = Path(__file__).parent.parent.parent
app_shell_path = project_root / "19-DESKTOP-OS-APP" / "app-shell"
sys.path.insert(0, str(app_shell_path))

from app_config import AppConfig


class LogSyntaxHighlighter(QSyntaxHighlighter):
    """مميز صيغة السجلات"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.highlighting_rules = []
        
        # ERROR - أحمر
        error_format = QTextCharFormat()
        error_format.setForeground(QColor("#f48771"))
        error_format.setFontWeight(QFont.Bold)
        self.highlighting_rules.append((QRegularExpression(r"(?i)\b(ERROR|FATAL|CRITICAL|Exception|Traceback)\b"), error_format))
        
        # WARNING - أصفر
        warning_format = QTextCharFormat()
        warning_format.setForeground(QColor("#dcdcaa"))
        self.highlighting_rules.append((QRegularExpression(r"(?i)\b(WARNING|WARN|CAUTION)\b"), warning_format))
        
        # INFO - أزرق
        info_format = QTextCharFormat()
        info_format.setForeground(QColor("#4fc1ff"))
        self.highlighting_rules.append((QRegularExpression(r"(?i)\b(INFO|INFORMATION)\b"), info_format))
        
        # DEBUG - رمادي
        debug_format = QTextCharFormat()
        debug_format.setForeground(QColor("#858585"))
        self.highlighting_rules.append((QRegularExpression(r"(?i)\b(DEBUG|TRACE)\b"), debug_format))
        
        # SUCCESS - أخضر
        success_format = QTextCharFormat()
        success_format.setForeground(QColor("#4ec9b0"))
        self.highlighting_rules.append((QRegularExpression(r"(?i)\b(SUCCESS|OK|DONE)\b"), success_format))
    
    def highlightBlock(self, text):
        """تطبيق التمييز على كتلة النص"""
        for pattern, format in self.highlighting_rules:
            expression = QRegularExpression(pattern)
            iterator = expression.globalMatch(text)
            while iterator.hasNext():
                match = iterator.next()
                self.setFormat(match.capturedStart(), match.capturedLength(), format)


class LogsViewerWidget(QWidget):
    """عارض السجلات"""
    
    def __init__(self, config: AppConfig, project_root: Path):
        super().__init__()
        self.config = config
        self.project_root = project_root
        self.log_files = {}
        self.current_log_file = None
        self.all_log_lines = []
        self.filtered_lines = []
        self.current_filter = "all"
        self.search_text = ""
        self.show_line_numbers = True
        
        self.setup_ui()
        self.setup_timer()
        self.load_log_files()
    
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        layout.setSpacing(10)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # العنوان
        title = QLabel("عارض السجلات")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        title.setStyleSheet("color: #cccccc;")
        layout.addWidget(title)
        
        # أدوات التحكم - الصف الأول
        controls_layout = QHBoxLayout()
        
        # اختيار ملف السجل
        self.log_selector = QComboBox()
        self.log_selector.addItem("جميع السجلات", None)
        self.log_selector.currentIndexChanged.connect(self.on_log_file_changed)
        controls_layout.addWidget(QLabel("ملف السجل:"))
        controls_layout.addWidget(self.log_selector)
        
        # فلترة حسب المستوى
        controls_layout.addWidget(QLabel("المستوى:"))
        self.level_filter = QComboBox()
        self.level_filter.addItems(["الكل", "ERROR", "WARNING", "INFO", "DEBUG"])
        self.level_filter.currentTextChanged.connect(self.on_filter_changed)
        controls_layout.addWidget(self.level_filter)
        
        # بحث
        controls_layout.addWidget(QLabel("بحث:"))
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("ابحث في السجلات...")
        self.search_input.textChanged.connect(self.on_search_changed)
        controls_layout.addWidget(self.search_input)
        
        controls_layout.addStretch()
        layout.addLayout(controls_layout)
        
        # أدوات التحكم - الصف الثاني
        controls_layout2 = QHBoxLayout()
        
        # ترقيم الأسطر
        self.line_numbers_check = QCheckBox("ترقيم الأسطر")
        self.line_numbers_check.setChecked(True)
        self.line_numbers_check.toggled.connect(self.on_line_numbers_toggled)
        controls_layout2.addWidget(self.line_numbers_check)
        
        # زر التحديث
        refresh_btn = QPushButton("🔄 تحديث")
        refresh_btn.clicked.connect(self.refresh_logs)
        controls_layout2.addWidget(refresh_btn)
        
        # زر التصدير
        export_btn = QPushButton("💾 تصدير")
        export_btn.clicked.connect(self.export_logs)
        controls_layout2.addWidget(export_btn)
        
        # زر مسح
        clear_btn = QPushButton("🗑️ مسح")
        clear_btn.clicked.connect(self.clear_logs)
        controls_layout2.addWidget(clear_btn)
        
        controls_layout2.addStretch()
        layout.addLayout(controls_layout2)
        
        # عارض السجلات
        self.log_viewer = QTextEdit()
        self.log_viewer.setReadOnly(True)
        self.log_viewer.setFont(QFont("Consolas", 9))
        self.log_viewer.setStyleSheet("""
            QTextEdit {
                background-color: #1e1e1e;
                color: #cccccc;
                border: 1px solid #3e3e42;
                border-radius: 5px;
            }
        """)
        
        # إضافة Syntax Highlighter
        self.highlighter = LogSyntaxHighlighter(self.log_viewer.document())
        
        layout.addWidget(self.log_viewer)
    
    def setup_timer(self):
        """إعداد المؤقت للتحديث"""
        self.update_timer = QTimer()
        # التحديث التلقائي يكون خفيفاً: فقط الملف الحالي، وبفاصل أطول
        self.update_timer.timeout.connect(self._auto_refresh_logs)
        interval = self.config.get("monitoring.log_refresh_interval", 3000)
        self.update_timer.start(interval)
    
    def load_log_files(self):
        """تحميل ملفات السجلات"""
        log_dirs = [
            self.project_root / "logs",
            self.project_root / "01-OPERATING-SYSTEM" / "logs",
            self.project_root / "02-SYSTEM-INTEGRATION" / "logs"
        ]
        
        for log_dir in log_dirs:
            if log_dir.exists():
                for log_file in log_dir.glob("*.log"):
                    name = log_file.name
                    self.log_files[name] = log_file
                    self.log_selector.addItem(name, str(log_file))
    
    def on_log_file_changed(self, index: int):
        """معالجة تغيير ملف السجل"""
        if index > 0:
            self.current_log_file = self.log_selector.itemData(index)
        else:
            self.current_log_file = None
        self.refresh_logs()
    
    def refresh_logs(self):
        """تحديث السجلات"""
        try:
            if self.current_log_file:
                # عرض ملف محدد
                self.load_single_log(self.current_log_file)
            else:
                # عرض جميع السجلات
                self.load_all_logs()
        except Exception as e:
            self.log_viewer.append(f"<span style='color: #f48771;'>خطأ: {str(e)}</span>")
    
    def load_single_log(self, log_file_path: str):
        """تحميل ملف سجل واحد"""
        try:
            with open(log_file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                # عرض آخر 500 سطر فقط لتخفيف الحمل
                lines = lines[-500:]
                self.all_log_lines = lines
                self.apply_filters()
        except Exception as e:
            self.log_viewer.append(f"<span style='color: #f48771;'>خطأ في قراءة الملف: {str(e)}</span>")
    
    def load_all_logs(self):
        """تحميل جميع السجلات"""
        content = []
        for name, log_file in self.log_files.items():
            try:
                with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
                    # آخر 100 سطر من كل ملف فقط
                    lines = lines[-100:]
                    content.append(f"\n{'='*60}\n")
                    content.append(f"📄 {name}\n")
                    content.append(f"{'='*60}\n")
                    content.extend(lines)
            except Exception:
                pass
        
        if content:
            self.all_log_lines = content
            self.apply_filters()
        else:
            self.all_log_lines = []
            self.log_viewer.setPlainText("لا توجد سجلات متاحة")

    def _auto_refresh_logs(self):
        """
        تحديث تلقائي خفيف:
        - إذا كان هناك ملف محدد، نحدّثه فقط.
        - إذا لم يكن هناك ملف محدد، لا نقرأ جميع الملفات كل مرة (تحديث يدوي فقط عبر زر \"تحديث\").
        """
        try:
            if self.current_log_file:
                self.load_single_log(self.current_log_file)
        except Exception:
            # في حالة الخطأ نتجاهل لتفادي تجميد الواجهة
            pass
    
    def on_filter_changed(self, level: str):
        """معالجة تغيير الفلتر"""
        self.current_filter = level.lower() if level != "الكل" else "all"
        self.apply_filters()
    
    def on_search_changed(self, text: str):
        """معالجة تغيير البحث"""
        self.search_text = text.lower()
        self.apply_filters()
    
    def on_line_numbers_toggled(self, checked: bool):
        """معالجة تبديل ترقيم الأسطر"""
        self.show_line_numbers = checked
        self.apply_filters()
    
    def apply_filters(self):
        """تطبيق الفلاتر والبحث"""
        if not self.all_log_lines:
            self.log_viewer.clear()
            return
        
        filtered = self.all_log_lines.copy()
        
        # فلترة حسب المستوى
        if self.current_filter != "all":
            filtered = [line for line in filtered if self.current_filter in line.upper()]
        
        # فلترة حسب البحث
        if self.search_text:
            filtered = [line for line in filtered if self.search_text in line.lower()]
        
        self.filtered_lines = filtered
        
        # تطبيق ترقيم الأسطر
        if self.show_line_numbers:
            numbered_lines = []
            for i, line in enumerate(filtered, 1):
                numbered_lines.append(f"{i:5d} | {line}")
            content = ''.join(numbered_lines)
        else:
            content = ''.join(filtered)
        
        # حفظ موضع التمرير
        scrollbar = self.log_viewer.verticalScrollBar()
        scroll_position = scrollbar.value()
        max_position = scrollbar.maximum()
        was_at_bottom = (scroll_position >= max_position - 10)
        
        self.log_viewer.setPlainText(content)
        
        # استعادة موضع التمرير
        if was_at_bottom:
            cursor = self.log_viewer.textCursor()
            cursor.movePosition(QTextCursor.End)
            self.log_viewer.setTextCursor(cursor)
        else:
            scrollbar.setValue(scroll_position)
    
    def export_logs(self):
        """تصدير السجلات"""
        if not self.filtered_lines:
            QMessageBox.warning(self, "تحذير", "لا توجد سجلات للتصدير")
            return
        
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "حفظ السجلات",
            f"logs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
            "Text Files (*.txt);;All Files (*)"
        )
        
        if file_path:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(self.filtered_lines)
                QMessageBox.information(self, "نجح", f"تم تصدير السجلات إلى:\n{file_path}")
            except Exception as e:
                QMessageBox.critical(self, "خطأ", f"فشل تصدير السجلات:\n{str(e)}")
    
    def clear_logs(self):
        """مسح عارض السجلات"""
        self.log_viewer.clear()
        self.all_log_lines = []
        self.filtered_lines = []

