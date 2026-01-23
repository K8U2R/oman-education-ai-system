# تحديث Memurai Port - دليل خطوة بخطوة

## الطريقة 1: تعديل ملف التكوين (موصى بها)

### 1. إيقاف خدمة Memurai

```powershell
Stop-Service Memurai
```

### 2. تعديل ملف التكوين

موقع الملف:

```
C:\Program Files\Memurai\memurai.conf
```

ابحث عن السطر:

```
port 6379
```

غيّره إلى:

```
port 36379
```

### 3. حفظ الملف وإعادة تشغيل الخدمة

```powershell
Start-Service Memurai
```

### 4. التحقق

```powershell
Test-NetConnection -ComputerName localhost -Port 36379
```

---

## الطريقة 2: إبقاء Memurai على المنفذ الافتراضي

إذا كنت تفضل عدم تغيير Memurai، يمكنك:

1. إرجاع `REDIS_PORT` في `.env` إلى `6379`
2. إبقاء كل شيء كما هو

---

## ⚠️ ملاحظة

إذا واجهت مشاكل في تحرير الملف، قد تحتاج:

- تشغيل المحرر كـ Administrator
- أو استخدام `notepad` بدلاً من برامج أخرى
