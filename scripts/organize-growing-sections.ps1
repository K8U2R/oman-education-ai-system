# ============================================
# Script to Organize Growing Sections
# سكريبت تنظيم الأقسام سريعة النمو
# ============================================

param(
    [switch]$DryRun = $false,  # Dry run mode
    [switch]$Force = $false    # Force without confirmation
)

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "============================================" "Cyan"
Write-ColorOutput "  Organize Growing Sections" "Yellow"
Write-ColorOutput "============================================" "Cyan"
Write-Host ""

if ($DryRun) {
    Write-ColorOutput "[DRY RUN] No changes will be made." "Yellow"
    Write-Host ""
}

$scriptPath = if ($PSScriptRoot) {
    $PSScriptRoot
} else {
    Split-Path -Parent $MyInvocation.MyCommand.Path
}
$rootPath = (Get-Item $scriptPath).Parent.FullName

Write-ColorOutput "[INFO] Root path: $rootPath" "Cyan"
Write-Host ""

# ============================================
# 1. Organize Frontend Services
# ============================================
Write-ColorOutput "[1] Organizing Frontend Services..." "Cyan"

$frontendServicesPath = Join-Path $rootPath "frontend\src\application\services"

$serviceMappings = @{
    # Auth services
    "auth.service.ts" = "auth"
    
    # Learning services
    "learning-assistant.service.ts" = "learning"
    
    # Notification services
    "notification.service.ts" = "notifications"
    
    # Storage services
    "storage-integration.service.ts" = "storage"
    
    # System services
    "cache.service.ts" = "system"
    "offline.service.ts" = "system"
    "background-sync.service.ts" = "system"
    "error-handling.service.ts" = "system"
    "error-boundary.service.ts" = "system"
    "performance.service.ts" = "system"
    "analytics.service.ts" = "system"
    
    # UI services
    "theme.service.ts" = "ui"
    "i18n.service.ts" = "ui"
    "validation.service.ts" = "ui"
    "search.service.ts" = "ui"
}

$movedCount = 0
$failedCount = 0

foreach ($file in $serviceMappings.Keys) {
    $sourcePath = Join-Path $frontendServicesPath $file
    $targetDir = Join-Path $frontendServicesPath $serviceMappings[$file]
    $targetPath = Join-Path $targetDir $file
    
    if (Test-Path $sourcePath) {
        try {
            if (-not $DryRun) {
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                Move-Item -Path $sourcePath -Destination $targetPath -Force
                Write-ColorOutput "  [MOVED] $file -> $($serviceMappings[$file])/" "Green"
            } else {
                Write-ColorOutput "  [WOULD MOVE] $file -> $($serviceMappings[$file])/" "Yellow"
            }
            $movedCount++
        } catch {
            Write-ColorOutput "  [ERROR] Failed to move $file : $($_.Exception.Message)" "Red"
            $failedCount++
        }
    }
}

Write-Host ""

# ============================================
# 2. Organize Backend Use Cases
# ============================================
Write-ColorOutput "[2] Organizing Backend Use Cases..." "Cyan"

$backendUseCasesPath = Join-Path $rootPath "backend\src\application\use-cases"

$useCaseMappings = @{
    # Auth use cases
    "LoginUseCase.ts" = "auth"
    "LoginUseCase.test.ts" = "auth"
    "RegisterUseCase.ts" = "auth"
    "RegisterUseCase.test.ts" = "auth"
    "RefreshTokenUseCase.ts" = "auth"
    "RefreshTokenUseCase.test.ts" = "auth"
    "UpdatePasswordUseCase.ts" = "auth"
    "UpdatePasswordUseCase.test.ts" = "auth"
    "RequestPasswordResetUseCase.ts" = "auth"
    "RequestPasswordResetUseCase.test.ts" = "auth"
    "ResetPasswordUseCase.ts" = "auth"
    "ResetPasswordUseCase.test.ts" = "auth"
    
    # OAuth use cases
    "InitiateGoogleOAuthUseCase.ts" = "auth"
    "HandleGoogleOAuthCallbackUseCase.ts" = "auth"
    
    # Email use cases
    "SendVerificationEmailUseCase.ts" = "auth"
    "SendVerificationEmailUseCase.test.ts" = "auth"
    "VerifyEmailUseCase.ts" = "auth"
    "VerifyEmailUseCase.test.ts" = "auth"
    
    # User use cases
    "UpdateUserUseCase.ts" = "user"
    "UpdateUserUseCase.test.ts" = "user"
}

foreach ($file in $useCaseMappings.Keys) {
    $sourcePath = Join-Path $backendUseCasesPath $file
    $targetDir = Join-Path $backendUseCasesPath $useCaseMappings[$file]
    $targetPath = Join-Path $targetDir $file
    
    if (Test-Path $sourcePath) {
        try {
            if (-not $DryRun) {
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                Move-Item -Path $sourcePath -Destination $targetPath -Force
                Write-ColorOutput "  [MOVED] $file -> $($useCaseMappings[$file])/" "Green"
            } else {
                Write-ColorOutput "  [WOULD MOVE] $file -> $($useCaseMappings[$file])/" "Yellow"
            }
            $movedCount++
        } catch {
            Write-ColorOutput "  [ERROR] Failed to move $file : $($_.Exception.Message)" "Red"
            $failedCount++
        }
    }
}

Write-Host ""

# ============================================
# 3. Organize Backend Services
# ============================================
Write-ColorOutput "[3] Organizing Backend Services..." "Cyan"

$backendServicesPath = Join-Path $rootPath "backend\src\application\services"

$backendServiceMappings = @{
    # Auth services
    "AuthService.ts" = "auth"
    "AuthService.test.ts" = "auth"
    "TokenService.ts" = "auth"
    "TokenService.test.ts" = "auth"
    "LoginRateLimiter.ts" = "auth"
    "LoginRateLimiter.test.ts" = "auth"
    "OAuthStateService.ts" = "auth"
    "GoogleOAuthService.ts" = "auth"
    
    # Email services
    "EmailService.ts" = "email"
    "EmailService.test.ts" = "email"
}

foreach ($file in $backendServiceMappings.Keys) {
    $sourcePath = Join-Path $backendServicesPath $file
    $targetDir = Join-Path $backendServicesPath $backendServiceMappings[$file]
    $targetPath = Join-Path $targetDir $file
    
    if (Test-Path $sourcePath) {
        try {
            if (-not $DryRun) {
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                Move-Item -Path $sourcePath -Destination $targetPath -Force
                Write-ColorOutput "  [MOVED] $file -> $($backendServiceMappings[$file])/" "Green"
            } else {
                Write-ColorOutput "  [WOULD MOVE] $file -> $($backendServiceMappings[$file])/" "Yellow"
            }
            $movedCount++
        } catch {
            Write-ColorOutput "  [ERROR] Failed to move $file : $($_.Exception.Message)" "Red"
            $failedCount++
        }
    }
}

Write-Host ""

# ============================================
# Summary
# ============================================
Write-ColorOutput "============================================" "Cyan"
Write-ColorOutput "  Summary" "Yellow"
Write-ColorOutput "============================================" "Cyan"
Write-Host ""

if ($DryRun) {
    Write-ColorOutput "  [DRY RUN] Would have moved: $movedCount files" "Yellow"
} else {
    Write-ColorOutput "  [SUCCESS] Moved: $movedCount files" "Green"
    if ($failedCount -gt 0) {
        Write-ColorOutput "  [ERROR] Failed: $failedCount files" "Red"
    }
}

Write-Host ""
Write-ColorOutput "[COMPLETE] Operation finished." "Green"

