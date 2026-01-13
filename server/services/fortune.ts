/**
 * Fortune Services
 * Zodiac forecasts, Auspicious dates, Lunar New Year tools
 */

import type {
  ZodiacAnimal,
  ZodiacForecast,
  AuspiciousPurpose,
  AuspiciousDateInput,
  AuspiciousDate,
  XongDatInput,
  XongDatResult,
  LuckyColorInput,
  LuckyColorResult,
  LuckyMoneyInput,
  LuckyMoneyResult,
} from "@shared/types";

// Zodiac animals in order
const ZODIAC_ORDER: ZodiacAnimal[] = [
  "rat", "ox", "tiger", "rabbit", "dragon", "snake",
  "horse", "goat", "monkey", "rooster", "dog", "pig"
];

// Vietnamese zodiac names
export const ZODIAC_VIETNAMESE: Record<ZodiacAnimal, string> = {
  rat: "Tý (Chuột)",
  ox: "Sửu (Trâu)",
  tiger: "Dần (Hổ)",
  rabbit: "Mão (Mèo)",
  dragon: "Thìn (Rồng)",
  snake: "Tỵ (Rắn)",
  horse: "Ngọ (Ngựa)",
  goat: "Mùi (Dê)",
  monkey: "Thân (Khỉ)",
  rooster: "Dậu (Gà)",
  dog: "Tuất (Chó)",
  pig: "Hợi (Lợn)",
};

// Five Elements mapping by year ending
const YEAR_ELEMENTS: Record<number, string> = {
  0: "Kim", 1: "Kim",
  2: "Thủy", 3: "Thủy",
  4: "Mộc", 5: "Mộc",
  6: "Hỏa", 7: "Hỏa",
  8: "Thổ", 9: "Thổ",
};

// Element colors
const ELEMENT_COLORS: Record<string, { lucky: string[]; avoid: string[] }> = {
  "Kim": { lucky: ["Trắng", "Vàng", "Bạc", "Xám nhạt"], avoid: ["Đỏ", "Hồng", "Cam"] },
  "Mộc": { lucky: ["Xanh lá", "Xanh lục", "Xanh ngọc"], avoid: ["Trắng", "Bạc", "Xám"] },
  "Thủy": { lucky: ["Đen", "Xanh dương", "Xanh navy", "Tím"], avoid: ["Vàng", "Nâu", "Be"] },
  "Hỏa": { lucky: ["Đỏ", "Hồng", "Cam", "Tím"], avoid: ["Đen", "Xanh dương"] },
  "Thổ": { lucky: ["Vàng", "Nâu", "Be", "Cam đất"], avoid: ["Xanh lá", "Xanh lục"] },
};

// Element compatibility (sinh - khắc)
const ELEMENT_SINH: Record<string, string> = {
  "Kim": "Thủy", "Thủy": "Mộc", "Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim"
};

const ELEMENT_KHAC: Record<string, string> = {
  "Kim": "Mộc", "Mộc": "Thổ", "Thổ": "Thủy", "Thủy": "Hỏa", "Hỏa": "Kim"
};

// Zodiac compatibility
const ZODIAC_TAM_HOP: Record<ZodiacAnimal, ZodiacAnimal[]> = {
  rat: ["dragon", "monkey"],
  ox: ["snake", "rooster"],
  tiger: ["horse", "dog"],
  rabbit: ["goat", "pig"],
  dragon: ["rat", "monkey"],
  snake: ["ox", "rooster"],
  horse: ["tiger", "dog"],
  goat: ["rabbit", "pig"],
  monkey: ["rat", "dragon"],
  rooster: ["ox", "snake"],
  dog: ["tiger", "horse"],
  pig: ["rabbit", "goat"],
};

const ZODIAC_XUNG: Record<ZodiacAnimal, ZodiacAnimal> = {
  rat: "horse", ox: "goat", tiger: "monkey", rabbit: "rooster",
  dragon: "dog", snake: "pig", horse: "rat", goat: "ox",
  monkey: "tiger", rooster: "rabbit", dog: "dragon", pig: "snake",
};

/**
 * Get zodiac animal from birth year
 */
export function getZodiacFromYear(year: number): ZodiacAnimal {
  const index = (year - 4) % 12;
  return ZODIAC_ORDER[index];
}

/**
 * Get element from birth year
 */
export function getElementFromYear(year: number): string {
  const lastDigit = year % 10;
  return YEAR_ELEMENTS[lastDigit];
}

/**
 * Get zodiac forecast prompt for AI
 */
export function getZodiacForecastPrompt(animal: ZodiacAnimal, year: number = 2026): string {
  const vietnameseName = ZODIAC_VIETNAMESE[animal];
  const compatible = ZODIAC_TAM_HOP[animal].map(a => ZODIAC_VIETNAMESE[a]).join(", ");
  const clash = ZODIAC_VIETNAMESE[ZODIAC_XUNG[animal]];
  
  return `Bạn là một chuyên gia phong thủy và tử vi với hơn 30 năm kinh nghiệm. Hãy dự báo chi tiết vận mệnh năm ${year} cho người tuổi ${vietnameseName}.

THÔNG TIN:
- Con giáp: ${vietnameseName}
- Năm dự báo: ${year} (Năm Bính Ngọ)
- Tam hợp: ${compatible}
- Xung khắc: ${clash}

Hãy viết dự báo chi tiết bao gồm:

1. **TỔNG QUAN NĂM ${year}**
   - Đánh giá tổng thể vận mệnh
   - Các tháng tốt nhất và cần cẩn thận
   - Sao chiếu mệnh năm nay

2. **DỰ BÁO THEO TỪNG THÁNG** (12 tháng)
   Mỗi tháng cần có:
   - Sự nghiệp: Cơ hội, thách thức
   - Tài chính: Thu nhập, đầu tư
   - Tình duyên: Người độc thân và có gia đình
   - Sức khỏe: Lưu ý và phòng tránh
   - Lời khuyên: Việc nên làm và tránh

3. **LỜI KHUYÊN TỔNG HỢP**
   - Hướng xuất hành tốt
   - Màu sắc may mắn
   - Con số may mắn
   - Quý nhân phù trợ

Viết bằng tiếng Việt, văn phong trang trọng, chi tiết và thiết thực. Mỗi tháng nên có ít nhất 3-4 câu cho mỗi lĩnh vực.`;
}

/**
 * Get auspicious dates for a purpose
 */
export function getAuspiciousDatesPrompt(input: AuspiciousDateInput): string {
  const purposeNames: Record<AuspiciousPurpose, string> = {
    wedding: "Cưới hỏi",
    business_opening: "Khai trương",
    groundbreaking: "Động thổ",
    travel: "Xuất hành",
    moving_house: "Nhập trạch",
    other: "Việc quan trọng",
  };

  const ownerInfo = input.ownerBirthYear 
    ? `\n- Tuổi gia chủ: ${input.ownerBirthYear} (${ZODIAC_VIETNAMESE[getZodiacFromYear(input.ownerBirthYear)]})`
    : "";

  return `Bạn là một chuyên gia phong thủy và lịch vạn niên. Hãy chọn ngày tốt cho việc ${purposeNames[input.purpose]}.

THÔNG TIN:
- Mục đích: ${purposeNames[input.purpose]}
- Khoảng thời gian: Từ ${input.startDate} đến ${input.endDate}${ownerInfo}

Hãy liệt kê các ngày tốt với thông tin:

1. **DANH SÁCH NGÀY TỐT**
   Mỗi ngày cần có:
   - Ngày dương lịch và âm lịch
   - Đánh giá: Đại cát / Trung cát / Tiểu cát
   - Giờ hoàng đạo trong ngày
   - Hướng xuất hành tốt
   - Việc nên làm
   - Việc kiêng kỵ

2. **GIẢI THÍCH**
   - Lý do chọn các ngày này
   - Các yếu tố xem xét (sao tốt, ngày hợp tuổi, etc.)

3. **LƯU Ý CHUNG**
   - Các điều cần chuẩn bị
   - Nghi lễ cần thiết (nếu có)

Viết bằng tiếng Việt, rõ ràng và dễ hiểu. Liệt kê ít nhất 5-10 ngày tốt trong khoảng thời gian yêu cầu.`;
}

/**
 * Calculate Xông Đất recommendations
 */
export function calculateXongDat(input: XongDatInput): XongDatResult {
  const ownerZodiac = getZodiacFromYear(input.ownerBirthYear);
  const ownerElement = getElementFromYear(input.ownerBirthYear);
  
  // Tam hợp zodiacs are suitable
  const suitableZodiacs = [ownerZodiac, ...ZODIAC_TAM_HOP[ownerZodiac]];
  
  // Xung zodiac should be avoided
  const avoidZodiacs = [ZODIAC_XUNG[ownerZodiac]];
  
  // Calculate suitable ages (current year 2026)
  const currentYear = 2026;
  const suitableAges: number[] = [];
  const avoidAges: number[] = [];
  
  suitableZodiacs.forEach(zodiac => {
    for (let year = currentYear - 60; year <= currentYear; year += 12) {
      if (getZodiacFromYear(year) === zodiac) {
        const age = currentYear - year;
        if (age >= 18 && age <= 70) {
          suitableAges.push(age);
        }
      }
    }
  });
  
  avoidZodiacs.forEach(zodiac => {
    for (let year = currentYear - 60; year <= currentYear; year += 12) {
      if (getZodiacFromYear(year) === zodiac) {
        const age = currentYear - year;
        if (age >= 18 && age <= 70) {
          avoidAges.push(age);
        }
      }
    }
  });
  
  return {
    suitableAges: suitableAges.sort((a, b) => a - b),
    suitableZodiacs,
    avoidAges: avoidAges.sort((a, b) => a - b),
    avoidZodiacs,
  };
}

/**
 * Get lucky colors based on birth year element
 */
export function calculateLuckyColors(input: LuckyColorInput): LuckyColorResult {
  const element = getElementFromYear(input.birthYear);
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS["Thổ"];
  
  return {
    element,
    luckyColors: colors.lucky,
    avoidColors: colors.avoid,
  };
}

/**
 * Get lucky money suggestions
 */
export function calculateLuckyMoney(input: LuckyMoneyInput): LuckyMoneyResult {
  const element = getElementFromYear(input.recipientBirthYear);
  
  // Lucky numbers based on element
  const elementLuckyNumbers: Record<string, number[]> = {
    "Kim": [4, 9, 49, 94],
    "Mộc": [3, 8, 38, 83],
    "Thủy": [1, 6, 16, 61],
    "Hỏa": [2, 7, 27, 72],
    "Thổ": [5, 10, 50, 100],
  };
  
  const luckyNumbers = elementLuckyNumbers[element] || [8, 9];
  
  // Suggested amounts (in thousands VND)
  const baseAmounts = [20, 50, 100, 200, 500, 1000, 2000];
  const suggestedAmounts = baseAmounts.map(base => {
    // Find a lucky ending
    const luckyEnding = luckyNumbers[0];
    if (base < 100) {
      return base * 1000 + luckyEnding * 1000;
    }
    return base * 1000;
  });
  
  // Add some specific lucky amounts
  suggestedAmounts.push(88000, 99000, 168000, 888000);
  
  return {
    element,
    suggestedAmounts: suggestedAmounts.sort((a, b) => a - b),
    luckyNumbers,
  };
}

/**
 * Get Xông Đất prompt for AI
 */
export function getXongDatPrompt(input: XongDatInput, result: XongDatResult): string {
  const ownerZodiac = getZodiacFromYear(input.ownerBirthYear);
  const ownerElement = getElementFromYear(input.ownerBirthYear);
  
  return `Bạn là một chuyên gia phong thủy. Hãy tư vấn về việc xông đất đầu năm cho gia chủ.

THÔNG TIN GIA CHỦ:
- Năm sinh: ${input.ownerBirthYear}
- Con giáp: ${ZODIAC_VIETNAMESE[ownerZodiac]}
- Mệnh: ${ownerElement}

KẾT QUẢ TÍNH TOÁN:
- Tuổi hợp xông đất: ${result.suitableAges.join(", ")}
- Con giáp hợp: ${result.suitableZodiacs.map(z => ZODIAC_VIETNAMESE[z]).join(", ")}
- Tuổi nên tránh: ${result.avoidAges.join(", ")}
- Con giáp xung: ${result.avoidZodiacs.map(z => ZODIAC_VIETNAMESE[z]).join(", ")}

Hãy giải thích chi tiết:
1. Tại sao các tuổi này hợp xông đất
2. Giờ tốt để xông đất ngày mùng 1 Tết
3. Nghi lễ xông đất cần chuẩn bị
4. Lời chúc phù hợp khi xông đất
5. Các điều kiêng kỵ

Viết bằng tiếng Việt, văn phong trang trọng và dễ hiểu.`;
}

/**
 * Get Lunar New Year tools prompt for AI
 */
export function getLunarNewYearPrompt(
  luckyColors: LuckyColorResult,
  luckyMoney: LuckyMoneyResult,
  birthYear: number
): string {
  const zodiac = getZodiacFromYear(birthYear);
  
  return `Bạn là một chuyên gia phong thủy. Hãy tư vấn về các công cụ Tết Nguyên Đán 2026.

THÔNG TIN:
- Năm sinh: ${birthYear}
- Con giáp: ${ZODIAC_VIETNAMESE[zodiac]}
- Mệnh: ${luckyColors.element}
- Màu may mắn: ${luckyColors.luckyColors.join(", ")}
- Màu nên tránh: ${luckyColors.avoidColors.join(", ")}
- Số may mắn: ${luckyMoney.luckyNumbers.join(", ")}

Hãy tư vấn chi tiết:

1. **MÀU SẮC MAY MẮN TẾT 2026**
   - Giải thích tại sao các màu này hợp mệnh
   - Cách áp dụng trong trang phục, trang trí nhà cửa
   - Màu sắc cho bao lì xì

2. **GỢI Ý SỐ TIỀN LÌ XÌ**
   - Ý nghĩa các con số may mắn
   - Số tiền phù hợp cho từng đối tượng (trẻ em, người lớn, người già)
   - Cách chọn số tiền đẹp

3. **LỜI KHUYÊN TẾT 2026**
   - Hướng xuất hành đầu năm
   - Ngày giờ tốt để làm các việc quan trọng
   - Các điều kiêng kỵ trong dịp Tết

Viết bằng tiếng Việt, văn phong vui vẻ nhưng trang trọng, phù hợp với không khí Tết.`;
}
