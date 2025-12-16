#!/bin/bash
# Quick Test Script - سكريبت اختبار سريع

echo "🧪 Quick System Test"
echo "==================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
echo "1. Checking if API server is running..."
if curl -s http://localhost:8001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API server is running${NC}"
else
    echo -e "${RED}❌ API server is not running${NC}"
    echo "   Start it with: python -m api_gateway.fastapi_server"
    exit 1
fi

# Test endpoints
echo ""
echo "2. Testing endpoints..."

endpoints=(
    "/health"
    "/api/v1/system/status"
    "/api/v1/system/health"
    "/api/v1/monitoring/health"
    "/api/v1/services/list"
)

for endpoint in "${endpoints[@]}"; do
    if curl -s "http://localhost:8001${endpoint}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} ${endpoint}"
    else
        echo -e "${RED}❌${NC} ${endpoint}"
    fi
done

echo ""
echo "✅ Quick test completed!"

