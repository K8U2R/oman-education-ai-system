@echo off
REM تشغيل جميع الأنظمة - Windows
REM Start All Systems - Windows

REM الحصول على مسار السكريبت
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%..\..\"

echo ====================================
echo   تشغيل جميع أنظمة المشروع
echo   Starting All Systems
echo ====================================
echo.

REM الانتقال إلى الجذر
cd /d "%PROJECT_ROOT%"

REM التحقق من Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python غير مثبت أو غير موجود في PATH
    echo    يرجى تثبيت Python أولاً
    pause
    exit /b 1
)

REM تشغيل السكريبت Python
python "%SCRIPT_DIR%start-all-systems.py"

pause

