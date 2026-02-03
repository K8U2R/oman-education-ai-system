# Final fix for SCSS imports
$files = Get-ChildItem -Path "src\presentation" -Recurse -Filter "*.tsx"
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    # Remove lines containing scss imports - simple line-by-line approach
    $lines = $content -split "`n"
    $newLines = $lines | Where-Object { $_ -notmatch "import\s+['\`"]\.\/.*\.scss['\`"]" }
    $newContent = $newLines -join "`n"
    
    if ($newContent -ne $original) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        $count++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nTotal files fixed: $count" -ForegroundColor Cyan
