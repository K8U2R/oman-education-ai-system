# 📤 دليل رفع المشروع إلى GitHub

## ✅ التحقق قبل الرفع

### 1. التأكد من حماية الملفات الحساسة

قبل الرفع، تأكد من أن الملفات التالية **مستثناة** من Git:

- ✅ `.env` (في الجذر)
- ✅ `03-WEB-INTERFACE/frontend/.env`
- ✅ `*.log` (جميع ملفات السجلات)
- ✅ `node_modules/` (في frontend)
- ✅ `__pycache__/` (في جميع مجلدات Python)
- ✅ `*.key`, `*.pem`, `*.cert` (مفاتيح التشفير)

**ملاحظة:** ملف `.gitignore` موجود ويغطي هذه الملفات ✅

---

## 🚀 خطوات الرفع إلى GitHub

### الخطوة 1: إنشاء مستودع جديد على GitHub

1. اذهب إلى [GitHub](https://github.com)
2. اضغط على **"New repository"** (أو **"+"** → **"New repository"**)
3. املأ التفاصيل:
   - **Repository name:** `oman-education-ai-system`
   - **Description:** `نظام ذكي عربي للتعلم والبناء العملي - AI-powered Arabic Education System`
   - **Visibility:** اختر **Public** أو **Private** حسب رغبتك
   - **⚠️ لا تضع علامة على** "Initialize with README" (لأن لدينا README.md بالفعل)
4. اضغط **"Create repository"**

---

### الخطوة 2: تهيئة Git في المشروع (إذا لم يكن موجوداً)

افتح PowerShell في مجلد المشروع:

```powershell
cd A:\oman-education-ai-system

# التحقق من حالة Git
git status

# إذا لم يكن Git مهيأ، قم بالتهيئة:
git init
```

---

### الخطوة 3: إضافة جميع الملفات (مع احترام .gitignore)

```powershell
# إضافة جميع الملفات (سيتم تجاهل الملفات في .gitignore تلقائياً)
git add .

# التحقق من الملفات المضافة (اختياري)
git status
```

**⚠️ مهم:** تأكد من أن ملفات `.env` **غير موجودة** في القائمة!

---

### الخطوة 4: إنشاء Commit أولي

```powershell
git commit -m "Initial commit: نظام التعليم الذكي العُماني - AI Integration Complete"
```

---

### الخطوة 5: ربط المشروع مع GitHub

```powershell
# استبدل <username> باسم المستخدم الخاص بك على GitHub
git remote add origin https://github.com/<username>/oman-education-ai-system.git

# التحقق من الربط
git remote -v
```

**مثال:**
```powershell
git remote add origin https://github.com/nasser-alhatri/oman-education-ai-system.git
```

---

### الخطوة 6: رفع المشروع

```powershell
# رفع المشروع إلى GitHub (الفرع الرئيسي)
git branch -M main
git push -u origin main
```

**إذا طُلب منك اسم المستخدم وكلمة المرور:**
- استخدم **Personal Access Token** بدلاً من كلمة المرور
- كيفية إنشاء Token: [GitHub Personal Access Tokens](https://github.com/settings/tokens)

---

## 🔒 الأمان: حماية المفاتيح الحساسة

### إذا رفعت ملف `.env` بالخطأ:

**⚠️ إذا كان المشروع Public ورفعت `.env` بالخطأ، يجب عليك:**

1. **تغيير جميع المفاتيح فوراً:**
   - Gemini API Key
   - Google OAuth Keys
   - OpenAI API Key
   - أي مفاتيح أخرى

2. **إزالة الملف من Git History:**
   ```powershell
   # إزالة .env من Git (لكن يبقى محلياً)
   git rm --cached .env
   git rm --cached 03-WEB-INTERFACE/frontend/.env
   
   # Commit التغيير
   git commit -m "Remove .env files from repository"
   
   # رفع التغيير
   git push
   ```

3. **استخدام Git Secrets Scanner:**
   - استخدم [git-secrets](https://github.com/awslabs/git-secrets) أو [truffleHog](https://github.com/trufflesecurity/trufflehog)

---

## 📝 ملف .env.example (مثال آمن)

أنشئ ملف `.env.example` في الجذر يحتوي على:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/oauth/google/callback

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# OpenAI API Key (optional)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/oman_ai_db
MONGODB_URL=mongodb://localhost:27017/oman_ai_db
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here

# Server Configuration
API_HOST=0.0.0.0
API_PORT=8001
FRONTEND_PORT=3000

# Environment
ENVIRONMENT=development
DEBUG=True
```

**ملاحظة:** هذا الملف **آمن للرفع** لأنه لا يحتوي على مفاتيح حقيقية.

---

## 🔄 التحديثات المستقبلية

بعد الرفع الأولي، لتحديث المشروع:

```powershell
# إضافة التغييرات
git add .

# Commit
git commit -m "وصف التغييرات"

# رفع التحديثات
git push
```

---

## 📋 Checklist قبل الرفع

- [ ] ✅ `.env` غير موجود في `git status`
- [ ] ✅ `node_modules/` غير موجود في `git status`
- [ ] ✅ `__pycache__/` غير موجود في `git status`
- [ ] ✅ `*.log` غير موجود في `git status`
- [ ] ✅ تم إنشاء `.env.example` (اختياري لكن موصى به)
- [ ] ✅ تم تحديث `README.md` إذا لزم الأمر
- [ ] ✅ تم اختبار المشروع محلياً قبل الرفع

---

## 🆘 حل المشاكل الشائعة

### المشكلة: `error: failed to push some refs`

**الحل:**
```powershell
# سحب التغييرات من GitHub أولاً
git pull origin main --allow-unrelated-histories

# ثم رفع التغييرات
git push -u origin main
```

### المشكلة: `Authentication failed`

**الحل:**
- استخدم **Personal Access Token** بدلاً من كلمة المرور
- أو استخدم **SSH** بدلاً من HTTPS

### المشكلة: الملفات كبيرة جداً (>100MB)

**الحل:**
- استخدم [Git LFS](https://git-lfs.github.com/) للملفات الكبيرة
- أو أضف الملفات الكبيرة إلى `.gitignore`

---

## 📚 موارد إضافية

- [GitHub Docs](https://docs.github.com/)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Personal Access Tokens](https://github.com/settings/tokens)

---

**✅ بعد اكتمال الرفع، سيكون المشروع متاحاً على:**
`https://github.com/<username>/oman-education-ai-system`

