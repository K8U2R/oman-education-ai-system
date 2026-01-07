# Infrastructure Layer - طبقة البنية التحتية (Frontend)

## 📋 الوصف

طبقة البنية التحتية في Frontend تحتوي على التكامل مع الأنظمة الخارجية والخدمات التقنية. تشمل API Clients، Storage Adapters، WebSocket Services، SSE Services، وغيرها من المكونات التقنية.

## 🏗️ الهيكل

```
infrastructure/
├── api/              # API Clients
│   ├── api-client.ts
│   └── request-queue.ts
├── services/        # الخدمات التقنية
│   ├── websocket.service.ts
│   ├── sse.service.ts
│   └── supabase.client.ts
└── storage/         # Storage Adapters
    ├── localStorage-adapter.ts
    ├── sessionStorage-adapter.ts
    ├── indexeddb-adapter.ts
    └── storage-adapter.interface.ts
```

## 📦 المكونات

### 1. API - API Clients

**الموقع:** `api/`

**الوظيفة:**

- التواصل مع Backend APIs
- HTTP Request Management
- Request/Response Interceptors
- Error Handling

**الأقسام:**

#### `api/api-client.ts`

- API Client الرئيسي
- HTTP Methods (GET, POST, PUT, DELETE)
- Request Interceptors
- Response Interceptors
- Error Handling
- Token Management

#### `api/request-queue.ts`

- Queue للطلبات
- Request Retry
- Request Prioritization
- Offline Queue Management

### 2. Services - الخدمات التقنية

**الموقع:** `services/`

**الوظيفة:**

- خدمات تقنية خارجية
- Real-time Communication
- External Integrations

**الأقسام:**

#### `services/websocket.service.ts`

- خدمة WebSocket
- Real-time Communication
- Connection Management
- Reconnection Logic
- Message Handling

#### `services/sse.service.ts`

- خدمة Server-Sent Events
- Real-time Updates
- Event Handling
- Connection Management

#### `services/supabase.client.ts`

- عميل Supabase
- Supabase Integration
- Authentication
- Database Access

### 3. Storage - Storage Adapters

**الموقع:** `storage/`

**الوظيفة:**

- التكامل مع Browser Storage
- Storage Abstraction
- Multiple Storage Backends

**الأقسام:**

#### `storage/storage-adapter.interface.ts`

- واجهة Storage Adapter
- Contract Definition
- Common Methods

#### `storage/localStorage-adapter.ts`

- محول LocalStorage
- Persistent Storage
- Browser LocalStorage API

#### `storage/sessionStorage-adapter.ts`

- محول SessionStorage
- Session-based Storage
- Browser SessionStorage API

#### `storage/indexeddb-adapter.ts`

- محول IndexedDB
- Large Data Storage
- Complex Data Structures
- Async Operations

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. External Integrations

- API Clients
- WebSocket Connections
- External Services

### 2. Browser APIs

- LocalStorage/SessionStorage
- IndexedDB
- WebSocket API
- Fetch API

### 3. Technical Details

- HTTP Implementation
- Network Error Handling
- Connection Management
- Retry Logic

### 4. Storage Abstraction

- Storage Adapters
- Storage Interface
- Multiple Storage Backends

### 5. Real-time Communication

- WebSocket Management
- SSE Management
- Connection Handling

### 6. Request Management

- Request Queue
- Request Retry
- Request Prioritization

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Business Logic

- ❌ لا يجب وجود Business Logic
- ✅ يجب أن يكون في Application Layer

### 2. UI Components

- ❌ لا يجب وجود React Components
- ✅ يجب أن تكون في Presentation Layer

### 3. State Management

- ❌ لا يجب وجود State Management Logic
- ✅ يجب أن يكون في Application Layer

### 4. Domain Models

- ❌ لا يجب تعريف Domain Entities
- ✅ يجب استخدام Domain Models من Domain Layer

### 5. Routing

- ❌ لا يجب وجود Routing Logic
- ✅ يجب أن يكون في Presentation Layer

### 6. Styling

- ❌ لا يجب وجود CSS/SCSS
- ✅ يجب أن يكون في Presentation Layer

## 🔄 التدفق (Flow)

```
Application Layer
    ↓ (Uses)
Infrastructure Layer (API Client, Storage)
    ↓ (Calls)
External Systems (Backend API, Browser Storage)
```

## 📝 أمثلة الاستخدام

### API Client Example

```typescript
// api-client.ts
export class ApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response)
  }
}
```

### Storage Adapter Example

```typescript
// localStorage-adapter.ts
export class LocalStorageAdapter implements IStorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
```

### WebSocket Service Example

```typescript
// websocket.service.ts
export class WebSocketService {
  connect(url: string): void {
    this.ws = new WebSocket(url)
    this.ws.onmessage = event => {
      this.handleMessage(event.data)
    }
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }
}
```

## 🧪 الاختبار

- كل API Client يجب أن يكون له Unit Tests
- كل Storage Adapter يجب أن يكون له Unit Tests
- استخدام Mocks للـ Browser APIs
- اختبار Error Scenarios
- اختبار Network Failures

## 📚 المراجع

- API Client Best Practices
- WebSocket Best Practices
- Browser Storage APIs
- Frontend Infrastructure Patterns
