# Deployment Guide
# دليل النشر

## 📋 نظرة عامة

هذا الدليل يشرح كيفية نشر وحدة التخصيص الشخصي في بيئة الإنتاج.

---

## 🚀 متطلبات ما قبل النشر

### 1. Environment Variables

تأكد من إعداد جميع متغيرات البيئة:

```bash
# Backend
GEMINI_API_KEY=your_key_here
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/oauth/google/callback

# Frontend
VITE_AI_API_URL=https://api.yourdomain.com/api/ai
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=your_key_here
```

### 2. Database Setup

```bash
# Run migrations
psql -U postgres -d your_database -f 06-DATABASE-SYSTEM/database-operations/migrations/001_create_user_personalization_tables.sql
```

### 3. Build Frontend

```bash
cd 03-WEB-INTERFACE/frontend
npm run build
```

### 4. Build Backend

```bash
# Ensure all dependencies are installed
pip install -r requirements.txt
```

---

## 📦 Deployment Steps

### 1. Backend Deployment

```bash
# Start FastAPI server
cd 01-OPERATING-SYSTEM/api_gateway
uvicorn fastapi_server:app --host 0.0.0.0 --port 8001
```

### 2. Frontend Deployment

```bash
# Serve built files with Nginx
# Copy dist/ to /var/www/html/
# Configure Nginx
```

### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Error messages sanitized
- [ ] Input validation enabled
- [ ] SQL injection protection
- [ ] XSS protection

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Frontend health
curl https://yourdomain.com
```

### Logs

```bash
# Backend logs
tail -f /var/log/backend.log

# Frontend logs
tail -f /var/log/nginx/access.log
```

---

## 🔄 Updates

### Rolling Update

1. Build new version
2. Deploy to staging
3. Test thoroughly
4. Deploy to production
5. Monitor for issues

### Rollback

```bash
# Restore previous version
git checkout previous-version
npm run build
# Deploy previous build
```

---

## 📚 Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Deployment](https://react.dev/learn/start-a-new-react-project)

