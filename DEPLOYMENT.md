# Deployment Guide - Oman Education AI System

This guide covers deploying the Oman Education AI System to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

###  System Requirements

- **Operating System**: Linux (Ubuntu 22.04+ recommended)
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **Redis**: 7.x or higher (recommended for production)
- **Domain**: Configured with SSL/TLS certificate

### Required Services

- **Database**: PostgreSQL instance with backups configured
- **Cache**: Redis instance (optional but recommended)
- **Email**: Email service configured (SendGrid, AWS SES, or SMTP)
- **OAuth**: Google OAuth credentials configured

---

## Environment Configuration

### Backend Environment (`.env.production`)

Create `.env.production` in `/backend` directory:

```bash
# ============================================================================
# Core Configuration
# ============================================================================
NODE_ENV=production
PORT=3000
APP_NAME=Oman Education AI
APP_VERSION=1.0.0

# ============================================================================
# URLs (CRITICAL: Must use HTTPS in production!)
# ============================================================================
APP_URL=https://k8u2r.online
FRONTEND_URL=https://k8u2r.online
CORS_ORIGIN=https://k8u2r.online

# ============================================================================
# Database
# ============================================================================
DATABASE_URL=postgresql://user:password@db-host:5432/oman_education_prod
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# ============================================================================
# Redis (Recommended for Production)
# ============================================================================
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# ============================================================================
# Security Secrets (CRITICAL: Change from defaults!)
# ============================================================================
# Generate with: openssl rand -base64 48
JWT_SECRET=your-production-jwt-secret-minimum-32-characters-required-here
SESSION_SECRET=your-production-session-secret-minimum-32-characters-required

# Optional: External JWT validation
SECRET_KEY=your-production-secret-key-minimum-32-characters-required-here

# ============================================================================
# Google OAuth
# ============================================================================
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_CALLBACK_URL=https://k8u2r.online/api/v1/auth/google/callback

# ============================================================================
# AI Services (Optional)
# ============================================================================
OPENAI_API_KEY=sk-proj-your-openai-api-key
AI_DEFAULT_PROVIDER=openai

# ============================================================================
# Email Configuration
# ============================================================================
EMAIL_PROVIDER=sendgrid  # or 'ses', 'smtp'
EMAIL_FROM=noreply@k8u2r.online
SENDGRID_API_KEY=SG.your-sendgrid-api-key  # if using SendGrid

# AWS SES (if using SES)
# AWS_SES_REGION=us-east-1
# AWS_SES_ACCESS_KEY_ID=your-access-key
# AWS_SES_SECRET_ACCESS_KEY=your-secret-key

# ============================================================================
# Rate Limiting
# ============================================================================
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
```

### Frontend Environment (`.env.production`)

Create `.env.production` in `/frontend` directory:

```bash
# API Configuration
VITE_API_URL=https://k8u2r.online/api/v1
VITE_API_BASE_URL=https://k8u2r.online
VITE_API_TARGET=https://k8u2r.online

# Real-time Communication (Use WSS for secure WebSocket)
VITE_WS_URL=wss://k8u2r.online/ws/notifications
VITE_SSE_URL=https://k8u2r.online/api/v1/notifications/stream

# Application
VITE_APP_URL=https://k8u2r.online
VITE_APP_NAME="Oman Education AI"
VITE_ENABLE_ANALYTICS=true
```

---

## Backend Deployment

### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis (optional)
sudo apt install -y redis-server

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Deploy Backend Code

```bash
# Clone repository
git clone https://github.com/your-org/oman-education-ai-system.git
cd oman-education-ai-system/backend

# Install dependencies
npm ci --production

# Copy and configure environment
cp .env.example .env.production
nano .env.production  # Edit with production values

# Build application
npm run build

# Run database migrations
npm run db:migrate
```

### 3. Start Backend with PM2

```bash
# Start application
pm2 start dist/index.js --name oman-education-backend \
  --env production \
  --instances 2 \
  --exec-mode cluster

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

### 4. Configure Nginx (Reverse Proxy)

Create `/etc/nginx/sites-available/oman-education`:

```nginx
server {
    listen 80;
    server_name k8u2r.online;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name k8u2r.online;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/k8u2r.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/k8u2r.online/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        root /var/www/oman-education/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/oman-education /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Frontend Deployment

### 1. Build Frontend

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Output will be in dist/ directory
```

### 2. Deploy to Server

```bash
# Copy build files to server
rsync -avz dist/ user@k8u2r.online:/var/www/oman-education/frontend/dist/

# Or using SCP
scp -r dist/* user@k8u2r.online:/var/www/oman-education/frontend/dist/
```

### 3. Set Correct Permissions

```bash
# On server
sudo chown -R www-data:www-data /var/www/oman-education/frontend/dist
sudo chmod -R 755 /var/www/oman-education/frontend/dist
```

---

## Post-Deployment

### 1. Verify Environment Variables

```bash
# Backend validation check
cd backend
node -e "require('./dist/index.js')"

# Should see:
# ✅ Environment Validation Passed
```

### 2. Health Checks

```bash
# Backend health
curl https://k8u2r.online/api/health

# Expected: {"status":"ok","message":"Oman Education AI Backend is alive"}

# Frontend
curl -I https://k8u2r.online

# Expected: HTTP/2 200
```

### 3. Test OAuth Flow

1. Navigate to `https://k8u2r.online/login`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify redirect back to dashboard

### 4. Monitor Logs

```bash
# PM2 logs
pm2 logs oman-education-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 5. Setup Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## Troubleshooting

### Environment Validation Failed

**Error**: `Missing critical environment variable: FRONTEND_URL`

**Solution**:
1. Ensure `.env.production` exists in `/backend`
2. Verify `NODE_ENV=production` is set
3. Check all required variables are defined
4. Restart application: `pm2 restart oman-education-backend`

### CORS Errors

**Error**: `Access to fetch at 'https://k8u2r.online/api/...' has been blocked by CORS policy`

**Solution**:
1. Verify `CORS_ORIGIN` in `.env.production` matches frontend URL exactly
2. Ensure both use HTTPS
3. Restart backend: `pm2 restart oman-education-backend`

### OAuth Callback Error

**Error**: `redirect_uri_mismatch`

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Edit OAuth 2.0 Client ID
4. Add `https://k8u2r.online/api/v1/auth/google/callback` to Authorized redirect URIs
5. Verify `GOOGLE_CALLBACK_URL` in `.env.production` matches exactly

### Database Connection Failed

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify `DATABASE_URL` format is correct
3. Test connection: `psql $DATABASE_URL`
4. Check firewall allows connections on port 5432

### WebSocket Connection Failed

**Error**: `WebSocket connection to 'wss://k8u2r.online/ws/notifications' failed`

**Solution**:
1. Verify Nginx WebSocket configuration (see above)
2. Check `VITE_WS_URL` uses `wss://` (not `ws://`)
3. Test: `wscat -c wss://k8u2r.online/ws/notifications`
4. Check Nginx error logs

---

## Rollback Procedure

If deployment fails:

```bash
# Stop current deployment
pm2 stop oman-education-backend

# Restore previous version
git checkout <previous-commit>
npm ci
npm run build

# Restart
pm2 restart oman-education-backend
```

---

## Security Checklist

Before going live:

- [ ] All secrets changed from defaults
- [ ] Secrets are ≥32 characters
- [ ] All URLs use HTTPS
- [ ] Database backups configured
- [ ] Redis password set
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] SSL certificate valid and auto-renewing
- [ ] Environment validation passing
- [ ] OAuth credentials secured
- [ ] PM2 startup script configured
- [ ] Log rotation configured
- [ ] Monitoring/alerting setup

---

## Contact & Support

For deployment issues, check:
1. Backend logs: `pm2 logs`
2. Nginx error logs
3. Health endpoints
4. Environment validation output

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0
