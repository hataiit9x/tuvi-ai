# Cross-Platform Setup Guide

## Giải quyết lỗi NODE_ENV trên Windows

Lỗi `'NODE_ENV' is not recognized as an internal or external command` xảy ra vì Windows không hỗ trợ cú pháp Unix để set environment variables.

## Giải pháp

### 1. Sử dụng cross-env (Khuyến nghị)

Cài đặt cross-env để handle environment variables cross-platform:

```bash
pnpm add -D cross-env
```

Cập nhật package.json scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cross-env NODE_ENV=development tsx watch server/index.ts",
    "dev:client": "cd client && vite",
    "start": "cross-env NODE_ENV=production node server/dist/index.js"
  }
}
```

### 2. Sử dụng setup scripts

**Windows - chạy setup.bat:**
```cmd
setup.bat
```

**Linux/Mac - chạy setup.sh:**
```bash
./setup.sh
```

### 3. Manual setup cho Windows

**Cách 1: Sử dụng set command**
```cmd
set NODE_ENV=development
pnpm dev
```

**Cách 2: Sử dụng PowerShell**
```powershell
$env:NODE_ENV="development"
pnpm dev
```

**Cách 3: Tạo .env file**
```bash
# Tạo .env file với nội dung:
NODE_ENV=development
DATABASE_URL=mysql://user:pass@localhost:3306/tuvi_db
```

## Recommended Package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cross-env NODE_ENV=development tsx watch server/index.ts",
    "dev:client": "cd client && vite",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=server/dist/index.js",
    "start": "cross-env NODE_ENV=production node server/dist/index.js",
    "setup": "node -e \"require('fs').copyFileSync('.env.example', '.env'); require('fs').copyFileSync('client/.env.example', 'client/.env'); console.log('Environment files created!');\""
  }
}
```

## Dependencies cần thiết

```bash
pnpm add -D cross-env concurrently tsx esbuild
```
