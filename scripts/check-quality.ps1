# ============================================
# Quality Check Script - PowerShell Version
# ============================================
# 
# هذا السكريبت يقوم بفحص شامل للجودة في أي قسم من المشروع
# Usage: .\scripts\check-quality.ps1 [frontend|backend|all] [-Fix]
#
# Examples:
#   .\scripts\check-quality.ps1 frontend      # فحص Frontend فقط
#   .\scripts\check-quality.ps1 backend       # فحص Backend فقط
#   .\scripts\check-quality.ps1 all           # فحص كل شيء
#   .\scripts\check-quality.ps1 frontend -Fix # فحص وإصلاح Frontend
# ============================================

param(
    [Parameter(Position=0)]
    [ValidateSet("frontend", "backend", "all")]
    [string]$Target = "all",
    
    [switch]$Fix
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Section {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Frontend checks
function Check-Frontend {
    Write-Section "🔍 Frontend Quality Check"
    
    Push-Location frontend
    
    try {
        # 1. TypeScript Type Checking
        Write-Info "1. فحص أنواع TypeScript..."
        npm run type-check
        if ($LASTEXITCODE -eq 0) {
            Write-Success "TypeScript types صحيحة"
        } else {
            Write-Error "وجدت أخطاء في أنواع TypeScript"
            exit 1
        }
        
        # 2. ESLint
        Write-Info "2. فحص ESLint..."
        if ($Fix) {
            npm run lint:fix
            if ($LASTEXITCODE -eq 0) {
                Write-Success "تم إصلاح أخطاء ESLint"
            } else {
                Write-Warning "بعض أخطاء ESLint لم يتم إصلاحها تلقائياً"
            }
        } else {
            npm run lint
            if ($LASTEXITCODE -eq 0) {
                Write-Success "ESLint لا يوجد أخطاء"
            } else {
                Write-Error "وجدت أخطاء في ESLint (استخدم -Fix للإصلاح التلقائي)"
                exit 1
            }
        }
        
        # 3. Prettier Format Check
        Write-Info "3. فحص تنسيق Prettier..."
        if ($Fix) {
            npm run format
            if ($LASTEXITCODE -eq 0) {
                Write-Success "تم تنسيق الملفات باستخدام Prettier"
            } else {
                Write-Warning "بعض الملفات لم يتم تنسيقها"
            }
        } else {
            npm run format:check
            if ($LASTEXITCODE -eq 0) {
                Write-Success "تنسيق Prettier صحيح"
            } else {
                Write-Error "وجدت مشاكل في التنسيق (استخدم -Fix للإصلاح التلقائي)"
                exit 1
            }
        }
        
        # 4. Build Check
        Write-Info "4. فحص البناء (Build Check)..."
        $buildOutput = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "البناء نجح بدون أخطاء"
        } else {
            Write-Error "فشل البناء - يوجد أخطاء في الكود"
            Write-Host $buildOutput
            exit 1
        }
        
        Write-Success "✅ Frontend checks completed successfully"
    } finally {
        Pop-Location
    }
}

# Backend checks
function Check-Backend {
    Write-Section "🔍 Backend Quality Check"
    
    Push-Location backend
    
    try {
        # 1. TypeScript Type Checking
        Write-Info "1. فحص أنواع TypeScript..."
        npx tsc --noEmit
        if ($LASTEXITCODE -eq 0) {
            Write-Success "TypeScript types صحيحة"
        } else {
            Write-Error "وجدت أخطاء في أنواع TypeScript"
            exit 1
        }
        
        # 2. Build Check
        Write-Info "2. فحص البناء (Build Check)..."
        $buildOutput = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "البناء نجح بدون أخطاء"
        } else {
            Write-Error "فشل البناء - يوجد أخطاء في الكود"
            Write-Host $buildOutput
            exit 1
        }
        
        Write-Success "✅ Backend checks completed successfully"
    } finally {
        Pop-Location
    }
}

# All checks
function Check-All {
    Write-Section "🔍 Full Project Quality Check"
    
    Check-Frontend
    Check-Backend
    
    Write-Section "✅ All Quality Checks Passed!"
    Write-Success "المشروع جاهز للـ commit/deploy"
}

# Main execution
switch ($Target) {
    "frontend" {
        Check-Frontend
    }
    "backend" {
        Check-Backend
    }
    "all" {
        Check-All
    }
    default {
        Write-Host "Usage: .\scripts\check-quality.ps1 [frontend|backend|all] [-Fix]"
        exit 1
    }
}

