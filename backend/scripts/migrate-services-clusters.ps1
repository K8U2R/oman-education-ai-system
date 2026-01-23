$basePath = "a:/oman-education-ai-system/backend/src/application/services"

# 1. Create Cluster Structure
$clusters = @(
    "auth/identity", "auth/access",
    "user/admin", "user/developer",
    "ai/core", "ai/generation",
    "education/learning", "education/content",
    "communication/messaging",
    "system/monitoring", "system/storage"
)

foreach ($cluster in $clusters) {
    $dir = Join-Path $basePath $cluster
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created $cluster"
    }
}

# 2. Migration Function
function Move-ServiceContent($srcDirName, $destClusterPath) {
    $src = Join-Path $basePath $srcDirName
    $dest = Join-Path $basePath $destClusterPath
    
    if (Test-Path $src) {
        Get-ChildItem -Path $src | Move-Item -Destination $dest -Force -ErrorAction SilentlyContinue
        Write-Host "Moved $srcDirName to $destClusterPath"
    }
}

# 3. Execute Migration
# Auth
Move-ServiceContent "auth" "auth/identity"
Move-ServiceContent "whitelist" "auth/access"
Move-ServiceContent "security" "auth/access"

# User
Move-ServiceContent "admin" "user/admin"
Move-ServiceContent "developer" "user/developer"

# AI
Move-ServiceContent "ai" "ai/core"
Move-ServiceContent "knowledge" "ai/core"
Move-ServiceContent "code-generation" "ai/generation"
Move-ServiceContent "office" "ai/generation"

# Education
Move-ServiceContent "learning" "education/learning"
Move-ServiceContent "assessment" "education/learning"
Move-ServiceContent "content-management" "education/content"
Move-ServiceContent "project" "education/content"

# Communication
Move-ServiceContent "email" "communication/messaging"
Move-ServiceContent "notification" "communication/messaging"

# System
Move-ServiceContent "monitoring" "system/monitoring"
Move-ServiceContent "storage" "system/storage"
Move-ServiceContent "export-import" "system/storage"

# 4. Clean up empty folders (except the new cluster roots)
$foldersToRemove = @(
    "whitelist", "security", "admin", "developer", 
    "knowledge", "code-generation", "office", 
    "learning", "assessment", "content-management", "project", 
    "email", "notification", "monitoring", "storage", "export-import",
    "tmp_migration"
)

foreach ($folder in $foldersToRemove) {
    $path = Join-Path $basePath $folder
    if (Test-Path $path) {
        $items = Get-ChildItem -Path $path
        if ($items.Count -eq 0 -or $folder -eq "tmp_migration") {
            Remove-Item -Path $path -Recurse -Force
            Write-Host "Removed $folder"
        }
    }
}

Write-Host "Sovereign Services Migration Complete!"
