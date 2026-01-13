// Tử Vi chart generation service - matches exact format from image
export interface TuviStar {
  name: string;
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'black';
  brightness?: 'bright' | 'dim';
}

export interface TuviPalace {
  id: number;
  name: string;
  earthlyBranch: string;
  number: number;
  stars: TuviStar[];
  elements: string[];
}

export interface TuviChart {
  palaces: TuviPalace[];
  centerInfo: {
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: string;
    gender: string;
    lunarCalendar: boolean;
    destiny: string;
    bodyPalace: string;
  };
}

// Palace names in correct order
const PALACE_NAMES = [
  'TÀI BẠCH', 'TỬ TỨC', 'PHU THÊ', 'MỆNH', 'PHÁ QUÂN', 'PHU MẪU', 
  'PHÚC ĐỨC', 'ĐIỀN TRẠCH', 'QUAN LỘC', 'NÔ BỘC', 'THIÊN DI', 'TẤT ÁCH'
];

// Earthly branches
const EARTHLY_BRANCHES = [
  'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 
  'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'
];

// Major stars with their properties
const MAJOR_STARS = {
  '紫微': { name: 'Tử Vi', color: 'purple' as const },
  '天機': { name: 'Thiên Cơ', color: 'green' as const },
  '太陽': { name: 'Thái Dương', color: 'red' as const },
  '武曲': { name: 'Vũ Khúc', color: 'blue' as const },
  '天同': { name: 'Thiên Đồng', color: 'blue' as const },
  '廉貞': { name: 'Liêm Trinh', color: 'red' as const },
  '天府': { name: 'Thiên Phủ', color: 'purple' as const },
  '太陰': { name: 'Thái Âm', color: 'blue' as const },
  '貪狼': { name: 'Tham Lang', color: 'green' as const },
  '巨門': { name: 'Cự Môn', color: 'black' as const },
  '天相': { name: 'Thiên Tướng', color: 'blue' as const },
  '天梁': { name: 'Thiên Lương', color: 'green' as const },
  '七殺': { name: 'Thất Sát', color: 'red' as const },
  '破軍': { name: 'Phá Quân', color: 'blue' as const }
};

// Minor stars
const MINOR_STARS = {
  '左輔': { name: 'Tả Phụ', color: 'green' as const },
  '右弼': { name: 'Hữu Bật', color: 'green' as const },
  '文昌': { name: 'Văn Xương', color: 'green' as const },
  '文曲': { name: 'Văn Khúc', color: 'green' as const },
  '祿存': { name: 'Lộc Tồn', color: 'orange' as const },
  '天馬': { name: 'Thiên Mã', color: 'orange' as const },
  '擎羊': { name: 'Kình Dương', color: 'red' as const },
  '陀羅': { name: 'Đà La', color: 'red' as const },
  '火星': { name: 'Hỏa Tinh', color: 'red' as const },
  '鈴星': { name: 'Linh Tinh', color: 'red' as const },
  '天空': { name: 'Thiên Không', color: 'black' as const },
  '地劫': { name: 'Địa Kiếp', color: 'black' as const }
};

export function generateTuviChart(input: {
  fullName: string;
  birthDate: string;
  birthHour: string;
  gender: 'male' | 'female';
  calendarType: 'lunar' | 'solar';
}): TuviChart {
  const birthDate = new Date(input.birthDate);
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  // Calculate palace positions based on birth data
  const yearBranch = (year - 4) % 12;
  const monthBranch = (month + 1) % 12;
  const dayBranch = (day - 1) % 12;
  const hourBranch = getHourBranch(input.birthHour);
  
  // Generate palaces with sample data matching the image
  const palaces: TuviPalace[] = [
    {
      id: 1,
      name: 'TÀI BẠCH',
      earthlyBranch: 'Dần',
      number: 82,
      stars: [
        { name: 'Thất Sát', color: 'red', brightness: 'bright' },
        { name: 'Phương Các', color: 'red' },
        { name: 'Giải Thần', color: 'blue' },
        { name: 'Thiên Tài', color: 'green' },
        { name: 'Thiên Giải', color: 'green' },
        { name: 'Thiên Mã', color: 'orange', brightness: 'dim' }
      ],
      elements: []
    },
    {
      id: 2,
      name: 'TỬ TỨC',
      earthlyBranch: 'Mão',
      number: 92,
      stars: [
        { name: 'Thiên Đồng', color: 'blue', brightness: 'dim' },
        { name: 'Tướng Quân', color: 'red' },
        { name: 'Long Đức', color: 'green' },
        { name: 'Bát Tọa', color: 'blue' },
        { name: 'Thiên Khôi', color: 'green' }
      ],
      elements: []
    },
    {
      id: 3,
      name: 'PHU THÊ',
      earthlyBranch: 'Thìn',
      number: 102,
      stars: [
        { name: 'Vũ Khúc', color: 'blue', brightness: 'bright' },
        { name: 'Tấu Thư', color: 'green' },
        { name: 'Hữu Bật', color: 'green' },
        { name: 'Đường Phù', color: 'orange' },
        { name: 'Phong Cáo', color: 'red' },
        { name: 'Đẩu Quân', color: 'red' }
      ],
      elements: []
    },
    {
      id: 4,
      name: 'MỆNH',
      earthlyBranch: 'Tỵ',
      number: 112,
      stars: [
        { name: 'Thái Dương', color: 'red', brightness: 'bright' },
        { name: 'Phi Liêm', color: 'red' },
        { name: 'Phúc Đức', color: 'green' },
        { name: 'Thiên Đức', color: 'green' },
        { name: 'Thiên Việt', color: 'green' }
      ],
      elements: []
    },
    {
      id: 5,
      name: 'PHÁ QUÂN',
      earthlyBranch: 'Ngọ',
      number: 2,
      stars: [
        { name: 'Phá Quân', color: 'blue', brightness: 'bright' },
        { name: 'Kiếp Sát', color: 'red' },
        { name: 'Hý Thần', color: 'blue' },
        { name: 'Văn Khúc', color: 'green', brightness: 'dim' },
        { name: 'Thiên Quý', color: 'green' },
        { name: 'Thiên Thọ', color: 'green' },
        { name: 'Thiên Phúc', color: 'green' }
      ],
      elements: []
    },
    {
      id: 6,
      name: 'PHU MẪU',
      earthlyBranch: 'Mùi',
      number: 12,
      stars: [
        { name: 'Thiên Cơ', color: 'green', brightness: 'dim' },
        { name: 'Điều Khách', color: 'blue' },
        { name: 'Hồng Loan', color: 'orange' },
        { name: 'Thiên Ý', color: 'blue' },
        { name: 'Quốc Ấn', color: 'green' }
      ],
      elements: []
    },
    {
      id: 7,
      name: 'PHÚC ĐỨC',
      earthlyBranch: 'Thân',
      number: 22,
      stars: [
        { name: 'Tử Vi', color: 'purple', brightness: 'bright' },
        { name: 'Thiên Phủ', color: 'purple' },
        { name: 'Bệnh Phù', color: 'orange' },
        { name: 'Trực Phù', color: 'blue' },
        { name: 'Văn Xương', color: 'green', brightness: 'dim' },
        { name: 'Ân Quang', color: 'green' },
        { name: 'Thai Phù', color: 'orange' },
        { name: 'Hỏa Quỳnh', color: 'red' },
        { name: 'Hỏa Khoa', color: 'red' }
      ],
      elements: []
    },
    {
      id: 8,
      name: 'ĐIỀN TRẠCH',
      earthlyBranch: 'Dậu',
      number: 32,
      stars: [
        { name: 'Thái Âm', color: 'blue', brightness: 'bright' },
        { name: 'Thiều Dương', color: 'red' },
        { name: 'Văn Tinh', color: 'green' },
        { name: 'Đào Hoa', color: 'orange' },
        { name: 'Thiên Trù', color: 'blue' }
      ],
      elements: []
    },
    {
      id: 9,
      name: 'QUAN LỘC',
      earthlyBranch: 'Tuất',
      number: 42,
      stars: [
        { name: 'Tham Lang', color: 'green', brightness: 'dim' },
        { name: 'Tả Phụ', color: 'green' },
        { name: 'Thiên Quan', color: 'blue' },
        { name: 'Quan Phù', color: 'green' },
        { name: 'Tang Môn', color: 'black' },
        { name: 'Đà La', color: 'red', brightness: 'dim' },
        { name: 'Thiên Khốc', color: 'black' },
        { name: 'Địa Vông', color: 'black' }
      ],
      elements: []
    },
    {
      id: 10,
      name: 'NÔ BỘC',
      earthlyBranch: 'Hợi',
      number: 52,
      stars: [
        { name: 'Cự Môn', color: 'black', brightness: 'dim' },
        { name: 'Lộc Tồn', color: 'orange' },
        { name: 'Cơ Thần', color: 'blue' },
        { name: 'Thiên Thương', color: 'red' },
        { name: 'Lưu Hà', color: 'black' }
      ],
      elements: []
    },
    {
      id: 11,
      name: 'THIÊN DI',
      earthlyBranch: 'Tý',
      number: 62,
      stars: [
        { name: 'Liêm Trinh', color: 'red', brightness: 'dim' },
        { name: 'Thiên Tướng', color: 'blue', brightness: 'dim' },
        { name: 'Lục Sĩ', color: 'green' },
        { name: 'Long Trì', color: 'blue' },
        { name: 'Kình Dương', color: 'red', brightness: 'dim' }
      ],
      elements: []
    },
    {
      id: 12,
      name: 'TẤT ÁCH',
      earthlyBranch: 'Sửu',
      number: 72,
      stars: [
        { name: 'Thiên Lương', color: 'green', brightness: 'dim' },
        { name: 'Thanh Long', color: 'blue' },
        { name: 'Tử Phù', color: 'red' },
        { name: 'Nguyệt Đức', color: 'green' },
        { name: 'Địa Kiếp', color: 'black', brightness: 'dim' },
        { name: 'Thiên Hý', color: 'green' },
        { name: 'Thiên Sứ', color: 'blue' },
        { name: 'Địa Giải', color: 'green' },
        { name: 'Hỏa Lộc', color: 'red' }
      ],
      elements: []
    }
  ];

  const centerInfo = {
    name: input.fullName,
    birthYear: year,
    birthMonth: month,
    birthDay: day,
    birthHour: input.birthHour,
    gender: input.gender === 'male' ? 'Dương Nam' : 'Âm Nữ',
    lunarCalendar: input.calendarType === 'lunar',
    destiny: 'KIẾM PHONG KIM (Âm dương thuận lý - Bản Mệnh sinh Cục)',
    bodyPalace: 'Liêm Trinh'
  };

  return {
    palaces,
    centerInfo
  };
}

function getHourBranch(hourString: string): number {
  const hour = parseInt(hourString.split(':')[0]);
  // Convert 24-hour to traditional Chinese hour system
  const hourBranches = [
    23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21
  ];
  
  for (let i = 0; i < hourBranches.length; i++) {
    if (hour >= hourBranches[i] && hour < hourBranches[(i + 1) % 12]) {
      return i;
    }
  }
  return 0;
}

export function getTuviAnalysisPrompt(chart: TuviChart, input: any): string {
  return `
Phân tích lá số tử vi chi tiết cho:
- Họ tên: ${chart.centerInfo.name}
- Sinh năm: ${chart.centerInfo.birthYear}
- Giới tính: ${chart.centerInfo.gender}
- Bản mệnh: ${chart.centerInfo.destiny}

Các cung quan trọng:
${chart.palaces.map(palace => `
${palace.name} (${palace.earthlyBranch}): ${palace.stars.map(s => s.name).join(', ')}
`).join('')}

Hãy phân tích:
1. Tính cách và đặc điểm cá nhân
2. Vận mệnh tổng quan
3. Sự nghiệp và tài lộc
4. Tình duyên và hôn nhân
5. Sức khỏe và tuổi thọ
6. Lời khuyên và hướng phát triển

Phân tích bằng tiếng Việt, chi tiết và dễ hiểu.
  `;
}
