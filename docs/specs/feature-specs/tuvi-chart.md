# Tử Vi Đẩu Số Feature Specification

## Overview

Tính năng lập và luận giải lá số tử vi theo phương pháp Tử Vi Đẩu Số truyền thống Việt Nam.

## User Stories

### US-001: Lập lá số tử vi
**As a** user  
**I want to** nhập thông tin sinh để lập lá số tử vi  
**So that** tôi có thể xem biểu đồ tử vi của mình  

**Acceptance Criteria:**
- Nhập được họ tên, ngày sinh, giờ sinh, giới tính
- Chọn được âm lịch/dương lịch
- Hiển thị lá số 12 cung với sao và cách
- Lưu lịch sử cho user đã đăng nhập

### US-002: Luận giải tử vi bằng AI
**As a** user  
**I want to** nhận được phân tích chi tiết về lá số  
**So that** tôi hiểu ý nghĩa của lá số tử vi  

**Acceptance Criteria:**
- Phân tích từng cung quan trọng
- Giải thích ý nghĩa các sao chủ
- Dự báo vận mệnh theo từng giai đoạn
- Đưa ra lời khuyên phù hợp

## Technical Specification

### Input Data Structure
```typescript
interface TuviInput {
  name: string;
  birthDate: Date;
  birthTime: string; // "HH:mm" format
  gender: "male" | "female";
  isLunar: boolean;
}
```

### Output Data Structure
```typescript
interface TuviChart {
  palaces: Palace[];
  stars: Star[];
  elements: Element[];
  analysis?: string;
}

interface Palace {
  id: number;
  name: string;
  position: number;
  stars: string[];
  elements: string[];
}
```

## API Endpoints

### Generate Tuvi Chart
- **Endpoint**: `tuvi.generate`
- **Method**: Query
- **Auth**: Public
- **Input**: TuviInput
- **Output**: TuviChart

### Analyze Chart
- **Endpoint**: `tuvi.analyze`
- **Method**: Mutation
- **Auth**: Public
- **Input**: Chart data + analysis type
- **Output**: Analysis text

## Database Schema

Charts are stored in `readings` table with type='tuvi'.

## UI Components

- TuviForm: Input form
- TuviChart: Chart visualization
- TuviAnalysis: AI analysis display
