"""
Run Integration System
run.py

تشغيل نظام التكامل
Run the integration system
"""

import sys
from pathlib import Path

# إضافة المسارات
project_root = Path(__file__).parent
orchestrator_dir = project_root / "integration-orchestrator"
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(orchestrator_dir))

# استيراد وتشغيل
if __name__ == "__main__":
    import uvicorn
    
    # استيراد الإعدادات
    try:
        from config import settings
    except ImportError:
        # Fallback
        import os
        class Settings:
            HOST = os.getenv("HOST", "0.0.0.0")
            PORT = int(os.getenv("PORT", 8003))
            DEBUG = os.getenv("DEBUG", "False").lower() == "true"
        settings = Settings()
    
    # تغيير المجلد إلى integration-orchestrator
    import os
    original_cwd = os.getcwd()
    os.chdir(str(orchestrator_dir))
    
    try:
        # تشغيل التطبيق
        uvicorn.run(
            "main:app",
            host=settings.HOST,
            port=settings.PORT,
            log_level="info",
            reload=settings.DEBUG
        )
    finally:
        os.chdir(original_cwd)

