# Remove styles. references from TSX files
$files = @(
    "src\presentation\components\common\OptimizedImage\OptimizedImage.tsx",
    "src\presentation\components\common\RouteLoader.tsx",
    "src\presentation\components\common\SkeletonLoader.tsx",
    "src\presentation\components\common\SkipLink.tsx",
    "src\presentation\components\common\PWAInstallPrompt\PWAInstallPrompt.tsx"
)

$count = 0

foreach ($filePath in $files) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $original = $content
        
        # Replace styles.className with just className without styles.
        $content = $content -replace '\$\{styles\.(\w+)\}', '$1'
        $content = $content -replace 'styles\.(\w+)', '$1'
        $content = $content -replace 'className=\{`(\w+) \$\{className\}', 'className={`$1 ${className}'
        $content = $content -replace 'className=\{`(\w+) \$\{isLoaded', 'className={`$1 ${isLoaded'
        
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
