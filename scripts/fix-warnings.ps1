# ============================================
# Fix Warnings Script - PowerShell Version
# ============================================
# 
# Script to automatically fix common warnings
# Usage: .\scripts\fix-warnings.ps1 [frontend|backend] [-TypeCheck]
#
# Examples:
#   .\scripts\fix-warnings.ps1 frontend      # Fix Frontend
#   .\scripts\fix-warnings.ps1 frontend -TypeCheck # With type checking
# ============================================

# Set UTF-8 encoding for proper display
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Stop"

# Parse arguments manually
$Target = "frontend"
$TypeCheck = $false

if ($args.Count -gt 0) {
    $firstArg = $args[0]
    if ($firstArg -eq "frontend" -or $firstArg -eq "backend") {
        $Target = $firstArg
    }
    
    if ($args -contains "-TypeCheck" -or $args -contains "--TypeCheck") {
        $TypeCheck = $true
    }
}

# Colors
function Write-Section {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

# Frontend fixes
function Fix-Frontend {
    Write-Section "Fixing Frontend Warnings"
    
    $scriptPath = Split-Path -Parent $MyInvocation.PSCommandPath
    $rootPath = Split-Path -Parent $scriptPath
    
    Push-Location (Join-Path $rootPath "frontend")
    
    try {
        # 1. ESLint Fix
        Write-Info "1. Running ESLint auto-fix..."
        npm run lint:fix
        if ($LASTEXITCODE -eq 0) {
            Write-Success "ESLint auto-fix completed successfully"
        } else {
            Write-Warning "Some ESLint issues require manual fixing"
        }
        
        # 2. Prettier Format
        Write-Info "2. Formatting files..."
        npm run format
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Files formatted successfully"
        }
        
        # 3. Type Check (optional)
        if ($TypeCheck) {
            Write-Info "3. Running TypeScript type check..."
            npm run type-check
            if ($LASTEXITCODE -eq 0) {
                Write-Success "TypeScript types are valid"
            } else {
                Write-Warning "Found TypeScript type errors"
            }
        }
        
        # 4. Show remaining warnings
        Write-Info "4. Checking remaining warnings..."
        $lintOutput = npm run lint 2>&1
        $warningCount = ($lintOutput | Select-String "warning").Count
        
        if ($warningCount -gt 0) {
            Write-Warning "There are still $warningCount warnings that need manual fixing"
            Write-Info "See scripts/FIX_WARNINGS.md for details"
        } else {
            Write-Success "No remaining warnings!"
        }
        
        Write-Success "Frontend fixes completed"
    } finally {
        Pop-Location
    }
}

# Backend fixes
function Fix-Backend {
    Write-Section "Fixing Backend Warnings"
    
    $scriptPath = Split-Path -Parent $MyInvocation.PSCommandPath
    $rootPath = Split-Path -Parent $scriptPath
    
    Push-Location (Join-Path $rootPath "backend")
    
    try {
        # 1. ESLint Fix
        Write-Info "1. Running ESLint auto-fix..."
        npm run lint:fix
        if ($LASTEXITCODE -eq 0) {
            Write-Success "ESLint auto-fix completed"
        }
        
        # 2. Type Check (optional)
        if ($TypeCheck) {
            Write-Info "2. Running TypeScript type check..."
            npm run type-check
            if ($LASTEXITCODE -eq 0) {
                Write-Success "TypeScript types are valid"
            }
        }
        
        Write-Success "Backend fixes completed"
    } finally {
        Pop-Location
    }
}

# Main execution
switch ($Target) {
    "frontend" {
        Fix-Frontend
    }
    "backend" {
        Fix-Backend
    }
    default {
        Write-Host 'Usage: .\scripts\fix-warnings.ps1 [frontend|backend] [-TypeCheck]'
        exit 1
    }
}
