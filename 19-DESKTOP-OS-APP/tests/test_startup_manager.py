"""
اختبارات وحدة لـ StartupManager (منطق الأوركسترايتور الأساسي)
Unit tests for StartupManager logic (without running real services)
"""

from pathlib import Path

from orchestrator import StartupManager, ServiceStatus


def make_fake_config(tmp_path: Path):
    """
    إنشاء إعدادات خدمة بسيطة لا تعتمد على المشروع الحقيقي.
    Create minimal config for a fake service.
    """
    return {
        "services": {
            "fake_service": {
                "enabled": True,
                "auto_start": False,
                "port": 0,
                "path": str(tmp_path),  # موجود دائماً في سياق pytest
                "command": ["python", "-c", "print('ok')"],
            }
        }
    }


def test_initialize_services(tmp_path):
    """يجب أن يقوم StartupManager بتحميل الخدمات من الإعدادات"""
    config = make_fake_config(tmp_path)
    manager = StartupManager(project_root=tmp_path, config=config)

    assert "fake_service" in manager.services
    service = manager.services["fake_service"]
    assert service.enabled is True
    assert service.auto_start is False
    assert service.status == ServiceStatus.STOPPED


def test_get_all_statuses_initial(tmp_path):
    """يجب أن يعيد get_all_statuses حالة STopped افتراضياً"""
    config = make_fake_config(tmp_path)
    manager = StartupManager(project_root=tmp_path, config=config)

    statuses = manager.get_all_statuses()
    assert statuses["fake_service"] == ServiceStatus.STOPPED.value


def test_start_non_existing_service_returns_false(tmp_path):
    """تشغيل خدمة غير موجودة يجب أن يعيد False ولا يرفع استثناء"""
    config = make_fake_config(tmp_path)
    manager = StartupManager(project_root=tmp_path, config=config)

    result = manager.start_service("unknown_service")
    assert result is False


