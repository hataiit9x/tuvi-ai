# Feature Specifications

Thư mục này chứa đặc tả chi tiết cho từng tính năng của Tử Vi AI Web.

## Cấu trúc Tài liệu

Mỗi tính năng có tài liệu riêng với format:

```
feature-name.md
├── Overview          # Tổng quan tính năng
├── User Stories      # User stories và acceptance criteria
├── Technical Spec    # Đặc tả kỹ thuật
├── API Endpoints     # Chi tiết API
├── Database Schema   # Cấu trúc dữ liệu
├── UI/UX Design      # Thiết kế giao diện
└── Testing Plan      # Kế hoạch test
```

## Danh sách Tính năng

### Core Features
- `tuvi-chart.md` - Tử Vi Đẩu Số
- `numerology.md` - Thần Số Học
- `zodiac-forecast.md` - Cung Hoàng Đạo
- `compatibility.md` - Hợp Tuổi

### Supporting Features
- `auth-system.md` - Hệ thống xác thực
- `user-profile.md` - Quản lý profile
- `reading-history.md` - Lịch sử xem bói
- `admin-panel.md` - Panel quản trị

### Utility Features
- `auspicious-dates.md` - Xem Ngày Tốt
- `tet-tools.md` - Công Cụ Tết
- `llm-integration.md` - Tích hợp AI

## Template cho Tính năng Mới

Khi thêm tính năng mới, copy template từ `_template.md` và điền thông tin chi tiết.

## Cập nhật Tài liệu

- Cập nhật khi có thay đổi requirements
- Review định kỳ để đảm bảo tính chính xác
- Sync với implementation thực tế
