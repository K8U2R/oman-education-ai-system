#!/bin/bash

# --- Sovereign Deployment Script ---
# Project: Oman Education AI System
# OS: Ubuntu 24.04 LTS
# -----------------------------------

# Colors for diagnostics
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Sovereign Deployment Protocol...${NC}"

# Exit on any error
set -e

# 1. Pull Latest Changes
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
git pull origin main

# 2. Root Dependencies
echo -e "${YELLOW}📦 Updating Root Dependencies...${NC}"
npm install

# 3. Database Core
echo -e "${YELLOW}🗄️ Processing Database Core...${NC}"
cd database-core
npm install
# npm run build:bundle  # Optional: ensure latest build is ready for Docker
cd ..

# 4. Backend Dependencies & Migrations
echo -e "${YELLOW}⚙️ Processing Backend...${NC}"
cd backend
npm install
# Trigger the sovereign migration engine
echo -e "${YELLOW}🔄 Running Database Migrations...${NC}"
npm run db:migrate
cd ..

# 5. Frontend Dependencies
echo -e "${YELLOW}🎨 Processing Frontend...${NC}"
cd frontend
npm install
cd ..

# 6. Docker Orchestration
echo -e "${YELLOW}🐳 Rebuilding and Restarting Containers...${NC}"
# Rebuild ensures all code changes inside 'dist' or 'src' are included
docker compose up -d --build

# 7. Post-Deployment Clean (Optional)
echo -e "${YELLOW}🧹 Cleaning up dangling images...${NC}"
docker image prune -f

echo -e "${GREEN}✅ Sovereign Deployment Successful! System is now live.${NC}"
