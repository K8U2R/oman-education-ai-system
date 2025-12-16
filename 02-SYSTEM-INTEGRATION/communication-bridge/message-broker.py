"""
Message Broker
message-broker.py

وسيط الرسائل - إدارة الرسائل بين الأنظمة
Message Broker - Manages messages between systems

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
import json
from typing import Dict, List, Optional, Any, Callable
from datetime import datetime
from enum import Enum
from dataclasses import dataclass
from collections import defaultdict, deque

logger = logging.getLogger(__name__)


class MessagePriority(Enum):
    """أولوية الرسالة"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    URGENT = 4


class MessageStatus(Enum):
    """حالة الرسالة"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Message:
    """رسالة"""
    id: str
    source: str
    destination: str
    content: Any
    priority: MessagePriority = MessagePriority.NORMAL
    status: MessageStatus = MessageStatus.PENDING
    created_at: datetime = None
    processed_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """تحويل الرسالة إلى dict"""
        return {
            "id": self.id,
            "source": self.source,
            "destination": self.destination,
            "content": self.content,
            "priority": self.priority.value,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "processed_at": self.processed_at.isoformat() if self.processed_at else None
        }


class MessageBroker:
    """
    وسيط الرسائل
    يدير الرسائل بين الأنظمة المختلفة
    
    Message Broker
    Manages messages between different systems
    """
    
    def __init__(self):
        """تهيئة وسيط الرسائل"""
        self.name = "Message Broker"
        self.version = "1.0.0"
        
        # طوابير الرسائل (منظمة حسب الوجهة والأولوية)
        self.queues: Dict[str, Dict[int, deque]] = defaultdict(lambda: defaultdict(deque))
        
        # معالجات الرسائل
        self.handlers: Dict[str, List[Callable]] = defaultdict(list)
        
        # الرسائل المعالجة
        self.processed_messages: Dict[str, Message] = {}
        
        # إحصائيات
        self.stats: Dict[str, int] = {
            "total_messages": 0,
            "processed_messages": 0,
            "failed_messages": 0,
            "pending_messages": 0
        }
        
        # حالة التشغيل
        self.running = False
        self.processor_task: Optional[asyncio.Task] = None
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def start(self):
        """بدء معالجة الرسائل"""
        if self.running:
            logger.warning("وسيط الرسائل يعمل بالفعل")
            return
        
        self.running = True
        self.processor_task = asyncio.create_task(self._process_messages())
        logger.info("✅ بدأ وسيط الرسائل")
    
    async def stop(self):
        """إيقاف معالجة الرسائل"""
        self.running = False
        if self.processor_task:
            self.processor_task.cancel()
            try:
                await self.processor_task
            except asyncio.CancelledError:
                pass
        logger.info("🛑 تم إيقاف وسيط الرسائل")
    
    async def publish(
        self,
        destination: str,
        content: Any,
        source: str = "unknown",
        priority: MessagePriority = MessagePriority.NORMAL
    ) -> str:
        """
        نشر رسالة
        
        Args:
            destination: الوجهة
            content: محتوى الرسالة
            source: المصدر
            priority: الأولوية
            
        Returns:
            str: معرف الرسالة
        """
        message_id = f"{source}_{destination}_{datetime.now().timestamp()}"
        
        message = Message(
            id=message_id,
            source=source,
            destination=destination,
            content=content,
            priority=priority,
            status=MessageStatus.PENDING
        )
        
        # إضافة الرسالة إلى الطابور
        self.queues[destination][priority.value].append(message)
        self.stats["total_messages"] += 1
        self.stats["pending_messages"] += 1
        
        logger.info(f"📨 تم نشر رسالة: {message_id} من {source} إلى {destination}")
        
        return message_id
    
    def subscribe(self, destination: str, handler: Callable):
        """
        الاشتراك في رسائل وجهة معينة
        
        Args:
            destination: الوجهة
            handler: معالج الرسائل
        """
        self.handlers[destination].append(handler)
        logger.info(f"✅ تم الاشتراك في {destination}")
    
    async def _process_messages(self):
        """معالجة الرسائل (يعمل في الخلفية)"""
        while self.running:
            try:
                # البحث عن رسائل معالجة
                processed_any = False
                
                for destination, priority_queues in self.queues.items():
                    # معالجة حسب الأولوية (من الأعلى للأقل)
                    for priority in sorted(priority_queues.keys(), reverse=True):
                        queue = priority_queues[priority]
                        
                        if queue and destination in self.handlers:
                            message = queue.popleft()
                            message.status = MessageStatus.PROCESSING
                            
                            try:
                                # استدعاء المعالجات
                                for handler in self.handlers[destination]:
                                    if asyncio.iscoroutinefunction(handler):
                                        await handler(message)
                                    else:
                                        handler(message)
                                
                                message.status = MessageStatus.COMPLETED
                                message.processed_at = datetime.now()
                                self.stats["processed_messages"] += 1
                                processed_any = True
                                
                            except Exception as e:
                                logger.error(f"❌ خطأ في معالجة الرسالة {message.id}: {e}")
                                message.status = MessageStatus.FAILED
                                self.stats["failed_messages"] += 1
                            
                            finally:
                                self.stats["pending_messages"] = max(0, self.stats["pending_messages"] - 1)
                                self.processed_messages[message.id] = message
                
                if not processed_any:
                    await asyncio.sleep(0.1)  # انتظار قصير إذا لم تكن هناك رسائل
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"❌ خطأ في معالج الرسائل: {e}")
                await asyncio.sleep(1)
    
    def get_queue_size(self, destination: Optional[str] = None) -> Dict[str, int]:
        """
        الحصول على حجم الطوابير
        
        Args:
            destination: الوجهة (اختياري)
            
        Returns:
            dict: أحجام الطوابير
        """
        if destination:
            if destination in self.queues:
                total = sum(len(queue) for queue in self.queues[destination].values())
                return {destination: total}
            return {destination: 0}
        
        return {
            dest: sum(len(queue) for queue in queues.values())
            for dest, queues in self.queues.items()
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """
        الحصول على الإحصائيات
        
        Returns:
            dict: الإحصائيات
        """
        return {
            **self.stats,
            "queues": self.get_queue_size(),
            "subscribers": {dest: len(handlers) for dest, handlers in self.handlers.items()},
            "success_rate": (
                self.stats["processed_messages"] / self.stats["total_messages"]
                if self.stats["total_messages"] > 0
                else 0
            )
        }
    
    def get_message(self, message_id: str) -> Optional[Message]:
        """
        الحصول على رسالة
        
        Args:
            message_id: معرف الرسالة
            
        Returns:
            Message أو None
        """
        return self.processed_messages.get(message_id)
    
    def is_healthy(self) -> bool:
        """
        التحقق من صحة وسيط الرسائل
        
        Returns:
            bool: True إذا كان يعمل بشكل صحيح
        """
        return self.running and self.processor_task is not None and not self.processor_task.done()


async def main():
    """اختبار وسيط الرسائل"""
    broker = MessageBroker()
    
    # بدء المعالج
    await broker.start()
    
    # تعريف معالج
    async def chat_handler(message: Message):
        print(f"📨 معالجة رسالة محادثة: {message.content}")
    
    # الاشتراك
    broker.subscribe("ai_core", chat_handler)
    
    # نشر رسائل
    await broker.publish("ai_core", "مرحباً", source="web_interface", priority=MessagePriority.HIGH)
    await broker.publish("ai_core", "كيف حالك؟", source="web_interface", priority=MessagePriority.NORMAL)
    
    # انتظار المعالجة
    await asyncio.sleep(1)
    
    # عرض الإحصائيات
    stats = broker.get_stats()
    print(f"\n📊 الإحصائيات:")
    print(f"  إجمالي الرسائل: {stats['total_messages']}")
    print(f"  الرسائل المعالجة: {stats['processed_messages']}")
    print(f"  معدل النجاح: {stats['success_rate']:.2%}")
    
    # إيقاف
    await broker.stop()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    asyncio.run(main())
