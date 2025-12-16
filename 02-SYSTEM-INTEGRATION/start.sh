#!/bin/bash
# تشغيل نظام التكامل
# Start Integration System

echo "🚀 بدء تشغيل نظام التكامل..."
echo "Starting Integration System..."

cd "$(dirname "$0")"

# التحقق من وجود البيئة الافتراضية
if [ -f "../.venv/bin/activate" ]; then
    source ../.venv/bin/activate
fi

# تشغيل النظام
python3 run.py

