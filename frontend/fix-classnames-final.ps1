# Fix className={variable} to className="variable"
$files = @(
    "src\presentation\components\common\OptimizedImage\OptimizedImage.tsx",
    "src\presentation\components\common\SkeletonLoader.tsx",
    "src\presentation\components\common\SkipLink.tsx",
    "src\presentation\components\common\PWAInstallPrompt\PWAInstallPrompt.tsx"
)

$count = 0

foreach ($filePath in $files) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $original = $content
        
        # Replace className={variableName} with className="variableName"
        # Match pattern: className={validJSIdentifier}
        $content = $content -replace 'className=\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}', 'className="$1"'
        
        if ($content -ne $original) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
            $count++
            Write-Host "Fixed: $filePath" -ForegroundColor Green
        }
    } else {
        Write-Host "Not found: $filePath" -ForegroundColor Yellow
    }
}

Write-Host "`nTotal files fixed: $count" -ForegroundColor Cyan
