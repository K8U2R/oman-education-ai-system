# Backend - Oman Education AI System

Enterprise-grade backend for the Oman Education AI platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for production)

### Environment Setup

1. **Copy environment template**:
   ```bash
   # For development
   cp .env.example .env.development
   
   # For production
   cp .env.example .env.production
   ```

2. **Configure environment variables**:
   
   Edit `.env.development` with your local settings:
   ```bash
   # Core
   NODE_ENV=development
   PORT=3000
   
   # URLs
   APP_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173
   
   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/oman_education_dev
   
   # Secrets (change these!)
   JWT_SECRET=your-dev-jwt-secret-min-32-chars-here
   SESSION_SECRET=your-dev-session-secret-min-32-chars-here
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── application/        # Application services and use cases
├── domain/            # Domain models, types, and business logic
├── infrastructure/    # External integrations (DB, cache, email)
│   └── config/        # Environment configuration (ENV_CONFIG)
├── modules/           # Feature modules (auth, education, etc.)
├── presentation/      # API routes and middleware
│   └── api/
│       ├── middleware/
│       └── routes/
├── shared/            # Shared utilities and helpers
│   └── configuration/ # Application settings (wraps ENV_CONFIG)
└── index.ts          # Application entry point
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data

# Testing
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Lint code
npm run format           # Format code with Prettier
npm run typecheck        # Type check with TypeScript
```

## 🌍 Environment Variables

### Required Variables (All Environments)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development`, `production`, `test` |
| `PORT` | Server port | `3000` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `CORS_ORIGIN` | CORS allowed origins | `http://localhost:5173` |
| `JWT_SECRET` | JWT signing secret (≥32 chars) | `your-jwt-secret...` |
| `SESSION_SECRET` | Session secret (≥32 chars) | `your-session-secret...` |

### Database

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `DATABASE_POOL_SIZE` | Connection pool size | `10` |
| `DATABASE_TIMEOUT` | Query timeout (ms) | `30000` |

### Google OAuth

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | `{APP_URL}/api/v1/auth/google/callback` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis server host | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | - |
| `EMAIL_FROM` | Sender email address | `noreply@oman-education.om` |

## 🔒 Security Best Practices

### Development

- ✅ Use `.env.development` for local development
- ✅ Use development secrets (prefixed with `dev-`)
- ✅ Connect to local database
- ⚠️ Never commit `.env` files to git

### Production

- 🔴 **CRITICAL**: Change all secrets from defaults
- 🔴 Use strong, random secrets (≥32 characters)
- 🔴 Use HTTPS URLs only
- 🔴 Enable Redis for session store
- 🔴 Set `NODE_ENV=production`
- 🔴 Use production database with backups
- ⚠️ Store secrets in secure vault (e.g., AWS Secrets Manager)

## 🧪 Environment Validation

The application validates environment variables at startup and will **fail to start** if:

- Required variables are missing
- Secrets are too short (<32 characters)
- Production uses HTTP instead of HTTPS
- Development secrets are used in production

**Example validation error**:
```
🔴 Environment Validation FAILED:
  - Missing critical environment variable: FRONTEND_URL
  - JWT_SECRET must be at least 32 characters long
  - FRONTEND_URL must use HTTPS in production
```

## 📚 API Documentation

Once the server is running, API documentation is available at:

- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI JSON**: `http://localhost:3000/api/docs/json`

## 🏗️ Architecture

### Configuration System

The backend uses a two-layer configuration system:

1. **Infrastructure Layer** (`infrastructure/config/`)
   - Loads and validates raw environment variables
   - Exports `ENV_CONFIG` singleton
   - Validates at startup (fail-fast)

2. **Application Layer** (`shared/configuration/`)
   - Transforms `ENV_CONFIG` into structured `Settings`
   - Provides typed access to configuration
   - Used by application services

**Usage**:
```typescript
// Raw environment access
import { ENV_CONFIG } from '@/infrastructure/config';
const port = ENV_CONFIG.PORT;

// Structured settings access
import { getSettings } from '@/shared/configuration';
const settings = getSettings();
const dbUrl = settings.database.url;
```

## 🐛 Troubleshooting

### "Environment validation failed"

**Cause**: Missing or invalid environment variables

**Solution**: 
1. Check `.env.development` file exists
2. Ensure all required variables are set
3. Verify secrets are at least 32 characters
4. Check for typos in variable names

### "Database connection failed"

**Cause**: Invalid `DATABASE_URL` or database not running

**Solution**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check database exists: `psql -l`
3. Verify connection string format
4. Test connection: `psql $DATABASE_URL`

### "Google OAuth error"

**Cause**: Invalid OAuth credentials or callback URL

**Solution**:
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
2. Check callback URL in Google Cloud Console matches `GOOGLE_CALLBACK_URL`
3. Ensure redirect URIs include your callback URL

## 📖 Additional Documentation

- [Deployment Guide](../DEPLOYMENT.md)
- [API Reference](./docs/api.md)
- [Architecture Overview](./docs/architecture.md)

## 📄 License

Copyright © 2026 Oman Education AI System
