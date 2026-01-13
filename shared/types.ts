/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";


// Tử Vi Types
export interface TuviInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD format
  birthHour: string; // Chi giờ: Tý, Sửu, Dần, etc.
  gender: "male" | "female";
  calendarType: "lunar" | "solar";
}

export interface Palace {
  name: string;
  nameChinese: string;
  position: number;
  mainStars: Star[];
  secondaryStars: Star[];
  element: string;
  daiVan?: number;
}

export interface Star {
  name: string;
  nameChinese: string;
  type: "main" | "secondary" | "auxiliary";
  nature: "good" | "bad" | "neutral";
  brightness?: string; // M, V, Đ, H
  element?: string;
}

export interface TuviChart {
  palaces: Palace[];
  heavenlyStem: string;
  earthlyBranch: string;
  element: string;
  lunarDate: LunarDate;
  majorStarGroup?: {
    name: string;
    description: string;
  };
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

// Numerology Types
export interface NumerologyInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD format
}

export interface NumerologyResult {
  lifePathNumber: number;
  soulNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  birthDayNumber: number;
  birthChart: number[][];
  masterNumbers: number[];
}

// Zodiac Types
export type ZodiacAnimal =
  | "rat" | "ox" | "tiger" | "rabbit"
  | "dragon" | "snake" | "horse" | "goat"
  | "monkey" | "rooster" | "dog" | "pig";

export interface ZodiacForecast {
  animal: ZodiacAnimal;
  year: number;
  overview: string;
  monthly: MonthlyForecast[];
}

export interface MonthlyForecast {
  month: number;
  career: string;
  finance: string;
  romance: string;
  health: string;
  advice: string;
}

// Auspicious Dates Types
export type AuspiciousPurpose =
  | "wedding" | "business_opening" | "groundbreaking"
  | "travel" | "moving_house" | "other";

export interface AuspiciousDateInput {
  purpose: AuspiciousPurpose;
  startDate: string;
  endDate: string;
  ownerBirthYear?: number;
}

export interface AuspiciousDate {
  date: string;
  lunarDate: string;
  quality: "excellent" | "good" | "average";
  auspiciousHours: string[];
  favorableDirections: string[];
  doList: string[];
  avoidList: string[];
}

// Lunar New Year Tools Types
export interface XongDatInput {
  ownerBirthYear: number;
}

export interface XongDatResult {
  suitableAges: number[];
  suitableZodiacs: ZodiacAnimal[];
  avoidAges: number[];
  avoidZodiacs: ZodiacAnimal[];
}

export interface LuckyColorInput {
  birthYear: number;
}

export interface LuckyColorResult {
  element: string;
  luckyColors: string[];
  avoidColors: string[];
}

export interface LuckyMoneyInput {
  recipientBirthYear: number;
}

export interface LuckyMoneyResult {
  element: string;
  suggestedAmounts: number[];
  luckyNumbers: number[];
}

// LLM Settings Types
export interface LLMConfig {
  baseUrl: string;
  model: string;
  apiKey: string;
}

// Vietnamese constants
export const ZODIAC_NAMES: Record<ZodiacAnimal, string> = {
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

export const PALACE_NAMES = [
  { name: "Mệnh", chinese: "命宮", description: "Cung chủ về bản thân, tính cách, vận mệnh" },
  { name: "Phụ Mẫu", chinese: "父母宮", description: "Cung chủ về cha mẹ, tổ tiên" },
  { name: "Phúc Đức", chinese: "福德宮", description: "Cung chủ về phúc đức, tâm linh" },
  { name: "Điền Trạch", chinese: "田宅宮", description: "Cung chủ về nhà cửa, bất động sản" },
  { name: "Quan Lộc", chinese: "官祿宮", description: "Cung chủ về sự nghiệp, công danh" },
  { name: "Nô Bộc", chinese: "奴僕宮", description: "Cung chủ về bạn bè, cấp dưới" },
  { name: "Thiên Di", chinese: "遷移宮", description: "Cung chủ về di chuyển, xuất ngoại" },
  { name: "Tật Ách", chinese: "疾厄宮", description: "Cung chủ về sức khỏe, bệnh tật" },
  { name: "Tài Bạch", chinese: "財帛宮", description: "Cung chủ về tài chính, tiền bạc" },
  { name: "Tử Tức", chinese: "子息宮", description: "Cung chủ về con cái" },
  { name: "Phu Thê", chinese: "夫妻宮", description: "Cung chủ về hôn nhân, vợ chồng" },
  { name: "Huynh Đệ", chinese: "兄弟宮", description: "Cung chủ về anh chị em" },
];

export const BIRTH_HOURS = [
  { value: "ty", label: "Giờ Tý (23:00 - 01:00)", branch: "Tý" },
  { value: "suu", label: "Giờ Sửu (01:00 - 03:00)", branch: "Sửu" },
  { value: "dan", label: "Giờ Dần (03:00 - 05:00)", branch: "Dần" },
  { value: "mao", label: "Giờ Mão (05:00 - 07:00)", branch: "Mão" },
  { value: "thin", label: "Giờ Thìn (07:00 - 09:00)", branch: "Thìn" },
  { value: "ti", label: "Giờ Tỵ (09:00 - 11:00)", branch: "Tỵ" },
  { value: "ngo", label: "Giờ Ngọ (11:00 - 13:00)", branch: "Ngọ" },
  { value: "mui", label: "Giờ Mùi (13:00 - 15:00)", branch: "Mùi" },
  { value: "than", label: "Giờ Thân (15:00 - 17:00)", branch: "Thân" },
  { value: "dau", label: "Giờ Dậu (17:00 - 19:00)", branch: "Dậu" },
  { value: "tuat", label: "Giờ Tuất (19:00 - 21:00)", branch: "Tuất" },
  { value: "hoi", label: "Giờ Hợi (21:00 - 23:00)", branch: "Hợi" },
];

export const FIVE_ELEMENTS = {
  kim: { name: "Kim", color: "#FFD700", luckyColors: ["Trắng", "Vàng", "Bạc"], avoidColors: ["Đỏ", "Hồng"] },
  moc: { name: "Mộc", color: "#228B22", luckyColors: ["Xanh lá", "Xanh dương"], avoidColors: ["Trắng", "Bạc"] },
  thuy: { name: "Thủy", color: "#1E90FF", luckyColors: ["Đen", "Xanh dương", "Xám"], avoidColors: ["Vàng", "Nâu"] },
  hoa: { name: "Hỏa", color: "#FF4500", luckyColors: ["Đỏ", "Hồng", "Cam"], avoidColors: ["Đen", "Xanh dương"] },
  tho: { name: "Thổ", color: "#8B4513", luckyColors: ["Vàng", "Nâu", "Cam"], avoidColors: ["Xanh lá", "Xanh dương"] },
};

export const PURPOSE_NAMES: Record<AuspiciousPurpose, string> = {
  wedding: "Cưới hỏi",
  business_opening: "Khai trương",
  groundbreaking: "Động thổ",
  travel: "Xuất hành",
  moving_house: "Nhập trạch",
  other: "Khác",
};
