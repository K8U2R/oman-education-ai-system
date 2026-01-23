#!/bin/bash

# ============================================
# Fix Warnings Script - Bash Version
# ============================================
# 
# سكريبت لإصلاح التحذيرات الشائعة تلقائياً
# Usage: ./scripts/fix-warnings.sh [frontend|backend] [--type-check]
#
# Examples:
#   ./scripts/fix-warnings.sh frontend      # إصلاح Frontend
#   ./scripts/fix-warnings.sh frontend --type-check # مع فحص الأنواع
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_section() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Parse arguments
TARGET=${1:-frontend}
TYPE_CHECK=false

if [[ "$2" == "--type-check" ]] || [[ "$3" == "--type-check" ]]; then
    TYPE_CHECK=true
fi

# Frontend fixes
fix_frontend() {
    print_section "🔧 إصلاح تحذيرات Frontend"
    
    cd frontend || exit 1
    
    # 1. ESLint Fix
    print_info "1. إصلاح ESLint تلقائياً..."
    if npm run lint:fix; then
        print_success "تم إصلاح أخطاء ESLint القابلة للإصلاح تلقائياً"
    else
        print_warning "بعض أخطاء ESLint تحتاج إصلاح يدوي"
    fi
    
    # 2. Prettier Format
    print_info "2. تنسيق الملفات..."
    if npm run format; then
        print_success "تم تنسيق الملفات"
    fi
    
    # 3. Type Check (optional)
    if [ "$TYPE_CHECK" = true ]; then
        print_info "3. فحص أنواع TypeScript..."
        if npm run type-check; then
            print_success "TypeScript types صحيحة"
        else
            print_warning "وجدت أخطاء في أنواع TypeScript"
        fi
    fi
    
    # 4. Show remaining warnings
    print_info "4. عرض التحذيرات المتبقية..."
    WARNING_COUNT=$(npm run lint 2>&1 | grep -c "warning" || echo "0")
    
    if [ "$WARNING_COUNT" -gt 0 ]; then
        print_warning "لا يزال هناك $WARNING_COUNT تحذير يحتاج إصلاح يدوي"
        print_info "راجع scripts/FIX_WARNINGS.md للتفاصيل"
    else
        print_success "لا توجد تحذيرات متبقية!"
    fi
    
    cd ..
    print_success "✅ Frontend fixes completed"
}

# Backend fixes
fix_backend() {
    print_section "🔧 إصلاح تحذيرات Backend"
    
    cd backend || exit 1
    
    # 1. ESLint Fix
    print_info "1. إصلاح ESLint تلقائياً..."
    if npm run lint:fix; then
        print_success "تم إصلاح أخطاء ESLint"
    fi
    
    # 2. Type Check (optional)
    if [ "$TYPE_CHECK" = true ]; then
        print_info "2. فحص أنواع TypeScript..."
        if npm run type-check; then
            print_success "TypeScript types صحيحة"
        else
            print_warning "وجدت أخطاء في أنواع TypeScript"
        fi
    fi
    
    cd ..
    print_success "✅ Backend fixes completed"
}

# Main execution
case $TARGET in
    frontend)
        fix_frontend
        ;;
    backend)
        fix_backend
        ;;
    *)
        echo "Usage: $0 [frontend|backend] [--type-check]"
        exit 1
        ;;
esac

