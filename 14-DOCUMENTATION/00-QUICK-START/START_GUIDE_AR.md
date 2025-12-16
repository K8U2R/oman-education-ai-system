# 🚀 دليل تشغيل النظام الكامل - بالعربية

## ⚡ الطريقة السريعة

### Windows:
```bash
start-all-systems.bat
```

### Linux/Mac:
```bash
chmod +x start-all-systems.sh
./start-all-systems.sh
```

---

## 📋 خطوات التشغيل اليدوي

### 1️⃣ تشغيل نظام التشغيل
```bash
cd 01-OPERATING-SYSTEM
python api_server.py
```
**النتيجة:** http://localhost:8003

### 2️⃣ تشغيل نظام التكامل
```bash
cd 02-SYSTEM-INTEGRATION/integration-orchestrator
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```
**النتيجة:** http://localhost:8001

### 3️⃣ تشغيل Backend
```bash
cd 03-WEB-INTERFACE/backend-api
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
**النتيجة:** http://localhost:8000

### 4️⃣ تشغيل Frontend
```bash
cd 03-WEB-INTERFACE/frontend-architecture
npm install --legacy-peer-deps  # إذا لم يتم التثبيت
npm start
```
**النتيجة:** http://localhost:3000

---

## 🌐 الروابط

- 🎨 **الواجهة:** http://localhost:3000
- 🔌 **API:** http://localhost:8000
- 📚 **التوثيق:** http://localhost:8000/docs

---

## ✅ التحقق

```bash
python check-systems-status.py
```

---

**🎉 جاهز للاستخدام!**

