# 🚀 دليل تشغيل السكريبتات - Scripts Runner Guide

## 📁 هيكل المجلدات

### 01-SETUP/ - سكريبتات الإعداد والتهيئة
- `setup-environment.sh` - إعداد البيئة الكاملة
- `install-dependencies.sh` - تثبيت المتطلبات
- `configure-services.sh` - تكوين الخدمات
- `initialize-database.sh` - تهيئة قاعدة البيانات

### 02-DEPLOYMENT/ - سكريبتات النشر
- `start-all-systems.sh` - تشغيل جميع الأنظمة (Linux/Mac)
- `start-all-systems.bat` - تشغيل جميع الأنظمة (Windows)
- `start-all-systems.py` - تشغيل جميع الأنظمة (Python)
- `deploy-production.sh` - نشر على الإنتاج
- `deploy-staging.sh` - نشر على التجريبي
- `rollback-deployment.sh` - التراجع عن النشر

### 03-MAINTENANCE/ - سكريبتات الصيانة
- `check-systems-status.py` - فحص حالة جميع الأنظمة
- `health-check.sh` - فحص صحة النظام
- `backup-system.sh` - نسخ احتياطي للنظام
- `cleanup-logs.sh` - تنظيف السجلات
- `monitor-resources.sh` - مراقبة الموارد

### 04-DEVELOPMENT/ - سكريبتات التطوير
- `run-tests.sh` - تشغيل الاختبارات
- `generate-docs.sh` - توليد الوثائق
- `code-quality-check.sh` - فحص جودة الكود
- `docker-build.sh` - بناء Docker

### 05-INTEGRATION/ - سكريبتات التكامل
- `sync-with-system2.sh` - مزامنة مع النظام الثاني
- `import-data.sh` - استيراد البيانات
- `export-config.sh` - تصدير الإعدادات
- `validate-integration.sh` - التحقق من التكامل

### 06-EMERGENCY/ - سكريبتات الطوارئ
- `emergency-restart.sh` - إعادة تشغيل طارئة
- `system-recovery.sh` - استعادة النظام
- `kill-all-processes.sh` - إيقاف جميع العمليات
- `safe-shutdown.sh` - إيقاف آمن

### 07-UTILITIES/ - أدوات مساعدة
- `json-formatter.py` - تنسيق JSON
- `log-analyzer.sh` - تحليل السجلات
- `data-migrator.py` - نقل البيانات
- `config-validator.sh` - التحقق من الإعدادات

### templates/ - قوالب السكريبتات
- `template-bash.sh` - قالب Bash
- `template-python.py` - قالب Python
- `README-TEMPLATE.md` - قالب README

---

## 🛠️ كيفية الاستخدام

### تشغيل سكريبت Bash (Linux/Mac):
```bash
# من الجذر
./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh

# أو من داخل المجلد
cd 16-SCRIPTS/02-DEPLOYMENT
./start-all-systems.sh
```

### تشغيل سكريبت Bash (Windows - Git Bash/WSL):
```bash
# من الجذر
./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh
```

### تشغيل سكريبت Batch (Windows):
```cmd
REM من الجذر
16-SCRIPTS\02-DEPLOYMENT\start-all-systems.bat

REM أو من داخل المجلد
cd 16-SCRIPTS\02-DEPLOYMENT
start-all-systems.bat
```

### تشغيل سكريبت Python:
```bash
# من الجذر
python 16-SCRIPTS/03-MAINTENANCE/check-systems-status.py

# أو مباشرة (إذا كان لديه shebang)
./16-SCRIPTS/03-MAINTENANCE/check-systems-status.py
```

### مع خيارات:
```bash
# وضع تفصيلي
./16-SCRIPTS/03-MAINTENANCE/health-check.sh --verbose

# تجربة بدون تنفيذ
./16-SCRIPTS/02-DEPLOYMENT/deploy-staging.sh --dry-run

# جميع الخيارات
./16-SCRIPTS/02-DEPLOYMENT/deploy-production.sh --verbose --dry-run
```

### في وضع التصحيح:
```bash
# Bash
bash -x ./16-SCRIPTS/02-DEPLOYMENT/deploy-staging.sh

# Python
python -m pdb 16-SCRIPTS/03-MAINTENANCE/check-systems-status.py
```

---

## 🔧 إعدادات مسبقة

### 1. منح صلاحيات التنفيذ (Linux/Mac):
```bash
# لجميع السكريبتات
chmod +x ./16-SCRIPTS/**/*.sh

# أو لكل سكريبت على حدة
chmod +x ./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh
```

### 2. إضافة إلى PATH (اختياري):
```bash
# في ~/.bashrc أو ~/.zshrc
export PATH="$PATH:$(pwd)/16-SCRIPTS/02-DEPLOYMENT"
export PATH="$PATH:$(pwd)/16-SCRIPTS/03-MAINTENANCE"

# ثم يمكنك تشغيلها مباشرة
start-all-systems.sh
```

### 3. إنشاء اختصارات (Windows):
```cmd
REM إنشاء اختصار في سطح المكتب
mklink "%USERPROFILE%\Desktop\Start Systems.bat" "%CD%\16-SCRIPTS\02-DEPLOYMENT\start-all-systems.bat"
```

---

## 📞 استكشاف الأخطاء

### السكريبت لا يعمل:

#### Linux/Mac:
```bash
# تحقق من الصلاحيات
ls -la script.sh

# تحقق من السطر الأول (shebang)
head -1 script.sh  # يجب أن يكون #!/bin/bash

# تحقق من نوع الملف
file script.sh

# منح صلاحيات التنفيذ
chmod +x script.sh
```

#### Windows:
```cmd
REM تحقق من المسار
cd 16-SCRIPTS\02-DEPLOYMENT
dir start-all-systems.bat

REM تشغيل مباشر
start-all-systems.bat
```

### خطأ في المسار:
```bash
# استخدم المسار الكامل
/path/to/project/16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh

# أو من الجذر
cd /path/to/project
./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh
```

### خطأ في الترميز (Windows):
```python
# تأكد من أن السكريبت يحتوي على:
# -*- coding: utf-8 -*-
# أو
# coding: utf-8
```

### خطأ في المتطلبات:
```bash
# تحقق من تثبيت Python
python --version

# تحقق من تثبيت Node.js
node --version

# تحقق من تثبيت Git
git --version
```

---

## 🎯 أفضل الممارسات

### 1. اقرأ قبل التشغيل:
```bash
# اقرأ السكريبت أولاً
cat 16-SCRIPTS/02-DEPLOYMENT/deploy-production.sh

# أو استخدم less
less 16-SCRIPTS/02-DEPLOYMENT/deploy-production.sh
```

### 2. استخدم --dry-run:
```bash
# للتجربة أولاً
./16-SCRIPTS/02-DEPLOYMENT/deploy-staging.sh --dry-run
```

### 3. حافظ على النسخ الاحتياطية:
```bash
# قبل أي عملية كبيرة
cp -r 16-SCRIPTS/ 16-SCRIPTS-BACKUP-$(date +%Y%m%d)
```

### 4. سجل الإخراج:
```bash
# تسجيل الإخراج إلى ملف
./16-SCRIPTS/03-MAINTENANCE/health-check.sh 2>&1 | tee health-check.log

# مع الطوابع الزمنية
./16-SCRIPTS/02-DEPLOYMENT/deploy-staging.sh 2>&1 | tee "deploy-$(date +%Y%m%d-%H%M%S).log"
```

### 5. استخدم وضع التصحيح:
```bash
# Bash
set -x  # في بداية السكريبت
# أو
bash -x script.sh

# Python
python -v script.py
```

---

## ⚠️ تحذيرات أمنية

### 1. لا تشغل سكريبتات من مصادر غير موثوقة:
```bash
# تحقق من محتوى السكريبت
cat script.sh | head -50
```

### 2. استخدم حسابات محدودة الصلاحيات:
```bash
# تشغيل بأقل الصلاحيات المطلوبة
sudo -u limited_user ./script.sh
```

### 3. تحقق من التغييرات:
```bash
# استخدم git للتحقق من التغييرات
git diff script.sh

# أو استخدم checksum
md5sum script.sh
```

### 4. حافظ على تحديث السكريبتات:
```bash
# تحقق من آخر تحديث
git log -1 --format="%ai %s" script.sh
```

---

## 📋 أمثلة الاستخدام

### مثال 1: تشغيل جميع الأنظمة
```bash
# Linux/Mac
./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh

# Windows
16-SCRIPTS\02-DEPLOYMENT\start-all-systems.bat
```

### مثال 2: فحص حالة الأنظمة
```bash
python 16-SCRIPTS/03-MAINTENANCE/check-systems-status.py
```

### مثال 3: نسخ احتياطي
```bash
./16-SCRIPTS/03-MAINTENANCE/backup-system.sh --verbose
```

### مثال 4: نشر على التجريبي
```bash
./16-SCRIPTS/02-DEPLOYMENT/deploy-staging.sh --dry-run  # تجربة
./16-SCRIPTS/02-DEPLOYMENT/deploy-staging.sh            # تنفيذ
```

---

## 🔗 روابط مفيدة

- [دليل Bash](https://www.gnu.org/software/bash/manual/)
- [دليل Python](https://docs.python.org/3/)
- [Best Practices for Shell Scripts](https://github.com/koalaman/shellcheck)

---

**📅 آخر تحديث**: 2025-12-12  
**الإصدار**: 1.0.0

