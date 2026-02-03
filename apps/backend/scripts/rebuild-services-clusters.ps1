$servicesPath = "a:/oman-education-ai-system/backend/src/application/services"
$stagingPath = "a:/oman-education-ai-system/backend/src/application/services_staging"

# 1. Create Staging
if (!(Test-Path $stagingPath)) {
    New-Item -ItemType Directory -Path $stagingPath -Force
}

# 2. Move all folders to staging
$folders = @(
    "auth", "whitelist", "security", "admin", "developer", "ai", "knowledge", 
    "code-generation", "office", "learning", "assessment", "content-management", 
    "project", "email", "notification", "monitoring", "storage", "export-import",
    "base", "examples"
)

foreach ($f in $folders) {
    $src = Join-Path $servicesPath $f
    $dest = Join-Path $stagingPath $f
    if (Test-Path $src) {
        if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
        Move-Item $src $dest -Force
        Write-Host "Staged $f"
    }
}

# 3. Handle nested mess (if any files were moved to auth/identity already)
# We need to look inside the staged 'auth' etc. for nested files and pull them up.
function Pull-Up-Files($stagedFolder) {
    $folderPath = Join-Path $stagingPath $stagedFolder
    if (Test-Path $folderPath) {
        $subDirs = Get-ChildItem -Path $folderPath -Directory -Recurse
        foreach ($sd in $subDirs) {
            Get-ChildItem -Path $sd.FullName -File | Move-Item -Destination $folderPath -Force -ErrorAction SilentlyContinue
        }
    }
}

foreach ($f in $folders) { Pull-Up-Files $f }

# 4. Create New Cluster Structure in Services
$clusters = @(
    "auth/identity", "auth/access",
    "user/admin", "user/developer",
    "ai/core", "ai/generation",
    "education/learning", "education/content",
    "communication/messaging",
    "system/monitoring", "system/storage"
)

foreach ($cluster in $clusters) {
    $dir = Join-Path $servicesPath $cluster
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 5. Distribute from Staging to Clusters
function Move-Staged($srcName, $destCluster) {
    $src = Join-Path $stagingPath $srcName
    $dest = Join-Path $servicesPath $destCluster
    if (Test-Path $src) {
        Get-ChildItem -Path $src -File | Move-Item -Destination $dest -Force -ErrorAction SilentlyContinue
        # Also move any subfolders if they are actually the same service
        Get-ChildItem -Path $src -Directory | Move-Item -Destination $dest -Force -ErrorAction SilentlyContinue 
        Write-Host "Migrated $srcName -> $destCluster"
    }
}

Move-Staged "auth" "auth/identity"
Move-Staged "whitelist" "auth/access"
Move-Staged "security" "auth/access"
Move-Staged "admin" "user/admin"
Move-Staged "developer" "user/developer"
Move-Staged "ai" "ai/core"
Move-Staged "knowledge" "ai/core"
Move-Staged "code-generation" "ai/generation"
Move-Staged "office" "ai/generation"
Move-Staged "learning" "education/learning"
Move-Staged "assessment" "education/learning"
Move-Staged "content-management" "education/content"
Move-Staged "project" "education/content"
Move-Staged "email" "communication/messaging"
Move-Staged "notification" "communication/messaging"
Move-Staged "monitoring" "system/monitoring"
Move-Staged "storage" "system/storage"
Move-Staged "export-import" "system/storage"

# Move base and examples back to root
if (Test-Path "$stagingPath/base") { Move-Item "$stagingPath/base" $servicesPath -Force }
if (Test-Path "$stagingPath/examples") { Move-Item "$stagingPath/examples" $servicesPath -Force }

# 6. Cleanup Staging
Remove-Item $stagingPath -Recurse -Force
Write-Host "Clean rebuild complete!"
