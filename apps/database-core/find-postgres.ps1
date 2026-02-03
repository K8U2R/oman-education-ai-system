# ============================================
# Find PostgreSQL Installation
# ============================================

Write-Host "Searching for PostgreSQL installation..." -ForegroundColor Cyan
Write-Host ""

$foundPaths = @()

# البحث في المواقع الشائعة
$searchPaths = @(
    "C:\Program Files\PostgreSQL",
    "C:\Program Files (x86)\PostgreSQL",
    "$env:ProgramFiles\PostgreSQL",
    "${env:ProgramFiles(x86)}\PostgreSQL",
    "C:\PostgreSQL",
    "D:\PostgreSQL"
)

foreach ($basePath in $searchPaths) {
    if (Test-Path $basePath) {
        Write-Host "Found PostgreSQL directory: $basePath" -ForegroundColor Green
        $binPath = Join-Path $basePath "*\bin\psql.exe"
        $psqlFiles = Get-ChildItem $binPath -ErrorAction SilentlyContinue
        foreach ($psql in $psqlFiles) {
            $versionDir = $psql.Directory.Parent.Name
            $fullPath = $psql.FullName
            Write-Host "  ✅ Found psql.exe at: $fullPath" -ForegroundColor Green
            $foundPaths += $fullPath
        }
    }
}

# البحث في جميع محركات الأقراص
Write-Host ""
Write-Host "Searching all drives (this may take a while)..." -ForegroundColor Yellow

$drives = Get-PSDrive -PSProvider FileSystem | Where-Object {$_.Used -gt 0}
foreach ($drive in $drives) {
    $drivePath = $drive.Root
    try {
        $psqlFiles = Get-ChildItem "$drivePath" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue -Depth 3 | Select-Object -First 5
        foreach ($psql in $psqlFiles) {
            if ($psql.FullName -notin $foundPaths) {
                Write-Host "  ✅ Found: $($psql.FullName)" -ForegroundColor Green
                $foundPaths += $psql.FullName
            }
        }
    } catch {
        # تجاهل الأخطاء (مثل الوصول المرفوض)
    }
}

Write-Host ""
if ($foundPaths.Count -eq 0) {
    Write-Host "❌ PostgreSQL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please provide the path to PostgreSQL installation manually:" -ForegroundColor Yellow
    Write-Host "  Example: C:\Program Files\PostgreSQL\15\bin" -ForegroundColor White
} else {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Found PostgreSQL installations:" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    for ($i = 0; $i -lt $foundPaths.Count; $i++) {
        $path = $foundPaths[$i]
        $binDir = Split-Path $path
        Write-Host "[$($i+1)] $binDir" -ForegroundColor White
    }
    Write-Host ""
    
    if ($foundPaths.Count -eq 1) {
        $selectedPath = $foundPaths[0]
    } else {
        $choice = Read-Host "Select installation (1-$($foundPaths.Count))"
        $index = [int]$choice - 1
        if ($index -ge 0 -and $index -lt $foundPaths.Count) {
            $selectedPath = $foundPaths[$index]
        } else {
            Write-Host "Invalid selection" -ForegroundColor Red
            exit 1
        }
    }
    
    $binDir = Split-Path $selectedPath
    Write-Host ""
    Write-Host "Selected: $binDir" -ForegroundColor Green
    Write-Host ""
    
    # إضافة إلى PATH للجلسة الحالية
    if ($env:Path -notlike "*$binDir*") {
        Write-Host "Adding to PATH for this session..." -ForegroundColor Yellow
        $env:Path += ";$binDir"
        Write-Host "✅ Added to PATH" -ForegroundColor Green
    } else {
        Write-Host "✅ Already in PATH" -ForegroundColor Green
    }
    
    # اختبار psql
    Write-Host ""
    Write-Host "Testing psql..." -ForegroundColor Yellow
    try {
        $version = & "$selectedPath" --version
        Write-Host "✅ psql is working!" -ForegroundColor Green
        Write-Host "   $version" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
    }
    
    # إضافة إلى PATH بشكل دائم (اختياري)
    Write-Host ""
    $addPermanent = Read-Host "Add to PATH permanently? (requires admin) (y/N)"
    if ($addPermanent -eq "y" -or $addPermanent -eq "Y") {
        try {
            $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
            if ($currentPath -notlike "*$binDir*") {
                [Environment]::SetEnvironmentVariable("Path", "$currentPath;$binDir", "Machine")
                Write-Host "✅ Added to system PATH (requires restart)" -ForegroundColor Green
            } else {
                Write-Host "✅ Already in system PATH" -ForegroundColor Green
            }
        } catch {
            Write-Host "❌ Failed to add to system PATH: $_" -ForegroundColor Red
            Write-Host "   You may need to run PowerShell as Administrator" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create database: psql -U postgres -c 'CREATE DATABASE oman_education_db;'" -ForegroundColor White
    Write-Host "2. Or run: .\setup-postgres-windows.ps1" -ForegroundColor White
    Write-Host ""
}
