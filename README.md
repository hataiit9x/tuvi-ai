# Tử Vi AI - Luận Giải Số Mệnh & Phong Thủy

![Tu Vi AI Banner](docs/images/banner.png)

**Tử Vi AI** là ứng dụng web hiện đại kết hợp tinh hoa **Tử Vi Đẩu Số** truyền thống với sức mạnh của **Trí tuệ nhân tạo (AI)**. Dự án nhằm mang đến những luận giải sâu sắc, cá nhân hóa và dễ hiểu về vận mệnh, phong thủy cho người sử dụng.

## 🌟 Tính Năng Nổi Bật

### 1. 🔮 Lập & Luận Giải Lá Số Tử Vi
- **An sao chính xác**: Thuật toán an sao chuẩn Tử Vi Đẩu Số Nam Phái (có tham khảo Thiên Lương, Đông A).
- **Luận giải AI chuyên sâu**:
  - **Tổng quan**: Phân tích Cục, Mệnh, Thân, tương quan Ngũ Hành.
  - **Chi tiết 12 Cung**: Luận giải từng cung (Mệnh, Phụ Mẫu, Phúc Đức...) dựa trên tinh hệ và các cách cục.
  - **Tương tác**: Bình giải Tam Hợp, Nhị Hợp, Xung Chiếu.
- **Phong cách cung đình**: Văn phong luận giải uy nghi, trích dẫn thư tịch cổ.

### 2. 🔢 Thần Số Học (Numerology)
- Tính toán các chỉ số quan trọng: Số Chủ Đạo, Linh Hồn, Nhân Cách, Sứ Mệnh.
- Biểu đồ ngày sinh.
- Luận giải AI chi tiết về tính cách và định hướng cuộc đời.

### 3. 🌙 Tử Vi 12 Con Giáp & Phong Thủy
- **Dự báo năm 2026**: Vận hạn chi tiết cho 12 tuổi.
- **Phong thủy ngày Tết**:
  - **Xông đất**: Chọn tuổi xông đất hợp mệnh gia chủ.
  - **Ngày đẹp**: Xem ngày tốt xấu.
  - **Màu sắc & Lì xì**: Gợi ý phong thủy may mắn.

### 4. ⚡ Hiệu Năng & Trải Nghiệm
- **Smart Caching**: Hệ thống Cache thông minh (MySQL + Drizzle) giúp phản hồi tức thì các kết quả đã phân tích.
- **Giao diện hiện đại**: Thiết kế đẹp mắt, Responsive, Dark/Light mode (tùy chỉnh), animation mượt mà.
- **Background Jobs**: Xử lý tác vụ nặng (luận giải 12 cung) ngầm để không làm gián đoạn trải nghiệm.

---

## 🛠 Công Nghệ Sử Dụng

- **Frontend**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Wouter](https://github.com/molefrog/wouter) (Routing), [Framer Motion](https://www.framer.com/motion/).
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/).
- **Database**: [MySQL](https://www.mysql.com/), [Drizzle ORM](https://orm.drizzle.team/).
- **AI Integration**: OpenAI API (GPT-4o/GPT-4o-mini).
- **Tools**: Vite, TypeScript, PNPM.

---

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu
- Node.js >= 18
- MySQL Database
- OpenAI API Key

### Các Bước

1.  **Clone repository:**
    ```bash
    git clone https://github.com/your-username/tuvi-ai.git
    cd tuvi-ai
    ```

2.  **Cài đặt dependencies:**
    ```bash
    pnpm install
    ```

3.  **Cấu hình môi trường:**
    - Copy file `.env.example` thành `.env`:
    ```bash
    cp .env.example .env
    ```
    - Điền thông tin Database và API Key vào `.env`.

4.  **Khởi tạo Database:**
    ```bash
    pnpm db:push
    ```

5.  **Chạy Development Server:**
    ```bash
    pnpm dev
    ```
    Hệ thống sẽ chạy tại `http://localhost:3000` (Frontend) và `http://localhost:3000/api` (Backend).

---

## 📚 Tài Liệu Kỹ Thuật

Xem chi tiết trong thư mục [docs/](docs/):
- [Cơ chế Cache hệ thống](docs/technical/cache-architecture.md)
- [Implement Palace Analysis Cache](docs/technical/palace-cache.md)
- [Cấu trúc Component Phân Tích](docs/components/analysis-panel.md)

---

## 📄 License

Dự án được phát hành dưới giấy phép [MIT License](LICENSE).

---

**Made with ❤️ by Tai Ha** | **Created by Kiro**
