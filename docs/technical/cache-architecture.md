# Tử Vi Cache Mechanism

## Tổng quan

Hệ thống cache cho Tử Vi được thiết kế để giảm số lần gọi API LLM cho cùng một input, giúp tiết kiệm chi phí và tăng tốc độ phản hồi.

## Cách hoạt động

### 1. Cache Key
Cache được lưu dựa trên các tham số sau:
- **birthDate**: Ngày sinh (format: YYYY-MM-DD)
- **birthHour**: Giờ sinh
- **gender**: Giới tính (male/female)
- **calendarType**: Loại lịch (lunar/solar)
- **year**: Năm sinh (extracted từ birthDate)

### 2. Flow xử lý

```
User Request
    ↓
1. Kiểm tra cache trong DB (tuvi_cache table)
    ↓
    ├─ Cache HIT → Trả về kết quả từ cache
    │              ✅ Nhanh, không tốn API call
    └─ Cache MISS → 
        ↓
        2. Tính toán lá số Tử Vi
        ↓
        3. Gọi LLM API để phân tích
        ↓
        4. Lưu kết quả vào cache
        ↓
        5. Lưu vào history (nếu user đã login)
        ↓
        6. Trả về kết quả cho user
```

### 3. Database Schema

```sql
CREATE TABLE `tuvi_cache` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `birthDate` varchar(32) NOT NULL,
  `birthHour` varchar(32) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `calendarType` enum('lunar','solar') NOT NULL,
  `year` int NOT NULL,
  `chartData` json NOT NULL,
  `aiAnalysis` text NOT NULL,           -- Phân tích tổng quan
  `palaceAnalyses` json,                -- Phân tích chi tiết 12 cung
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
```

**Cấu trúc `palaceAnalyses` JSON:**
```json
{
  "Mệnh": "Phân tích chi tiết cung Mệnh...",
  "Phụ Mẫu": "Phân tích chi tiết cung Phụ Mẫu...",
  "Phúc Đức": "Phân tích chi tiết cung Phúc Đức...",
  "Điền Trạch": "...",
  "Quan Lộc": "...",
  "Nô Bộc": "...",
  "Thiên Di": "...",
  "Tật Ách": "...",
  "Tài Bạch": "...",
  "Tử Tức": "...",
  "Phu Thê": "...",
  "Huynh Đệ": "..."
}
```

## Ví dụ sử dụng

### Lần 1: Cache MISS
```
Input:
- birthDate: "2025-03-15"
- birthHour: "ty"
- gender: "male"
- calendarType: "lunar"

→ Cache không tìm thấy
→ Gọi LLM API (tốn thời gian + chi phí)
→ Lưu vào cache với key: (2025-03-15, ty, male, lunar, 2025)
→ Trả về kết quả
```

### Lần 2: Cache HIT
```
Input: (Cùng input như lần 1)
- birthDate: "2025-03-15"
- birthHour: "ty"
- gender: "male"
- calendarType: "lunar"

→ ✅ Tìm thấy trong cache!
→ Trả về ngay lập tức (không gọi API)
→ Response có flag: cached: true
```

### Lần 3: Palace Analysis Cache

Cache cũng hoạt động cho phân tích chi tiết từng cung:

```
User click "Luận giải chi tiết" cho cung Mệnh
    ↓
1. Tìm cache entry (same cache key: birthDate + birthHour + gender + calendarType + year)
    ↓
2. Kiểm tra palaceAnalyses["Mệnh"]
    ↓
    ├─ Đã có → ✅ Trả về ngay (cached: true)
    └─ Chưa có → 
        ↓
        3. Gọi LLM API để phân tích cung Mệnh
        ↓
        4. Update palaceAnalyses["Mệnh"] = result
        ↓
        5. Trả về kết quả (cached: false)

User click "Luận giải chi tiết" cho cung Phụ Mẫu
    ↓
    → Tương tự, update palaceAnalyses["Phụ Mẫu"]
    
User click lại cung Mệnh
    ↓
    → ✅ Trả về từ palaceAnalyses["Mệnh"] (cached: true)
```

**Lợi ích:**
- Mỗi cung chỉ cần phân tích 1 lần
- Các cung khác nhau được cache riêng biệt
- User có thể xem lại bất kỳ cung nào đã phân tích mà không tốn API call
```

## Admin Tools

### Xem thống kê cache
```typescript
const stats = await trpc.admin.getCacheStats.query();
// Returns:
// {
//   totalEntries: 150,
//   totalPalaceAnalyses: 420,  // Tổng số cung đã phân tích chi tiết
//   byYear: {
//     2025: 80,
//     2024: 50,
//     2023: 20
//   },
//   palaceCount: {           // Số lần phân tích từng cung
//     "Mệnh": 85,
//     "Phụ Mẫu": 42,
//     "Phu Thê": 38,
//     "Quan Lộc": 55,
//     ...
//   },
//   recentEntries: [
//     {
//       birthDate: "2025-03-15",
//       birthHour: "ty",
//       gender: "male",
//       year: 2025,
//       palaceAnalysesCount: 3,  // Đã phân tích 3 cung
//       createdAt: "..."
//     },
//     ...
//   ]
// }
```

### Xóa cache
```typescript
await trpc.admin.clearCache.mutate();
// Xóa toàn bộ cache
```

## Lợi ích

1. **Tiết kiệm chi phí**: Giảm số lần gọi LLM API
2. **Tăng tốc độ**: Response ngay lập tức cho request đã có cache
3. **Giảm tải server**: Không cần tính toán lại cho cùng input
4. **Theo dõi được**: Admin có thể xem thống kê cache theo năm

## Lưu ý

- Cache được lưu **vĩnh viễn** cho đến khi admin xóa
- Mỗi năm sinh sẽ có cache riêng (ví dụ: 1990, 2025, 2026)
- Cache không phụ thuộc vào user - nghĩa là user A và user B có cùng input sẽ dùng chung cache
- Khi có thay đổi logic tính toán hoặc prompt LLM, nên xóa cache cũ

## Console Logs

Hệ thống sẽ log ra console:

**Tổng quan (Overview):**
- `✅ Cache HIT for ...` - Khi tìm thấy cache tổng quan
- `❌ Cache MISS for ...` - Khi không tìm thấy cache tổng quan
- `💾 Cached analysis for ...` - Khi lưu cache tổng quan thành công

**Chi tiết cung (Palace):**
- `✅ Palace Cache HIT for Mệnh (2025-03-15)` - Khi tìm thấy cache của cung
- `❌ Palace Cache MISS for Phụ Mẫu (2025-03-15)` - Khi chưa có cache của cung
- `💾 Cached palace analysis for Phu Thê (2025-03-15)` - Khi lưu cache cung thành công
- `⚠️ No cache entry found for ...` - Warning khi không tìm thấy cache entry gốc
