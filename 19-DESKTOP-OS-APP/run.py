"""
ملف تشغيل سريع
Quick Run Script
"""

import sys
from pathlib import Path

# إضافة مسار المشروع
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# تشغيل التطبيق
if __name__ == "__main__":
    import sys
    import os
    from pathlib import Path
    
    # إضافة مسار app-shell
    app_shell_path = Path(__file__).parent / "app-shell"
    sys.path.insert(0, str(app_shell_path))
    
    from main import main
    main()

