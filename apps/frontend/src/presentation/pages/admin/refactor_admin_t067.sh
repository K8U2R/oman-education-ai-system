#!/bin/bash
set -e

BASE_ADMIN="/root/oman-education-ai-system/apps/frontend/src/presentation/pages/admin"
FEATURES_DIR="$BASE_ADMIN/features"

# Function to sovereignize a page
sovereignize() {
    SOURCE_FILE="$1"
    NEW_FOLDER_NAME="$2"
    NEW_COMPONENT_NAME="$3"
    SOURCE_STYLE="$4" # Optional

    echo "Sovereignizing $NEW_COMPONENT_NAME..."

    TARGET_DIR="$BASE_ADMIN/$NEW_FOLDER_NAME"
    mkdir -p "$TARGET_DIR/core"
    mkdir -p "$TARGET_DIR/components"

    # Move TSX
    if [ -f "$SOURCE_FILE" ]; then
        mv "$SOURCE_FILE" "$TARGET_DIR/$NEW_COMPONENT_NAME.tsx"
    else
        echo "Warning: Source file $SOURCE_FILE not found!"
        return
    fi

    # Move or Create Style
    if [ -n "$SOURCE_STYLE" ] && [ -f "$SOURCE_STYLE" ]; then
        mv "$SOURCE_STYLE" "$TARGET_DIR/$NEW_COMPONENT_NAME.module.scss"
    else
        touch "$TARGET_DIR/$NEW_COMPONENT_NAME.module.scss"
    fi

    # Create Index
    echo "export { default as $NEW_COMPONENT_NAME } from './$NEW_COMPONENT_NAME'" > "$TARGET_DIR/$NEW_COMPONENT_NAME.index.ts"
    echo "export * from './core/$NEW_COMPONENT_NAME.hooks'" >> "$TARGET_DIR/$NEW_COMPONENT_NAME.index.ts"
    echo "export * from './core/$NEW_COMPONENT_NAME.types'" >> "$TARGET_DIR/$NEW_COMPONENT_NAME.index.ts"

    # Create Core Files
    echo "export const use$NEW_COMPONENT_NAME = () => { return {} }" > "$TARGET_DIR/core/$NEW_COMPONENT_NAME.hooks.ts"
    echo "export interface ${NEW_COMPONENT_NAME}Props {}" > "$TARGET_DIR/core/$NEW_COMPONENT_NAME.types.ts"
}

# 1. Root Pages
sovereignize "$BASE_ADMIN/DeveloperDashboardPage.tsx" "DeveloperDashboard" "DeveloperDashboard" ""
sovereignize "$BASE_ADMIN/KnowledgePage.tsx" "Knowledge" "Knowledge" ""
sovereignize "$BASE_ADMIN/UsersManagementPage.tsx" "UsersManagement" "UsersManagement" "$BASE_ADMIN/UsersManagementPage.module.scss"
sovereignize "$BASE_ADMIN/WhitelistManagementPage.tsx" "WhitelistManagement" "WhitelistManagement" "$BASE_ADMIN/WhitelistManagementPage.module.scss"

# 2. Security Pages
SEC_PAGES="$FEATURES_DIR/security/pages"
sovereignize "$SEC_PAGES/SecurityDashboardPage.tsx" "SecurityDashboard" "SecurityDashboard" ""
sovereignize "$SEC_PAGES/SessionsManagementPage.tsx" "SessionsManagement" "SessionsManagement" ""
sovereignize "$SEC_PAGES/SecurityLogsPage.tsx" "SecurityLogs" "SecurityLogs" ""
sovereignize "$SEC_PAGES/SecuritySettingsPage.tsx" "SecuritySettings" "SecuritySettings" ""
sovereignize "$SEC_PAGES/RouteProtectionPage.tsx" "RouteProtection" "RouteProtection" ""

# 3. Analytics Pages
ANALYTICS_PAGES="$FEATURES_DIR/analytics/pages"
sovereignize "$ANALYTICS_PAGES/ErrorDashboardPage.tsx" "ErrorDashboard" "ErrorDashboard" ""
sovereignize "$ANALYTICS_PAGES/PerformanceDashboardPage.tsx" "PerformanceDashboard" "PerformanceDashboard" ""

# 4. Database Core Pages
DB_PAGES="$FEATURES_DIR/database-core/pages"
sovereignize "$DB_PAGES/DatabaseCoreDashboardPage.tsx" "DatabaseCoreDashboard" "DatabaseCoreDashboard" ""
sovereignize "$DB_PAGES/PerformancePage.tsx" "DatabasePerformance" "DatabasePerformance" ""
sovereignize "$DB_PAGES/ConnectionsPage.tsx" "DatabaseConnections" "DatabaseConnections" ""
sovereignize "$DB_PAGES/CachePage.tsx" "DatabaseCache" "DatabaseCache" ""
sovereignize "$DB_PAGES/DatabaseExplorerPage.tsx" "DatabaseExplorer" "DatabaseExplorer" ""
sovereignize "$DB_PAGES/QueryBuilderPage.tsx" "DatabaseQueryBuilder" "DatabaseQueryBuilder" ""
sovereignize "$DB_PAGES/TransactionsPage.tsx" "DatabaseTransactions" "DatabaseTransactions" ""
sovereignize "$DB_PAGES/AuditLogsPage.tsx" "DatabaseAuditLogs" "DatabaseAuditLogs" ""
sovereignize "$DB_PAGES/BackupsPage.tsx" "DatabaseBackups" "DatabaseBackups" ""
sovereignize "$DB_PAGES/MigrationsPage.tsx" "DatabaseMigrations" "DatabaseMigrations" ""

echo "Admin T067 migration complete."
