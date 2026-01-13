# Tài Liệu Kỹ Thuật Dự Án Tử Vi AI

Thư mục này chứa các tài liệu chi tiết về kiến trúc hệ thống, hướng dẫn triển khai và các component chính của dự án.

## 🏗 Kiến Trúc Hệ Thống (Technical Architecture)

- **[Cache Architecture](technical/cache-architecture.md)**: Tổng quan về cơ chế caching 3 lớp (Tu Vi, Palace, Numerology) giúp tối ưu hiệu năng và giảm chi phí AI.
- **[Palace Analysis Cache](technical/palace-cache.md)**: Chi tiết implement cache cho từng cung (12 cung chức năng).
- **[Background Analysis](technical/background-analysis.md)**: Cơ chế phân tích ngầm (Background Job) để cải thiện UX.
- **[Cache Summary](technical/cache-summary.md)**: Tóm tắt thông số và lợi ích của hệ thống cache hiện tại.
- **[Test Plan](technical/cache-test-plan.md)**: Kế hoạch và kịch bản test hệ thống cache.

## 🧩 Components (Frontend)

- **[Analysis Panel](components/analysis-panel.md)**: Tài liệu về `TuviAnalysisPanel` - Component hiển thị kết quả luận giải Tabs/Markdown.
  - [Usage Example](components/examples/analysis-panel-usage.tsx)
- **[Frontend Integration](components/examples/frontend-integration.tsx)**: Ví dụ tích hợp API Full Flow.

## 📝 Quy Ước (Convention)

- **Database**: Sử dụng Drizzle ORM, schema định nghĩa tại `drizzle/schema.ts`.
- **API**: tRPC router đặt tại `server/routers.ts`.
- **Styling**: Tailwind CSS cho toàn bộ giao diện.

---

*Tài liệu được cập nhật liên tục theo sự phát triển của dự án.*
