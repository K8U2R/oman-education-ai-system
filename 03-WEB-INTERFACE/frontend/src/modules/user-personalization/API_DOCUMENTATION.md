# API Documentation
# توثيق API للتخصيص الشخصي

## 📋 نظرة عامة

هذا التوثيق يشرح جميع API endpoints المتاحة للتخصيص الشخصي.

---

## 🔐 Authentication

جميع الـ endpoints تتطلب authentication token في header:

```
Authorization: Bearer <token>
```

---

## 📡 Endpoints

### 1. GET /api/v1/user/preferences

**الوصف:** الحصول على تفضيلات المستخدم

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "theme": "light" | "dark" | "auto",
  "layout": "compact" | "comfortable" | "spacious",
  "language": "ar" | "en",
  "timezone": "Asia/Muscat",
  "date_format": "DD/MM/YYYY",
  "time_format": "12h" | "24h",
  "notifications_enabled": true,
  "email_notifications": true,
  "push_notifications": false,
  "sound_enabled": true,
  "animations_enabled": true,
  "sidebar_collapsed": false,
  "custom_colors": {},
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

---

### 2. PUT /api/v1/user/preferences

**الوصف:** تحديث تفضيلات المستخدم

**Request Body:**
```json
{
  "theme": "dark",
  "layout": "comfortable",
  "language": "ar",
  "timezone": "Asia/Muscat",
  "date_format": "DD/MM/YYYY",
  "time_format": "24h",
  "notifications_enabled": true,
  "email_notifications": true,
  "push_notifications": false,
  "sound_enabled": true,
  "animations_enabled": true,
  "sidebar_collapsed": false,
  "custom_colors": {
    "primary": "#000000"
  }
}
```

**Response:** نفس Response من GET

**Status Codes:**
- `200`: Success
- `400`: Bad Request (Validation Error)
- `401`: Unauthorized
- `500`: Server Error

---

### 3. GET /api/v1/user/settings

**الوصف:** الحصول على إعدادات المستخدم

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "ai_model_preference": "gemini-pro" | "openai-gpt4" | "anthropic-claude",
  "ai_temperature": 0.7,
  "ai_max_tokens": 2048,
  "code_editor_theme": "vs-dark" | "vs-light" | "monokai" | "dracula",
  "code_editor_font_size": 14,
  "font_family": "Consolas, monospace",
  "tab_size": 2,
  "auto_save_enabled": true,
  "auto_save_interval": 30,
  "word_wrap": true,
  "line_numbers": true,
  "minimap_enabled": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

---

### 4. PUT /api/v1/user/settings

**الوصف:** تحديث إعدادات المستخدم

**Request Body:**
```json
{
  "ai_model_preference": "gemini-pro",
  "ai_temperature": 0.8,
  "ai_max_tokens": 2048,
  "code_editor_theme": "vs-dark",
  "code_editor_font_size": 16,
  "font_family": "Consolas, monospace",
  "tab_size": 4,
  "auto_save_enabled": true,
  "auto_save_interval": 60,
  "word_wrap": true,
  "line_numbers": true,
  "minimap_enabled": false
}
```

**Response:** نفس Response من GET

**Status Codes:**
- `200`: Success
- `400`: Bad Request (Validation Error)
- `401`: Unauthorized
- `500`: Server Error

---

### 5. GET /api/v1/user/profile

**الوصف:** الحصول على الملف الشخصي للمستخدم

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "display_name": "John Doe",
  "bio": "Software Developer",
  "avatar_url": "https://example.com/avatar.jpg",
  "website": "https://example.com",
  "location": "Muscat, Oman",
  "skills": ["JavaScript", "TypeScript", "React"],
  "interests": ["AI", "Web Development"],
  "social_links": {
    "github": "https://github.com/user",
    "linkedin": "https://linkedin.com/in/user"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

---

### 6. PUT /api/v1/user/profile

**الوصف:** تحديث الملف الشخصي للمستخدم

**Request Body:**
```json
{
  "display_name": "John Doe",
  "bio": "Software Developer",
  "avatar_url": "https://example.com/avatar.jpg",
  "website": "https://example.com",
  "location": "Muscat, Oman",
  "skills": ["JavaScript", "TypeScript", "React"],
  "interests": ["AI", "Web Development"],
  "social_links": {
    "github": "https://github.com/user",
    "linkedin": "https://linkedin.com/in/user"
  }
}
```

**Response:** نفس Response من GET

**Status Codes:**
- `200`: Success
- `400`: Bad Request (Validation Error)
- `401`: Unauthorized
- `500`: Server Error

---

## 🔍 Validation Rules

### Preferences
- `theme`: يجب أن يكون `light`, `dark`, أو `auto`
- `layout`: يجب أن يكون `compact`, `comfortable`, أو `spacious`
- `language`: يجب أن يكون `ar` أو `en`
- `timezone`: يجب أن يكون نص صالح
- `time_format`: يجب أن يكون `12h` أو `24h`

### Settings
- `ai_temperature`: يجب أن يكون بين 0 و 1
- `ai_max_tokens`: يجب أن يكون بين 100 و 4000
- `font_size`: يجب أن يكون بين 10 و 24
- `tab_size`: يجب أن يكون بين 1 و 8
- `auto_save_interval`: يجب أن يكون بين 10 و 300

### Profile
- `display_name`: يجب ألا يتجاوز 255 حرف
- `bio`: يجب ألا يتجاوز 1000 حرف
- `website`: يجب أن يكون URL صالح
- `skills`: يجب ألا يتجاوز 50 عنصر
- `interests`: يجب ألا يتجاوز 50 عنصر

---

## ⚠️ Error Responses

جميع الأخطاء تعيد نفس التنسيق:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message in Arabic",
    "details": {}
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR`: خطأ في التحقق من البيانات
- `UNAUTHORIZED`: غير مصرح
- `NOT_FOUND`: غير موجود
- `SERVER_ERROR`: خطأ في الخادم

---

## 📝 Examples

### Example: Update Preferences

```typescript
const response = await fetch('/api/v1/user/preferences', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    theme: 'dark',
    layout: 'comfortable',
    language: 'ar',
  }),
});

const data = await response.json();
```

---

## 🔄 Rate Limiting

- **GET requests**: 100 requests/minute
- **PUT requests**: 20 requests/minute

---

## 📚 Additional Resources

- [Integration Guide](./INTEGRATION_GUIDE.md)
- [README](./README.md)

