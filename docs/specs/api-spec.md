# API Specification

## tRPC Router Structure

### Main Router (server/routers.ts)

```typescript
export const appRouter = router({
  tuvi: tuviRouter,
  numerology: numerologyRouter,
  zodiac: zodiacRouter,
  compatibility: compatibilityRouter,
  fortune: fortuneRouter,
  auth: authRouter,
  admin: adminRouter,
});
```

## API Endpoints

### Tử Vi Router

#### `tuvi.generate`
- **Type**: `publicProcedure`
- **Input**: 
  ```typescript
  {
    name: string;
    birthDate: Date;
    birthTime: string; // "HH:mm"
    gender: "male" | "female";
    isLunar: boolean;
  }
  ```
- **Output**: Tử vi chart data
- **Description**: Tạo lá số tử vi từ thông tin sinh

#### `tuvi.analyze`
- **Type**: `publicProcedure`
- **Input**: Chart data + analysis type
- **Output**: AI analysis text
- **Description**: Phân tích lá số bằng AI

### Numerology Router

#### `numerology.calculate`
- **Type**: `publicProcedure`
- **Input**: 
  ```typescript
  {
    name: string;
    birthDate: Date;
  }
  ```
- **Output**: Numerology numbers và meanings
- **Description**: Tính các số thần số học

### Zodiac Router

#### `zodiac.forecast`
- **Type**: `publicProcedure`
- **Input**: `{ year: number; zodiac: string }`
- **Output**: Yearly forecast
- **Description**: Dự báo cung hoàng đạo

#### `zodiac.compatibility`
- **Type**: `publicProcedure`
- **Input**: `{ zodiac1: string; zodiac2: string }`
- **Output**: Compatibility analysis
- **Description**: Phân tích tương hợp 2 cung

### Auth Router

#### `auth.login`
- **Type**: `publicProcedure`
- **Input**: `{ email: string; password: string }`
- **Output**: JWT token + user info
- **Description**: Đăng nhập

#### `auth.register`
- **Type**: `publicProcedure`
- **Input**: User registration data
- **Output**: Success message
- **Description**: Đăng ký tài khoản

#### `auth.profile`
- **Type**: `protectedProcedure`
- **Input**: None (từ JWT)
- **Output**: User profile
- **Description**: Lấy thông tin profile

### Admin Router

#### `admin.llmConfig`
- **Type**: `adminProcedure`
- **Input**: LLM configuration
- **Output**: Success status
- **Description**: Cấu hình LLM settings

## Error Handling

### tRPC Error Codes
- `BAD_REQUEST`: Invalid input data
- `UNAUTHORIZED`: Missing/invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_SERVER_ERROR`: Server errors

### Error Response Format
```typescript
{
  error: {
    code: string;
    message: string;
    data?: any;
  }
}
```

## Rate Limiting

- Public endpoints: 100 requests/minute
- Protected endpoints: 200 requests/minute
- Admin endpoints: No limit

## Authentication

### JWT Token Structure
```typescript
{
  userId: string;
  email: string;
  role: "user" | "admin";
  exp: number;
}
```

### Headers
```
Authorization: Bearer <jwt_token>
```
