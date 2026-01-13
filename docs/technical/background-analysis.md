# Background Palace Analysis - Auto Pre-Caching

## 🎯 Mục tiêu

Thay vì user phải chờ 5-10 giây mỗi lần click vào 1 cung để xem phân tích chi tiết, hệ thống sẽ **tự động phân tích tất cả 12 cung ngầm** sau khi phân tích tổng quan xong.

## ✨ Lợi ích

1. **UX cực tốt**: User click vào bất kỳ cung nào cũng thấy kết quả ngay lập tức (<100ms)
2. **Tiết kiệm thời gian**: Không phải chờ đợi cho từng cung
3. **Tận dụng thời gian chết**: LLM đang phân tích trong background khi user đang đọc tổng quan
4. **Transparent**: User không biết có background job, chỉ thấy mọi thứ "siêu nhanh"

## 🔄 Cách hoạt động

### Flow chính

```
User submit form xem Tử Vi
    ↓
1. Generate chart (instant)
    ↓
2. Call LLM for overview analysis (5-10s)
    ↓
3. Save to cache + Return to user ✅ USER SEES RESULT
    ↓
4. 🚀 Start background job (fire-and-forget)
    ↓
    Background: Analyze palace 1/12 → Save
    Background: Analyze palace 2/12 → Save
    Background: Analyze palace 3/12 → Save
    ...
    Background: Analyze palace 12/12 → Save
    ↓
    Background: Done! 🎉

Meanwhile, user is reading overview or clicking palaces
    ↓
User clicks "Luận giải chi tiết" cung Mệnh
    ↓
    ✅ Already cached! Return instantly!
```

### Timeline ví dụ

```
T=0s:   User submit
T=0s:   Generate chart (instant)
T=0s:   Start LLM overview analysis
T=7s:   Overview done → Return to user → User reading
T=7s:   🚀 Background job starts

T=7s:   Background: Start palace 1 (Mệnh)
T=12s:  Background: Palace 1 done, start palace 2
T=17s:  Background: Palace 2 done, start palace 3
...
T=67s:  Background: All 12 palaces done! 🎉

T=20s:  User clicks "Luận giải" cung Mệnh
        → ✅ Already cached! Instant!

T=30s:  User clicks "Luận giải" cung Quan Lộc  
        → ✅ Already cached! Instant!
```

## 📊 Performance

### Trước (Without Background Job)

- Overview analysis: 7 giây
- User nhận kết quả: T=7s ✅
- Click cung 1: 5-10 giây chờ đợi ❌
- Click cung 2: 5-10 giây chờ đợi ❌
- ...
- **Total user waiting: 7s + (5-10s × N cung đã xem)**

### Sau (With Background Job)

- Overview analysis: 7 giây
- User nhận kết quả: T=7s ✅
- Click cung 1: <100ms (instant) ✅
- Click cung 2: <100ms (instant) ✅
- ...
- **Total user waiting: Chỉ 7s ban đầu!**

## 🛠️ Implementation

### 1. Background Function

```typescript
async function preAnalyzeAllPalaces(input, chart, cacheId) {
  console.log('🚀 Starting background palace analysis...');
  
  for (const palaceName of PALACE_NAMES) {
    // Call LLM API
    const analysis = await invokeLLM(...);
    
    // Update cache
    await db.update(tuviCache)
      .set({ palaceAnalyses: { ...existing, [palaceName]: analysis } })
      .where(eq(tuviCache.id, cacheId));
    
    console.log(`✅ Pre-cached palace ${count}/12: ${palaceName}`);
    
    // Small delay to avoid overwhelming API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎉 Background analysis completed!');
}
```

### 2. Trigger Point

Sau khi save overview cache:

```typescript
// Save to cache
const [result] = await db.insert(tuviCache).values({...});
const cacheId = result.insertId;

// 🚀 Fire-and-forget background job
preAnalyzeAllPalaces(input, chart, cacheId).catch(error => {
  console.error("Background job failed:", error);
});

// Return immediately to user
return { chart, analysis, cached: false };
```

### 3. Rate Limiting

Để tránh overwhelm LLM API:
- Analyze tuần tự (sequential), không parallel
- Delay 500ms giữa mỗi palace
- Total time: ~60-70 giây cho 12 cung

## 📝 Console Logs

User sẽ thấy trong server console:

```
💾 Cached analysis for 2025-03-15 ty (year: 2025)
🚀 Starting background palace analysis for 2025-03-15 ty
✅ Pre-cached palace 1/12: Mệnh
✅ Pre-cached palace 2/12: Phụ Mẫu
✅ Pre-cached palace 3/12: Phúc Đức
✅ Pre-cached palace 4/12: Điền Trạch
✅ Pre-cached palace 5/12: Quan Lộc
✅ Pre-cached palace 6/12: Nô Bộc
✅ Pre-cached palace 7/12: Thiên Di
✅ Pre-cached palace 8/12: Tật Ách
✅ Pre-cached palace 9/12: Tài Bạch
✅ Pre-cached palace 10/12: Tử Tức
✅ Pre-cached palace 11/12: Phu Thê
✅ Pre-cached palace 12/12: Huynh Đệ
🎉 Background palace analysis completed! Success: 12/12, Failed: 0/12
```

Nếu có lỗi:
```
❌ Failed to pre-cache palace: Quan Lộc [Error details]
🎉 Background palace analysis completed! Success: 11/12, Failed: 1/12
```

## ⚠️ Edge Cases

### 1. API Rate Limit
- **Problem**: LLM provider có rate limit
- **Solution**: Sequential execution + 500ms delay
- **Fallback**: Nếu background job fail, user vẫn có thể click để analyze on-demand

### 2. Server Restart
- **Problem**: Background job đang chạy, server restart
- **Solution**: Job sẽ dừng, nhưng palaces đã cache vẫn còn. User click palace chưa cache → analyze on-demand

### 3. Concurrent Users
- **Problem**: 10 users cùng lúc submit
- **Solution**: 10 background jobs chạy song song, mỗi job analyze tuần tự. Total: 10 jobs × 12 palaces

### 4. Database Lock
- **Problem**: Nhiều background jobs update cùng cache entry
- **Solution**: Mỗi palace update là transaction riêng, safe

## 🎯 Success Metrics

Sau khi deploy:
- 95%+ palaces đã có cache khi user click
- Average palace click response time: <200ms (vs 5-10s trước)
- User satisfaction: Tăng đáng kể vì "siêu nhanh"

## 📈 Future Enhancements

1. **Priority palaces**: Analyze hot palaces first (Mệnh, Quan Lộc, Tài Bạch, Phu Thê)
2. **Parallel batches**: Analyze 2-3 palaces song song (nếu API cho phép)
3. **Progress indicator**: WebSocket/SSE để show progress cho user
4. **Smart caching**: Skip palaces ít được click

## ✅ Kết luận

Background palace analysis là một **game changer** cho UX:
- User chỉ chờ 1 lần (overview)
- Tất cả palaces đều instant sau đó
- Transparent và effortless
- Win-win: Tiết kiệm thời gian user, maximize LLM usage efficiency
