$base = "a:/oman-education-ai-system/backend/src/application/services"
$staging = "a:/oman-education-ai-system/backend/src/application/_staging"

# 1. Flatten all original subdirectories into staging
mkdir $staging -Force | Out-Null
$originals = @(
    "admin", "developer", "ai", "knowledge", "code-generation", "office",
    "learning", "assessment", "content-management", "project",
    "auth", "whitelist", "security", "email", "notification",
    "monitoring", "storage", "export-import", "base", "examples"
)

foreach ($f in $originals) {
    # Find the folder anywhere in the mess
    $found = Get-ChildItem -Path $base -Directory -Filter $f -Recurse
    foreach ($item in $found) {
        if ($item.FullName -notlike "*_staging*") {
            $dest = Join-Path $staging $f
            if (!(Test-Path $dest)) { mkdir $dest -Force | Out-Null }
            Get-ChildItem -Path $item.FullName -File | Move-Item -Destination $dest -Force -ErrorAction SilentlyContinue
            Write-Host "Flattened $($item.FullName)"
        }
    }
}

# 2. Purge everything in services except index.ts and the new staging
Get-ChildItem -Path $base -Directory | Remove-Item -Recurse -Force

# 3. Rebuild structure
$clusters = @(
    "auth/identity", "auth/access",
    "user/admin", "user/developer",
    "ai/core", "ai/generation",
    "education/learning", "education/content",
    "communication/messaging",
    "system/monitoring", "system/storage"
)
foreach ($c in $clusters) { mkdir (Join-Path $base $c) -Force | Out-Null }

# 4. Move from staging to correct clusters
function MoveToCluster($name, $cluster) {
    $src = Join-Path $staging $name
    $dest = Join-Path $base $cluster
    if (Test-Path $src) {
        $files = Get-ChildItem -Path $src -File
        if ($files.Count -gt 0) {
            # Move files into a subfolder with the original name for better organization if needed, 
            # or just flatten them into the sub-cluster. 
            # The plan says "identity/: auth folder", so let's keep the folder name.
            $finalDest = Join-Path $dest $name
            mkdir $finalDest -Force | Out-Null
            $files | Move-Item -Destination $finalDest -Force
            Write-Host "Moved $name to $cluster/$name"
        }
    }
}

MoveToCluster "auth" "auth/identity"
MoveToCluster "whitelist" "auth/access"
MoveToCluster "security" "auth/access"
MoveToCluster "admin" "user/admin"
MoveToCluster "developer" "user/developer"
MoveToCluster "ai" "ai/core"
MoveToCluster "knowledge" "ai/core"
MoveToCluster "code-generation" "ai/generation"
MoveToCluster "office" "ai/generation"
MoveToCluster "learning" "education/learning"
MoveToCluster "assessment" "education/learning"
MoveToCluster "content-management" "education/content"
MoveToCluster "project" "education/content"
MoveToCluster "email" "communication/messaging"
MoveToCluster "notification" "communication/messaging"
MoveToCluster "monitoring" "system/monitoring"
MoveToCluster "storage" "system/storage"
MoveToCluster "export-import" "system/storage"

# Move base and examples back to root
if (Test-Path "$staging/base") { Move-Item "$staging/base" $base -Force }
if (Test-Path "$staging/examples") { Move-Item "$staging/examples" $base -Force }

# 5. Final Registry
Remove-Item $staging -Recurse -Force
Write-Host "Sovereign Services Cluster Protocol Execution Successful!"
