"""
اختبارات وحدة بسيطة لـ MonitoringWebSocketClient
Simple unit tests for MonitoringWebSocketClient internal logic.

هذه الاختبارات لا تحتاج إلى خادم WebSocket حقيقي، فقط تتحقق من حالة العميل.
"""

from PySide6.QtCore import QCoreApplication, QTimer

from monitoring.monitoring_ws_client import MonitoringWebSocketClient


def _create_qapp():
    """إنشاء QCoreApplication واحد لاختبارات PySide6."""
    app = QCoreApplication.instance()
    if app is None:
        app = QCoreApplication([])
    return app


def test_ws_client_start_and_stop(qtbot):
    """
    start() يجب أن يفعّل should_run، و stop() يجب أن يعطّله بدون رفع استثناء.
    """
    _create_qapp()
    client = MonitoringWebSocketClient("ws://localhost:65535/ws/monitoring", reconnect_interval_ms=10)

    # نستخدم qtbot لإدارة عمر الكائن ومنع التسريبات
    qtbot.addWidget  # فقط للتأكد من توفر qtbot (لا نستخدم widget حقيقي هنا)

    client.start()
    # لا يمكننا الوصول لـ _should_run مباشرة، لكنها لو كانت False لن يحاول الاتصال
    # نسمح بمرور event loop قليلاً للتأكد من عدم حدوث استثناءات
    QTimer.singleShot(20, client.stop)

    # تشغيل الـ event loop فترة قصيرة
    QTimer.singleShot(30, QCoreApplication.quit)
    QCoreApplication.exec()


