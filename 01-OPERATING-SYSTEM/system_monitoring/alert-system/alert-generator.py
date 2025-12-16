"""
Alert Generator - مولّد التنبيهات
Generates system alerts based on conditions
"""

import logging
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class AlertLevel(Enum):
    """Alert severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class Alert:
    """Alert data class"""
    alert_id: str
    title: str
    message: str
    level: AlertLevel
    timestamp: datetime
    source: str
    acknowledged: bool = False
    metadata: Optional[Dict] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class AlertGenerator:
    """
    Alert Generator Class
    Generates and manages system alerts
    """
    
    def __init__(self):
        """Initialize Alert Generator"""
        self.logger = logging.getLogger(__name__)
        self.alerts: List[Alert] = []
        self.alert_callbacks: List[Callable[[Alert], None]] = []
        self.alert_count = 0
        
    def generate_alert(
        self,
        title: str,
        message: str,
        level: AlertLevel = AlertLevel.INFO,
        source: str = "system",
        metadata: Optional[Dict] = None
    ) -> Alert:
        """
        Generate a new alert
        
        Args:
            title: Alert title
            message: Alert message
            level: Alert level
            source: Alert source
            metadata: Additional metadata
            
        Returns:
            Generated Alert object
        """
        alert_id = f"ALT_{self.alert_count:06d}"
        self.alert_count += 1
        
        alert = Alert(
            alert_id=alert_id,
            title=title,
            message=message,
            level=level,
            timestamp=datetime.now(),
            source=source,
            metadata=metadata or {}
        )
        
        self.alerts.append(alert)
        
        # Keep only last 1000 alerts
        if len(self.alerts) > 1000:
            self.alerts.pop(0)
        
        # Trigger callbacks
        for callback in self.alert_callbacks:
            try:
                callback(alert)
            except Exception as e:
                self.logger.error(f"Error in alert callback: {e}")
        
        level_emoji = {
            AlertLevel.INFO: "ℹ️",
            AlertLevel.WARNING: "⚠️",
            AlertLevel.ERROR: "❌",
            AlertLevel.CRITICAL: "🚨"
        }
        
        self.logger.warning(
            f"{level_emoji.get(level, '📢')} Alert [{level.value.upper()}]: {title} - {message}"
        )
        
        return alert
    
    def get_alerts(
        self,
        level: Optional[AlertLevel] = None,
        unacknowledged_only: bool = False,
        limit: int = 100
    ) -> List[Alert]:
        """
        Get alerts with filters
        
        Args:
            level: Filter by alert level
            unacknowledged_only: Return only unacknowledged alerts
            limit: Maximum number of alerts to return
            
        Returns:
            List of alerts
        """
        alerts = self.alerts
        
        if level:
            alerts = [a for a in alerts if a.level == level]
        
        if unacknowledged_only:
            alerts = [a for a in alerts if not a.acknowledged]
        
        return alerts[-limit:]
    
    def acknowledge_alert(self, alert_id: str) -> bool:
        """
        Acknowledge an alert
        
        Args:
            alert_id: Alert ID
            
        Returns:
            True if acknowledged successfully
        """
        for alert in self.alerts:
            if alert.alert_id == alert_id:
                alert.acknowledged = True
                self.logger.info(f"Acknowledged alert: {alert_id}")
                return True
        return False
    
    def register_callback(self, callback: Callable[[Alert], None]) -> None:
        """Register callback for new alerts"""
        self.alert_callbacks.append(callback)
    
    def get_alert_statistics(self) -> Dict[str, Any]:
        """Get alert statistics"""
        total = len(self.alerts)
        unacknowledged = sum(1 for a in self.alerts if not a.acknowledged)
        
        by_level = {}
        for alert in self.alerts:
            level = alert.level.value
            by_level[level] = by_level.get(level, 0) + 1
        
        return {
            "total_alerts": total,
            "unacknowledged": unacknowledged,
            "by_level": by_level
        }

