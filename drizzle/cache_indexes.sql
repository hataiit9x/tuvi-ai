-- Tối ưu hóa hiệu năng truy vấn cache
-- Thêm composite index cho các trường thường xuyên query

-- Index cho cache lookup (tất cả các trường trong WHERE clause)
CREATE INDEX idx_tuvi_cache_lookup 
ON tuvi_cache(birthDate, birthHour, gender, calendarType, year);

-- Index cho query theo năm (admin stats)
CREATE INDEX idx_tuvi_cache_year 
ON tuvi_cache(year);

-- Index cho sắp xếp theo thời gian tạo (recent entries)
CREATE INDEX idx_tuvi_cache_created 
ON tuvi_cache(createdAt DESC);

-- Để chạy migration này:
-- 1. Copy nội dung file này
-- 2. Chạy trong MySQL client hoặc phpmyadmin
-- 3. Hoặc tạo migration mới với drizzle-kit
