# TuviAnalysisPanel Component - Tab-Based UI

## 🎨 Tổng quan

Component mới `TuviAnalysisPanel` thay thế modal cũ bằng một **tab system** hiện đại và dễ sử dụng hơn.

## ✨ Features

### 1. Tab Navigation
- **Tổng Quan**: Phân tích tổng quan của toàn bộ lá số
- **12 Cung**: Mỗi cung có tab riêng với icon đại diện
- **Responsive**: Grid layout thích ứng (4 cols mobile, 7 cols tablet, 13 cols desktop)

### 2. Palace Details
Mỗi tab cung hiển thị:
- 📍 Tên cung + Địa Chi
- ✨ Chủ Tinh (Main Stars) với badges màu purple
- 🌟 Phụ Tinh (Secondary Stars) với outline badges
- 🎯 Luận giải AI chi tiết

### 3. On-Demand Analysis
- Button "Luận giải ngay" cho từng cung
- Loading state với animation
- Cache indicator (⚡ Cached badge)
- Empty state khi chưa phân tích

### 4. UX Improvements
- ✅ Không cần mở/đóng modal
- ✅ Dễ dàng chuyển đổi giữa các cung
- ✅ Xem so sánh nhanh giữa các cung
- ✅ Scroll mượt mà
- ✅ Visual feedback tốt hơn

## 🎯 Layout

```
┌─────────────────────────────────────────────────┐
│  Luận Giải Tử Vi - AI Master           ✨       │
├─────────────────────────────────────────────────┤
│ Tabs:                                           │
│ [📊Tổng Quan][✨Mệnh][👨‍👩‍👧Phụ Mẫu][🙏Phúc Đức]... │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab Content Area:                              │
│                                                 │
│  📊 Phân Tích Tổng Quan                         │
│  ┌──────────────────────────────────────┐      │
│  │  - Tổng quan về bản thân...          │      │
│  │  - Tính cách...                       │      │
│  │  - Sự nghiệp...                       │      │
│  └──────────────────────────────────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

When switching to palace tab:

```
┌─────────────────────────────────────────────────┐
│  ✨ Cung Mệnh (Thân)              [⚡ Cached]    │
├─────────────────────────────────────────────────┤
│  Chủ Tinh: [Tử Vi] [Thiên Phủ]                 │
│  Phụ Tinh: [Văn Xương] [Văn Khúc] [Tả Phụ]... │
├─────────────────────────────────────────────────┤
│  ✨ Luận Giải Chi Tiết (AI)                     │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Người sinh có Tử Vi ở cung Mệnh...    │    │
│  │  Chính tính: Phá Quân làm chính tinh...│    │
│  │  Ảnh hưởng: ...                        │    │
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## 🔧 Usage

### Integrate into existing page

```tsx
import { TuviAnalysisPanel } from '@/components/TuviAnalysisPanel';

// In your parent component (e.g., TuViChartProfessional)
export function YourComponent() {
  const [analysisData, setAnalysisData] = useState(null);
  const [formInput, setFormInput] = useState({...});
  
  const analyzeMutation = trpc.tuvi.analyze.useMutation({
    onSuccess: (data) => {
      setAnalysisData(data);
    }
  });

  return (
    <div>
      {/* Chart Display */}
      <TuViChart palaces={palaces} />
      
      {/* Button to trigger analysis */}
      <Button onClick={() => analyzeMutation.mutate(formInput)}>
        Phân Tích Bằng AI
      </Button>
      
      {/* Analysis Panel */}
      {analysisData && (
        <TuviAnalysisPanel
          palaces={chart.palaces}
          overviewAnalysis={analysisData.analysis}
          input={formInput}
        />
      )}
    </div>
  );
}
```

### Props Interface

```typescript
interface TuviAnalysisPanelProps {
  palaces: Palace[];              // Array of 12 palaces from chart
  overviewAnalysis?: string;      // Overview AI analysis
  input: {                        // Form input for palace analysis
    fullName: string;
    birthDate: string;
    birthHour: string;
    gender: 'male' | 'female';
    calendarType: 'lunar' | 'solar';
  };
}
```

## 🎨 Styling

### Colors
- Primary: Purple (`purple-600`, `purple-700`)
- Success: Green (`green-100`, `green-700`) for cache indicator
- Background: Gray (`gray-50`, `gray-100`)
- Accent: Purple gradient for AI sections

### Badges
- **Main Stars**: Solid purple background
- **Secondary Stars**: Outline style
- **Cached**: Green background with lightning icon

### States
- **Loading**: Purple spinner with message
- **Empty**: Dashed border with icon
- **Active Tab**: Purple background with white text
- **Inactive Tab**: Default with hover effect

## 📱 Responsive Behavior

### Mobile (< 768px)
- 4 columns grid for tabs
- Stacked layout
- Scrollable tabs

### Tablet (768px - 1024px)
- 7 columns grid
- Better spacing

### Desktop (> 1024px)
- 13 columns grid (all tabs visible)
- Full width layout

## ✅ Advantages over Modal

| Feature | Modal (Old) | Tabs (New) |
|---------|-------------|------------|
| Navigation | Click palace → Modal opens | Click tab → Content shows |
| Comparison | Need to open/close multiple times | Switch tabs easily |
| Context | Lose overview when viewing palace | Keep overview accessible |
| Mobile | Full screen modal | Inline, scrollable |
| UX Flow | Interrupted | Continuous |
| Visual Hierarchy | Depth (modal over content) | Breadth (side by side) |

## 🚀 Future Enhancements

1. **Sticky Tabs**: Make tab list sticky when scrolling
2. **Keyboard Navigation**: Arrow keys to switch tabs
3. **Deep Linking**: URL params for specific palace (e.g., `?tab=Mệnh`)
4. **Search**: Quick search to jump to specific palace
5. **Export**: Download analysis for specific palace
6. **Comparison Mode**: Show 2 palaces side-by-side

## 📝 Migration Guide

### Step 1: Import new component
```tsx
import { TuviAnalysisPanel } from '@/components/TuviAnalysisPanel';
```

### Step 2: Replace modal rendering
```tsx
// Old
{selectedPalace && (
  <PalaceDetailModal
    palace={selectedPalace}
    open={isModalOpen}
    onOpenChange={setIsModalOpen}
    input={formInput}
  />
)}

// New
{analysisData && (
  <TuviAnalysisPanel
    palaces={chart.palaces}
    overviewAnalysis={analysisData.analysis}
    input={formInput}
  />
)}
```

### Step 3: Remove modal state management
```tsx
// Can remove these
const [selectedPalace, setSelectedPalace] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Step 4: Update palace cell click handler
```tsx
// Old - opens modal
const handlePalaceClick = (palace) => {
  setSelectedPalace(palace);
  setIsModalOpen(true);
};

// New - no action needed, tabs handle it
// Remove this handler entirely
```

## 🎯 Best Practices

1. **Show panel after analysis**: Only render after overview analysis completes
2. **Keep form input**: Pass form input for palace-specific analysis
3. **Handle loading**: Component manages palace analysis loading internally
4. **Cached feedback**: Badge shows when analysis comes from cache
5. **Empty states**: Clear messaging when no analysis available

## ✨ Result

Users now have a **seamless, modern experience** where they can:
- View all 12 palaces in tabs
- Switch between palaces instantly
- See overview and details side-by-side
- No interruptions from modals
- Better on mobile devices
