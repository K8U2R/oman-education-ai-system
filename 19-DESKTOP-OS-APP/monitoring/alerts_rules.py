"""
قواعد التنبيهات
Alerts Rules
"""

from typing import Dict, List, Callable, Optional
from enum import Enum
from PySide6.QtCore import QObject, Signal


class AlertLevel(Enum):
    """مستوى التنبيه"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AlertRule:
    """قاعدة تنبيه"""
    
    def __init__(self, name: str, condition: Callable, level: AlertLevel, message: str):
        self.name = name
        self.condition = condition
        self.level = level
        self.message = message
        self.enabled = True


class AlertsManager(QObject):
    """مدير التنبيهات"""
    
    alert_triggered = Signal(str, str, str)  # rule_name, level, message
    
    def __init__(self):
        super().__init__()
        self.rules: List[AlertRule] = []
        self.setup_default_rules()
    
    def setup_default_rules(self):
        """إعداد قواعد التنبيه الافتراضية"""
        # قاعدة: خدمة متوقفة
        self.add_rule(
            "service_stopped",
            lambda data: data.get("status") == "stopped",
            AlertLevel.WARNING,
            "الخدمة متوقفة"
        )
        
        # قاعدة: خدمة في حالة خطأ
        self.add_rule(
            "service_error",
            lambda data: data.get("status") == "error",
            AlertLevel.ERROR,
            "الخدمة في حالة خطأ"
        )
        
        # قاعدة: منفذ مستخدم
        self.add_rule(
            "port_in_use",
            lambda data: not data.get("port_available", True),
            AlertLevel.WARNING,
            "المنفذ مستخدم بالفعل"
        )
    
    def add_rule(self, name: str, condition: Callable, level: AlertLevel, message: str):
        """إضافة قاعدة تنبيه"""
        rule = AlertRule(name, condition, level, message)
        self.rules.append(rule)
    
    def remove_rule(self, name: str):
        """إزالة قاعدة تنبيه"""
        self.rules = [r for r in self.rules if r.name != name]
    
    def check_rules(self, data: Dict):
        """فحص القواعد"""
        for rule in self.rules:
            if rule.enabled and rule.condition(data):
                self.alert_triggered.emit(
                    rule.name,
                    rule.level.value,
                    rule.message
                )
    
    def enable_rule(self, name: str):
        """تفعيل قاعدة"""
        for rule in self.rules:
            if rule.name == name:
                rule.enabled = True
    
    def disable_rule(self, name: str):
        """تعطيل قاعدة"""
        for rule in self.rules:
            if rule.name == name:
                rule.enabled = False

