#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Services Clustering Migration Script - Sovereign Architecture Enforcer
.DESCRIPTION
    Migrates src/application/services from flat structure to 6 Sovereign Domain Clusters.
    Constitutional Authority: .ai_governance/LAWS.md - Article 3 (Cluster Sovereignty)
.NOTES
    Author: Oman AI Education System - Architectural Office
    Version: 1.0.1
    Date: 2026-01-23
#>

[CmdletBinding()]
param(
    [switch]$DryRun = $false
)

# === Configuration ===
$ErrorActionPreference = "Stop"
$ServicesRoot = Join-Path $PSScriptRoot "..\src\application\services"
$LogFile = Join-Path $PSScriptRoot "clustering-migration-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# === Logging Functions ===
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path $LogFile -Value $logEntry
}

function Write-Section {
    param([string]$Title)
    $separator = "=" * 80
    Write-Log $separator
    Write-Log "  $Title"
    Write-Log $separator
}

# === Migration Mapping ===
$clusterMappings = @(
    # Auth Cluster
    @{ Source = "auth"; Destination = "auth\identity"; Cluster = "auth" },
    @{ Source = "whitelist"; Destination = "auth\access"; Cluster = "auth" },
    @{ Source = "security"; Destination = "auth\security"; Cluster = "auth" },
    
    # User Cluster
    @{ Source = "admin"; Destination = "user\admin"; Cluster = "user" },
    @{ Source = "developer"; Destination = "user\developer"; Cluster = "user" },
    
    # AI Cluster
    @{ Source = "ai"; Destination = "ai\core"; Cluster = "ai" },
    @{ Source = "code-generation"; Destination = "ai\generation"; Cluster = "ai" },
    @{ Source = "office"; Destination = "ai\office"; Cluster = "ai" },
    @{ Source = "knowledge"; Destination = "ai\knowledge"; Cluster = "ai" },
    
    # Education Cluster
    @{ Source = "learning"; Destination = "education\learning"; Cluster = "education" },
    @{ Source = "assessment"; Destination = "education\assessment"; Cluster = "education" },
    @{ Source = "content-management"; Destination = "education\content"; Cluster = "education" },
    @{ Source = "project"; Destination = "education\project"; Cluster = "education" },
    
    # Communication Cluster
    @{ Source = "email"; Destination = "communication\email"; Cluster = "communication" },
    @{ Source = "notification"; Destination = "communication\notification"; Cluster = "communication" },
    
    # System Cluster
    @{ Source = "monitoring"; Destination = "system\monitoring"; Cluster = "system" },
    @{ Source = "storage"; Destination = "system\storage"; Cluster = "system" },
    @{ Source = "export-import"; Destination = "system\export-import"; Cluster = "system" },
    @{ Source = "base"; Destination = "system\base"; Cluster = "system" }
)

# === Pre-Flight Checks ===
function Test-PreConditions {
    Write-Section "Pre-Flight Validation"
    
    if (-not (Test-Path $ServicesRoot)) {
        throw "Services directory not found: $ServicesRoot"
    }
    
    Write-Log "[OK] Services directory exists: $ServicesRoot" "SUCCESS"
    
    # Verify git repository (safety check)
    $gitRoot = Join-Path $PSScriptRoot ".."
    if (-not (Test-Path (Join-Path $gitRoot ".git"))) {
        Write-Log "[WARNING] Not a git repository. Backup recommended!" "WARN"
    } else {
        Write-Log "[OK] Git repository detected" "SUCCESS"
    }
    
    return $true
}

# === Cluster Creation ===
function New-ClusterDirectories {
    Write-Section "Creating Cluster Parent Directories"
    
    $clusters = @("auth", "user", "ai", "education", "communication", "system")
    
    foreach ($cluster in $clusters) {
        $clusterPath = Join-Path $ServicesRoot $cluster
        
        if (Test-Path $clusterPath) {
            Write-Log "Cluster already exists: $cluster" "INFO"
        } else {
            if (-not $DryRun) {
                New-Item -ItemType Directory -Path $clusterPath -Force | Out-Null
                Write-Log "[OK] Created cluster: $cluster" "SUCCESS"
            } else {
                Write-Log "[DRY RUN] Would create cluster: $cluster" "INFO"
            }
        }
    }
}

# === Folder Migration ===
function Move-ServiceFolders {
    Write-Section "Migrating Service Folders to Clusters"
    
    $successCount = 0
    $skipCount = 0
    $errorCount = 0
    
    foreach ($mapping in $clusterMappings) {
        $sourcePath = Join-Path $ServicesRoot $mapping.Source
        $destinationPath = Join-Path $ServicesRoot $mapping.Destination
        $destinationParent = Split-Path $destinationPath -Parent
        
        # Check if source exists
        if (-not (Test-Path $sourcePath)) {
            Write-Log "[SKIP] Source not found (may be already moved): $($mapping.Source)" "WARN"
            $skipCount++
            continue
        }
        
        # Check if destination already exists
        if (Test-Path $destinationPath) {
            Write-Log "[SKIP] Destination already exists: $($mapping.Destination)" "WARN"
            $skipCount++
            continue
        }
        
        try {
            if (-not $DryRun) {
                # Ensure parent directory exists
                if (-not (Test-Path $destinationParent)) {
                    New-Item -ItemType Directory -Path $destinationParent -Force | Out-Null
                }
                
                # Move the folder
                Move-Item -Path $sourcePath -Destination $destinationPath -Force
                Write-Log "[OK] Moved: $($mapping.Source) -> $($mapping.Destination)" "SUCCESS"
                $successCount++
            } else {
                Write-Log "[DRY RUN] Would move: $($mapping.Source) -> $($mapping.Destination)" "INFO"
                $successCount++
            }
        } catch {
            Write-Log "[ERROR] Failed to move $($mapping.Source): $_" "ERROR"
            $errorCount++
        }
    }
    
    Write-Section "Migration Summary"
    Write-Log "[OK] Successfully moved: $successCount folders" "SUCCESS"
    Write-Log "[SKIP] Skipped: $skipCount folders" "WARN"
    Write-Log "[ERROR] Errors: $errorCount folders" "ERROR"
    
    return @{
        Success = $successCount
        Skipped = $skipCount
        Errors = $errorCount
    }
}

# === Verification ===
function Test-MigrationResults {
    Write-Section "Post-Migration Verification"
    
    $expectedClusters = @("auth", "user", "ai", "education", "communication", "system")
    $allValid = $true
    
    foreach ($cluster in $expectedClusters) {
        $clusterPath = Join-Path $ServicesRoot $cluster
        
        if (Test-Path $clusterPath) {
            $subFolders = Get-ChildItem -Path $clusterPath -Directory
            Write-Log "[OK] Cluster validated: $cluster ($($subFolders.Count) sub-folders)" "SUCCESS"
        } else {
            Write-Log "[ERROR] Missing cluster: $cluster" "ERROR"
            $allValid = $false
        }
    }
    
    # Check for orphaned folders (folders not in any cluster)
    $existingFolders = Get-ChildItem -Path $ServicesRoot -Directory | 
                       Where-Object { $_.Name -notin $expectedClusters -and $_.Name -ne "examples" }
    
    if ($existingFolders.Count -gt 0) {
        Write-Log "[WARNING] Orphaned folders detected (not in any cluster):" "WARN"
        foreach ($folder in $existingFolders) {
            Write-Log "  - $($folder.Name)" "WARN"
        }
    }
    
    return $allValid
}

# === Generate Report ===
function Export-MigrationReport {
    param([hashtable]$Results)
    
    Write-Section "Final Report"
    
    $reportPath = Join-Path $PSScriptRoot "clustering-migration-report.md"
    
    $reportContent = @"
# Services Clustering Migration Report

**Execution Time:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Mode:** $(if ($DryRun) { "DRY RUN" } else { "LIVE MIGRATION" })

## Results

- **Folders Migrated:** $($Results.Success)
- **Folders Skipped:** $($Results.Skipped)  
- **Errors:** $($Results.Errors)

## Cluster Structure

``````
services/
|-- auth/
|-- user/
|-- ai/
|-- education/
|-- communication/
+-- system/
``````

## Next Steps

1. Run type-check: ``npm run type-check``
2. Update imports in ServiceRegistry.ts
3. Run tests: ``npm test``
4. Build project: ``npm run build``

**Full Log:** ``$(Split-Path $LogFile -Leaf)``
"@

    if (-not $DryRun) {
        Set-Content -Path $reportPath -Value $reportContent
        Write-Log "[OK] Report saved: $reportPath" "SUCCESS"
    }
    
    Write-Host ""
    Write-Host $reportContent -ForegroundColor Cyan
}

# === Main Execution ===
try {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host "  SERVICES CLUSTERING MIGRATION - SOVEREIGN ARCHITECTURE v1.0  " -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($DryRun) {
        Write-Host "[DRY RUN MODE] No changes will be made" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Execute migration pipeline
    Test-PreConditions
    New-ClusterDirectories
    $results = Move-ServiceFolders
    
    if (-not $DryRun) {
        Test-MigrationResults
    }
    
    Export-MigrationReport -Results $results
    
    Write-Host ""
    Write-Host "[SUCCESS] MIGRATION COMPLETED SUCCESSFULLY" -ForegroundColor Green
    Write-Host ""
    
    if ($DryRun) {
        Write-Host "To execute the migration, run:" -ForegroundColor Yellow
        Write-Host "  .\backend\scripts\refactor-services-clustering.ps1" -ForegroundColor Cyan
    } else {
        Write-Host "[IMPORTANT] Update import paths in:" -ForegroundColor Yellow
        Write-Host "  - ServiceRegistry.ts" -ForegroundColor Cyan
        Write-Host "  - Use-Cases" -ForegroundColor Cyan
        Write-Host "  - Handlers" -ForegroundColor Cyan
    }
    
} catch {
    Write-Log "[FATAL] ERROR: $_" "ERROR"
    Write-Host ""
    Write-Host "[FAILED] MIGRATION FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
