"""
حوار التحديثات للتطبيق المكتبي
Update dialog for desktop app
"""

from pathlib import Path
from typing import Dict

from PySide6.QtWidgets import (
    QDialog,
    QVBoxLayout,
    QLabel,
    QPushButton,
    QTextEdit,
    QMessageBox,
    QHBoxLayout,
)
from PySide6.QtCore import Qt

from updater import Updater


class UpdateDialog(QDialog):
    """نافذة تعرض تفاصيل التحديث وتسمح بالتحميل"""

    def __init__(self, updater: Updater, manifest: Dict, localization, parent=None):
        super().__init__(parent)
        self.updater = updater
        self.manifest = manifest
        self.localization = localization
        self.setWindowTitle(self.localization.get("update_title"))
        self.resize(520, 420)
        self._build_ui()

    def _build_ui(self):
        layout = QVBoxLayout(self)

        latest_version = self.manifest.get("latest_version", "")
        channel = self.manifest.get("channel", "stable")
        download_url = self.manifest.get("download_url", "")

        header = QLabel(
            self.localization.format(
                "update_available",
                version=latest_version,
                channel=channel,
            )
        )
        header.setWordWrap(True)
        layout.addWidget(header)

        notes_label = QLabel(self.localization.get("update_notes"))
        layout.addWidget(notes_label)

        self.notes = QTextEdit()
        self.notes.setReadOnly(True)
        self.notes.setText(self.manifest.get("release_notes", ""))
        layout.addWidget(self.notes)

        btn_row = QHBoxLayout()
        download_btn = QPushButton(self.localization.get("update_download"))
        download_btn.clicked.connect(lambda: self._download(download_url))
        close_btn = QPushButton(self.localization.get("action_close"))
        close_btn.clicked.connect(self.accept)
        btn_row.addWidget(download_btn)
        btn_row.addWidget(close_btn)
        layout.addLayout(btn_row)

    def _download(self, url: str):
        try:
            saved_path = self.updater.download_update(url)
            QMessageBox.information(
                self,
                self.localization.get("update_downloaded_title"),
                self.localization.format(
                    "update_downloaded_body",
                    path=str(saved_path),
                ),
            )
        except Exception as e:
            QMessageBox.warning(
                self,
                self.localization.get("update_error_title"),
                self.localization.format("update_error_body", error=str(e)),
            )


