# 🎨 إعداد أيقونات PWA

## 📋 نظرة عامة

لإكمال إعداد PWA، يجب إضافة الأيقونات بأحجام مختلفة في مجلد `public/`.

## 📁 الملفات المطلوبة

أنشئ مجلد `public/icons/` وأضف الأيقونات التالية:

```
public/icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

## 🛠️ إنشاء الأيقونات

### الطريقة 1: استخدام أداة Online

1. اذهب إلى [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. ارفع أيقونة أساسية (512x512 أو أكبر)
3. حمّل جميع الأحجام المطلوبة
4. ضعها في `public/icons/`

### الطريقة 2: استخدام ImageMagick

```bash
# تثبيت ImageMagick
# Windows: choco install imagemagick
# Linux: sudo apt-get install imagemagick
# Mac: brew install imagemagick

# إنشاء الأيقونات من أيقونة أساسية
convert icon-base.png -resize 72x72 public/icons/icon-72x72.png
convert icon-base.png -resize 96x96 public/icons/icon-96x96.png
convert icon-base.png -resize 128x128 public/icons/icon-128x128.png
convert icon-base.png -resize 144x144 public/icons/icon-144x144.png
convert icon-base.png -resize 152x152 public/icons/icon-152x152.png
convert icon-base.png -resize 192x192 public/icons/icon-192x192.png
convert icon-base.png -resize 384x384 public/icons/icon-384x384.png
convert icon-base.png -resize 512x512 public/icons/icon-512x512.png
```

### الطريقة 3: استخدام Node.js Script

```javascript
// create-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const input = 'icon-base.png';
const outputDir = 'public/icons';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

sizes.forEach(size => {
  sharp(input)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`Created icon-${size}x${size}.png`))
    .catch(err => console.error(`Error creating icon-${size}x${size}.png:`, err));
});
```

## 📝 تحديث الملفات

بعد إضافة الأيقونات، قم بتحديث:

1. `vite.config.ts` - أزل التعليق عن الأيقونات
2. `public/manifest.json` - أزل التعليق عن الأيقونات

## ✅ التحقق

بعد إضافة الأيقونات:

1. أعد بناء المشروع: `npm run build`
2. افتح في المتصفح
3. افحص Console - يجب ألا تظهر أخطاء الأيقونات
4. افحص Application > Manifest في DevTools

---

**ملاحظة:** حالياً يستخدم النظام `/vite.svg` كأيقونة مؤقتة. بعد إضافة الأيقونات الحقيقية، سيتم تحديث الملفات تلقائياً.

