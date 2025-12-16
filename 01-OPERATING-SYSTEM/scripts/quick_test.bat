@echo off
REM Quick Test Script for Windows

echo 🧪 Quick System Test
echo ===================
echo.

REM Check if server is running
echo 1. Checking if API server is running...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ API server is running
) else (
    echo ❌ API server is not running
    echo    Start it with: python -m api_gateway.fastapi_server
    exit /b 1
)

REM Test endpoints
echo.
echo 2. Testing endpoints...

curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% == 0 (echo ✅ /health) else (echo ❌ /health)

curl -s http://localhost:8001/api/v1/system/status >nul 2>&1
if %errorlevel% == 0 (echo ✅ /api/v1/system/status) else (echo ❌ /api/v1/system/status)

curl -s http://localhost:8001/api/v1/system/health >nul 2>&1
if %errorlevel% == 0 (echo ✅ /api/v1/system/health) else (echo ❌ /api/v1/system/health)

echo.
echo ✅ Quick test completed!

