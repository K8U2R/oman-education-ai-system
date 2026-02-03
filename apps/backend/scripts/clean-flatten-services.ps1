$base = "a:/oman-education-ai-system/backend/src/application/services"

# Function to flatten a directory: move files from subfolder up one level and delete subfolder
function Flatten-ClusterSub($clusterPath, $subDirName) {
    $fullPath = Join-Path $base $clusterPath
    $targetDir = Join-Path $fullPath $subDirName
    
    if (Test-Path $targetDir) {
        Get-ChildItem -Path $targetDir -File | Move-Item -Destination $fullPath -Force
        Get-ChildItem -Path $targetDir -Directory | Move-Item -Destination $fullPath -Force -ErrorAction SilentlyContinue
        Remove-Item $targetDir -Recurse -Force
        Write-Host "Flattened $clusterPath/$subDirName"
    }
}

# 1. Fix Auth
Flatten-ClusterSub "auth/identity" "auth"
Flatten-ClusterSub "auth/access" "security"
Flatten-ClusterSub "auth/access" "whitelist"

# 2. Fix User
Flatten-ClusterSub "user/admin" "admin"
Flatten-ClusterSub "user/developer" "developer"

# 3. Fix AI
Flatten-ClusterSub "ai/core" "ai"
Flatten-ClusterSub "ai/core" "knowledge"
Flatten-ClusterSub "ai/generation" "code-generation"
Flatten-ClusterSub "ai/generation" "office"

# 4. Fix Education
Flatten-ClusterSub "education/learning" "learning"
Flatten-ClusterSub "education/learning" "assessment"
Flatten-ClusterSub "education/content" "content-management"
Flatten-ClusterSub "education/content" "project"

# 5. Fix Communication
Flatten-ClusterSub "communication/messaging" "email"
Flatten-ClusterSub "communication/messaging" "notification"

# 6. Fix System
Flatten-ClusterSub "system/monitoring" "monitoring"
Flatten-ClusterSub "system/storage" "storage"
Flatten-ClusterSub "system/storage" "export-import"

Write-Host "Physical structure alignment complete."
