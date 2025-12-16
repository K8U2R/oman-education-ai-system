#!/bin/bash
# تشغيل جميع الأنظمة - Linux/Mac
# Start All Systems - Linux/Mac

# الحصول على مسار السكريبت
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"

echo "===================================="
echo "  تشغيل جميع أنظمة المشروع"
echo "  Starting All Systems"
echo "===================================="
echo ""

# الانتقال إلى الجذر
cd "$PROJECT_ROOT"

# التحقق من Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 غير مثبت"
    echo "   يرجى تثبيت Python3 أولاً"
    exit 1
fi

# تشغيل السكريبت Python
python3 "$SCRIPT_DIR/start-all-systems.py"

