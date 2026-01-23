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

# 3. Sovereign Orchestration
echo -e "${YELLOW}🐳 Initiating Unitary Containerization...${NC}"
# This command builds new images and restarts everything atomically
docker compose up -d --build --remove-orphans

# 4. Post-Deployment Clean
echo -e "${YELLOW}🧹 Cleaning up dangling images...${NC}"
docker image prune -f

echo -e "${GREEN}✅ Sovereign Deployment Successful! Entire System is now Dockerized.${NC}"
