#!/bin/bash

# ============================================
# Quality Check Script - سكريبت فحص الجودة
# ============================================
# 
# هذا السكريبت يقوم بفحص شامل للجودة في أي قسم من المشروع
# Usage: ./scripts/check-quality.sh [frontend|backend|all] [--fix]
#
# Examples:
#   ./scripts/check-quality.sh frontend      # فحص Frontend فقط
#   ./scripts/check-quality.sh backend       # فحص Backend فقط
#   ./scripts/check-quality.sh all           # فحص كل شيء
#   ./scripts/check-quality.sh frontend --fix # فحص وإصلاح Frontend
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
TARGET=${1:-all}
FIX_MODE=${2:-""}

# Check if --fix flag is set
SHOULD_FIX=false
if [[ "$FIX_MODE" == "--fix" ]] || [[ "$2" == "--fix" ]] || [[ "$3" == "--fix" ]]; then
    SHOULD_FIX=true
fi

# Frontend checks
check_frontend() {
    print_section "🔍 Frontend Quality Check"
    
    cd frontend || exit 1
    
    # 1. TypeScript Type Checking
    print_info "1. فحص أنواع TypeScript..."
    if npm run type-check; then
        print_success "TypeScript types صحيحة"
    else
        print_error "وجدت أخطاء في أنواع TypeScript"
        if [ "$SHOULD_FIX" = false ]; then
            exit 1
        fi
    fi
    
    # 2. ESLint
    print_info "2. فحص ESLint..."
    if [ "$SHOULD_FIX" = true ]; then
        if npm run lint:fix; then
            print_success "تم إصلاح أخطاء ESLint"
        else
            print_warning "بعض أخطاء ESLint لم يتم إصلاحها تلقائياً"
        fi
    else
        if npm run lint; then
            print_success "ESLint لا يوجد أخطاء"
        else
            print_error "وجدت أخطاء في ESLint (استخدم --fix للإصلاح التلقائي)"
            if [ "$SHOULD_FIX" = false ]; then
                exit 1
            fi
        fi
    fi
    
    # 3. Prettier Format Check
    print_info "3. فحص تنسيق Prettier..."
    if [ "$SHOULD_FIX" = true ]; then
        if npm run format; then
            print_success "تم تنسيق الملفات باستخدام Prettier"
        else
            print_warning "بعض الملفات لم يتم تنسيقها"
        fi
    else
        if npm run format:check; then
            print_success "تنسيق Prettier صحيح"
        else
            print_error "وجدت مشاكل في التنسيق (استخدم --fix للإصلاح التلقائي)"
            if [ "$SHOULD_FIX" = false ]; then
                exit 1
            fi
        fi
    fi
    
    # 4. Build Check (optional - can be slow)
    print_info "4. فحص البناء (Build Check)..."
    if npm run build > /dev/null 2>&1; then
        print_success "البناء نجح بدون أخطاء"
    else
        print_error "فشل البناء - يوجد أخطاء في الكود"
        exit 1
    fi
    
    cd ..
    print_success "✅ Frontend checks completed successfully"
}

# Backend checks
check_backend() {
    print_section "🔍 Backend Quality Check"
    
    cd backend || exit 1
    
    # 1. TypeScript Type Checking
    print_info "1. فحص أنواع TypeScript..."
    if npx tsc --noEmit; then
        print_success "TypeScript types صحيحة"
    else
        print_error "وجدت أخطاء في أنواع TypeScript"
        exit 1
    fi
    
    # 2. Build Check
    print_info "2. فحص البناء (Build Check)..."
    if npm run build > /dev/null 2>&1; then
        print_success "البناء نجح بدون أخطاء"
    else
        print_error "فشل البناء - يوجد أخطاء في الكود"
        exit 1
    fi
    
    cd ..
    print_success "✅ Backend checks completed successfully"
}

# All checks
check_all() {
    print_section "🔍 Full Project Quality Check"
    
    check_frontend
    check_backend
    
    print_section "✅ All Quality Checks Passed!"
    print_success "المشروع جاهز للـ commit/deploy"
}

# Main execution
case $TARGET in
    frontend)
        check_frontend
        ;;
    backend)
        check_backend
        ;;
    all)
        check_all
        ;;
    *)
        echo "Usage: $0 [frontend|backend|all] [--fix]"
        exit 1
        ;;
esac

