$basePath = "a:/oman-education-ai-system/backend/src/application/services"

# Fix nested clusters
if (Test-Path "$basePath/auth/identity/access") {
    Move-Item "$basePath/auth/identity/access" "$basePath/auth/access" -Force
}

if (Test-Path "$basePath/ai/core/generation") {
    Move-Item "$basePath/ai/core/generation" "$basePath/ai/generation" -Force
}

if (Test-Path "$basePath/education/learning/content") {
    Move-Item "$basePath/education/learning/content" "$basePath/education/content" -Force
}

if (Test-Path "$basePath/system/monitoring/storage") {
    Move-Item "$basePath/system/monitoring/storage" "$basePath/system/storage" -Force
}

Write-Host "Nested clusters fixed."
