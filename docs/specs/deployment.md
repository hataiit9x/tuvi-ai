# Deployment Guide

## Environment Setup

### Development Environment
```bash
# Clone repository
git clone <repository-url>
cd tuvi

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

#### Required Variables
```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/tuvi_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Optional: LLM Configuration (can be set via admin panel)
OPENAI_API_KEY="sk-..."
OPENAI_BASE_URL="https://api.openai.com/v1"
```

#### Optional Variables
```bash
# Server
PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN="https://yourdomain.com"

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Production Deployment

### 1. Build Application
```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build client and server
pnpm build

# The build creates:
# - client/dist/ (static files)
# - server/dist/ (compiled server)
```

### 2. Database Setup
```bash
# Run migrations
pnpm db:push

# Optional: Seed initial data
node server/dist/seeds/admin-user.js
```

### 3. Server Deployment

#### Using PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

#### ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'tuvi-api',
    script: 'server/dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### Using Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server/dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/tuvi_db
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=tuvi_db
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve static files
    location / {
        root /path/to/tuvi/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Logging

### Application Logs
```bash
# PM2 logs
pm2 logs tuvi-api

# Custom logging
mkdir logs
# Logs are written to logs/ directory
```

### Health Check Endpoint
```typescript
// server/routers.ts
export const appRouter = router({
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }),
  // ... other routers
});
```

### Database Monitoring
```bash
# MySQL performance
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';

# Slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u user -p tuvi_db > backup_$DATE.sql
gzip backup_$DATE.sql

# Upload to cloud storage (optional)
aws s3 cp backup_$DATE.sql.gz s3://your-backup-bucket/
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

## Performance Optimization

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_readings_user_created ON readings(user_id, created_at);
CREATE INDEX idx_users_email ON users(email);

-- Optimize MySQL configuration
# my.cnf
[mysqld]
innodb_buffer_pool_size = 1G
query_cache_size = 256M
max_connections = 200
```

### Application Optimization
```bash
# Enable gzip compression in Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Set proper cache headers
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MySQL status
systemctl status mysql

# Test connection
mysql -u user -p -h localhost tuvi_db
```

#### Application Errors
```bash
# Check PM2 status
pm2 status
pm2 logs tuvi-api --lines 100

# Check disk space
df -h

# Check memory usage
free -h
```

#### Performance Issues
```bash
# Check CPU usage
top
htop

# Check database performance
SHOW PROCESSLIST;
EXPLAIN SELECT * FROM readings WHERE user_id = 'xxx';
```
