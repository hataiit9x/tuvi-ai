# Kiến trúc Hệ thống

## Tổng quan

Tử Vi AI Web sử dụng kiến trúc monorepo với frontend React và backend Express.js, kết nối qua tRPC.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│   MySQL DB      │
│   (Port 5173)   │    │   (Port 3000)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ tRPC    │             │ tRPC    │             │ Drizzle │
    │ Client  │             │ Router  │             │ ORM     │
    └─────────┘             └─────────┘             └─────────┘
```

## Luồng Dữ liệu

### 1. Client Request
```
User Action → React Component → tRPC Hook → HTTP Request
```

### 2. Server Processing
```
Express Middleware → tRPC Router → Service Layer → Database
```

### 3. Response
```
Database → Service → tRPC Response → React Query Cache → UI Update
```

## Thành phần Chính

### Frontend (client/)
- **React 19**: UI framework với TypeScript
- **Vite**: Build tool và dev server
- **tRPC Client**: Type-safe API calls
- **React Query**: Caching và state management
- **shadcn/ui**: Component library
- **Tailwind CSS**: Styling

### Backend (server/)
- **Express.js**: Web server
- **tRPC**: Type-safe API layer
- **Drizzle ORM**: Database operations
- **Zod**: Input validation
- **Services**: Business logic layer

### Database
- **MySQL**: Primary database
- **Drizzle**: Schema management và migrations

## Bảo mật

- JWT authentication cho protected routes
- Input validation với Zod schemas
- SQL injection protection qua Drizzle ORM
- CORS configuration cho production

## Performance

- React Query caching
- Database indexing
- Static asset optimization
- Code splitting với Vite
