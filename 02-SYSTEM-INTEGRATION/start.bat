@echo off
REM تشغيل نظام التكامل
REM Start Integration System

echo 🚀 بدء تشغيل نظام التكامل...
echo Starting Integration System...

cd /d "%~dp0"

REM التحقق من وجود البيئة الافتراضية
if exist "..\.venv\Scripts\activate.bat" (
    call ..\.venv\Scripts\activate.bat
)

REM تشغيل النظام
python run.py

pause

