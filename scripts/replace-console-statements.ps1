# Script to replace console statements with loggingService
# Usage: .\scripts\replace-console-statements.ps1

$files = Get-ChildItem -Path "frontend\src\presentation" -Recurse -Include "*.tsx","*.ts" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match "console\.(error|log|warn|info)"
}

Write-Host "Found $($files.Count) files with console statements" -ForegroundColor Yellow

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Cyan
    
    $content = Get-Content $file.FullName -Raw
    
    # Check if loggingService is already imported
    $hasLoggingImport = $content -match "from ['\`"]@/infrastructure/services/logging\.service['\`"]"
    
    # Replace console.error('message', error) with loggingService.error('message', error as Error)
    $content = $content -replace "console\.error\((['\`"])([^'\`"]+)(['\`"])\s*,\s*(\w+)\)", "loggingService.error(`$1`$2`$3, `$4 as Error)"
    
    # Replace console.log('message', data) with loggingService.info('message', data)
    $content = $content -replace "console\.log\((['\`"])([^'\`"]+)(['\`"])\s*,\s*(\w+)\)", "loggingService.info(`$1`$2`$3, `$4)"
    
    # Replace console.warn('message', data) with loggingService.warn('message', data)
    $content = $content -replace "console\.warn\((['\`"])([^'\`"]+)(['\`"])\s*,\s*(\w+)\)", "loggingService.warn(`$1`$2`$3, `$4)"
    
    # Replace console.info('message', data) with loggingService.info('message', data)
    $content = $content -replace "console\.info\((['\`"])([^'\`"]+)(['\`"])\s*,\s*(\w+)\)", "loggingService.info(`$1`$2`$3, `$4)"
    
    # Add import if not present and file was modified
    if (-not $hasLoggingImport -and ($content -match "loggingService\.")) {
        # Find the last import statement
        $importPattern = "(import\s+.*?from\s+['\`"].*?['\`"];?\s*\n)"
        $lastImport = [regex]::Matches($content, $importPattern) | Select-Object -Last 1
        
        if ($lastImport) {
            $importStatement = "import { loggingService } from '@/infrastructure/services/logging.service'`n"
            $content = $content.Insert($lastImport.Index + $lastImport.Length, $importStatement)
        }
    }
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "  ✓ Updated" -ForegroundColor Green
}

Write-Host "`nDone! Please review the changes before committing." -ForegroundColor Green

