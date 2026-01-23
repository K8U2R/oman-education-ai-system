#!/bin/bash

# --- Sovereign Monitoring Script ---
# Real-time log stream for all services
# ------------------------------------

# Colors
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🔍 Initiating Sovereign Log Stream...${NC}"
echo "Press Ctrl+C to exit monitoring mode."

# Tail logs for all containers in docker-compose
docker compose logs -f --tail=100
