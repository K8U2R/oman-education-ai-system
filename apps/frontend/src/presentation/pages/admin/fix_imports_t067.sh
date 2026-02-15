#!/bin/bash

BASE_ADMIN="/root/oman-education-ai-system/apps/frontend/src/presentation/pages/admin"

# Function to fix imports
fix_imports() {
    FOLDER="$1"
    FEATURE="$2"
    
    echo "Fixing imports in $FOLDER to point to features/$FEATURE..."
    
    # Hooks
    sed -i "s|from '\.\./hooks'|from '@/presentation/pages/admin/features/$FEATURE/hooks'|g" "$BASE_ADMIN/$FOLDER"/*.tsx
    sed -i "s|from '\.\./\.\./hooks'|from '@/presentation/pages/admin/features/$FEATURE/hooks'|g" "$BASE_ADMIN/$FOLDER"/*.tsx
    
    # Types
    sed -i "s|from '\.\./types'|from '@/presentation/pages/admin/features/$FEATURE/types'|g" "$BASE_ADMIN/$FOLDER"/*.tsx
    sed -i "s|from '\.\./\.\./types'|from '@/presentation/pages/admin/features/$FEATURE/types'|g" "$BASE_ADMIN/$FOLDER"/*.tsx

    # Layouts (if any)
    sed -i "s|from '\.\./layouts'|from '@/presentation/pages/admin/features/$FEATURE/layouts'|g" "$BASE_ADMIN/$FOLDER"/*.tsx
}

# Security Pages
fix_imports "SecurityDashboard" "security"
fix_imports "SessionsManagement" "security"
fix_imports "SecurityLogs" "security"
fix_imports "SecuritySettings" "security"
fix_imports "RouteProtection" "security"

# Analytics Pages
fix_imports "ErrorDashboard" "analytics"
fix_imports "PerformanceDashboard" "analytics"

# Database Core Pages
# DatabaseCoreDashboard was decomposed manually, but check origin files if logic remains
fix_imports "DatabaseCoreDashboard" "database-core" 
fix_imports "DatabasePerformance" "database-core"
fix_imports "DatabaseConnections" "database-core"
fix_imports "DatabaseCache" "database-core"
fix_imports "DatabaseExplorer" "database-core"
fix_imports "DatabaseQueryBuilder" "database-core"
fix_imports "DatabaseTransactions" "database-core"
fix_imports "DatabaseAuditLogs" "database-core"
fix_imports "DatabaseBackups" "database-core"
fix_imports "DatabaseMigrations" "database-core"

echo "Imports fixed."
