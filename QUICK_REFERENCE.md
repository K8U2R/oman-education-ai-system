# 🚀 Quick Reference - k8u2r.online

**Last Updated**: January 31, 2026

---

## 🌐 Production URLs

```
Frontend:       https://k8u2r.online
Backend API:    https://k8u2r.online/api/v1
API Docs:       https://k8u2r.online/api/docs
Health Check:   https://k8u2r.online/api/health
```

---

## ⚡ Quick Tests

### Backend Health
```bash
curl https://k8u2r.online/api/health
# Expected: {"status":"ok"}
```

### API Documentation
```bash
# Open in browser:
https://k8u2r.online/api/docs
```

### OAuth Flow
```
1. Visit: https://k8u2r.online/login
2. Click "Sign in with Google"
3. Should redirect to dashboard
```

---

## 🔐 SSH Access

```bash
ssh username@k8u2r.online
```

---

## 📁 Server Paths

```
Backend:     /var/www/oman-education/backend/
Frontend:    /var/www/oman-education/frontend/dist/
Nginx:       /etc/nginx/sites-available/oman-education
SSL Certs:   /etc/letsencrypt/live/k8u2r.online/
Logs:        ~/.pm2/logs/ and /var/log/nginx/
```

---

## 🔧 PM2 Commands

```bash
pm2 status                          # Check status
pm2 logs oman-education-backend     # View logs
pm2 restart oman-education-backend  # Restart app
pm2 monit                           # Monitor
```

---

## 🔄 Nginx Commands

```bash
sudo nginx -t                # Test config
sudo systemctl reload nginx  # Reload
sudo systemctl status nginx  # Check status
```

---

## 📊 View Logs

```bash
# Backend logs
pm2 logs oman-education-backend --lines 50

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

## ✅ Verification Checklist

- [ ] Backend health: `curl https://k8u2r.online/api/health`
- [ ] Frontend loads: Visit `https://k8u2r.online`
- [ ] API docs: Visit `https://k8u2r.online/api/docs`
- [ ] OAuth works: Test login flow
- [ ] No errors in logs: `pm2 logs`
- [ ] HTTPS valid: Check SSL certificate

---

## 🐛 Quick Fixes

### Site Not Loading
```bash
sudo systemctl restart nginx
```

### Backend Errors
```bash
pm2 restart oman-education-backend
pm2 logs oman-education-backend --err
```

### Database Issues
```bash
sudo systemctl restart postgresql
psql $DATABASE_URL  # Test connection
```

---

## 📞 Support

For detailed instructions, see:
- [HOSTING_ACCESS.md](./HOSTING_ACCESS.md) - Complete access guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions

---

**Status**: 🟢 Production Active
