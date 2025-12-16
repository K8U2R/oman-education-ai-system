"""
عميل WebSocket لمراقبة الصحة والمقاييس
WebSocket client for health/monitoring (replacement for HTTP polling)
"""

from __future__ import annotations

import json
from typing import Optional

from PySide6.QtCore import QObject, Signal, QTimer, QUrl
from PySide6.QtWebSockets import QWebSocket


class MonitoringWebSocketClient(QObject):
    """Client بسيط لاستقبال تحديثات /ws/monitoring"""

    monitoring_update = Signal(dict)  # full JSON payload
    connection_state_changed = Signal(bool)  # connected: bool

    def __init__(self, url: str, reconnect_interval_ms: int = 5000, parent: Optional[QObject] = None):
        super().__init__(parent)
        self._url = QUrl(url)
        self._socket = QWebSocket()
        self._reconnect_interval = reconnect_interval_ms
        self._should_run = False

        self._socket.connected.connect(self._on_connected)
        self._socket.disconnected.connect(self._on_disconnected)
        self._socket.textMessageReceived.connect(self._on_text_message)

        self._reconnect_timer = QTimer(self)
        self._reconnect_timer.setInterval(self._reconnect_interval)
        self._reconnect_timer.timeout.connect(self._try_connect)

    def start(self):
        """بدء الاتصال والاستمرار مع إعادة المحاولة عند الفشل"""
        self._should_run = True
        self._try_connect()

    def stop(self):
        """إيقاف الاتصال وإيقاف المحاولات"""
        self._should_run = False
        self._reconnect_timer.stop()
        if self._socket.state() != QWebSocket.Closed:
            self._socket.close()

    def _try_connect(self):
        if not self._should_run:
            return
        if self._socket.state() in (QWebSocket.ConnectingState, QWebSocket.OpenState):
            return
        self._socket.open(self._url)

    def _on_connected(self):
        self._reconnect_timer.stop()
        self.connection_state_changed.emit(True)

    def _on_disconnected(self):
        self.connection_state_changed.emit(False)
        if self._should_run:
            # حاول إعادة الاتصال بعد فترة
            self._reconnect_timer.start()

    def _on_text_message(self, message: str):
        try:
            data = json.loads(message)
            if isinstance(data, dict):
                self.monitoring_update.emit(data)
        except Exception:
            # تجاهل الرسائل غير الصحيحة
            pass


