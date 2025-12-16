"""
نافذة فحص الأذونات
Permissions check dialog
"""

from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QLabel, QTableWidget, QTableWidgetItem, QPushButton, QHeaderView
)
from PySide6.QtCore import Qt
from pathlib import Path
import sys

project_root = Path(__file__).parent.parent.parent
orchestrator_path = project_root / "19-DESKTOP-OS-APP" / "orchestrator"
sys.path.insert(0, str(orchestrator_path))

from orchestrator.permissions_checker import PermissionsChecker


class PermissionsDialog(QDialog):
    """نافذة فحص الأذونات"""

    def __init__(self, project_root: Path, required_ports: list, writable_paths: list, parent=None):
        super().__init__(parent)
        self.setWindowTitle("فحص الأذونات")
        self.resize(600, 400)
        self.project_root = project_root
        self.required_ports = required_ports
        self.writable_paths = writable_paths
        self.checker = PermissionsChecker(project_root)

        self.setup_ui()
        self.run_checks()

    def setup_ui(self):
        layout = QVBoxLayout(self)

        info = QLabel("يتم فحص أذونات الكتابة والمنافذ المطلوبة للتشغيل.")
        info.setWordWrap(True)
        layout.addWidget(info)

        self.table = QTableWidget()
        self.table.setColumnCount(3)
        self.table.setHorizontalHeaderLabels(["الفحص", "القيمة", "الحالة"])
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(QHeaderView.Stretch)
        layout.addWidget(self.table)

        close_btn = QPushButton("إغلاق")
        close_btn.clicked.connect(self.accept)
        layout.addWidget(close_btn)

    def run_checks(self):
        results = self.checker.run_all(
            [Path(p) for p in self.writable_paths],
            self.required_ports,
        )

        rows = []
        for path, ok in results["write_access"].items():
            rows.append(("إذن كتابة", path, "✅" if ok else "❌"))
        for port, ok in results["ports_access"].items():
            rows.append(("منفذ", str(port), "✅" if ok else "❌"))

        self.table.setRowCount(len(rows))
        for i, (check, value, status) in enumerate(rows):
            self.table.setItem(i, 0, QTableWidgetItem(check))
            self.table.setItem(i, 1, QTableWidgetItem(value))
            self.table.setItem(i, 2, QTableWidgetItem(status))
            for col in range(3):
                item = self.table.item(i, col)
                if status == "❌":
                    item.setForeground(Qt.red)
                else:
                    item.setForeground(Qt.green)

