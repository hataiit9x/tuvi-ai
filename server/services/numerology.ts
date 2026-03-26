/**
 * Numerology (Thần Số Học) Service
 * Implements Pythagorean numerology system with Vietnamese diacritics support
 */

import type { NumerologyInput, NumerologyResult } from "@shared/types";

// Pythagorean letter-to-number mapping
// Vietnamese letters are mapped to their base Latin equivalents
const LETTER_VALUES: Record<string, number> = {
  a: 1, á: 1, à: 1, ả: 1, ã: 1, ạ: 1,
  ă: 1, ắ: 1, ằ: 1, ẳ: 1, ẵ: 1, ặ: 1,
  â: 1, ấ: 1, ầ: 1, ẩ: 1, ẫ: 1, ậ: 1,
  b: 2,
  c: 3,
  d: 4, đ: 4,
  e: 5, é: 5, è: 5, ẻ: 5, ẽ: 5, ẹ: 5,
  ê: 5, ế: 5, ề: 5, ể: 5, ễ: 5, ệ: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9, í: 9, ì: 9, ỉ: 9, ĩ: 9, ị: 9,
  j: 1,
  k: 2,
  l: 3,
  m: 4,
  n: 5,
  o: 6, ó: 6, ò: 6, ỏ: 6, õ: 6, ọ: 6,
  ô: 6, ố: 6, ồ: 6, ổ: 6, ỗ: 6, ộ: 6,
  ơ: 6, ớ: 6, ờ: 6, ở: 6, ỡ: 6, ợ: 6,
  p: 7,
  q: 8,
  r: 9,
  s: 1,
  t: 2,
  u: 3, ú: 3, ù: 3, ủ: 3, ũ: 3, ụ: 3,
  ư: 3, ứ: 3, ừ: 3, ử: 3, ữ: 3, ự: 3,
  v: 4,
  w: 5,
  x: 6,
  y: 7, ý: 7, ỳ: 7, ỷ: 7, ỹ: 7, ỵ: 7,
  z: 8,
};

// Vietnamese vowels (including diacritics)
const VOWELS = new Set([
  'a', 'á', 'à', 'ả', 'ã', 'ạ',
  'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ',
  'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ',
  'e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ',
  'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ',
  'i', 'í', 'ì', 'ỉ', 'ĩ', 'ị',
  'o', 'ó', 'ò', 'ỏ', 'õ', 'ọ',
  'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ',
  'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ',
  'u', 'ú', 'ù', 'ủ', 'ũ', 'ụ',
  'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự',
  'y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ',
]);

// Master numbers that should not be reduced
const MASTER_NUMBERS = [11, 22, 33];

/**
 * Reduce a number to a single digit or master number
 */
export function reduceToSingleDigit(num: number, keepMasterNumbers = true): number {
  if (keepMasterNumbers && MASTER_NUMBERS.includes(num)) {
    return num;
  }

  while (num > 9 && !(keepMasterNumbers && MASTER_NUMBERS.includes(num))) {
    num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  return num;
}

/**
 * Get numeric value of a letter
 */
function getLetterValue(letter: string): number {
  return LETTER_VALUES[letter.toLowerCase()] || 0;
}

/**
 * Check if a character is a vowel
 */
function isVowel(char: string): boolean {
  return VOWELS.has(char.toLowerCase());
}

/**
 * Calculate Life Path Number from birth date
 * Formula: Reduce each component (day, month, year) then sum and reduce
 */
export function calculateLifePathNumber(birthDate: string): number {
  const [year, month, day] = birthDate.split('-').map(Number);

  // Reduce each component
  const dayReduced = reduceToSingleDigit(day, false);
  const monthReduced = reduceToSingleDigit(month, false);
  const yearReduced = reduceToSingleDigit(year, false);

  // Sum and reduce
  const total = dayReduced + monthReduced + yearReduced;
  return reduceToSingleDigit(total);
}

/**
 * Calculate Soul Number (Số Linh Hồn) from vowels in name
 */
export function calculateSoulNumber(fullName: string): number {
  const vowelSum = fullName
    .toLowerCase()
    .split('')
    .filter(char => isVowel(char))
    .reduce((sum, char) => sum + getLetterValue(char), 0);

  return reduceToSingleDigit(vowelSum);
}

/**
 * Calculate Personality Number (Số Nhân Cách) from consonants in name
 */
export function calculatePersonalityNumber(fullName: string): number {
  const consonantSum = fullName
    .toLowerCase()
    .split('')
    .filter(char => !isVowel(char) && LETTER_VALUES[char])
    .reduce((sum, char) => sum + getLetterValue(char), 0);

  return reduceToSingleDigit(consonantSum);
}

/**
 * Calculate Destiny Number (Số Định Mệnh) from full name
 */
export function calculateDestinyNumber(fullName: string): number {
  const totalSum = fullName
    .toLowerCase()
    .split('')
    .filter(char => LETTER_VALUES[char])
    .reduce((sum, char) => sum + getLetterValue(char), 0);

  return reduceToSingleDigit(totalSum);
}

/**
 * Calculate Birth Day Number
 */
export function calculateBirthDayNumber(birthDate: string): number {
  const day = parseInt(birthDate.split('-')[2]);
  return reduceToSingleDigit(day);
}

/**
 * Generate Birth Chart (Biểu đồ ngày sinh)
 * A 3x3 grid showing the frequency of each number (1-9) in the birth date
 */
export function generateBirthChart(birthDate: string): number[][] {
  const dateDigits = birthDate.replace(/-/g, '').split('').map(Number);

  // Count frequency of each digit
  const frequency: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) {
    frequency[i] = 0;
  }

  dateDigits.forEach(digit => {
    if (digit >= 1 && digit <= 9) {
      frequency[digit]++;
    }
  });

  // Create 3x3 grid (Pythagorean layout)
  // Layout:
  // 3 6 9
  // 2 5 8
  // 1 4 7
  const chart: number[][] = [
    [frequency[3], frequency[6], frequency[9]],
    [frequency[2], frequency[5], frequency[8]],
    [frequency[1], frequency[4], frequency[7]],
  ];

  return chart;
}

/**
 * Find master numbers in the calculation
 */
export function findMasterNumbers(input: NumerologyInput): number[] {
  const masterNumbers: number[] = [];
  const [year, month, day] = input.birthDate.split('-').map(Number);

  // Check if any intermediate sum equals a master number
  const daySum = String(day).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const monthSum = String(month).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const yearSum = String(year).split('').reduce((sum, d) => sum + parseInt(d), 0);

  [daySum, monthSum, yearSum].forEach(sum => {
    if (MASTER_NUMBERS.includes(sum)) {
      masterNumbers.push(sum);
    }
  });

  // Check total
  const total = daySum + monthSum + yearSum;
  if (MASTER_NUMBERS.includes(total)) {
    masterNumbers.push(total);
  }

  return Array.from(new Set(masterNumbers));
}

/**
 * Calculate Personal Year Number
 * Formula: Reduce(Day + Month + CurrentYear)
 */
export function calculatePersonalYear(birthDate: string, year: number, keepMasterNumbers = false): number {
  const [_, month, day] = birthDate.split('-').map(Number);
  const sum = reduceToSingleDigit(day, false) + reduceToSingleDigit(month, false) + reduceToSingleDigit(year, false);
  return reduceToSingleDigit(sum, keepMasterNumbers);
}

/**
 * Calculate Personal Month Number
 * Formula: Reduce(PersonalYear + CurrentMonth)
 */
export function calculatePersonalMonth(birthDate: string, month: number, year: number): number {
  const personalYear = calculatePersonalYear(birthDate, year, false);
  return reduceToSingleDigit(personalYear + month, false);
}

/**
 * Calculate Life Path Cycles (3 Cycles)
 * Cycle 1: Reduced Month
 * Cycle 2: Reduced Day
 * Cycle 3: Reduced Year
 */
export function calculateLifePathCycles(birthDate: string) {
  const [year, month, day] = birthDate.split('-').map(Number);
  return {
    cycle1: reduceToSingleDigit(month, false),
    cycle2: reduceToSingleDigit(day, false),
    cycle3: reduceToSingleDigit(year, false),
  };
}

/**
 * Calculate Pinnacles (4 Peaks) - Vietnamese Base Order: Day, Month, Year
 * 1. Day + Month
 * 2. Month + Year
 * 3. P1 + P2
 * 4. Day + Year
 */
export function calculatePinnacles(birthDate: string): number[] {
  const [year, month, day] = birthDate.split('-').map(Number);
  const m = reduceToSingleDigit(month, false);
  const d = reduceToSingleDigit(day, false);
  const y = reduceToSingleDigit(year, false);

  const p1 = reduceToSingleDigit(m + d, true); // Keep master if they do? Look at tracuuthansohoc: Peak 4 was 11!
  const p2 = reduceToSingleDigit(d + y, true);
  const p3 = reduceToSingleDigit(p1 + p2, true);
  const p4 = reduceToSingleDigit(m + y, true); // Month + Year

  return [p1, p2, p3, p4];
}

/**
 * Calculate Challenges (4 Challenges) - Vietnamese Base Order: Day, Month, Year
 * 1. |Day - Month|
 * 2. |Month - Year|
 * 3. |C1 - C2|
 * 4. |Day - Year|
 */
export function calculateChallenges(birthDate: string): number[] {
  const [year, month, day] = birthDate.split('-').map(Number);
  const m = reduceToSingleDigit(month, false);
  const d = reduceToSingleDigit(day, false);
  const y = reduceToSingleDigit(year, false);

  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);

  return [c1, c2, c3, c4];
}

// ... existing code ...

/**
 * Calculate Personal Year Cycle Forecast (Current Year - 2 to Current Year + 7)
 */
export function calculateCycleForecast(birthDate: string): { year: number; personalYear: number; energyLevel: number; description: string }[] {
  // Updated to show an 11-year window (5 years before, current year, 5 years after) 
  // to match the requested reference chart, and strictly reduce to 1-9 (no master numbers)
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5;
  const forecast = [];

  // Energy map for Pythagorean 9-year cycle visualization (peaks at 1, 9; troughs at 4, 7)
  const ENERGY_MAP: Record<number, number> = {
    1: 7, 2: 5, 3: 3, 4: 1, 5: 3, 6: 5, 7: 3, 8: 6, 9: 9
  };

  for (let i = 0; i < 11; i++) {
    const year = startYear + i;
    // Calculate strictly 1-9
    const personalYear = calculatePersonalYear(birthDate, year, false);
    
    forecast.push({
      year,
      personalYear,
      energyLevel: ENERGY_MAP[personalYear] || 5, // Map 1-9 to the shape Y-coord heights
      description: `Năm cá nhân số ${personalYear}`,
    });
  }

  return forecast;
}

/**
 * Calculate all numerology numbers
 */
export function calculateNumerology(input: NumerologyInput): NumerologyResult {
  return {
    lifePathNumber: calculateLifePathNumber(input.birthDate),
    soulNumber: calculateSoulNumber(input.fullName),
    personalityNumber: calculatePersonalityNumber(input.fullName),
    destinyNumber: calculateDestinyNumber(input.fullName),
    birthDayNumber: calculateBirthDayNumber(input.birthDate),
    birthChart: generateBirthChart(input.birthDate),
    masterNumbers: findMasterNumbers(input),
    lifePathCycles: calculateLifePathCycles(input.birthDate),
    pinnacles: calculatePinnacles(input.birthDate),
    challenges: calculateChallenges(input.birthDate),
    cycleForecast: calculateCycleForecast(input.birthDate),
    personalYear: calculatePersonalYear(input.birthDate, new Date().getFullYear()),
    personalMonth: calculatePersonalMonth(input.birthDate, new Date().getMonth() + 1, new Date().getFullYear()),
  };
}

/**
 * Get interpretation prompt for AI analysis
 */
export function getNumerologyAnalysisPrompt(result: NumerologyResult, input: NumerologyInput): string {
  const chartDisplay = result.birthChart
    .map(row => row.map(n => n || '-').join(' '))
    .join('\n');

  return `Bạn là một chuyên gia Thần Số Học (Numerology) với kiến thức sâu rộng về hệ thống Pythagorean. Hãy phân tích chi tiết các con số sau:

THÔNG TIN NGƯỜI XEM:
- Họ tên: ${input.fullName}
- Ngày sinh: ${input.birthDate}

CÁC CON SỐ TÍNH ĐƯỢC:
- Số Chủ Đạo (Life Path Number): ${result.lifePathNumber}
- Số Linh Hồn (Soul Number): ${result.soulNumber}
- Số Nhân Cách (Personality Number): ${result.personalityNumber}
- Số Định Mệnh (Destiny Number): ${result.destinyNumber}
- Số Ngày Sinh (Birth Day Number): ${result.birthDayNumber}
${result.masterNumbers.length > 0 ? `- Số Chủ (Master Numbers): ${result.masterNumbers.join(', ')}` : ''}

BIỂU ĐỒ NGÀY SINH:
${chartDisplay}
(Hàng trên: 3-6-9, Hàng giữa: 2-5-8, Hàng dưới: 1-4-7)

Hãy phân tích chi tiết với các nội dung:

1. **Số Chủ Đạo (${result.lifePathNumber})**: Ý nghĩa, sứ mệnh cuộc đời, con đường phát triển
2. **Số Linh Hồn (${result.soulNumber})**: Khát khao nội tâm, động lực sâu xa
3. **Số Nhân Cách (${result.personalityNumber})**: Hình ảnh bên ngoài, cách người khác nhìn nhận
4. **Số Định Mệnh (${result.destinyNumber})**: Mục tiêu cuộc đời, tiềm năng cần phát triển
5. **Số Ngày Sinh (${result.birthDayNumber})**: Tài năng bẩm sinh, điểm mạnh tự nhiên
6. **Biểu đồ ngày sinh**: Phân tích các trục (Trí tuệ, Tinh thần, Thể chất), các mũi tên có và thiếu
7. **Tổng hợp**: Mối quan hệ giữa các con số, lời khuyên phát triển bản thân

Viết bằng tiếng Việt, văn phong trang trọng nhưng dễ hiểu. Đưa ra những phân tích sâu sắc và lời khuyên thiết thực cho cuộc sống.`;
}
