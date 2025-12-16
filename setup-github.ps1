# دليل إعداد GitHub - قم بتعديل اسم المستخدم أدناه
$GITHUB_USERNAME = "YOUR_GITHUB_USERNAME_HERE"  # ⚠️ استبدل هذا باسم المستخدم الخاص بك

# التحقق من أن اسم المستخدم تم تعديله
if ($GITHUB_USERNAME -eq "YOUR_GITHUB_USERNAME_HERE") {
    Write-Host "❌ خطأ: يجب تعديل اسم المستخدم في السطر 2 من هذا الملف!" -ForegroundColor Red
    Write-Host "افتح الملف setup-github.ps1 وعدل قيمة `$GITHUB_USERNAME" -ForegroundColor Yellow
    exit 1
}

$REPO_NAME = "oman-education-ai-system"
$REPO_URL = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

Write-Host "🚀 إعداد GitHub للمشروع..." -ForegroundColor Cyan
Write-Host ""

# التحقق من حالة Git
Write-Host "📋 التحقق من حالة Git..." -ForegroundColor Yellow
$gitStatus = git status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطأ: Git غير مهيأ. قم بتشغيل 'git init' أولاً." -ForegroundColor Red
    exit 1
}

# التحقق من وجود commits
Write-Host "📦 التحقق من وجود commits..." -ForegroundColor Yellow
$commits = git log --oneline -1 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطأ: لا توجد commits. قم بإنشاء commit أولاً." -ForegroundColor Red
    exit 1
}

# إزالة remote القديم إن وجد
Write-Host "🔧 إزالة remote القديم إن وجد..." -ForegroundColor Yellow
git remote remove origin 2>&1 | Out-Null

# إضافة remote جديد
Write-Host "🔗 إضافة remote جديد..." -ForegroundColor Yellow
git remote add origin $REPO_URL

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطأ في إضافة remote. تحقق من اسم المستخدم." -ForegroundColor Red
    exit 1
}

# التحقق من remote
Write-Host "✅ التحقق من remote..." -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "✅ تم إعداد remote بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "📤 الخطوة التالية: رفع المشروع" -ForegroundColor Cyan
Write-Host "   قم بتشغيل:" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  ملاحظة: إذا طُلب منك اسم المستخدم وكلمة المرور:" -ForegroundColor Yellow
Write-Host "   - استخدم Personal Access Token بدلاً من كلمة المرور" -ForegroundColor Yellow
Write-Host "   - رابط إنشاء Token: https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host ""

