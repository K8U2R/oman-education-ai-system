@echo off
REM تشغيل جميع الأنظمة - Windows
REM Start All Systems - Windows

echo ====================================
echo   تشغيل جميع أنظمة المشروع
echo   Starting All Systems
echo ====================================
echo.

REM التحقق من Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python غير مثبت أو غير موجود في PATH
    echo    يرجى تثبيت Python أولاً
    pause
    exit /b 1
)

REM تشغيل السكريبت
python start-all-systems.py

pause

