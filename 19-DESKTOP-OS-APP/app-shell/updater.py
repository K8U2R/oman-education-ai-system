"""
نظام التحديثات للتطبيق المكتبي
Desktop app updater (manifest-based)
"""

from __future__ import annotations

import json
import shutil
import webbrowser
from pathlib import Path
from typing import Dict, Optional, Tuple

import requests


class Updater:
    """بسيط للتحقق من التحديثات وتحميلها"""

    def __init__(self, project_root: Path, config):
        self.project_root = project_root
        self.config = config
        self.download_dir = self.project_root / "updates"
        self.download_dir.mkdir(exist_ok=True)

    def _resolve_manifest_path(self, url: str) -> str:
        """يدعم روابط http/https أو مسار ملف محلي"""
        if url.startswith("http://") or url.startswith("https://"):
            return url
        # مسار نسبي من جذر المشروع
        return str((self.project_root / url).resolve())

    def fetch_manifest(self) -> Dict:
        """جلب ملف المانيفست"""
        url = self._resolve_manifest_path(self.config.get("app.update.manifest_url", ""))
        if not url:
            raise ValueError("manifest URL is missing")

        if url.startswith("http"):
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            return resp.json()

        # قراءة ملف محلي
        path = Path(url)
        if not path.exists():
            raise FileNotFoundError(f"Manifest not found: {path}")
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def compare_versions(current: str, latest: str) -> int:
        """مقارنة إصدارين (semver مبسط)"""
        def normalize(v: str):
            return [int(x) for x in v.split(".") if x.isdigit()]

        cur = normalize(current)
        lat = normalize(latest)
        # ملء بالأصفار لتجنب اختلاف الطول
        length = max(len(cur), len(lat))
        cur += [0] * (length - len(cur))
        lat += [0] * (length - len(lat))
        if cur == lat:
            return 0
        return -1 if cur < lat else 1

    def check_for_update(self) -> Tuple[bool, Optional[Dict]]:
        """إرجاع (هل يوجد تحديث، بيانات المانيفست)"""
        manifest = self.fetch_manifest()
        latest = manifest.get("latest_version")
        current = self.config.get("app.version", "0.0.0")
        if latest and self.compare_versions(current, latest) < 0:
            return True, manifest
        return False, manifest

    def download_update(self, download_url: str) -> Path:
        """تحميل ملف التحديث إلى مجلد updates"""
        if not download_url:
            raise ValueError("download_url is empty")

        # إذا كان رابط خارجي افتح المتصفح بدلاً من ذلك (لتجنب إدارة التنفيذ)
        if download_url.startswith(("http://", "https://")):
            filename = download_url.split("/")[-1] or "update.bin"
            target = self.download_dir / filename
            with requests.get(download_url, stream=True, timeout=20) as r:
                r.raise_for_status()
                with open(target, "wb") as f:
                    shutil.copyfileobj(r.raw, f)
            return target

        # مسار محلي
        src = Path(download_url)
        if not src.exists():
            raise FileNotFoundError(f"Update file not found: {src}")
        target = self.download_dir / src.name
        shutil.copy(src, target)
        return target

    def open_download_page(self, url: str):
        """فتح رابط التحديث في المتصفح"""
        if not url:
            raise ValueError("download_url is empty")
        webbrowser.open(url)


