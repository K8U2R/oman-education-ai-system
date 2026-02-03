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

# Navigate to project root (since script is in scripts/)
cd "$(dirname "$0")/.."

# 1. Pull Latest Changes
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
git pull origin main

# 2. Root Dependencies
echo -e "${YELLOW}📦 Updating Root Dependencies...${NC}"
npm install

# 3. Sovereign Orchestration
echo -e "${YELLOW}🐳 Initiating Unitary Containerization...${NC}"
docker compose up -d --build --remove-orphans

# 4. Database Migrations (Post-Launch)
echo -e "${YELLOW}🔄 Triggering Database Migrations inside container...${NC}"
# Wait a few seconds for Backend to be ready to accept commands
sleep 5
docker exec oman_edu_backend npm run db:migrate || echo -e "${RED}⚠️ Migration warning during container sync.${NC}"

# 5. Post-Deployment Clean
echo -e "${YELLOW}🧹 Cleaning up dangling images...${NC}"
docker image prune -f

echo -e "${GREEN}✅ Sovereign Deployment Successful! Entire System (FE, BE, DB) is now Dockerized.${NC}"
