"""
Script to create .env files programmatically
إنشاء ملفات .env برمجياً
"""

import os
from pathlib import Path

# Gemini API Key
GEMINI_API_KEY = "AIzaSyBfRGmWHSoZDp2s-nVjgzj9wIWapSocpzg"

# Google OAuth
GOOGLE_CLIENT_ID = "353597592173-a4ckuh3l0cfsvvs67c7e81lnpeeiktl5.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"  # يجب إضافته من Google Cloud Console
GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/oauth/google/callback"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID = "your_github_client_id_here"
GITHUB_CLIENT_SECRET = "your_github_client_secret_here"
GITHUB_REDIRECT_URI = "http://localhost:3000/auth/oauth/github/callback"

# Project root directory
PROJECT_ROOT = Path(__file__).parent
FRONTEND_DIR = PROJECT_ROOT / "03-WEB-INTERFACE" / "frontend"


def create_backend_env():
    """Create .env file for backend"""
    env_content = f"""# ============================================
# Backend Environment Variables
# متغيرات بيئة الخادم الخلفي
# ============================================

# Google Gemini API Key
# مفتاح API لـ Google Gemini
GEMINI_API_KEY={GEMINI_API_KEY}

# Google OAuth
# تكوين OAuth من Google
GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET={GOOGLE_CLIENT_SECRET}
GOOGLE_REDIRECT_URI={GOOGLE_REDIRECT_URI}

# GitHub OAuth (optional)
# تكوين OAuth من GitHub (اختياري)
GITHUB_CLIENT_ID={GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET={GITHUB_CLIENT_SECRET}
GITHUB_REDIRECT_URI={GITHUB_REDIRECT_URI}

# OpenAI API Key (optional)
# مفتاح API لـ OpenAI (اختياري)
OPENAI_API_KEY=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

# Anthropic API Key (optional)
# مفتاح API لـ Anthropic (اختياري)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database Configuration
# تكوين قواعد البيانات
DATABASE_URL=postgresql://user:password@localhost:5432/oman_ai_db
MONGODB_URL=mongodb://localhost:27017/oman_ai_db
REDIS_URL=redis://localhost:6379/0

# Security
# الأمان
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here

# Server Configuration
# تكوين الخادم
API_HOST=0.0.0.0
API_PORT=8001
FRONTEND_PORT=3000

# CORS Configuration
# تكوين CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Environment
# البيئة
ENVIRONMENT=development
DEBUG=True

# Logging
# التسجيل
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# Performance Monitoring
# مراقبة الأداء
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_MONITORING_ENDPOINT=/api/analytics/performance

# Error Reporting
# الإبلاغ عن الأخطاء
ENABLE_ERROR_REPORTING=true
ERROR_REPORTING_ENDPOINT=/api/errors/report
"""
    
    env_file = PROJECT_ROOT / ".env"
    env_file.write_text(env_content, encoding='utf-8')
    print(f"[OK] تم إنشاء ملف .env في: {env_file}")
    return env_file


def create_frontend_env():
    """Create .env file for frontend"""
    env_content = f"""# ============================================
# Frontend Environment Variables
# متغيرات بيئة الواجهة الأمامية
# ============================================

# API Configuration
# تكوين API
# ملاحظة: VITE_API_BASE_URL للاستخدام العام (اختياري)
# Note: VITE_API_BASE_URL for general use (optional)
VITE_API_BASE_URL=http://localhost:8001
VITE_API_TIMEOUT=30000

# AI API Configuration
# تكوين API الذكاء الاصطناعي
VITE_AI_API_URL=http://localhost:8001/api/ai
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY={GEMINI_API_KEY}

# OAuth Configuration
# تكوين OAuth
VITE_GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID}
VITE_GITHUB_CLIENT_ID={GITHUB_CLIENT_ID}

# Backend API - Main API URL
# واجهة برمجة التطبيقات الخلفية - URL الرئيسي
# هذا هو URL الأساسي المستخدم في api-client.ts
# يجب أن يحتوي على /api/v1 أو /api حسب بنية الـ API
# This is the base URL used in api-client.ts
# Should contain /api/v1 or /api depending on API structure
VITE_API_URL=http://localhost:8001/api/v1

# Sentry Configuration (Optional - for Production)
# تكوين Sentry (اختياري - للإنتاج)
# احصل على DSN من https://sentry.io
VITE_SENTRY_DSN=

# Feature Flags
# أعلام الميزات
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true

# Development Mode
# وضع التطوير
VITE_DEV_MODE=false

# App Configuration
# تكوين التطبيق
VITE_APP_NAME=Oman Education AI System
VITE_APP_VERSION=1.0.0
"""
    
    # Create frontend directory if it doesn't exist
    FRONTEND_DIR.mkdir(parents=True, exist_ok=True)
    
    env_file = FRONTEND_DIR / ".env"
    env_file.write_text(env_content, encoding='utf-8')
    print(f"[OK] تم إنشاء ملف .env في: {env_file}")
    return env_file


def main():
    """Main function"""
    import sys
    import io
    # Set UTF-8 encoding for output
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print("بدء إنشاء ملفات .env...")
    print(f"المجلد الرئيسي: {PROJECT_ROOT}")
    print(f"Gemini API Key: {GEMINI_API_KEY[:20]}...")
    print()
    
    # Create backend .env
    try:
        backend_env = create_backend_env()
        print(f"   [OK] Backend .env: {backend_env.exists()}")
    except Exception as e:
        print(f"   [ERROR] خطأ في إنشاء Backend .env: {e}")
    
    # Create frontend .env
    try:
        frontend_env = create_frontend_env()
        print(f"   [OK] Frontend .env: {frontend_env.exists()}")
    except Exception as e:
        print(f"   [ERROR] خطأ في إنشاء Frontend .env: {e}")
    
    print()
    print("[SUCCESS] ✅ تم إنشاء جميع ملفات .env بنجاح!")
    print()
    print("=" * 60)
    print("الخطوات التالية:")
    print("=" * 60)
    print()
    print("1. ✅ تأكد من أن ملفات .env موجودة:")
    print(f"   - Backend: {PROJECT_ROOT / '.env'}")
    print(f"   - Frontend: {FRONTEND_DIR / '.env'}")
    print()
    print("2. 🚀 قم بتشغيل Backend:")
    print("      cd 01-OPERATING-SYSTEM")
    print("      python -m api_gateway.fastapi_server")
    print()
    print("3. 🎨 قم بتشغيل Frontend:")
    print("      cd 03-WEB-INTERFACE/frontend")
    print("      npm run dev")
    print()
    print("4. ⚙️  إعدادات إضافية (اختياري):")
    print("   - أضف VITE_SENTRY_DSN في frontend/.env للإنتاج")
    print("   - تأكد من إعداد قواعد البيانات")
    print("   - راجع ملفات .env.example للمزيد من المعلومات")
    print()
    print("=" * 60)
    print("[NOTE] ⚠️  ملاحظة مهمة:")
    print("   - تأكد من إضافة .env إلى .gitignore")
    print("   - لا تشارك ملفات .env في Git")
    print("   - استخدم .env.example كقالب")
    print("=" * 60)


if __name__ == "__main__":
    main()

