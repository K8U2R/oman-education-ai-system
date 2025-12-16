# ⚙️ دليل التكوينات - Configuration Guide

## 🎯 نظرة عامة
هذا الدليل يشرح كيفية استخدام وتكوين جميع ملفات التكوين في المشروع.

---

## 📁 هيكل التكوينات

```
15-CONFIGURATION/
├── 01-ENVIRONMENT-CONFIGS/     # تكوينات البيئات
├── 02-SERVICE-CONFIGS/         # تكوينات الخدمات
├── 03-SECURITY-CONFIGS/        # تكوينات الأمان
├── 04-FEATURE-CONFIGS/         # تكوينات الميزات
├── 05-FRONTEND-CONFIGS/        # تكوينات Frontend
└── 06-BACKEND-CONFIGS/         # تكوينات Backend
```

---

## 🌍 تكوينات البيئات (01-ENVIRONMENT-CONFIGS)

### development.yaml
تكوين بيئة التطوير:
```yaml
environment: development
debug: true
log_level: DEBUG
```

### staging.yaml
تكوين بيئة الاختبار:
```yaml
environment: staging
debug: false
log_level: INFO
```

### production.yaml
تكوين بيئة الإنتاج:
```yaml
environment: production
debug: false
log_level: WARNING
```

### local.yaml
تكوين البيئة المحلية:
```yaml
environment: local
debug: true
log_level: DEBUG
```

---

## 🔧 تكوينات الخدمات (02-SERVICE-CONFIGS)

### database-config.yaml
تكوين قاعدة البيانات:
```yaml
database:
  type: postgresql
  host: ${DB_HOST}
  port: ${DB_PORT}
  name: ${DB_NAME}
  user: ${DB_USER}
  password: ${DB_PASSWORD}
  pool_size: 10
```

### cache-config.yaml
تكوين التخزين المؤقت:
```yaml
cache:
  type: redis
  host: ${REDIS_HOST}
  port: ${REDIS_PORT}
  ttl: 300
```

### storage-config.yaml
تكوين التخزين:
```yaml
storage:
  type: local
  path: ./storage
  max_size: 10GB
```

---

## 🔐 تكوينات الأمان (03-SECURITY-CONFIGS)

### auth-config.yaml
تكوين المصادقة:
```yaml
auth:
  jwt:
    secret: ${JWT_SECRET}
    algorithm: HS256
    expires_in: 3600
  session:
    timeout: 1800
```

### oauth-config.yaml ⭐ جديد
تكوين OAuth:
```yaml
oauth:
  google:
    client_id: ${GOOGLE_OAUTH_CLIENT_ID}
    client_secret: ${GOOGLE_OAUTH_CLIENT_SECRET}
    redirect_uri: ${GOOGLE_OAUTH_REDIRECT_URI}
    scopes:
      - openid
      - email
      - profile
  github:
    client_id: ${GITHUB_OAUTH_CLIENT_ID}
    client_secret: ${GITHUB_OAUTH_CLIENT_SECRET}
    redirect_uri: ${GITHUB_OAUTH_REDIRECT_URI}
    scopes:
      - user:email
      - read:user
```

### encryption-config.yaml
تكوين التشفير:
```yaml
encryption:
  algorithm: AES-256-GCM
  key_rotation: true
  rotation_interval: 90
```

---

## 🎨 تكوينات الميزات (04-FEATURE-CONFIGS)

### ai-config.yaml
تكوين الذكاء الاصطناعي:
```yaml
ai:
  providers:
    - openai
    - anthropic
    - google
  default_provider: openai
  max_tokens: 4000
```

### chat-config.yaml
تكوين المحادثة:
```yaml
chat:
  max_history: 50
  auto_save: true
  typing_indicator: true
```

### user-personalization-config.yaml ⭐ جديد
تكوين التخصيص الشخصي:
```yaml
user_personalization:
  database:
    tables:
      - user_preferences
      - user_settings
      - user_profiles
  cache:
    enabled: true
    ttl: 300
  validation:
    strict_mode: true
  features:
    export_import: true
    auto_save: true
    keyboard_shortcuts: true
```

---

## 🎯 كيفية الاستخدام

### 1. تحميل التكوين
```python
import yaml
from pathlib import Path

config_path = Path("15-CONFIGURATION/environment-configs/development.yaml")
with open(config_path) as f:
    config = yaml.safe_load(f)
```

### 2. استخدام متغيرات البيئة
```yaml
database:
  host: ${DB_HOST:localhost}  # default: localhost
  port: ${DB_PORT:5432}       # default: 5432
```

### 3. التحقق من التكوين
```bash
python scripts/validate-config.py --config development.yaml
```

---

## 📝 ملاحظات مهمة

1. **لا ترفع ملفات التكوين الحساسة** إلى Git
2. **استخدم متغيرات البيئة** للقيم الحساسة
3. **راجع التكوينات** قبل النشر
4. **احتفظ بنسخ احتياطية** من التكوينات

---

## 🔗 روابط ذات صلة

- [دليل البيئات](./01-ENVIRONMENT-CONFIGS/README.md)
- [دليل الأمان](./03-SECURITY-CONFIGS/README.md)
- [دليل الميزات](./04-FEATURE-CONFIGS/README.md)

---

**تاريخ الإنشاء:** 2024-01-XX  
**آخر تحديث:** 2024-01-XX

