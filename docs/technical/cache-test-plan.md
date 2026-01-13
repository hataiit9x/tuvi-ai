## Test Cache Mechanism

Dưới đây là các bước để test cơ chế cache:

### 1. Test Cache MISS (Lần đầu)
Mở Developer Console trong trình duyệt và chạy:

```javascript
// Test lần 1 - Sẽ gọi LLM API
const testInput = {
  fullName: "Nguyễn Văn A",
  birthDate: "2025-03-15",
  birthHour: "ty",
  gender: "male",
  calendarType: "lunar"
};

// Measure time
console.time('First Call (Cache MISS)');
const result1 = await fetch('/api/trpc/tuvi.analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testInput)
});
console.timeEnd('First Call (Cache MISS)');

const data1 = await result1.json();
console.log('Cache status:', data1.cached); // Should be false
```

**Expected:**
- Console log: `❌ Cache MISS for 2025-03-15 ty (male, lunar, year: 2025)`
- Console log: `💾 Cached analysis for 2025-03-15 ty (year: 2025)`
- Response time: ~5-10 seconds (LLM call)
- Response: `cached: false`

### 2. Test Cache HIT (Lần thứ 2 - cùng input)

```javascript
// Test lần 2 - Sẽ lấy từ cache
console.time('Second Call (Cache HIT)');
const result2 = await fetch('/api/trpc/tuvi.analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testInput)
});
console.timeEnd('Second Call (Cache HIT)');

const data2 = await result2.json();
console.log('Cache status:', data2.cached); // Should be true
console.log('Analysis matches:', data1.analysis === data2.analysis); // Should be true
```

**Expected:**
- Console log: `✅ Cache HIT for 2025-03-15 ty (male, lunar, year: 2025)`
- Response time: <1 second (từ cache)
- Response: `cached: true`
- Analysis content giống y hệt lần 1

### 3. Test với năm khác

```javascript
// Test với năm khác - Sẽ tạo cache mới
const testInput2 = {
  fullName: "Nguyễn Văn B",
  birthDate: "1990-03-15", // Năm khác
  birthHour: "ty",
  gender: "male",
  calendarType: "lunar"
};

console.time('Different Year (Cache MISS)');
const result3 = await fetch('/api/trpc/tuvi.analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testInput2)
});
console.timeEnd('Different Year (Cache MISS)');

const data3 = await result3.json();
console.log('Cache status:', data3.cached); // Should be false (năm khác)
```

**Expected:**
- Console log: `❌ Cache MISS for 1990-03-15 ty (male, lunar, year: 1990)`
- New cache entry created for year 1990

### 4. Kiểm tra Admin Stats

Đăng nhập admin và chạy:

```javascript
const stats = await fetch('/api/trpc/admin.getCacheStats').then(r => r.json());
console.log('Cache Statistics:', stats);
```

**Expected:**
```json
{
  "totalEntries": 2,
  "byYear": {
    "2025": 1,
    "1990": 1
  },
  "recentEntries": [
    {
      "birthDate": "1990-03-15",
      "birthHour": "ty",
      "gender": "male",
      "year": 1990,
      "createdAt": "..."
    },
    {
      "birthDate": "2025-03-15",
      "birthHour": "ty",
      "gender": "male",
      "year": 2025,
      "createdAt": "..."
    }
  ]
}
```

### 5. Test Clear Cache

```javascript
// Clear all cache
const clearResult = await fetch('/api/trpc/admin.clearCache', {
  method: 'POST'
}).then(r => r.json());

console.log(clearResult); // { success: true, message: "Cache đã được xóa thành công!" }

// Test lại - phải cache MISS
console.time('After Clear (Cache MISS)');
const result4 = await fetch('/api/trpc/tuvi.analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testInput)
});
console.timeEnd('After Clear (Cache MISS)');

const data4 = await result4.json();
console.log('Cache status:', data4.cached); // Should be false
```

## Direct Database Check

Kiểm tra trong database:

```sql
-- Xem tất cả cache entries
SELECT id, birthDate, birthHour, gender, calendarType, year, createdAt 
FROM tuvi_cache;

-- Đếm theo năm
SELECT year, COUNT(*) as count 
FROM tuvi_cache 
GROUP BY year 
ORDER BY year DESC;

-- Xóa cache (nếu cần)
DELETE FROM tuvi_cache;
```

## Performance Metrics

| Scenario | Expected Time | API Call |
|----------|--------------|----------|
| First time (Cache MISS) | 5-10 seconds | ✅ Yes |
| Second time (Cache HIT) | <1 second | ❌ No |
| Different year | 5-10 seconds | ✅ Yes (new cache) |
| Different hour | 5-10 seconds | ✅ Yes (new cache) |
| Same parameters | <1 second | ❌ No (from cache) |
