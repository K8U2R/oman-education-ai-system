# System Ports & Configuration Standards

This document outlines the standard ports and configuration variables used across the Oman Education AI System.
It strictly adheres to the rule that NO hardcoded ports or localhost addresses should exist in the codebase. All configuration must be loaded via Environment Variables.

## 🔌 Service Port Allocation

| Service Component | Internal Port (Container/App) | External Port (Host/Nginx) | Env Variable | Default |
|-------------------|-------------------------------|----------------------------|--------------|---------|
| **Backend API**   | `3000`                        | `30000` (via Nginx)        | `PORT`       | `3000`  |
| **Frontend App**  | `30174` (Vite)                | `443` (HTTPS)              | `VITE_PORT`  | `30174` |
| **Database Core** | `5432`                        | `5432`                     | `DB_PORT`    | `5432`  |
| **Redis Cache**   | `6379`                        | `6379`                     | `REDIS_PORT` | `6379`  |

## 🌍 Environment Variables (The Source of Truth)

### Backend (`apps/backend/.env`)
- **PORT**: `3000` (Standard Node.js Port)
- **APP_URL**: `https://k8u2r.online` (Production Domain)
- **DATABASE_URL**: `postgresql://...:5432/...`

### Frontend (`apps/frontend/.env`)
- **VITE_API_URL**: `https://k8u2r.online/api/v1`
- **VITE_WS_URL**: `wss://k8u2r.online`

## 🚫 Prohibited Patterns (Audit Checks)

Codebase reviews must reject any commits containing:
1. `localhost:3000` or `127.0.0.1:3000` (Use `process.env.APP_URL` or `config.baseUrl`)
2. Hardcoded port numbers in `listen()` (Use `process.env.PORT`)
3. Hardcoded API prefixes like `/api/v1` (Use `ENV_CONFIG.API_PREFIX`)

## 🛠 Usage in Code

### Backend (Node.js)
```typescript
import { ENV_CONFIG } from './config/env.config';

// ✅ CORRECT
app.listen(ENV_CONFIG.PORT, () => {
  logger.info(`Server running on ${ENV_CONFIG.PORT}`);
});

// ❌ INCORRECT
app.listen(3000, () => ...);
```

### Frontend (React/Vite)
```typescript
// ✅ CORRECT
const API = import.meta.env.VITE_API_URL;

// ❌ INCORRECT
const API = "http://localhost:3000/api/v1";
```
