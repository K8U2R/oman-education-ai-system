# 🚀 دليل البدء السريع - Quick Start Guide

## التثبيت السريع

### 1. تثبيت التبعيات

```bash
cd 01-OPERATING-SYSTEM
pip install -r requirements.txt
```

### 2. تشغيل النظام

```bash
python main.py
```

## الاستخدام الأساسي

### تهيئة النظام

```python
import asyncio
from system_core.system_initializer import SystemInitializer

async def main():
    # تهيئة النظام
    initializer = SystemInitializer()
    result = await initializer.initialize()
    
    print(f"System initialized: {result['status']}")
    print(f"Components: {len(result['components'])}")

asyncio.run(main())
```

### إدارة الخدمات

```python
from system_core.service_manager import ServiceManager, ServiceStatus

async def main():
    manager = ServiceManager()
    
    # تسجيل خدمة
    await manager.register_service(
        name="my_service",
        description="My custom service",
        start_func=lambda: print("Service started"),
        priority=5
    )
    
    # بدء الخدمة
    await manager.start_service("my_service")
    
    # الحصول على حالة الخدمة
    status = manager.get_service_status("my_service")
    print(f"Service status: {status}")

asyncio.run(main())
```

### جدولة العمليات

```python
from system_core.process_scheduler import ProcessScheduler, ProcessPriority

async def main():
    scheduler = ProcessScheduler(max_concurrent=10)
    await scheduler.start()
    
    # إرسال عملية
    pid = await scheduler.submit(
        func=my_function,
        name="my_process",
        priority=ProcessPriority.HIGH
    )
    
    # انتظار اكتمال العملية
    result = await scheduler.wait_for_process(pid)
    
    await scheduler.stop()

asyncio.run(main())
```

### مراقبة الموارد

```python
from system_core.resource_allocator import ResourceAllocator, ResourceType

allocator = ResourceAllocator()

# الحصول على استخدام الموارد
cpu_usage = allocator.get_cpu_usage()
memory_usage = allocator.get_memory_usage()
disk_usage = allocator.get_disk_usage()

print(f"CPU: {cpu_usage.usage_percent}%")
print(f"Memory: {memory_usage.usage_percent}%")
print(f"Disk: {disk_usage.usage_percent}%")

# التحقق من توفر الموارد
available, message = allocator.check_resource_availability(
    ResourceType.MEMORY,
    required_amount=1024 * 1024 * 1024  # 1GB
)
```

### فحص صحة النظام

```python
from system_monitoring.health_monitoring.system_health_check import SystemHealthCheck

health_check = SystemHealthCheck()
report = health_check.check_system_health()

print(f"Overall Status: {report['overall_status']}")
print(f"CPU: {report['metrics']['cpu']['status']}")
print(f"Memory: {report['metrics']['memory']['status']}")
```

### مراقبة الأداء

```python
from system_monitoring.health_monitoring.performance_monitor import PerformanceMonitor

monitor = PerformanceMonitor()
monitor.start_monitoring(interval=1.0)

# الحصول على المقاييس الحالية
current_metrics = monitor.get_current_metrics()
print(f"CPU: {current_metrics.get('cpu_percent', 0)}%")

# الحصول على إحصائيات
stats = monitor.get_metric_statistics('cpu_percent')
print(f"CPU Stats: Min={stats['min']}, Max={stats['max']}, Avg={stats['avg']}")

# إيقاف المراقبة
monitor.stop_monitoring()
```

### كشف الأخطاء

```python
from system_monitoring.error_management.error_detector import ErrorDetector, ErrorCategory, ErrorSeverity

detector = ErrorDetector()

# كشف خطأ
error = detector.detect_error(
    message="Memory allocation failed",
    source="memory_manager",
    details={"requested": "1GB", "available": "512MB"}
)

print(f"Error ID: {error.error_id}")
print(f"Category: {error.category.value}")
print(f"Severity: {error.severity.value}")

# الحصول على إحصائيات الأخطاء
stats = detector.get_error_statistics()
print(f"Total Errors: {stats['total_errors']}")
```

### التنبيهات

```python
from system_monitoring.alert_system.alert_generator import AlertGenerator, AlertLevel

generator = AlertGenerator()

# إنشاء تنبيه
alert = generator.generate_alert(
    title="High CPU Usage",
    message="CPU usage has exceeded 90%",
    level=AlertLevel.WARNING,
    source="performance_monitor"
)

# الحصول على التنبيهات غير المقروءة
unread = generator.get_alerts(unacknowledged_only=True)
```

### التنظيف

```python
from system_maintenance.cleanup_manager import CleanupManager

cleanup = CleanupManager()

# تنظيف الملفات المؤقتة
result = cleanup.cleanup_temp_files(max_age_days=7)
print(f"Deleted {result['deleted']} files, freed {result['freed_mb']} MB")

# تنظيف كامل
results = cleanup.perform_full_cleanup()
```

## أمثلة متقدمة

### نظام متكامل

```python
import asyncio
from system_core.system_initializer import SystemInitializer
from system_core.service_manager import ServiceManager
from system_core.process_scheduler import ProcessScheduler
from system_monitoring.health_monitoring.system_health_check import SystemHealthCheck

async def main():
    # 1. تهيئة النظام
    initializer = SystemInitializer()
    await initializer.initialize()
    
    # 2. بدء مدير الخدمات
    service_manager = ServiceManager()
    
    # 3. بدء مجدول العمليات
    scheduler = ProcessScheduler()
    await scheduler.start()
    
    # 4. فحص صحة النظام
    health_check = SystemHealthCheck()
    health_report = health_check.check_system_health()
    
    print(f"System Status: {health_report['overall_status']}")
    
    # 5. إيقاف النظام
    await scheduler.stop()
    await initializer.shutdown()

asyncio.run(main())
```

## الملفات المهمة

- `main.py` - نقطة الدخول الرئيسية
- `config/system_config.json` - التكوين الأساسي
- `requirements.txt` - التبعيات المطلوبة
- `Building-Documentation.md` - الوثائق الكاملة
- `STATUS.md` - حالة التنفيذ

## الدعم

للمزيد من المعلومات، راجع:
- `Building-Documentation.md` - الوثائق الشاملة
- `README.md` - نظرة عامة
- `STATUS.md` - حالة التنفيذ

