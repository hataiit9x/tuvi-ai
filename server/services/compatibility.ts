/**
 * Compatibility Service
 * Tính toán độ tương hợp giữa hai người dựa trên Tử Vi và Thần Số Học
 */

import { getElementFromYear, getZodiacFromYear, ZODIAC_VIETNAMESE } from "./fortune";
import type { ZodiacAnimal } from "@shared/types";
import { calculateNumerology } from "./numerology";

// Ngũ hành tương sinh tương khắc
const ELEMENT_RELATIONS: Record<string, Record<string, { type: string; score: number }>> = {
  "Kim": {
    "Kim": { type: "Bình hòa", score: 70 },
    "Mộc": { type: "Tương khắc", score: 40 },
    "Thủy": { type: "Tương sinh", score: 90 },
    "Hỏa": { type: "Tương khắc", score: 35 },
    "Thổ": { type: "Tương sinh", score: 85 },
  },
  "Mộc": {
    "Kim": { type: "Tương khắc", score: 40 },
    "Mộc": { type: "Bình hòa", score: 70 },
    "Thủy": { type: "Tương sinh", score: 90 },
    "Hỏa": { type: "Tương sinh", score: 85 },
    "Thổ": { type: "Tương khắc", score: 45 },
  },
  "Thủy": {
    "Kim": { type: "Tương sinh", score: 85 },
    "Mộc": { type: "Tương sinh", score: 90 },
    "Thủy": { type: "Bình hòa", score: 70 },
    "Hỏa": { type: "Tương khắc", score: 30 },
    "Thổ": { type: "Tương khắc", score: 40 },
  },
  "Hỏa": {
    "Kim": { type: "Tương khắc", score: 35 },
    "Mộc": { type: "Tương sinh", score: 85 },
    "Thủy": { type: "Tương khắc", score: 30 },
    "Hỏa": { type: "Bình hòa", score: 70 },
    "Thổ": { type: "Tương sinh", score: 90 },
  },
  "Thổ": {
    "Kim": { type: "Tương sinh", score: 90 },
    "Mộc": { type: "Tương khắc", score: 45 },
    "Thủy": { type: "Tương khắc", score: 40 },
    "Hỏa": { type: "Tương sinh", score: 85 },
    "Thổ": { type: "Bình hòa", score: 70 },
  },
};

// 12 con giáp tương hợp
const ZODIAC_COMPATIBILITY: Record<string, { tam_hop: string[]; luc_hop: string; xung: string; hai: string[] }> = {
  "rat": { tam_hop: ["dragon", "monkey"], luc_hop: "ox", xung: "horse", hai: ["goat"] },
  "ox": { tam_hop: ["snake", "rooster"], luc_hop: "rat", xung: "goat", hai: ["horse"] },
  "tiger": { tam_hop: ["horse", "dog"], luc_hop: "pig", xung: "monkey", hai: ["snake"] },
  "rabbit": { tam_hop: ["goat", "pig"], luc_hop: "dog", xung: "rooster", hai: ["dragon"] },
  "dragon": { tam_hop: ["rat", "monkey"], luc_hop: "rooster", xung: "dog", hai: ["rabbit"] },
  "snake": { tam_hop: ["ox", "rooster"], luc_hop: "monkey", xung: "pig", hai: ["tiger"] },
  "horse": { tam_hop: ["tiger", "dog"], luc_hop: "goat", xung: "rat", hai: ["ox"] },
  "goat": { tam_hop: ["rabbit", "pig"], luc_hop: "horse", xung: "ox", hai: ["rat"] },
  "monkey": { tam_hop: ["rat", "dragon"], luc_hop: "snake", xung: "tiger", hai: ["pig"] },
  "rooster": { tam_hop: ["ox", "snake"], luc_hop: "dragon", xung: "rabbit", hai: ["dog"] },
  "dog": { tam_hop: ["tiger", "horse"], luc_hop: "rabbit", xung: "dragon", hai: ["rooster"] },
  "pig": { tam_hop: ["rabbit", "goat"], luc_hop: "tiger", xung: "snake", hai: ["monkey"] },
};

// Số chủ đạo tương hợp
const LIFE_PATH_COMPATIBILITY: Record<number, Record<number, number>> = {
  1: { 1: 75, 2: 65, 3: 90, 4: 60, 5: 85, 6: 70, 7: 80, 8: 75, 9: 85 },
  2: { 1: 65, 2: 80, 3: 70, 4: 85, 5: 60, 6: 90, 7: 75, 8: 85, 9: 70 },
  3: { 1: 90, 2: 70, 3: 80, 4: 55, 5: 85, 6: 85, 7: 65, 8: 60, 9: 90 },
  4: { 1: 60, 2: 85, 3: 55, 4: 75, 5: 50, 6: 80, 7: 85, 8: 90, 9: 55 },
  5: { 1: 85, 2: 60, 3: 85, 4: 50, 5: 70, 6: 55, 7: 90, 8: 65, 9: 80 },
  6: { 1: 70, 2: 90, 3: 85, 4: 80, 5: 55, 6: 75, 7: 60, 8: 70, 9: 90 },
  7: { 1: 80, 2: 75, 3: 65, 4: 85, 5: 90, 6: 60, 7: 80, 8: 55, 9: 70 },
  8: { 1: 75, 2: 85, 3: 60, 4: 90, 5: 65, 6: 70, 7: 55, 8: 80, 9: 65 },
  9: { 1: 85, 2: 70, 3: 90, 4: 55, 5: 80, 6: 90, 7: 70, 8: 65, 9: 75 },
};

export interface Person {
  fullName: string;
  birthDate: string; // YYYY-MM-DD format
}

export interface CompatibilityResult {
  person1: {
    name: string;
    birthYear: number;
    zodiac: string;
    zodiacVN: string;
    element: string;
    lifePathNumber: number;
  };
  person2: {
    name: string;
    birthYear: number;
    zodiac: string;
    zodiacVN: string;
    element: string;
    lifePathNumber: number;
  };
  elementCompatibility: {
    type: string;
    score: number;
    description: string;
  };
  zodiacCompatibility: {
    type: string;
    score: number;
    description: string;
  };
  numerologyCompatibility: {
    score: number;
    description: string;
  };
  overallScore: number;
  overallDescription: string;
  advice: string[];
}

function getZodiacCompatibilityScore(zodiac1: ZodiacAnimal, zodiac2: ZodiacAnimal): { type: string; score: number; description: string } {
  const compat = ZODIAC_COMPATIBILITY[zodiac1];
  if (!compat) {
    return { type: "Bình thường", score: 60, description: "Mối quan hệ ổn định, cần thêm nỗ lực từ cả hai bên." };
  }

  if (compat.tam_hop.includes(zodiac2)) {
    return {
      type: "Tam Hợp",
      score: 95,
      description: `${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac1]} và ${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac2]} thuộc bộ Tam Hợp - đây là sự kết hợp tuyệt vời, hai người hỗ trợ và bổ sung cho nhau hoàn hảo.`
    };
  }

  if (compat.luc_hop === zodiac2) {
    return {
      type: "Lục Hợp",
      score: 90,
      description: `${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac1]} và ${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac2]} thuộc cặp Lục Hợp - mối quan hệ hài hòa, dễ dàng thấu hiểu và đồng cảm với nhau.`
    };
  }

  if (compat.xung === zodiac2) {
    return {
      type: "Xung",
      score: 35,
      description: `${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac1]} và ${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac2]} tương xung - có thể gặp nhiều mâu thuẫn và bất đồng. Cần kiên nhẫn và bao dung để vượt qua.`
    };
  }

  if (compat.hai.includes(zodiac2)) {
    return {
      type: "Hại",
      score: 45,
      description: `${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac1]} và ${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac2]} có quan hệ tương hại - dễ xảy ra hiểu lầm và tổn thương. Cần giao tiếp cởi mở.`
    };
  }

  return {
    type: "Bình thường",
    score: 65,
    description: `${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac1]} và ${(ZODIAC_VIETNAMESE as Record<string, string>)[zodiac2]} có mối quan hệ trung tính - không đặc biệt thuận lợi hay khó khăn.`
  };
}

function getElementCompatibilityDescription(element1: string, element2: string, type: string): string {
  const e1 = element1.split(" ")[0];
  const e2 = element2.split(" ")[0];
  
  if (type === "Tương sinh") {
    return `Mệnh ${e1} và mệnh ${e2} tương sinh - đây là sự kết hợp rất tốt, hai người hỗ trợ và nuôi dưỡng lẫn nhau.`;
  } else if (type === "Tương khắc") {
    return `Mệnh ${e1} và mệnh ${e2} tương khắc - cần cẩn thận trong giao tiếp và tìm điểm chung để hài hòa.`;
  } else {
    return `Mệnh ${e1} và mệnh ${e2} bình hòa - mối quan hệ ổn định, dễ dàng thấu hiểu nhau.`;
  }
}

function getNumerologyCompatibilityDescription(num1: number, num2: number, score: number): string {
  if (score >= 85) {
    return `Số chủ đạo ${num1} và ${num2} rất hợp nhau - hai người có thể trở thành đối tác hoàn hảo trong cuộc sống.`;
  } else if (score >= 70) {
    return `Số chủ đạo ${num1} và ${num2} khá tương hợp - mối quan hệ có tiềm năng phát triển tốt đẹp.`;
  } else if (score >= 55) {
    return `Số chủ đạo ${num1} và ${num2} ở mức trung bình - cần nỗ lực để hiểu và chấp nhận sự khác biệt.`;
  } else {
    return `Số chủ đạo ${num1} và ${num2} có thể gặp thách thức - nhưng với sự kiên nhẫn, vẫn có thể xây dựng mối quan hệ tốt.`;
  }
}

function getOverallDescription(score: number): string {
  if (score >= 85) {
    return "Tuyệt vời! Hai bạn có độ tương hợp rất cao. Đây là mối quan hệ được trời định, hãy trân trọng và vun đắp.";
  } else if (score >= 70) {
    return "Khá tốt! Hai bạn có nhiều điểm tương đồng và bổ sung cho nhau. Mối quan hệ có tiềm năng phát triển lâu dài.";
  } else if (score >= 55) {
    return "Trung bình. Hai bạn có thể gặp một số thách thức nhưng với sự cố gắng, mối quan hệ vẫn có thể thành công.";
  } else if (score >= 40) {
    return "Cần nỗ lực. Hai bạn có nhiều khác biệt, cần kiên nhẫn và thấu hiểu để vượt qua những khó khăn.";
  } else {
    return "Thách thức lớn. Mối quan hệ có thể gặp nhiều trở ngại, nhưng tình yêu và sự cam kết có thể vượt qua tất cả.";
  }
}

function getAdvice(elementType: string, zodiacType: string, numerologyScore: number): string[] {
  const advice: string[] = [];

  // Advice based on element
  if (elementType === "Tương khắc") {
    advice.push("Hãy tìm những hoạt động chung mà cả hai đều yêu thích để tạo sự gắn kết.");
    advice.push("Tránh tranh cãi về những vấn đề nhỏ nhặt, tập trung vào điều quan trọng.");
  } else if (elementType === "Tương sinh") {
    advice.push("Tận dụng sự hỗ trợ tự nhiên giữa hai người để cùng nhau phát triển.");
  }

  // Advice based on zodiac
  if (zodiacType === "Xung" || zodiacType === "Hại") {
    advice.push("Giao tiếp cởi mở và trung thực là chìa khóa để giải quyết mâu thuẫn.");
    advice.push("Học cách lắng nghe và tôn trọng quan điểm của đối phương.");
  } else if (zodiacType === "Tam Hợp" || zodiacType === "Lục Hợp") {
    advice.push("Hai bạn có sự kết nối tự nhiên, hãy duy trì sự tin tưởng và chia sẻ.");
  }

  // Advice based on numerology
  if (numerologyScore < 60) {
    advice.push("Tìm hiểu về điểm mạnh và điểm yếu của nhau để bổ sung cho nhau tốt hơn.");
  }

  // General advice
  advice.push("Dành thời gian chất lượng bên nhau và tạo những kỷ niệm đẹp.");
  advice.push("Luôn thể hiện sự trân trọng và biết ơn đối với người bạn đời.");

  return advice.slice(0, 5);
}

export function calculateCompatibility(person1: Person, person2: Person): CompatibilityResult {
  // Extract birth years
  const year1 = parseInt(person1.birthDate.split("-")[0]);
  const year2 = parseInt(person2.birthDate.split("-")[0]);

  // Get zodiac and element
  const zodiac1 = getZodiacFromYear(year1) as ZodiacAnimal;
  const zodiac2 = getZodiacFromYear(year2) as ZodiacAnimal;
  const element1 = getElementFromYear(year1);
  const element2 = getElementFromYear(year2);

  // Get life path numbers
  const numerology1 = calculateNumerology({ fullName: person1.fullName, birthDate: person1.birthDate });
  const numerology2 = calculateNumerology({ fullName: person2.fullName, birthDate: person2.birthDate });
  const lifePathNumber1 = numerology1.lifePathNumber;
  const lifePathNumber2 = numerology2.lifePathNumber;

  // Calculate element compatibility
  const e1 = element1.split(" ")[0];
  const e2 = element2.split(" ")[0];
  const elementRelation = ELEMENT_RELATIONS[e1]?.[e2] || { type: "Bình hòa", score: 70 };
  const elementCompatibility = {
    ...elementRelation,
    description: getElementCompatibilityDescription(element1, element2, elementRelation.type),
  };

  // Calculate zodiac compatibility
  const zodiacCompatibility = getZodiacCompatibilityScore(zodiac1, zodiac2);

  // Calculate numerology compatibility
  const lpn1 = lifePathNumber1 > 9 ? (lifePathNumber1 === 11 ? 2 : lifePathNumber1 === 22 ? 4 : 6) : lifePathNumber1;
  const lpn2 = lifePathNumber2 > 9 ? (lifePathNumber2 === 11 ? 2 : lifePathNumber2 === 22 ? 4 : 6) : lifePathNumber2;
  const numerologyScore = LIFE_PATH_COMPATIBILITY[lpn1]?.[lpn2] || 65;
  const numerologyCompatibility = {
    score: numerologyScore,
    description: getNumerologyCompatibilityDescription(lifePathNumber1, lifePathNumber2, numerologyScore),
  };

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    elementCompatibility.score * 0.35 +
    zodiacCompatibility.score * 0.35 +
    numerologyCompatibility.score * 0.30
  );

  return {
    person1: {
      name: person1.fullName,
      birthYear: year1,
      zodiac: zodiac1,
      zodiacVN: (ZODIAC_VIETNAMESE as Record<string, string>)[zodiac1],
      element: element1,
      lifePathNumber: lifePathNumber1,
    },
    person2: {
      name: person2.fullName,
      birthYear: year2,
      zodiac: zodiac2,
      zodiacVN: (ZODIAC_VIETNAMESE as Record<string, string>)[zodiac2],
      element: element2,
      lifePathNumber: lifePathNumber2,
    },
    elementCompatibility,
    zodiacCompatibility,
    numerologyCompatibility,
    overallScore,
    overallDescription: getOverallDescription(overallScore),
    advice: getAdvice(elementCompatibility.type, zodiacCompatibility.type, numerologyCompatibility.score),
  };
}

export function getCompatibilityAnalysisPrompt(result: CompatibilityResult): string {
  return `Bạn là chuyên gia tử vi và thần số học Việt Nam. Hãy phân tích chi tiết độ tương hợp giữa hai người dựa trên thông tin sau:

**Người 1: ${result.person1.name}**
- Năm sinh: ${result.person1.birthYear}
- Con giáp: ${result.person1.zodiacVN}
- Mệnh: ${result.person1.element}
- Số chủ đạo: ${result.person1.lifePathNumber}

**Người 2: ${result.person2.name}**
- Năm sinh: ${result.person2.birthYear}
- Con giáp: ${result.person2.zodiacVN}
- Mệnh: ${result.person2.element}
- Số chủ đạo: ${result.person2.lifePathNumber}

**Kết quả phân tích:**
- Ngũ hành: ${result.elementCompatibility.type} (${result.elementCompatibility.score}/100)
- Con giáp: ${result.zodiacCompatibility.type} (${result.zodiacCompatibility.score}/100)
- Thần số học: ${result.numerologyCompatibility.score}/100
- Điểm tổng hợp: ${result.overallScore}/100

Hãy viết phân tích chi tiết bằng tiếng Việt, bao gồm:
1. Phân tích sự tương hợp về ngũ hành và cách hai mệnh này tương tác
2. Phân tích mối quan hệ giữa hai con giáp
3. Phân tích sự kết hợp của hai số chủ đạo
4. Những điểm mạnh của mối quan hệ này
5. Những thách thức có thể gặp phải
6. Lời khuyên cụ thể cho cả hai trong tình yêu, hôn nhân và cuộc sống

Viết theo phong cách chuyên nghiệp nhưng dễ hiểu, sử dụng markdown để format.`;
}
