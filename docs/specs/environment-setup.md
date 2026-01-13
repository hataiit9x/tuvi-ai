# Environment Variables Setup

## Backend (.env)

Copy `.env.example` to `.env` và cấu hình:

```bash
cp .env.example .env
```

### Required Variables

```bash
# Database - MySQL connection string
DATABASE_URL="mysql://username:password@localhost:3306/tuvi_db"

# JWT Secret - Generate a strong secret key
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### Optional Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# LLM Configuration (can be set via admin panel)
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_MODEL="gpt-3.5-turbo"
```

## Frontend (client/.env)

Copy `client/.env.example` to `client/.env` và cấu hình:

```bash
cp client/.env.example client/.env
```

### Required Variables

```bash
# API URL - Backend server URL
VITE_API_URL="http://localhost:3000"
```

### Optional Variables

```bash
# App Configuration
VITE_APP_NAME="Tử Vi AI Web"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV="development"

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Production Setup

### Backend Production
```bash
DATABASE_URL="mysql://user:pass@prod-host:3306/tuvi_prod"
JWT_SECRET="super-secure-production-secret"
NODE_ENV=production
CORS_ORIGIN="https://yourdomain.com"
```

### Frontend Production
```bash
VITE_API_URL="https://api.yourdomain.com"
VITE_NODE_ENV="production"
VITE_ENABLE_DEBUG=false
```

## Security Notes

- Never commit `.env` files to git
- Use strong, unique JWT secrets
- Rotate secrets regularly in production
- Use environment-specific database credentials
