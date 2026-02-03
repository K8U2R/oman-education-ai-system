# Remove CSS Modules imports
$files = Get-ChildItem -Path "src\presentation" -Recurse -Filter "*.tsx"
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    # Remove lines containing module.scss imports
    $lines = $content -split "`n"
    $newLines = $lines | Where-Object { $_ -notmatch "import\s+\w+\s+from\s+['\`"]\.\/.*\.module\.scss['\`"]" }
    $newContent = $newLines -join "`n"
    
    if ($newContent -ne $original) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        $count++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nTotal files fixed: $count" -ForegroundColor Cyan
