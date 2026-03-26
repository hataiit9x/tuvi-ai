# Tử Vi AI - Luận Giải Số Mệnh & Phong Thủy

**Tử Vi AI** là ứng dụng web hiện đại kết hợp tinh hoa **Tử Vi Đẩu Số** truyền thống với sức mạnh của **Trí tuệ nhân tạo (AI)**. Dự án nhằm mang đến những luận giải sâu sắc, cá nhân hóa và dễ hiểu về vận mệnh, phong thủy cho người sử dụng.

## 🌟 Tính Năng Nổi Bật

### 1. 🔮 Lập & Luận Giải Lá Số Tử Vi
- **An sao chính xác**: Thuật toán an sao chuẩn Tử Vi Đẩu Số Nam Phái.
- **Luận giải AI chuyên sâu**: Tổng quan + Chi tiết 12 Cung + Tương tác Tam Hợp/Nhị Hợp/Xung Chiếu.

### 2. 🔢 Thần Số Học (Numerology)
- Số Chủ Đạo, Linh Hồn, Nhân Cách, Sứ Mệnh, Kim Tự Tháp đỉnh cao.
- Biểu đồ chu kỳ vận số 9 năm (sóng Pythagorean chuẩn).
- Luận giải AI + **Chat hỏi đáp** cá nhân hóa theo số liệu từng người.

### 3. 🌙 Tử Vi 12 Con Giáp & Phong Thủy
- Dự báo vận hạn, xông đất, ngày đẹp, màu sắc & lì xì phong thủy.

### 4. ⚡ Hiệu Năng
- **Smart Caching** (MySQL + Drizzle ORM): phản hồi tức thì kết quả đã phân tích.
- **Background Jobs**: Luận giải 12 cung chạy ngầm không làm gián đoạn trải nghiệm.

---

## 🛠 Công Nghệ Sử Dụng

| Layer | Công nghệ |
|---|---|
| Frontend | React 19, Tailwind CSS v4, Wouter, Framer Motion, Recharts |
| Backend | Node.js, Express, tRPC |
| Database | MySQL 8+, Drizzle ORM |
| AI | OpenAI-compatible API (OpenAI / MiniMax / OpenRouter…) |
| Build | Vite 7, TypeScript, pnpm |

---

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống

| Phần mềm | Phiên bản tối thiểu |
|---|---|
| Node.js | >= 18.x |
| pnpm | >= 8.x |
| MySQL | >= 8.0 |

---

### Bước 1 – Clone Repository

```bash
git clone https://github.com/your-username/tuvi-ai.git
cd tuvi-ai
```

---

### Bước 2 – Cài đặt Dependencies

```bash
pnpm install
```

---

### Bước 3 – Cấu hình file `.env`

Copy file mẫu:

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Sau đó mở `.env` và chỉnh sửa theo môi trường của bạn:

```dotenv
# ===== DATABASE =====
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="mysql://root:@localhost:3306/tuvi"

# ===== SERVER =====
PORT=3000          # Cổng chạy ứng dụng (xem hướng dẫn đổi port bên dưới)
NODE_ENV=development

# ===== BẢO MẬT =====
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# ===== OAUTH (giữ nguyên nếu chạy local) =====
OAUTH_SERVER_URL="http://localhost:3000"
VITE_APP_ID="tuvi-ai-local"
VITE_OAUTH_PORTAL_URL="http://localhost:3000"

# ===== AI API =====
# Chọn 1 trong 3 provider bên dưới (bỏ comment dòng tương ứng)

# --- Option 1: OpenAI ---
# OPENAI_API_KEY="sk-your-openai-api-key"
# OPENAI_BASE_URL="https://api.openai.com/v1"
# OPENAI_MODEL="gpt-4o"

# --- Option 2: MiniMax ---
# OPENAI_API_KEY="your-minimax-api-key"
# OPENAI_BASE_URL="https://api.minimax.io/v1"
# OPENAI_MODEL="MiniMax-M2.5"
# Models: MiniMax-M2.7, MiniMax-M2.5, MiniMax-M2.1, MiniMax-M1 (thêm -highspeed để nhanh hơn)

# --- Option 3: OpenRouter ---
# OPENAI_API_KEY="sk-or-v1-your-key"
# OPENAI_BASE_URL="https://openrouter.ai/api/v1"
# OPENAI_MODEL="google/gemini-2.5-flash"
```

---

### Bước 4 – Tạo Database & Migrate Schema

```bash
pnpm db:push
```

> Lệnh này sẽ tạo tất cả các bảng cần thiết trong MySQL theo schema đã định nghĩa.

Nếu cần migrate thủ công (khi schema thay đổi):

```bash
npx tsx migrate-manual.ts
```

---

### Bước 5 – Chạy Development Server

```bash
pnpm dev
```

Ứng dụng sẽ khởi động tại: **http://localhost:3000**

---

## 🔌 Thay Đổi Port

Để chạy app trên port khác (ví dụ `8080`), có hai cách:

### Cách 1 – Sửa file `.env` *(khuyến nghị)*

Mở `.env` và thay đổi dòng `PORT`:

```dotenv
PORT=8080
```

Đồng thời cập nhật các URL có chứa port:

```dotenv
OAUTH_SERVER_URL="http://localhost:8080"
VITE_OAUTH_PORTAL_URL="http://localhost:8080"
CORS_ORIGIN="http://localhost:8080"
```

Sau đó restart:

```bash
pnpm dev
```

→ App sẽ chạy tại: **http://localhost:8080**

---

### Cách 2 – Truyền biến môi trường trực tiếp khi chạy

```bash
# Linux / macOS
PORT=8080 pnpm dev

# Windows (PowerShell)
$env:PORT=8080; pnpm dev

# Windows (CMD)
set PORT=8080 && pnpm dev
```

---

### Cách 3 – Deploy trên server với port tùy ý

```bash
# Build production bundle
pnpm build

# Chạy với port tùy chỉnh
PORT=8080 NODE_ENV=production node dist/index.js

# Hoặc dùng PM2 để quản lý process
pm2 start dist/index.js --name tuvi-ai -- --port 8080

# PM2 với file env
pm2 start dist/index.js --name tuvi-ai --env production
```

> ⚠️ **Lưu ý khi dùng Nginx/Reverse Proxy**: Nếu bạn đứng sau Nginx, hãy để `PORT` là port nội bộ (e.g. `3000`) và cấu hình Nginx proxy `80` → `3000`.

Ví dụ config Nginx cơ bản:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📦 Các Lệnh Scripts Hữu Ích

| Lệnh | Mô tả |
|---|---|
| `pnpm dev` | Khởi động development server (auto-reload) |
| `pnpm build` | Build production bundle vào `dist/` |
| `pnpm start` | Chạy production bundle đã build |
| `pnpm db:push` | Generate migration SQL và apply vào database |
| `pnpm test` | Chạy unit tests (Vitest) |
| `pnpm check` | TypeScript type check không emit file |
| `pnpm format` | Format code với Prettier |

---

## 📁 Cấu Trúc Thư Mục

```
tuvi-ai/
├── client/               # Frontend React
│   └── src/
│       ├── pages/        # Trang chính (Numerology, TuVi, Zodiac…)
│       ├── components/   # UI Components
│       └── lib/          # Utilities, tRPC client
├── server/               # Backend Express + tRPC
│   ├── _core/            # Core: LLM, tRPC, Auth, Vite middleware
│   ├── services/         # Business logic (numerology, tuvi, fortune…)
│   └── routers.ts        # Tất cả tRPC endpoints
├── drizzle/              # Database schema & migrations
├── shared/               # Types & constants dùng chung cả 2 phía
├── .env.example          # Mẫu cấu hình môi trường
└── package.json
```

---

## 🤖 Cấu Hình AI Provider

App hỗ trợ bất kỳ API tương thích OpenAI. Chỉ cần set 3 biến trong `.env`:

| Biến | Mô tả |
|---|---|
| `OPENAI_API_KEY` | API key từ provider |
| `OPENAI_BASE_URL` | Base URL của provider (kết thúc bằng `/v1`) |
| `OPENAI_MODEL` | Tên model muốn dùng |

Ngoài ra có thể cấu hình trực tiếp qua **Admin Panel** tại `/admin` sau khi đăng nhập với tài khoản admin.

---

## 📄 License

Dự án được phát hành dưới giấy phép [MIT License](LICENSE).

---

**Made with ❤️ by Tai Ha** | **Powered by AI**
