"""
Event Handler
event-handler.py

معالج الأحداث - إدارة الأحداث بين الأنظمة
Event Handler - Manages events between systems
"""

import asyncio
import logging
from typing import Dict, List, Callable, Any, Optional
from datetime import datetime
from enum import Enum
from dataclasses import dataclass

logger = logging.getLogger(__name__)


class EventType(Enum):
    """نوع الحدث"""
    SYSTEM_STARTED = "system_started"
    SYSTEM_STOPPED = "system_stopped"
    SERVICE_REGISTERED = "service_registered"
    SERVICE_STARTED = "service_started"
    SERVICE_STOPPED = "service_stopped"
    ERROR_OCCURRED = "error_occurred"
    RESOURCE_LOW = "resource_low"
    HEALTH_CHECK = "health_check"
    CUSTOM = "custom"


@dataclass
class Event:
    """حدث"""
    id: str
    type: EventType
    source: str
    data: Any
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """تحويل الحدث إلى dict"""
        return {
            "id": self.id,
            "type": self.type.value,
            "source": self.source,
            "data": self.data,
            "timestamp": self.timestamp.isoformat()
        }


class EventHandler:
    """
    معالج الأحداث
    يدير الأحداث بين الأنظمة المختلفة
    """
    
    def __init__(self):
        """تهيئة معالج الأحداث"""
        self.name = "Event Handler"
        self.version = "1.0.0"
        
        # المشتركون (نوع الحدث → قائمة المعالجات)
        self.subscribers: Dict[EventType, List[Callable]] = {}
        
        # سجل الأحداث
        self.event_history: List[Event] = []
        self.max_history = 1000
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    def subscribe(self, event_type: EventType, handler: Callable):
        """
        الاشتراك في نوع حدث
        
        Args:
            event_type: نوع الحدث
            handler: معالج الحدث
        """
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        
        self.subscribers[event_type].append(handler)
        logger.info(f"✅ تم الاشتراك في {event_type.value}")
    
    def unsubscribe(self, event_type: EventType, handler: Callable):
        """
        إلغاء الاشتراك من نوع حدث
        
        Args:
            event_type: نوع الحدث
            handler: معالج الحدث
        """
        if event_type in self.subscribers:
            if handler in self.subscribers[event_type]:
                self.subscribers[event_type].remove(handler)
                logger.info(f"❌ تم إلغاء الاشتراك من {event_type.value}")
    
    async def emit(self, event_type: EventType, source: str, data: Any) -> str:
        """
        إصدار حدث
        
        Args:
            event_type: نوع الحدث
            source: مصدر الحدث
            data: بيانات الحدث
            
        Returns:
            str: معرف الحدث
        """
        event_id = f"{source}_{event_type.value}_{datetime.now().timestamp()}"
        
        event = Event(
            id=event_id,
            type=event_type,
            source=source,
            data=data
        )
        
        # إضافة إلى السجل
        self.event_history.append(event)
        if len(self.event_history) > self.max_history:
            self.event_history.pop(0)
        
        # إرسال للمشتركين
        if event_type in self.subscribers:
            for handler in self.subscribers[event_type]:
                try:
                    if asyncio.iscoroutinefunction(handler):
                        await handler(event)
                    else:
                        handler(event)
                except Exception as e:
                    logger.error(f"❌ خطأ في معالج الحدث: {e}")
        
        logger.info(f"📢 تم إصدار حدث: {event_type.value} من {source}")
        return event_id
    
    def get_event_history(self, event_type: Optional[EventType] = None, limit: int = 100) -> List[Event]:
        """
        الحصول على سجل الأحداث
        
        Args:
            event_type: نوع الحدث (اختياري)
            limit: الحد الأقصى للأحداث
            
        Returns:
            list: قائمة الأحداث
        """
        events = self.event_history
        
        if event_type:
            events = [e for e in events if e.type == event_type]
        
        return events[-limit:]
    
    def get_stats(self) -> Dict[str, Any]:
        """الحصول على الإحصائيات"""
        return {
            "total_events": len(self.event_history),
            "subscribers": {
                event_type.value: len(handlers)
                for event_type, handlers in self.subscribers.items()
            },
            "event_types": [et.value for et in EventType]
        }

