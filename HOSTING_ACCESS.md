# 🌐 Hosting Access Guide - k8u2r.online

**Last Updated**: January 31, 2026  
**Domain**: https://k8u2r.online  
**Status**: Production Deployed ✅

---

## 📋 Quick Access

### Live Application URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://k8u2r.online | 🟢 Live |
| **Backend API** | https://k8u2r.online/api/v1 | 🟢 Live |
| **API Docs (Swagger)** | https://k8u2r.online/api/docs | 🟢 Live |
| **Health Check** | https://k8u2r.online/api/health | 🟢 Live |

### Quick Test Commands

```bash
# Test backend health
curl https://k8u2r.online/api/health

# Expected response:
# {"status":"ok","message":"Oman Education AI Backend is alive"}

# Test frontend
curl -I https://k8u2r.online

# Expected: HTTP/2 200
```

---

## 🔐 Server Access Information

### SSH Access

**Host**: `k8u2r.online`  
**Port**: `22` (default)  
**User**: Contact system administrator for credentials

```bash
# Connect to server
ssh username@k8u2r.online

# Or with custom port (if configured)
ssh -p 2222 username@k8u2r.online
```

### Application Locations

```bash
# Backend
/var/www/oman-education/backend/
├── dist/              # Compiled JavaScript
├── node_modules/      # Dependencies
├── .env.production    # Production environment variables
└── package.json

# Frontend
/var/www/oman-education/frontend/
└── dist/              # Built static files

# Nginx Configuration
/etc/nginx/sites-available/oman-education
/etc/nginx/sites-enabled/oman-education

# SSL Certificates
/etc/letsencrypt/live/k8u2r.online/
├── fullchain.pem
└── privkey.pem

# Logs
/var/log/nginx/access.log
/var/log/nginx/error.log
~/.pm2/logs/          # PM2 application logs
```

---

## 🧪 Testing & Verification

### 1. Backend Health Check

```bash
# From your local machine
curl https://k8u2r.online/api/health

# Expected Response:
{
  "status": "ok",
  "message": "Oman Education AI Backend is alive",
  "timestamp": "2026-01-31T19:59:29Z"
}
```

### 2. API Documentation

Visit: **https://k8u2r.online/api/docs**

You should see:
- ✅ Swagger UI interface
- ✅ All API endpoints listed
- ✅ Authentication section
- ✅ Try it out functionality

### 3. Frontend Application

Visit: **https://k8u2r.online**

You should see:
- ✅ Landing page loads
- ✅ No console errors
- ✅ Login/Register buttons functional
- ✅ RTL support (Arabic interface)

### 4. OAuth Flow Test

```bash
# Step 1: Visit login page
https://k8u2r.online/login

# Step 2: Click "Sign in with Google"

# Step 3: Google OAuth consent screen appears

# Step 4: After approval, redirects to:
https://k8u2r.online/dashboard

# Verify:
- ✅ No errors in browser console
- ✅ User authenticated successfully
- ✅ Session cookie set
- ✅ Dashboard loads with user data
```

### 5. Database Connection

```bash
# On server, test database connection
psql $DATABASE_URL

# Or check from application logs
pm2 logs oman-education-backend | grep -i "database connected"
```

### 6. WebSocket Connection

```bash
# Test WebSocket endpoint
wscat -c wss://k8u2r.online/ws/notifications

# Expected:
Connected (press CTRL+C to quit)
```

---

## 🔧 Server Management

### PM2 Commands (Backend)

```bash
# SSH into server first
ssh username@k8u2r.online

# Check application status
pm2 status

# View logs
pm2 logs oman-education-backend

# Restart application
pm2 restart oman-education-backend

# Stop application
pm2 stop oman-education-backend

# Start application
pm2 start oman-education-backend

# Monitor in real-time
pm2 monit
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Management

```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Auto-renewal is configured via cron:
sudo crontab -l | grep certbot
```

---

## 📊 Monitoring & Logs

### Application Logs

```bash
# Backend logs (PM2)
pm2 logs oman-education-backend --lines 100

# Backend errors only
pm2 logs oman-education-backend --err

# Backend output only
pm2 logs oman-education-backend --out

# Clear logs
pm2 flush
```

### System Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### PostgreSQL Logs

```bash
# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Connect to database
sudo -u postgres psql

# List databases
\l

# Connect to specific database
\c oman_education_prod

# List tables
\dt
```

---

## 🐛 Common Issues & Solutions

### Issue: Site Not Loading

**Check**:
```bash
# 1. Check Nginx is running
sudo systemctl status nginx

# 2. Check SSL certificate is valid
sudo certbot certificates

# 3. Check DNS resolution
nslookup k8u2r.online
```

**Fix**:
```bash
sudo systemctl restart nginx
```

---

### Issue: Backend API Errors

**Check**:
```bash
# 1. Check PM2 status
pm2 status

# 2. View error logs
pm2 logs oman-education-backend --err

# 3. Check environment variables
pm2 env 0  # Replace 0 with process ID
```

**Fix**:
```bash
# Restart backend
pm2 restart oman-education-backend

# If environment changed, reload
pm2 reload oman-education-backend
```

---

### Issue: Database Connection Failed

**Check**:
```bash
# 1. Test database connection
psql $DATABASE_URL

# 2. Check PostgreSQL is running
sudo systemctl status postgresql

# 3. Check environment variable
echo $DATABASE_URL
```

**Fix**:
```bash
# Restart PostgreSQL
sudo systemctl restart postgresql

# Verify connection string in .env.production
cat /var/www/oman-education/backend/.env.production | grep DATABASE_URL
```

---

### Issue: OAuth Not Working

**Check**:
1. Google Cloud Console > Credentials > Authorized redirect URIs
2. Verify includes: `https://k8u2r.online/api/v1/auth/google/callback`
3. Check `.env.production` for correct `GOOGLE_CALLBACK_URL`

**Fix**:
```bash
# Update .env.production with correct callback URL
nano /var/www/oman-education/backend/.env.production

# Restart backend
pm2 restart oman-education-backend
```

---

## 🔒 Security Checklist

Before testing:
- [ ] SSL certificate is valid (HTTPS working)
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] `.env.production` secrets changed from defaults
- [ ] Database backups configured
- [ ] PM2 startup script enabled
- [ ] Log rotation configured
- [ ] Google OAuth credentials secured

---

## 📞 Support Contacts

### Production Issues
- **Email**: admin@k8u2r.online (if configured)
- **Server Provider**: Contact your hosting provider
- **SSL Issues**: certbot/Let's Encrypt support

### Application Issues
- **Backend Logs**: `pm2 logs oman-education-backend`
- **Nginx Logs**: `/var/log/nginx/error.log`
- **Database Logs**: `/var/log/postgresql/`

---

## 📝 Deployment Verification Steps

After accessing the server, verify:

### ✅ Step 1: Backend Running
```bash
curl https://k8u2r.online/api/health
# Expected: {"status":"ok"}
```

### ✅ Step 2: Frontend Accessible
```bash
curl -I https://k8u2r.online
# Expected: HTTP/2 200
```

### ✅ Step 3: API Documentation
Visit: https://k8u2r.online/api/docs
- Should load Swagger UI

### ✅ Step 4: Database Connected
```bash
pm2 logs oman-education-backend | grep -i "database"
# Should see "Database connected" messages
```

### ✅ Step 5: OAuth Flow
1. Visit: https://k8u2r.online/login
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Should redirect to dashboard

### ✅ Step 6: Environment Validation
```bash
pm2 logs oman-education-backend | grep -i "environment"
# Should see "Environment Validation Passed"
```

---

## 🚀 Quick Deployment Commands

### Full Restart (Use with caution!)

```bash
# 1. Pull latest code
cd /var/www/oman-education/backend
git pull origin main

# 2. Install dependencies
npm ci --production

# 3. Build
npm run build

# 4. Restart
pm2 restart oman-education-backend

# 5. Verify
curl https://k8u2r.online/api/health
```

### Frontend Update

```bash
# 1. Build locally (on your machine)
cd frontend
npm run build

# 2. Upload to server
scp -r dist/* username@k8u2r.online:/var/www/oman-education/frontend/dist/

# 3. Set permissions
ssh username@k8u2r.online "sudo chown -R www-data:www-data /var/www/oman-education/frontend/dist"
```

---

## 📊 Performance Monitoring

```bash
# CPU and Memory usage
pm2 monit

# Application metrics
pm2 describe oman-education-backend

# System resources
htop  # or top
```

---

**Status**: 🟢 Production Environment Active  
**Last Deployment**: Check git log on server  
**Next Review**: As needed

For detailed deployment instructions, see: [DEPLOYMENT.md](./DEPLOYMENT.md)
