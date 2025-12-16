# 📋 الملخص التقني للمشروع - متطلبات الاستضافة

## 🎯 نظرة عامة

**نوع المشروع:** نظام ذكي عربي متكامل للتعليم والبناء العملي  
**البنية:** Full-Stack Application (Frontend + Backend + AI Services)  
**التعقيد:** عالي - نظام متعدد المكونات

---

## 1️⃣ لغات البرمجة والأطر المستخدمة

### Frontend (واجهة الويب)
- **اللغة:** TypeScript 5.3.3
- **الإطار:** React 18.2.0
- **أداة البناء:** Vite 5.0.8
- **التصميم:** Tailwind CSS 3.4.0
- **التوجيه:** React Router DOM 6.20.0
- **إدارة الحالة:** Zustand 4.4.7
- **محرر الكود:** Monaco Editor 0.44.0
- **الطرفية:** XTerm 5.3.0

### Backend (الخادم)
- **اللغة:** Python 3.14 (أو 3.9+)
- **الإطار:** FastAPI 0.104.1+
- **الخادم:** Uvicorn 0.24.0+ (ASGI Server)
- **التحقق:** Pydantic 2.5.0+

### AI & Machine Learning
- **OpenAI API:** 1.3.0+
- **Anthropic API:** 0.7.0+
- **Transformers:** 4.35.0+
- **PyTorch:** 2.0.0+ (2.9.1 مثبت)
- **معالجة اللغة العربية:** PyArabic 0.6.2+

### قواعد البيانات
- **PostgreSQL:** (رئيسي) - psycopg2-binary 2.9.9+
- **MongoDB:** (NoSQL) - pymongo 4.6.0+, motor 3.3.2+
- **Redis:** (Cache/Sessions) - redis 5.0.1+
- **Elasticsearch:** (Search) - elasticsearch 8.11.0+
- **SQLite:** (Development) - aiosqlite 0.19.0+
- **MySQL:** (Alternative) - aiomysql 0.2.0+

---

## 2️⃣ طريقة تشغيل المشروع

### Frontend (Development)
```bash
cd 03-WEB-INTERFACE/frontend
npm install
npm run dev          # يعمل على http://localhost:3000
```

### Frontend (Production Build)
```bash
cd 03-WEB-INTERFACE/frontend
npm run build       # يبني الملفات في مجلد dist/
npm run preview     # معاينة الإنتاج
```

### Backend (Python)
```bash
# تثبيت التبعيات
pip install -r requirements.txt

# تشغيل نظام التشغيل
python main.py

# أو تشغيل API Server مباشرة
cd 01-OPERATING-SYSTEM
python main.py
# أو
uvicorn api_gateway.main:app --host 0.0.0.0 --port 8000
```

### Docker (غير متوفر حالياً)
- ❌ لا يوجد Dockerfile حالياً
- ❌ لا يوجد docker-compose.yml
- 💡 **ملاحظة:** يمكن إضافة Docker لاحقاً للنشر

---

## 3️⃣ متطلبات السيرفر

### نظام التشغيل
- ✅ **Linux** (موصى به: Ubuntu 20.04+ أو 22.04 LTS)
- ✅ **Windows Server** (مدعوم)
- ✅ **macOS** (للتطوير فقط)

### متطلبات Python
- **Python:** 3.9+ (مثبت: 3.14)
- **pip:** أحدث إصدار
- **Virtual Environment:** موصى به (venv أو virtualenv)

### متطلبات Node.js
- **Node.js:** 16.0.0 أو أحدث (موصى به: 18.x أو 20.x LTS)
- **npm:** 8.0.0+ (يأتي مع Node.js)
- **pnpm** أو **yarn** (اختياري)

### الخدمات المطلوبة

#### 1. Web Server (Nginx - موصى به)
```nginx
# مثال تكوين Nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend (Static Files)
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API (Proxy)
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # WebSocket Support
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

#### 2. Process Manager (PM2 أو Supervisor)
```bash
# PM2 (لـ Node.js)
npm install -g pm2
pm2 start npm --name "frontend" -- run preview

# Supervisor (لـ Python)
sudo apt-get install supervisor
# تكوين في /etc/supervisor/conf.d/oman-ai.conf
```

#### 3. Redis (للتخزين المؤقت والجلسات)
```bash
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

#### 4. PostgreSQL (قاعدة البيانات الرئيسية)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 5. MongoDB (اختياري - للبيانات غير المهيكلة)
```bash
# اتبع دليل التثبيت الرسمي
# https://www.mongodb.com/docs/manual/installation/
```

### الموارد المطلوبة (الحد الأدنى)

#### Development (التطوير)
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Storage:** 20 GB
- **Bandwidth:** 100 Mbps

#### Production (الإنتاج)
- **CPU:** 4+ cores (موصى به: 8 cores)
- **RAM:** 8 GB (موصى به: 16 GB)
- **Storage:** 50+ GB SSD
- **Bandwidth:** 1 Gbps

#### Production مع AI (معالجة AI محلية)
- **CPU:** 8+ cores
- **RAM:** 32+ GB (للـ PyTorch)
- **GPU:** اختياري (لتسريع AI)
- **Storage:** 100+ GB SSD

---

## 4️⃣ نوع قاعدة البيانات المستخدمة

### قواعد البيانات المدعومة

#### 1. PostgreSQL (رئيسي)
- **الاستخدام:** البيانات المهيكلة، المستخدمين، المشاريع
- **البرنامج:** psycopg2-binary, asyncpg
- **المتطلبات:** PostgreSQL 12+

#### 2. MongoDB (NoSQL)
- **الاستخدام:** البيانات غير المهيكلة، الوثائق، السجلات
- **البرنامج:** pymongo, motor
- **المتطلبات:** MongoDB 5.0+

#### 3. Redis (Cache/Sessions)
- **الاستخدام:** التخزين المؤقت، الجلسات، الطوابير
- **البرنامج:** redis
- **المتطلبات:** Redis 6.0+

#### 4. Elasticsearch (Search)
- **الاستخدام:** البحث النصي، التحليل
- **البرنامج:** elasticsearch
- **المتطلبات:** Elasticsearch 8.0+

#### 5. SQLite (Development)
- **الاستخدام:** التطوير المحلي فقط
- **البرنامج:** aiosqlite
- **لا يحتاج تثبيت منفصل**

### توصيات قاعدة البيانات للإنتاج

**الحد الأدنى:**
- PostgreSQL (رئيسي)
- Redis (للتخزين المؤقت)

**موصى به:**
- PostgreSQL (رئيسي)
- MongoDB (للبيانات غير المهيكلة)
- Redis (للتخزين المؤقت والجلسات)
- Elasticsearch (للبحث - اختياري)

---

## 5️⃣ بنية المشروع (هيكل المجلدات الرئيسي)

```
oman-education-ai-system/
├── 00-AI-CORE-SYSTEM/          # نواة الذكاء الاصطناعي
│   ├── ai-brain/
│   ├── cognitive-architecture/
│   ├── communication-interfaces/
│   ├── knowledge-acquisition/
│   └── memory-systems/
│
├── 01-OPERATING-SYSTEM/         # نظام التشغيل ⭐
│   ├── api_gateway/            # API Gateway
│   ├── system_core/            # النواة الأساسية
│   ├── system_monitoring/      # المراقبة
│   ├── main.py                 # نقطة البداية
│   └── requirements.txt
│
├── 02-SYSTEM-INTEGRATION/      # تكامل الأنظمة
│   ├── communication-bridge/
│   ├── integration-orchestrator/
│   ├── run.py
│   └── requirements.txt
│
├── 03-WEB-INTERFACE/           # واجهة الويب ⭐
│   ├── frontend/               # React + TypeScript
│   │   ├── src/
│   │   │   ├── modules/         # الموديولات
│   │   │   │   ├── ai-assistant/
│   │   │   │   ├── code-editor/
│   │   │   │   ├── dashboard/
│   │   │   │   └── ...
│   │   │   ├── services/        # الخدمات
│   │   │   └── components/     # المكونات
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── backend-api/            # (قيد التطوير)
│   └── config/
│
├── 04-AUTHENTICATION-SYSTEM/    # نظام المصادقة
├── 05-FEATURES-SYSTEM/         # نظام الميزات
├── 06-DATABASE-SYSTEM/        # قاعدة البيانات
├── 07-CACHING-SYSTEM/         # التخزين المؤقت
├── 08-FILE-STORAGE/           # تخزين الملفات
├── 09-SECURITY-SYSTEM/        # نظام الأمان
├── 10-LOGGING-SYSTEM/         # نظام التسجيل
├── 11-MONITORING-SYSTEM/       # نظام المراقبة
├── 12-TESTING-SYSTEM/         # نظام الاختبار
├── 13-DEPLOYMENT-SYSTEM/      # نظام النشر
│
├── requirements.txt            # التبعيات الرئيسية
├── main.py                    # نقطة البداية الرئيسية
└── README.md
```

### الملفات المهمة
- `requirements.txt` - تبعيات Python الرئيسية
- `03-WEB-INTERFACE/frontend/package.json` - تبعيات Node.js
- `01-OPERATING-SYSTEM/requirements.txt` - تبعيات نظام التشغيل
- `02-SYSTEM-INTEGRATION/requirements.txt` - تبعيات التكامل

---

## 6️⃣ متطلبات خاصة (الدومين و HTTPS)

### الدومين (Domain)
- ✅ **مطلوب:** دومين مخصص (مثل: `yourdomain.com`)
- ✅ **DNS:** إعدادات DNS للدومين
- ✅ **Subdomain:** موصى به للـ API (مثل: `api.yourdomain.com`)

### HTTPS/SSL
- ✅ **مطلوب:** شهادة SSL/TLS
- ✅ **Let's Encrypt:** مجاني (موصى به)
- ✅ **Nginx:** تكوين SSL في Nginx
- ✅ **Port 443:** يجب فتح المنفذ 443

### مثال تكوين Nginx مع SSL
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### المنافذ المطلوبة
- **80:** HTTP (إعادة توجيه إلى HTTPS)
- **443:** HTTPS (الموقع الرئيسي)
- **8000:** Backend API (محلي فقط - لا يحتاج فتحه للعامة)
- **3000:** Frontend Dev (للتطوير فقط)

---

## 7️⃣ خطوات النشر (Deployment Checklist)

### 1. إعداد السيرفر
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Python و Node.js
sudo apt install python3.14 python3-pip nodejs npm -y

# تثبيت Nginx
sudo apt install nginx -y

# تثبيت PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# تثبيت Redis
sudo apt install redis-server -y
```

### 2. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة بيانات
sudo -u postgres psql
CREATE DATABASE oman_ai_db;
CREATE USER oman_ai_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE oman_ai_db TO oman_ai_user;
\q
```

### 3. بناء Frontend
```bash
cd 03-WEB-INTERFACE/frontend
npm install
npm run build
# الملفات ستكون في dist/
```

### 4. إعداد Backend
```bash
# إنشاء virtual environment
python3 -m venv venv
source venv/bin/activate

# تثبيت التبعيات
pip install -r requirements.txt
pip install -r 01-OPERATING-SYSTEM/requirements.txt

# تشغيل Backend
cd 01-OPERATING-SYSTEM
uvicorn api_gateway.main:app --host 127.0.0.1 --port 8000
```

### 5. إعداد Nginx
- نسخ تكوين Nginx أعلاه
- تعديل المسارات والدومين
- إعادة تشغيل Nginx: `sudo systemctl restart nginx`

### 6. إعداد SSL
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
sudo certbot --nginx -d yourdomain.com
```

### 7. إعداد Process Manager
```bash
# PM2 للـ Frontend (اختياري)
npm install -g pm2
pm2 start npm --name "frontend" -- run preview

# Supervisor للـ Backend
sudo apt install supervisor -y
# إضافة تكوين في /etc/supervisor/conf.d/
```

---

## 8️⃣ متطلبات الاستضافة الموصى بها

### خطة الاستضافة الأساسية
- **نوع الاستضافة:** VPS (Virtual Private Server) أو Cloud Server
- **نظام التشغيل:** Ubuntu 22.04 LTS
- **CPU:** 4 cores
- **RAM:** 8 GB
- **Storage:** 50 GB SSD
- **Bandwidth:** 1 TB/month

### خطة الاستضافة المتقدمة (مع AI)
- **نوع الاستضافة:** Dedicated Server أو Cloud (GPU)
- **نظام التشغيل:** Ubuntu 22.04 LTS
- **CPU:** 8+ cores
- **RAM:** 32 GB
- **Storage:** 100+ GB SSD
- **GPU:** اختياري (NVIDIA GPU للـ PyTorch)

### مزودو الاستضافة الموصى بهم
- **DigitalOcean:** VPS بأسعار معقولة
- **AWS:** EC2 للقابلية العالية
- **Google Cloud:** GCE مع GPU support
- **Azure:** Virtual Machines
- **Linode:** VPS بسيط وسريع
- **Hetzner:** VPS أوروبي بأسعار جيدة

---

## 9️⃣ ملاحظات مهمة

### الأمان
- ✅ استخدام HTTPS إلزامي
- ✅ تحديث النظام بانتظام
- ✅ جدار ناري (Firewall) - UFW أو iptables
- ✅ كلمات مرور قوية
- ✅ تحديث التبعيات بانتظام

### الأداء
- ✅ استخدام Redis للتخزين المؤقت
- ✅ ضغط الملفات الثابتة (Gzip)
- ✅ CDN للملفات الثابتة (اختياري)
- ✅ تحسين قاعدة البيانات (Indexes)

### النسخ الاحتياطي
- ✅ نسخ احتياطي يومي لقاعدة البيانات
- ✅ نسخ احتياطي للملفات
- ✅ خطة استعادة الكوارث

### المراقبة
- ✅ مراقبة الأداء (CPU, RAM, Disk)
- ✅ مراقبة السجلات (Logs)
- ✅ تنبيهات عند المشاكل

---

## 🔟 ملخص سريع

| المتطلب | التفاصيل |
|---------|----------|
| **Frontend** | React + TypeScript + Vite |
| **Backend** | Python 3.14 + FastAPI + Uvicorn |
| **قاعدة البيانات** | PostgreSQL (رئيسي) + Redis + MongoDB |
| **Web Server** | Nginx |
| **SSL/HTTPS** | مطلوب (Let's Encrypt) |
| **Process Manager** | PM2 (Frontend) + Supervisor (Backend) |
| **الحد الأدنى RAM** | 8 GB |
| **الحد الأدنى CPU** | 4 cores |
| **Storage** | 50+ GB SSD |

---

## ✅ الخلاصة

المشروع هو **نظام Full-Stack متكامل** يحتاج:
1. ✅ **VPS أو Cloud Server** مع Ubuntu 22.04
2. ✅ **Python 3.14** و **Node.js 18+**
3. ✅ **PostgreSQL** و **Redis** (الحد الأدنى)
4. ✅ **Nginx** كـ Web Server
5. ✅ **SSL Certificate** للـ HTTPS
6. ✅ **Process Manager** (PM2/Supervisor)

**الاستضافة الموصى بها:** VPS مع 8 GB RAM و 4 cores على الأقل.

---

**تاريخ الإنشاء:** $(date)  
**الإصدار:** 1.0.0  
**آخر تحديث:** $(date)

