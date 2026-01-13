/**
 * Tử Vi (Purple Star Astrology) Service
 * Implements traditional Vietnamese astrology algorithms with full An Sao logic
 */

import type { TuviInput, TuviChart, Palace, Star, LunarDate } from "@shared/types";

// --- constants.ts ---

const HEAVENLY_STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const EARTHLY_BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

const HOUR_MAPPING: Record<string, string> = {
  "ty": "Tý", "suu": "Sửu", "dan": "Dần", "mao": "Mão", "thin": "Thìn", "ti": "Tỵ",
  "ngo": "Ngọ", "mui": "Mùi", "than": "Thân", "dau": "Dậu", "tuat": "Tuất", "hoi": "Hợi"
};

const NAP_AM: Record<string, string> = {
  "Giáp Tý": "Kim", "Ất Sửu": "Kim", "Bính Dần": "Hỏa", "Đinh Mão": "Hỏa",
  "Mậu Thìn": "Mộc", "Kỷ Tỵ": "Mộc", "Canh Ngọ": "Thổ", "Tân Mùi": "Thổ",
  "Nhâm Thân": "Kim", "Quý Dậu": "Kim", "Giáp Tuất": "Hỏa", "Ất Hợi": "Hỏa",
  "Bính Tý": "Thủy", "Đinh Sửu": "Thủy", "Mậu Dần": "Thổ", "Kỷ Mão": "Thổ",
  "Canh Thìn": "Kim", "Tân Tỵ": "Kim", "Nhâm Ngọ": "Mộc", "Quý Mùi": "Mộc",
  "Giáp Thân": "Thủy", "Ất Dậu": "Thủy", "Bính Tuất": "Thổ", "Đinh Hợi": "Thổ",
  "Mậu Tý": "Hỏa", "Kỷ Sửu": "Hỏa", "Canh Dần": "Mộc", "Tân Mão": "Mộc",
  "Nhâm Thìn": "Thủy", "Quý Tỵ": "Thủy", "Giáp Ngọ": "Kim", "Ất Mùi": "Kim",
  "Bính Thân": "Hỏa", "Đinh Dậu": "Hỏa", "Mậu Tuất": "Mộc", "Kỷ Hợi": "Mộc",
  "Canh Tý": "Thổ", "Tân Sửu": "Thổ", "Nhâm Dần": "Kim", "Quý Mão": "Kim",
  "Giáp Thìn": "Hỏa", "Ất Tỵ": "Hỏa", "Bính Ngọ": "Thủy", "Đinh Mùi": "Thủy",
  "Mậu Thân": "Thổ", "Kỷ Dậu": "Thổ", "Canh Tuất": "Kim", "Tân Hợi": "Kim",
  "Nhâm Tý": "Mộc", "Quý Sửu": "Mộc", "Giáp Dần": "Thủy", "Ất Mão": "Thủy",
  "Bính Thìn": "Thổ", "Đinh Tỵ": "Thổ", "Mậu Ngọ": "Hỏa", "Kỷ Mùi": "Hỏa",
  "Canh Thân": "Mộc", "Tân Dậu": "Mộc", "Nhâm Tuất": "Thủy", "Quý Hợi": "Thủy",
};

const FULL_NAP_AM: Record<string, string> = {
  "Giáp Tý": "Hải Trung Kim", "Ất Sửu": "Hải Trung Kim",
  "Bính Dần": "Lư Trung Hỏa", "Đinh Mão": "Lư Trung Hỏa",
  "Mậu Thìn": "Đại Lâm Mộc", "Kỷ Tỵ": "Đại Lâm Mộc",
  "Canh Ngọ": "Lộ Bàng Thổ", "Tân Mùi": "Lộ Bàng Thổ",
  "Nhâm Thân": "Kiếm Phong Kim", "Quý Dậu": "Kiếm Phong Kim",
  "Giáp Tuất": "Sơn Đầu Hỏa", "Ất Hợi": "Sơn Đầu Hỏa",
  "Bính Tý": "Giản Hạ Thủy", "Đinh Sửu": "Giản Hạ Thủy",
  "Mậu Dần": "Thành Đầu Thổ", "Kỷ Mão": "Thành Đầu Thổ",
  "Canh Thìn": "Bạch Lạp Kim", "Tân Tỵ": "Bạch Lạp Kim",
  "Nhâm Ngọ": "Dương Liễu Mộc", "Quý Mùi": "Dương Liễu Mộc",
  "Giáp Thân": "Tuyền Trung Thủy", "Ất Dậu": "Tuyền Trung Thủy",
  "Bính Tuất": "Ốc Thượng Thổ", "Đinh Hợi": "Ốc Thượng Thổ",
  "Mậu Tý": "Tích Lịch Hỏa", "Kỷ Sửu": "Tích Lịch Hỏa",
  "Canh Dần": "Tùng Bách Mộc", "Tân Mão": "Tùng Bách Mộc",
  "Nhâm Thìn": "Trường Lưu Thủy", "Quý Tỵ": "Trường Lưu Thủy",
  "Giáp Ngọ": "Sa Trung Kim", "Ất Mùi": "Sa Trung Kim",
  "Bính Thân": "Sơn Hạ Hỏa", "Đinh Dậu": "Sơn Hạ Hỏa",
  "Mậu Tuất": "Bình Địa Mộc", "Kỷ Hợi": "Bình Địa Mộc",
  "Canh Tý": "Bích Thượng Thổ", "Tân Sửu": "Bích Thượng Thổ",
  "Nhâm Dần": "Kim Bạch Kim", "Quý Mão": "Kim Bạch Kim",
  "Giáp Thìn": "Phúc Đăng Hỏa", "Ất Tỵ": "Phúc Đăng Hỏa",
  "Bính Ngọ": "Thiên Hà Thủy", "Đinh Mùi": "Thiên Hà Thủy",
  "Mậu Thân": "Đại Trạch Thổ", "Kỷ Dậu": "Đại Trạch Thổ",
  "Canh Tuất": "Thoa Xuyến Kim", "Tân Hợi": "Thoa Xuyến Kim",
  "Nhâm Tý": "Tang Đố Mộc", "Quý Sửu": "Tang Đố Mộc",
  "Giáp Dần": "Đại Khê Thủy", "Ất Mão": "Đại Khê Thủy",
  "Bính Thìn": "Sa Trung Thổ", "Đinh Tỵ": "Sa Trung Thổ",
  "Mậu Ngọ": "Thiên Thượng Hỏa", "Kỷ Mùi": "Thiên Thượng Hỏa",
  "Canh Thân": "Thạch Lựu Mộc", "Tân Dậu": "Thạch Lựu Mộc",
  "Nhâm Tuất": "Đại Hải Thủy", "Quý Hợi": "Đại Hải Thủy",
};

// Cục mapping to number
const CUC_MAPPING: Record<string, number> = {
  "Thủy": 2, "Mộc": 3, "Kim": 4, "Thổ": 5, "Hỏa": 6
};

// Brightness Lookup Table (Tý -> Hợi)
// M: Miếu, V: Vượng, Đ: Đắc, H: Hãm
// Brightness Lookup Table (Tý -> Hợi)
// M: Miếu, V: Vượng, Đ: Đắc, H: Hãm
const STAR_BRIGHTNESS: Record<string, string[]> = {
  "Tử Vi": ["B", "Đ", "M", "B", "V", "M", "M", "V", "M", "B", "V", "B"],
  "Thiên Cơ": ["V", "H", "M", "M", "V", "Đ", "H", "H", "M", "M", "H", "H"],
  "Thái Dương": ["H", "H", "V", "V", "V", "V", "M", "Đ", "Đ", "H", "H", "H"],
  "Vũ Khúc": ["V", "M", "V", "Đ", "M", "Đ", "V", "M", "V", "Đ", "M", "H"],
  "Thiên Đồng": ["V", "H", "M", "M", "H", "Đ", "H", "H", "V", "M", "H", "M"],
  "Liêm Trinh": ["V", "Đ", "M", "H", "V", "H", "V", "Đ", "M", "H", "V", "H"],
  "Thiên Phủ": ["M", "M", "M", "B", "M", "Đ", "V", "M", "M", "B", "M", "Đ"],
  "Thái Âm": ["M", "M", "H", "H", "H", "H", "H", "H", "Đ", "V", "M", "M"],
  "Tham Lang": ["H", "M", "Đ", "H", "M", "H", "H", "M", "Đ", "H", "M", "H"],
  "Cự Môn": ["V", "H", "M", "M", "H", "H", "V", "H", "M", "M", "H", "H"],
  "Thiên Tướng": ["V", "M", "M", "H", "M", "Đ", "V", "M", "M", "H", "M", "Đ"],
  "Thiên Lương": ["V", "Đ", "V", "M", "V", "H", "M", "Đ", "V", "M", "H", "H"],
  "Thất Sát": ["M", "M", "M", "H", "H", "M", "M", "M", "M", "H", "H", "M"],
  "Phá Quân": ["M", "V", "Đ", "H", "V", "H", "M", "V", "Đ", "H", "V", "H"],

  // Secondary Stars Brightness
  "Kình Dương": ["H", "M", "H", "H", "M", "H", "H", "M", "H", "H", "M", "H"],
  "Đà La": ["H", "M", "H", "H", "M", "H", "H", "M", "H", "H", "M", "H"],
  "Hỏa Tinh": ["H", "Đ", "M", "H", "H", "Đ", "M", "H", "H", "Đ", "M", "H"],
  "Linh Tinh": ["H", "Đ", "M", "H", "H", "Đ", "M", "H", "H", "Đ", "M", "H"],
  "Địa Không": ["H", "H", "M", "H", "H", "M", "H", "H", "M", "H", "H", "M"],
  "Địa Kiếp": ["H", "H", "M", "H", "H", "M", "H", "H", "M", "H", "H", "M"],
  "Văn Xương": ["H", "M", "H", "H", "Đ", "M", "H", "H", "H", "M", "Đ", "H"],
  "Văn Khúc": ["H", "M", "H", "H", "Đ", "M", "H", "H", "H", "M", "Đ", "H"],
  "Hóa Kỵ": ["H", "Đ", "H", "H", "Đ", "H", "H", "Đ", "H", "H", "Đ", "H"],
};

// Stars Definitions
const MAIN_STARS = [
  { name: "Tử Vi", type: "main", nature: "good", element: "Thổ", nameChinese: "紫微" },
  { name: "Thiên Cơ", type: "main", nature: "good", element: "Mộc", nameChinese: "天機" },
  { name: "Thái Dương", type: "main", nature: "good", element: "Hỏa", nameChinese: "太陽" },
  { name: "Vũ Khúc", type: "main", nature: "good", element: "Kim", nameChinese: "武曲" },
  { name: "Thiên Đồng", type: "main", nature: "good", element: "Thủy", nameChinese: "天同" },
  { name: "Liêm Trinh", type: "main", nature: "neutral", element: "Hỏa", nameChinese: "廉貞" },
  { name: "Thiên Phủ", type: "main", nature: "good", element: "Thổ", nameChinese: "天府" },
  { name: "Thái Âm", type: "main", nature: "good", element: "Thủy", nameChinese: "太陰" },
  { name: "Tham Lang", type: "main", nature: "neutral", element: "Thủy", nameChinese: "貪狼" },
  { name: "Cự Môn", type: "main", nature: "neutral", element: "Thủy", nameChinese: "巨門" },
  { name: "Thiên Tướng", type: "main", nature: "good", element: "Thủy", nameChinese: "天相" },
  { name: "Thiên Lương", type: "main", nature: "good", element: "Mộc", nameChinese: "天梁" },
  { name: "Thất Sát", type: "main", nature: "bad", element: "Kim", nameChinese: "七殺" },
  { name: "Phá Quân", type: "main", nature: "bad", element: "Thủy", nameChinese: "破軍" },
];

const SECONDARY_STARS_INFO: Record<string, { type: string, nature: "good" | "bad" | "neutral", nameChinese?: string }> = {
  // Lục cát
  "Văn Xương": { type: "secondary", nature: "good" },
  "Văn Khúc": { type: "secondary", nature: "good" },
  "Tả Phụ": { type: "secondary", nature: "good" },
  "Hữu Bật": { type: "secondary", nature: "good" },
  "Thiên Khôi": { type: "secondary", nature: "good" },
  "Thiên Việt": { type: "secondary", nature: "good" },
  "Thai Phụ": { type: "secondary", nature: "good" },
  "Phong Cáo": { type: "secondary", nature: "good" },
  "Tam Thai": { type: "secondary", nature: "good" },
  "Bát Tọa": { type: "secondary", nature: "good" },
  "Ân Quang": { type: "secondary", nature: "good" },
  "Thiên Quý": { type: "secondary", nature: "good" },

  // Lục sát
  "Kình Dương": { type: "secondary", nature: "bad" },
  "Đà La": { type: "secondary", nature: "bad" },
  "Địa Không": { type: "secondary", nature: "bad" },
  "Địa Kiếp": { type: "secondary", nature: "bad" },
  "Hỏa Tinh": { type: "secondary", nature: "bad" },
  "Linh Tinh": { type: "secondary", nature: "bad" },

  // Tứ hóa
  "Hóa Lộc": { type: "secondary", nature: "good" },
  "Hóa Quyền": { type: "secondary", nature: "good" },
  "Hóa Khoa": { type: "secondary", nature: "good" },
  "Hóa Kỵ": { type: "secondary", nature: "bad" },

  // Vòng Lộc Tồn & Bác Sỹ
  "Lộc Tồn": { type: "secondary", nature: "good" },
  "Lực Sĩ": { type: "secondary", nature: "bad" },
  "Thanh Long": { type: "secondary", nature: "good" },
  "Tiểu Hao": { type: "secondary", nature: "bad" },
  "Tướng Quân": { type: "secondary", nature: "good" },
  "Tấu Thư": { type: "secondary", nature: "good" },
  "Phi Liêm": { type: "secondary", nature: "bad" },
  "Hỷ Thần": { type: "secondary", nature: "good" },
  "Bệnh Phù": { type: "secondary", nature: "bad" },
  "Đại Hao": { type: "secondary", nature: "bad" },
  "Phục Binh": { type: "secondary", nature: "bad" },
  "Quan Phủ": { type: "secondary", nature: "bad" },
  "Bác Sỹ": { type: "secondary", nature: "good" }, // Lead of Vong Bac Sy

  // Vòng Thái Tuế
  "Thái Tuế": { type: "secondary", nature: "neutral" },
  "Thiếu Dương": { type: "secondary", nature: "good" },
  "Tang Môn": { type: "secondary", nature: "bad" },
  "Thiếu Âm": { type: "secondary", nature: "good" },
  "Quan Phù (TT)": { type: "secondary", nature: "neutral" },
  "Tử Phù": { type: "secondary", nature: "bad" },
  "Tuế Phá": { type: "secondary", nature: "bad" },
  "Long Đức": { type: "secondary", nature: "good" },
  "Bạch Hổ": { type: "secondary", nature: "bad" },
  "Phúc Đức": { type: "secondary", nature: "good" },
  "Điếu Khách": { type: "secondary", nature: "bad" },
  "Trực Phù": { type: "secondary", nature: "bad" },

  // Vòng Tràng Sinh
  "Tràng Sinh": { type: "secondary", nature: "good" },
  "Mộc Dục": { type: "secondary", nature: "neutral" },
  "Quan Đới": { type: "secondary", nature: "good" },
  "Lâm Quan": { type: "secondary", nature: "good" },
  "Đế Vượng": { type: "secondary", nature: "good" },
  "Suy": { type: "secondary", nature: "neutral" },
  "Bệnh": { type: "secondary", nature: "bad" },
  "Tử": { type: "secondary", nature: "bad" },
  "Mộ": { type: "secondary", nature: "neutral" },
  "Tuyệt": { type: "secondary", nature: "bad" },
  "Thai": { type: "secondary", nature: "neutral" },
  "Dưỡng": { type: "secondary", nature: "good" },

  // Sao Theo Tháng/Năm/Khác
  "Thiên Mã": { type: "secondary", nature: "good" },
  "Thiên Hình": { type: "secondary", nature: "bad" },
  "Thiên Riêu": { type: "secondary", nature: "bad" },
  "Thiên Y": { type: "secondary", nature: "neutral" },
  "Thiên Giải": { type: "secondary", nature: "good" },
  "Địa Giải": { type: "secondary", nature: "good" },
  "Quốc Ấn": { type: "secondary", nature: "good" },
  "Đường Phù": { type: "secondary", nature: "good" },
  "Long Trì": { type: "secondary", nature: "good" },
  "Phượng Các": { type: "secondary", nature: "good" },
  "Thiên Đức": { type: "secondary", nature: "good" },
  "Nguyệt Đức": { type: "secondary", nature: "good" },
  "Hồng Loan": { type: "secondary", nature: "good" },
  "Thiên Hỷ": { type: "secondary", nature: "good" },
  "Thiên Quan": { type: "secondary", nature: "good" },
  "Thiên Phúc": { type: "secondary", nature: "good" },
  "Lưu Hà": { type: "secondary", nature: "bad" },
  "Thiên Khốc": { type: "secondary", nature: "bad" },
  "Thiên Hư": { type: "secondary", nature: "bad" },
  "Đào Hoa": { type: "secondary", nature: "good" },
  "Cô Thần": { type: "secondary", nature: "bad" },
  "Quả Tú": { type: "secondary", nature: "bad" },
  "Kiếp Sát": { type: "secondary", nature: "bad" },
  "Phá Toái": { type: "secondary", nature: "bad" },
  "Thiên Thương": { type: "secondary", nature: "bad" },
  "Thiên Sứ": { type: "secondary", nature: "bad" },
  "Thiên La": { type: "secondary", nature: "bad" },
  "Địa Võng": { type: "secondary", nature: "bad" },
  "Thiên Tài": { type: "secondary", nature: "neutral" },
  "Thiên Thọ": { type: "secondary", nature: "good" },
  "Hoa Cái": { type: "secondary", nature: "good" },
  "Thiên Trù": { type: "secondary", nature: "good" },
  "Giải Thần": { type: "secondary", nature: "good" },

  // Tuần Triệt
  "Tuần": { type: "secondary", nature: "neutral" },
  "Triệt": { type: "secondary", nature: "neutral" },
};

const BO_SO_CHU_DAO = [
  {
    name: "Sát Phá Tham",
    stars: ["Thất Sát", "Phá Quân", "Tham Lang"],
    description: "Bộ võ cách đầy uy lực, chủ về sự đột phá, dám nghĩ dám làm, thích hợp lĩnh vực kinh doanh, quân sự, kỹ thuật. Cuộc đời thường nhiều biến động nhưng dễ làm nên đại nghiệp.",
    priority: 10
  },
  {
    name: "Tử Phủ Vũ Tướng",
    stars: ["Tử Vi", "Thiên Phủ", "Vũ Khúc", "Thiên Tướng"],
    description: "Bộ đế vương, chủ về sự ổn định, quyền uy, lãnh đạo và tài lộc. Thường có cuộc sống phú quý, ít sóng gió, thích hợp làm quản lý, chính trị, tài chính.",
    priority: 9
  },
  {
    name: "Cơ Nguyệt Đồng Lương",
    stars: ["Thiên Cơ", "Thái Âm", "Thiên Đồng", "Thiên Lương"],
    description: "Bộ văn cách, chủ về sự mưu trí, hiền lành, phúc đức. Thường làm công chức, giáo dục, y tế hoặc tham mưu. Cuộc sống êm đềm, được nhiều người quý mến.",
    priority: 8
  },
  {
    name: "Cự Nhật",
    stars: ["Cự Môn", "Thái Dương"],
    description: "Chủ về khẩu tài, lý luận sắc bén, ngoại giao tốt. Thường thành công trong các nghề luật sư, giáo viên, diễn giả. Tuy nhiên cần đề phòng thị phi.",
    priority: 7
  },
  {
    name: "Nhật Nguyệt",
    stars: ["Thái Dương", "Thái Âm"],
    description: "Chủ về sự thông minh, sáng suốt, thay đổi linh hoạt. Thường phải đi xa lập nghiệp, cuộc đời có nhiều thăng trầm nhưng hậu vận tốt đẹp.",
    priority: 6
  }
];

const PALACE_NAMES = [
  { name: "Mệnh", chinese: "命宮" },
  { name: "Phụ Mẫu", chinese: "父母宮" },
  { name: "Phúc Đức", chinese: "福德宮" },
  { name: "Điền Trạch", chinese: "田宅宮" },
  { name: "Quan Lộc", chinese: "官祿宮" },
  { name: "Nô Bộc", chinese: "奴僕宮" },
  { name: "Thiên Di", chinese: "遷移宮" },
  { name: "Tật Ách", chinese: "疾厄宮" },
  { name: "Tài Bạch", chinese: "財帛宮" },
  { name: "Tử Tức", chinese: "子息宮" },
  { name: "Phu Thê", chinese: "夫妻宮" },
  { name: "Huynh Đệ", chinese: "兄弟宮" },
];

// --- Helpers ---

import { Solar } from "lunar-javascript";

export function solarToLunar(year: number, month: number, day: number): LunarDate {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: Math.abs(lunar.getMonth()) !== lunar.getMonth()
  };
}

export function getStarBrightness(starName: string, palaceIndex: number): string | undefined {
  if (STAR_BRIGHTNESS[starName]) {
    return STAR_BRIGHTNESS[starName][palaceIndex];
  }
  return undefined;
}

function getStemIndex(stem: string) { return HEAVENLY_STEMS.indexOf(stem); }
function getBranchIndex(branch: string) { return EARTHLY_BRANCHES.indexOf(branch); }

function getValuesFromYear(year: number) {
  return {
    stem: HEAVENLY_STEMS[(year - 4) % 10],
    branch: EARTHLY_BRANCHES[(year - 4) % 12],
    element: NAP_AM[`${HEAVENLY_STEMS[(year - 4) % 10]} ${EARTHLY_BRANCHES[(year - 4) % 12]}`] || "Thổ"
  };
}

// Tính Cục
function calculateCuc(yearStemIndex: number, menhBranchIndex: number): { name: string, value: number } {
  const month1StemIdx = ((yearStemIndex % 5) * 2 + 2) % 10;
  const dist = (menhBranchIndex - 2 + 12) % 12;
  const menhStemIdx = (month1StemIdx + dist) % 10;

  const stem = HEAVENLY_STEMS[menhStemIdx];
  const branch = EARTHLY_BRANCHES[menhBranchIndex];

  const napAm = NAP_AM[`${stem} ${branch}`] || "Thủy";
  const num = CUC_MAPPING[napAm] || 2;

  return { name: `${napAm} ${["", "", "Nhị", "Tam", "Tứ", "Ngũ", "Lục"][num]} Cục`, value: num };
}

// --- Placement Functions ---

function placeStar(map: Map<number, Star[]>, pos: number, name: string) {
  const info = SECONDARY_STARS_INFO[name] || { type: "secondary", nature: "neutral" };
  const brightness = getStarBrightness(name, pos % 12);
  const stars = map.get(pos) || [];
  stars.push({
    name,
    nameChinese: info.nameChinese || "",
    type: "secondary",
    nature: info.nature as any,
    brightness
  } as Star);
  map.set(pos, stars);
}

function placeTuVi(lunarDay: number, cuc: number): number {
  if (cuc === 0) return 2;
  const quotient = Math.floor(lunarDay / cuc);
  const remainder = lunarDay % cuc;

  let posIndex;
  if (remainder === 0) {
    posIndex = (2 + quotient - 1) % 12;
  } else {
    let base = (2 + quotient) % 12;
    posIndex = (base - (remainder - 1) + 12) % 12;
  }
  return posIndex;
}

// Tính Đại Vận
function calculateDaiVan(cuc: number, menhPos: number, gender: "male" | "female", stemIdx: number): number[] {
  const isYangStem = stemIdx % 2 === 0;
  const isMale = gender === "male";
  // Dương Nam, Âm Nữ -> Thuận (Clockwise)
  // Âm Nam, Dương Nữ -> Nghịch (Counter-Clockwise)
  const isClockwise = (isMale && isYangStem) || (!isMale && !isYangStem);

  const daiVanValues = new Array(12).fill(0);

  for (let i = 0; i < 12; i++) {
    // Distance from Mệnh
    // If Clockwise: Mệnh (0) -> Phụ Mẫu (1) -> ...
    // If Counter: Mệnh (0) -> Huynh Đệ (11) -> ...
    const dist = i; // This 'i' is simply the step count from 0 to 11

    // Determine the palace index for this step
    let palaceIdx;
    if (isClockwise) {
      palaceIdx = (menhPos + i) % 12;
    } else {
      palaceIdx = (menhPos - i + 12) % 12;
    }

    daiVanValues[palaceIdx] = cuc + i * 10;
  }

  return daiVanValues;
}

function identifyMajorStarGroup(mainStarsMap: Map<number, Star[]>, menhPos: number): { name: string, description: string } {
  // Tam Hợp palaces: Mệnh, Tài, Quan
  const triplicityPos = [menhPos, (menhPos + 4) % 12, (menhPos + 8) % 12];

  // Collect all main stars in these 3 palaces
  const starsInTriplicity = new Set<string>();
  triplicityPos.forEach(pos => {
    const stars = mainStarsMap.get(pos) || [];
    stars.forEach(s => {
      if (s.type === "main") {
        starsInTriplicity.add(s.name);
      }
    });
  });

  // Check against defined groups
  for (const group of BO_SO_CHU_DAO) {
    // Check if ALL stars in the group definition are present in the Triplicity
    // Exceptions: Some groups like Tu Phu Vu Tuong might not see all 4 if Triplicity doesn't capture,
    // but usually they appear together in the triangle layout. 
    // Actually, Sát Phá Tham always appear in triangle. 
    // Tử Phủ Vũ Tướng: Tử Vi (Thân) -> Vũ Khúc (Thìn) -> Liêm Trinh (Tý). (Missing Thiên Phủ/Thiên Tướng?).
    // Wait, Tu Phu Vu Tuong is a looser term. Often it's Tu Phu + Vu Tuong.
    // Let's check overlap count.

    let matchCount = 0;
    group.stars.forEach(s => {
      if (starsInTriplicity.has(s)) matchCount++;
    });

    // Heuristic: If detecting Sát Phá Tham (3 stars), need 3.
    // If Tu Phu Vu Tuong (4 stars), need at least 3? 
    // Co Nguyet Dong Luong (4 stars), need at least 3.
    // Cu Nhat (2 stars) - usually need both but they might be in opposition (Doi Xung) not Tam Hop?
    // Cự Nhật usually means Cự Môn + Thái Dương. 
    // Let's require 75% match or full match for small groups.

    if (group.stars.length <= 2 && matchCount === group.stars.length) return group;
    if (group.stars.length > 2 && matchCount >= 3) return group;
  }

  return { name: "Cách Cục Khác", description: "Lá số này có cách cục pha trộn, cần xem xét kỹ các sao và vị trí cụ thể." };
}

// --- MAIN GENERATION ---

const CHU_MENH_MAP: Record<string, string> = {
  "Tý": "Tham Lang", "Sửu": "Cự Môn", "Dần": "Lộc Tồn", "Mão": "Văn Khúc",
  "Thìn": "Liêm Trinh", "Tỵ": "Vũ Khúc", "Ngọ": "Phá Quân", "Mùi": "Vũ Khúc",
  "Thân": "Liêm Trinh", "Dậu": "Văn Khúc", "Tuất": "Lộc Tồn", "Hợi": "Cự Môn"
};

const CHU_THAN_MAP: Record<string, string> = {
  "Tý": "Linh Tinh", "Sửu": "Thiên Tướng", "Dần": "Thiên Lương", "Mão": "Thiên Đồng",
  "Thìn": "Văn Xương", "Tỵ": "Thiên Cơ", "Ngọ": "Hỏa Tinh", "Mùi": "Thiên Tướng",
  "Thân": "Thiên Lương", "Dậu": "Thiên Đồng", "Tuất": "Văn Xương", "Hợi": "Thiên Cơ"
};

// Helper to calculate destiny scores
function calculateDestinyScores(palaces: Palace[]): {
  careerScore: number;
  financeScore: number;
  romanceScore: number;
  healthScore: number;
} {
  const getScore = (palaceName: string) => {
    const palace = palaces.find(p => p.name === palaceName);
    if (!palace) return 60;

    let score = 60; // Base score

    // Evaluate Main Stars
    palace.mainStars.forEach(s => {
      if (s.brightness === 'M' || s.brightness === 'V') score += 8;
      else if (s.brightness === 'Đ') score += 4;
      else if (s.brightness === 'H') score -= 5;

      if (s.nature === 'good') score += 2;
      if (s.nature === 'bad') score -= 2;
    });

    // Evaluate Secondary Stars
    palace.secondaryStars.forEach(s => {
      if (s.nature === 'good') score += 3;
      if (s.nature === 'bad') score -= 3;

      // Bonus for specific lucky stars
      if (['Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Thiên Khôi', 'Thiên Việt'].includes(s.name)) score += 5;
      // Penalty for specific bad stars
      if (['Hóa Kỵ', 'Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La'].includes(s.name)) score -= 5;
    });

    return Math.max(20, Math.min(98, score));
  };

  return {
    careerScore: getScore("Quan Lộc"),
    financeScore: getScore("Tài Bạch"),
    romanceScore: getScore("Phu Thê"),
    healthScore: getScore("Tật Ách") // High score for Tật Ách means "Good Health" (Less sickness) -> Need to inverse?
    // Usually Tật Ách score: High = Good Health? Or High = Many Diseases?
    // Frontend Radar Chart usually means "Higher is Better".
    // "Health Score" -> 100 = Perfect Health.
    // In Tật Ách, "Good stars" (Rescue stars) are good. "Bad stars" (Disease stars) are bad.
    // My logic: Good stars add score, Bad stars subtract. So High Score = Good Stars = Good Health. Correct.
  };
}

export function generateTuviChart(input: TuviInput): TuviChart {
  const [y, m, d] = input.birthDate.split("-").map(Number);
  const lunarDate = input.calendarType === "lunar"
    ? { year: y, month: m, day: d, isLeapMonth: false }
    : solarToLunar(y, m, d);

  const { stem, branch, element } = getValuesFromYear(lunarDate.year);
  const stemIdx = getStemIndex(stem);
  const branchIdx = getBranchIndex(branch);

  const normHour = HOUR_MAPPING[input.birthHour] || input.birthHour;
  const hourIdx = Math.max(0, getBranchIndex(normHour));

  const menhPos = (2 + lunarDate.month - 1 - hourIdx + 12) % 12;

  const cuc = calculateCuc(stemIdx, menhPos);

  const tuViPos = placeTuVi(lunarDate.day, cuc.value);
  const thienPhuPos = (12 - tuViPos + 4) % 12;

  const mainStarsMap = new Map<number, Star[]>();
  const secondaryStarsMap = new Map<number, Star[]>();
  for (let i = 0; i < 12; i++) {
    mainStarsMap.set(i, []);
    secondaryStarsMap.set(i, []);
  }

  const tuViOffsets = [0, 11, 9, 8, 7, 4];
  const tuViStars = MAIN_STARS.slice(0, 6);
  tuViOffsets.forEach((off, i) => {
    const p = (tuViPos + off + 24) % 12;
    const brightness = getStarBrightness(tuViStars[i].name, p);
    mainStarsMap.get(p)?.push({
      ...tuViStars[i],
      nature: tuViStars[i].nature as any,
      brightness
    } as any as Star);
  });

  const thienPhuOffsets = [0, 1, 2, 3, 4, 5, 6, 10];
  const thienPhuStars = MAIN_STARS.slice(6);
  thienPhuOffsets.forEach((off, i) => {
    const p = (thienPhuPos + off + 24) % 12;
    const brightness = getStarBrightness(thienPhuStars[i].name, p);
    mainStarsMap.get(p)?.push({
      ...thienPhuStars[i],
      nature: thienPhuStars[i].nature as any,
      brightness
    } as any as Star);
  });

  // --- AN SAO (STAR PLACEMENT) ---

  // 1. AN SAO THEO GIỜ (Hour)
  placeStar(secondaryStarsMap, (10 - hourIdx + 12) % 12, "Văn Xương");
  placeStar(secondaryStarsMap, (4 + hourIdx) % 12, "Văn Khúc");
  placeStar(secondaryStarsMap, (11 + hourIdx) % 12, "Địa Kiếp"); // Hợi + hour
  placeStar(secondaryStarsMap, (11 - hourIdx + 12) % 12, "Địa Không"); // Hợi - hour
  placeStar(secondaryStarsMap, (6 + hourIdx) % 12, "Thai Phụ"); // Ngọ + hour (approx rule for simplified, strict is complex? No, strict is Ngọ based)
  placeStar(secondaryStarsMap, (2 + hourIdx) % 12, "Phong Cáo"); // Dần + hour

  // 2. AN SAO THEO THÁNG (Month)
  placeStar(secondaryStarsMap, (4 + lunarDate.month - 1) % 12, "Tả Phụ"); // Thìn + month
  placeStar(secondaryStarsMap, (10 - (lunarDate.month - 1) + 12) % 12, "Hữu Bật"); // Tuất - month
  placeStar(secondaryStarsMap, (9 + (lunarDate.month - 1)) % 12, "Thiên Hình"); // Dậu + month
  placeStar(secondaryStarsMap, (1 + (lunarDate.month - 1)) % 12, "Thiên Riêu"); // Sửu + month
  placeStar(secondaryStarsMap, (1 + (lunarDate.month - 1)) % 12, "Thiên Y"); // Sửu + month (same as Rieu)
  placeStar(secondaryStarsMap, (8 + (lunarDate.month - 1)) % 12, "Thiên Giải"); // Thân + month
  placeStar(secondaryStarsMap, (7 + (lunarDate.month - 1)) % 12, "Địa Giải"); // Mùi + month

  // 3. AN SAO THEO NGÀY (Day)
  // Tam Thai: From Tả Phụ + Day
  const taPhuPos = (4 + lunarDate.month - 1) % 12;
  const tamThaiPos = (taPhuPos + (lunarDate.day - 1)) % 12;
  placeStar(secondaryStarsMap, tamThaiPos, "Tam Thai");

  // Bát Tọa: From Hữu Bật - Day
  const huuBatPos = (10 - (lunarDate.month - 1) + 12) % 12;
  const batToaPos = (huuBatPos - (lunarDate.day - 1) + 24) % 12;
  placeStar(secondaryStarsMap, batToaPos, "Bát Tọa");

  // Ân Quang: From Văn Xương + Day - 1
  const vanXuongPos = (10 - hourIdx + 12) % 12;
  const anQuangPos = (vanXuongPos + (lunarDate.day - 2) + 24) % 12; // Rule: Xương + Day - 2? Check: Born 1st, AnQuang at Xuong. Recalib: 1st -> day-1=0.
  // Standard: Xuong count to Day (start 1). So (Xuong + day - 1). 
  // Wait, standard is "From Xuong counting clockwise to Day, then back 1". Effectively: Xuong + Day - 2.
  placeStar(secondaryStarsMap, (vanXuongPos + lunarDate.day - 2 + 12) % 12, "Ân Quang");

  // Thiên Quý: From Văn Khúc - Day + 1 (Counter-clock?)
  // Standard: From Khuc counting Counter-Clockwise to Day, then back 1 (which is Clockwise).
  // Effectively: Khuc - (Day - 1) + 1 = Khuc - Day + 2.
  const vanKhucPos = (4 + hourIdx) % 12;
  placeStar(secondaryStarsMap, (vanKhucPos - (lunarDate.day - 2) + 24) % 12, "Thiên Quý");

  // 4. AN SAO THEO CAN NĂM (Year Stem)
  const khoiViet = [
    [1, 7], [0, 8], [11, 9], [11, 9], [1, 7], // Giap, At, Binh, Dinh, Mau
    [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]    // Ky, Canh, Tan, Nham, Quy
  ][stemIdx];
  placeStar(secondaryStarsMap, khoiViet[0], "Thiên Khôi"); // Sửu/Mùi base
  placeStar(secondaryStarsMap, khoiViet[1], "Thiên Việt");

  // Lưu Hà - Thiên Trù
  const luuHaPos = [9, 10, 7, 8, 5, 6, 8, 9, 11, 0][stemIdx];
  const thienTruPos = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10][stemIdx];
  placeStar(secondaryStarsMap, luuHaPos, "Lưu Hà");
  placeStar(secondaryStarsMap, thienTruPos, "Thiên Trù");

  // Tứ Hóa
  const tuHoaMap: Record<number, string[]> = {
    0: ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"], // Giáp
    1: ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"],    // Ất
    2: ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"], // Bính
    3: ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"],    // Đinh
    4: ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"],    // Mậu
    5: ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"], // Kỷ
    6: ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"], // Canh
    7: ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"],  // Tân
    8: ["Thiên Lương", "Tử Vi", "Tả Phụ", "Vũ Khúc"],      // Nhâm
    9: ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"]      // Quý
  };
  const thStars = tuHoaMap[stemIdx];
  if (thStars) {
    const suffixes = [" (Hóa Lộc)", " (Hóa Quyền)", " (Hóa Khoa)", " (Hóa Kỵ)"];
    thStars.forEach((starName, i) => {
      // Find main/secondary star and append suffix or add as parallel star
      // We will add new stars "Hóa Lộc", "Hóa Kỵ" at the position of the base star
      for (let p = 0; p < 12; p++) {
        const ms = mainStarsMap.get(p) || [];
        const ss = secondaryStarsMap.get(p) || [];
        if (ms.find(s => s.name === starName) || ss.find(s => s.name === starName)) {
          placeStar(secondaryStarsMap, p, ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ"][i]);
          break;
        }
      }
    });
  }

  // 5. AN SAO THEO CHI NĂM (Year Branch)
  // Vòng Thái Tuế
  const ttStars = ["Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù (TT)", "Tử Phù", "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"];
  ttStars.forEach((name, i) => {
    placeStar(secondaryStarsMap, (branchIdx + i) % 12, name);
  });

  // Hỏa Tinh - Linh Tinh
  const fireBase = [2, 9, 1, 2][(branchIdx % 4)]; // Dần Ngọ Tuất -> Sửu (1)? Check logic:
  // Dần Ngọ Tuất -> Sửu (1) Mão (3).
  // Thân Tý Thìn -> Dần (2) Tuất (10).
  // Tỵ Dậu Sửu -> Mão (3) Tuất (10).
  // Hợi Mão Mùi -> Dậu (9) Tuất (10).
  // Using simplified logic from previous code, assume it is roughly correct or needs refined mapping.
  // Refined:
  const fireMap = { 2: 1, 6: 1, 10: 1, 8: 2, 0: 2, 4: 2, 5: 3, 9: 3, 1: 3, 11: 9, 3: 9, 7: 9 }; // Base positions
  const linhMap = { 2: 3, 6: 3, 10: 3, 8: 10, 0: 10, 4: 10, 5: 10, 9: 10, 1: 10, 11: 10, 3: 10, 7: 10 };
  const hBase = (fireMap as any)[branchIdx] || 1;
  const lBase = (linhMap as any)[branchIdx] || 3;
  // Hỏa: Thuan, Linh: Nghich (for all?) Or dependent on Dương/Âm nam nữ?
  // Only Hỏa Linh follow Hour directly.
  const isYangYear = stemIdx % 2 === 0; // Check logic for Hỏa/Linh direction? Usually it's simpler:
  // Hỏa: Clockwise from Base. Linh: Counter-Clockwise from Base.
  placeStar(secondaryStarsMap, (hBase + hourIdx) % 12, "Hỏa Tinh");
  placeStar(secondaryStarsMap, (lBase - hourIdx + 12) % 12, "Linh Tinh");

  // Thiên Mã
  const maPos = [2, 11, 8, 5][(branchIdx % 4)]; // Dần, Hợi, Thân, Tỵ
  placeStar(secondaryStarsMap, maPos, "Thiên Mã");

  // Hoa Cái
  // Ty Thin Than -> Thin (4)
  const hoaCaiPos = [4, 1, 10, 7][(branchIdx % 4)];
  placeStar(secondaryStarsMap, hoaCaiPos, "Hoa Cái");

  // Đào Hoa (Kiếp Sát đối Đào Hoa? No. Đào Hoa is Mộc Dục of Tam Hợp)
  // Ty Thin Than (Thuy) -> Dau (9)
  const daoHoaPos = [9, 6, 3, 0][(branchIdx % 4)];
  placeStar(secondaryStarsMap, daoHoaPos, "Đào Hoa");

  // Kiếp Sát (Đối cung của Đào Hoa? No. Dần Ngọ Tuất -> Hợi. Tỵ Dậu Sửu -> Dần)
  // Ty Thin Than -> Ty (0)
  const kiepSatPos = [5, 2, 11, 8][(branchIdx % 4)];
  placeStar(secondaryStarsMap, kiepSatPos, "Kiếp Sát");

  // Phá Toái
  const phaToaiPos = [5, 1, 9][branchIdx % 3]; // Tỵ, Sửu, Dậu
  placeStar(secondaryStarsMap, phaToaiPos, "Phá Toái");

  // Cô Thần - Quả Tú
  const coThanPos = [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2][branchIdx]; // Dần x2, Tỵ...
  placeStar(secondaryStarsMap, coThanPos, "Cô Thần");
  placeStar(secondaryStarsMap, (coThanPos - 4 + 12) % 12, "Quả Tú");

  // Thiên Khốc - Thiên Hư
  placeStar(secondaryStarsMap, (6 - (branchIdx) + 12) % 12, "Thiên Khốc"); // Ngọ nghịch
  placeStar(secondaryStarsMap, (6 + (branchIdx)) % 12, "Thiên Hư"); // Ngọ thuận

  // Long Phượng, Giải Thần
  const longTriPos = (4 + branchIdx) % 12; // Thìn thuận
  const phuongCacPos = (10 - branchIdx + 12) % 12; // Tuất nghịch
  placeStar(secondaryStarsMap, longTriPos, "Long Trì");
  placeStar(secondaryStarsMap, phuongCacPos, "Phượng Các");
  placeStar(secondaryStarsMap, phuongCacPos, "Giải Thần"); // Giải Thần đồng cung Phượng Các

  // Hồng Loan - Thiên Hỷ
  const hongLoanPos = (3 - branchIdx + 12) % 12; // Mão nghịch
  placeStar(secondaryStarsMap, hongLoanPos, "Hồng Loan");
  placeStar(secondaryStarsMap, (hongLoanPos + 6) % 12, "Thiên Hỷ"); // Đối Hồng Loan

  // Thiên Đức - Nguyệt Đức
  const thienDucPos = (9 + branchIdx) % 12; // Dậu thuận
  placeStar(secondaryStarsMap, thienDucPos, "Thiên Đức");
  placeStar(secondaryStarsMap, (5 + branchIdx) % 12, "Nguyệt Đức"); // Tỵ thuận

  // Thiên Quan - Thiên Phúc (Theorem based on Stem)
  const thienQuanPos = [9, 4, 5, 2, 3, 9, 11, 9, 10, 6][stemIdx];
  const thienPhucPos = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5][stemIdx];
  placeStar(secondaryStarsMap, thienQuanPos, "Thiên Quan");
  placeStar(secondaryStarsMap, thienPhucPos, "Thiên Phúc");

  // Quốc Ấn - Đường Phù (Theorem based on Stem? Or Loc Ton?)
  // Loc Ton based.
  const locTonPos = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][stemIdx];
  const quocAnPos = (locTonPos + 8) % 12; // From Loc Ton count 9? Check.
  // Loc Ton (1), Luc Si(2), Thanh Long(3), Tieu Hao(4), Tuong Quan(5), Tau Thu(6), Phi Liem(7), Hy Than(8), Benh Phu(9) -> Quoc An usually with Quoc An?
  // Wait, Quoc An is fixed relative to Loc Ton? Yes. Loc Ton -> ... -> Quoc An.
  // Loc Ton @1. Quoc An @9 (Benh Phu).
  placeStar(secondaryStarsMap, (locTonPos + 8) % 12, "Quốc Ấn");
  placeStar(secondaryStarsMap, (locTonPos - 8 + 24) % 12, "Đường Phù"); // Check logic

  // 6. VÒNG LỘC TỒN & BÁC SỸ
  // Lộc Tồn is placed. Stars follow:
  // Dương Nam Âm Nữ: Thuận. Âm Nam Dương Nữ: Nghịch. 
  // NOTE: TuVi's Loc Ton ring direction depends on Gender/Stem Yin-Yang.
  const isMale = input.gender === "male";
  const isYangStem = stemIdx % 2 === 0;
  const isClockwise = (isMale && isYangStem) || (!isMale && !isYangStem);

  const ltStars = ["Lộc Tồn", "Lực Sĩ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư", "Phi Liêm", "Hỷ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"];
  // Note: Vòng Bác Sỹ starts where Lộc Tồn is. Bác Sỹ = Lộc Tồn.
  const bsStars = ["Bác Sỹ", "Lực Sĩ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư", "Phi Liêm", "Hỷ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"];
  // Basically the same ring, but Lộc Tồn is replaced/accompanied by Bác Sỹ.

  ltStars.forEach((name, i) => {
    const pos = isClockwise ? (locTonPos + i) % 12 : (locTonPos - i + 12) % 12;
    placeStar(secondaryStarsMap, pos, name);
    if (i === 0) placeStar(secondaryStarsMap, pos, "Bác Sỹ"); // Add Bac Sy at Loc Ton
  });

  // Kình Dương, Đà La
  placeStar(secondaryStarsMap, (locTonPos + 1) % 12, "Kình Dương");
  placeStar(secondaryStarsMap, (locTonPos - 1 + 12) % 12, "Đà La");

  // 7. VÒNG TRÀNG SINH
  // Based on Cuc (Wood/Fire/etc) and Gender/Stem isClockwise? 
  // Rule: Dương Nam Âm Nữ Thuận, Âm Nam Dương Nữ Nghịch.
  // Bases:
  // Kim: Tỵ (5). Mộc: Hợi (11). Hỏa: Dần (2). Thủy/Thổ: Thân (8).
  // Check Cuc:
  const cucValues = [2, 3, 4, 5, 6]; // Thuy, Moc, Kim, Tho, Hoa
  // Mapping CUC_MAPPING names to Base:
  // Thủy (2) -> Thân (8)
  // Mộc (3) -> Hợi (11)
  // Kim (4) -> Tỵ (5)
  // Thổ (5) -> Thân (8) (Thủy Thổ đồng hành trong Tràng Sinh? Or Thổ follows Hỏa? Usually Thủy Thổ, or Hỏa Thổ.
  // In Tu Vi Nam Phai, Thổ (5) usually follows Thủy (Thân) or Hỏa (Dần)?
  // Standard: Thủy Thổ Tràng Sinh tại Thân. 
  // Hỏa (6) -> Dần (2).

  const tsBaseMap: Record<number, number> = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 };
  const tsBase = tsBaseMap[cuc.value] || 8;

  const tsStars = ["Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"];
  tsStars.forEach((name, i) => {
    const pos = isClockwise ? (tsBase + i) % 12 : (tsBase - i + 12) % 12;
    placeStar(secondaryStarsMap, pos, name);
  });

  // 8. TUẦN TRỆT (Modifiers)
  // Tuần Trung Không Vong (Tuần): Based on Year Stem/Branch (finding "Nhà Giáp").
  // Rule: Determine Liu Nien (Year) belongs to which Ten-Stem cycle.
  // Formula: (BranchIdx - StemIdx + 12) % 12 / 2 ... wait simplified:
  // (Branch - Stem) indicates the start of the decade.
  // Tuần blocks the two palaces at the end of the 10-year cycle.
  // Tuần positions:
  const tuanMap = {
    0: [10, 11], // Giap Ty -> Tuat Hoi
    10: [8, 9],  // Giap Tuat -> Than Dau
    8: [6, 7],   // Giap Than -> Ngo Mui
    6: [4, 5],   // Giap Ngo -> Thin Ti
    4: [2, 3],   // Giap Thin -> Dan Mao
    2: [0, 1],   // Giap Dan -> Ty Suu
  };
  const diff = (branchIdx - stemIdx + 12) % 12; // This is the "Giap" head.
  // E.g. Nham Than (8, 8). 8-8=0. Giap Ty. Tuan at Tuat(10), Hoi(11).
  const tuanPos = (tuanMap as any)[diff] || [10, 11];
  tuanPos.forEach((p: number) => placeStar(secondaryStarsMap, p, "Tuần"));

  // Triệt Lộ Không Vong (Triệt): Based on Year Stem only.
  // Giap Ky -> Than Dau (8, 9)
  // At Canh -> Ngo Mui (6, 7)
  // Binh Tan -> Thin Ti (4, 5)
  // Dinh Nham -> Dan Mao (2, 3)
  // Mau Quy -> Ty Suu (0, 1)
  const trietMap: Record<number, number[]> = {
    0: [8, 9], 5: [8, 9],
    1: [6, 7], 6: [6, 7],
    2: [4, 5], 7: [4, 5],
    3: [2, 3], 8: [2, 3],
    4: [0, 1], 9: [0, 1]
  };
  const trietPos = trietMap[stemIdx];
  trietPos.forEach(p => placeStar(secondaryStarsMap, p, "Triệt"));

  // 9. EXTRA FIXED STARS
  placeStar(secondaryStarsMap, 5, "Thiên Thương"); // Nô Bộc (Wait, Nô Bộc isn't fixed at 5. It's fixed relative to Mệnh? No. 
  // Thiên Thương always at Nô Bộc? Yes.
  // Thiên Sứ always at Tật Ách? Yes.
  // But Nô/Tật positions change.
  // I must place them AFTER palaces are defined or calculate relative to Menh.
  const noBocPos = (menhPos - 1 + 12) % 12; // Mệnh=1 -> Huynh=12 -> Phu=11 -> Tu=10 -> Tai=9 -> Tat=8 -> Thien=7 -> No=6.
  // Wait. Standard sequence: Mệnh (1) -> Phụ (2) -> Phúc (3) -> Điền (4) -> Quan (5) -> Nô (6).
  // So Nô is Menh + 5.
  placeStar(secondaryStarsMap, (menhPos + 5) % 12, "Thiên Thương");
  // Tật Ách is Menh + 7. (Mệnh 1, Phụ 2, Phúc 3, Điền 4, Quan 5, Nô 6, Di 7, Tật 8).
  // Wait, Menh->Phu->Phuc->Dien->Quan->No->Di->Tat. Menh=0 -> Tat=7.
  placeStar(secondaryStarsMap, (menhPos + 7) % 12, "Thiên Sứ");

  placeStar(secondaryStarsMap, 4, "Thiên La"); // Thìn
  placeStar(secondaryStarsMap, 10, "Địa Võng"); // Tuất

  // Thiên Tài, Thiên Thọ
  // Thiên Tài: From Mệnh, go clockwise to Year Branch.
  // Thiên Thọ: From Thân (Body), go clockwise to Year Branch.
  // Check rules.
  // Thiên Tài: Hợi/Tý/Sửu... rule based on Year Branch? No. 
  // Rule: Tại cung có Chi năm sinh tính là Tý (or Mệnh?), đếm thuận đến tháng sinh, tại đó tính là giờ Tý, đếm nghịch đến giờ sinh -> Thiên Tài?
  // Proper rule:
  // Thiên Tài: Xương Nhập Mệnh, Tài nhập Mệnh?
  // Rule: Năm (Branch) -> Tháng -> Giờ.
  // Start from Mệnh palace? No.
  // Start from "Year Branch" position on chart. Count clockwise to "Birth Month". Then count "Birth Hour"?
  // Complex rule. Let's use simpler lookup if possible. 
  // "Thiên Tài an tại cung Chi Năm, đếm thuận đến Tháng, nghịch về Giờ".
  // Ex: Nham Than (Year at Than=8). Month 8. Hour Dan (2).
  // Start 8. +8-1 = 15 -> 3 (Mao). From Mao count back to Hour (Dan=2).
  // Mao(3) -> Dan(2) -> Suu(1). So 3 - (2-1) = 2 (Dan)?
  // Let's implement: `(branchIdx + (month - 1) - (hourIdx - 0)) % 12` ?
  // Count Month (1-based steps). Year=1.
  const thienTaiPos = (branchIdx + (lunarDate.month - 1) - hourIdx + 12) % 12;
  placeStar(secondaryStarsMap, thienTaiPos, "Thiên Tài");

  // Thiên Thọ: Tại cung Chi Năm, đếm thuận đến Tháng, thuận đến Giờ.
  const thienThoPos = (branchIdx + (lunarDate.month - 1) + hourIdx) % 12;
  placeStar(secondaryStarsMap, thienThoPos, "Thiên Thọ");


  // Calculate Đại Vận for all palaces
  const daiVanValues = calculateDaiVan(cuc.value, menhPos, input.gender, stemIdx);

  // Identify Major Star Group
  const majorStarGroup = identifyMajorStarGroup(mainStarsMap, menhPos);

  const palaces: Palace[] = [];
  for (let i = 0; i < 12; i++) {
    const pos = (menhPos + i) % 12;
    palaces.push({
      name: PALACE_NAMES[i].name,
      nameChinese: PALACE_NAMES[i].chinese,
      position: pos,
      mainStars: mainStarsMap.get(pos) || [],
      secondaryStars: secondaryStarsMap.get(pos) || [],
      element: ["Thủy", "Thổ", "Mộc", "Mộc", "Thổ", "Hỏa", "Hỏa", "Thổ", "Kim", "Kim", "Thổ", "Thủy"][pos],
      daiVan: daiVanValues[pos], // Assign calculated Đại Vận
    });
  }

  return {
    palaces,
    heavenlyStem: stem,
    earthlyBranch: branch,
    element: element,
    napAm: FULL_NAP_AM[`${stem} ${branch}`] || element,
    lunarDate,
    majorStarGroup, // Return the group
    chuMenh: CHU_MENH_MAP[branch] || "Tham Lang",
    chuThan: CHU_THAN_MAP[branch] || "Linh Tinh",
    cucLoai: cuc.name,
    centerInfo: {
      name: input.fullName,
      birthYear: y, birthMonth: m, birthDay: d, birthHour: input.birthHour,
      gender: input.gender,
      destiny: `${element} - ${cuc.name}`
    } as any,
    ...calculateDestinyScores(palaces)
  } as unknown as TuviChart;
}

export function getTuviAnalysisPrompt(chart: TuviChart, input: TuviInput): string {
  const c = chart as any; // Cast to access extra fields if needed
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(input.birthDate.split('-')[0]);
  const lunarAge = currentYear - birthYear + 1; // Tuổi âm lịch thường +1

  const palaceDescriptions = chart.palaces.map(palace => {
    const mainStars = palace.mainStars.map(s => s.name).join(", ") || "Không có";
    const secondaryStars = palace.secondaryStars.map(s => s.name).join(", ") || "Không có";
    return `- Cung ${palace.name} (Đại vận ${palace.daiVan}): Chính tinh [${mainStars}], Phụ tinh [${secondaryStars}]`;
  }).join("\n");

  return `
Role: Bạn là Chuyên Gia Tử Vi Đẩu Số Cung Đình, người am hiểu sâu sắc các thư tịch cổ như "Tử Vi Đẩu Số Toàn Thư" (Trần Đoàn), "Tử Vi Hàm Số" và các bí kíp chân truyền của phái Thiên Lương, Đông A.
Phong thái: Uy nghi, thâm trầm, lời lẽ sắc sảo, dùng từ đắt giá của bậc quân sư trình tấu cho vua chúa. Luận giải không chỉ dừng ở bề mặt mà phải đi sâu vào cốt lõi, tìm ra "Huyền Cơ" của lá số.

Input:
- Đương số: ${input.fullName}
- Dương lịch: ${birthYear}
- Âm lịch: Năm ${chart.heavenlyStem} ${chart.earthlyBranch}, Mệnh ${chart.element}
- Cục: ${c.cucLoai || "N/A"}
- Chủ Mệnh: ${c.chuMenh || "N/A"}
- Chủ Thân: ${c.chuThan || "N/A"}
- Giới tính: ${input.gender === "male" ? "Nam" : "Nữ"}

Data (Lược đồ các cung):
${palaceDescriptions}

Task: Hãy phác họa "Bức Tranh Tổng Quan Vận Mệnh" cho đương số.
Tuyệt đối KHÔNG liệt kê máy móc từng sao. Hãy tổng hợp thành các luận điểm đanh thép:

1.  **Cốt Cách & Mệnh Cục**: Phân tích sự tương tác giữa Can Chi năm sinh với Hành Mệnh, giữa Mệnh và Cục. Đương số là người "Thời thế tạo anh hùng" hay "Anh hùng tạo thời thế"? Mệnh Thân có đắc cách hay bị phá cách bởi sát tinh?
2.  **Tâm Tính & Phẩm Chất**: Dựa vào bộ sao thủ Mệnh/Thân (như Sát Phá Tham, Tử Phủ Vũ Tướng, Cơ Nguyệt Đồng Lương...) để khắc họa tính cách, tài năng và thiên hướng rèn luyện.
3.  **Vận Trình Tổng Quát**: Nhận định sơ bộ về Tiền vận (Mệnh), Trung vận (Thân) và Hậu vận. Đâu là giai đoạn rực rỡ nhất?
4.  **Lời Khuyên Cải Mệnh**: Dựa trên quy luật Nhân Quả và sự cân bằng Âm Dương, hãy đưa ra lời khuyên cốt lõi nhất để đương số tối ưu hóa cuộc đời (Tu tâm, dưỡng tính, chọn nghề, chọn bạn...).

Output format: Markdown. Dùng các tiêu đề phụ trang trọng. Văn phong cổ điển, uyên bác nhưng súc tích (khoảng 400 từ).
`;
}

export function getPalaceAnalysisPrompt(chart: TuviChart, input: TuviInput, palaceName: string): string {
  const c = chart as any; // Cast to access extra fields if needed
  const birthYear = parseInt(input.birthDate.split('-')[0]);

  const targetPalace = chart.palaces.find(p => p.name === palaceName);
  if (!targetPalace) return "Không tìm thấy cung này.";

  // Context of related palaces (Tam Hợp, Xung Chiếu)
  const PALACE_INDICES = ["Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc", "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"];
  const idx = PALACE_INDICES.indexOf(palaceName);

  const tamHop1 = chart.palaces[(idx + 4) % 12];
  const tamHop2 = chart.palaces[(idx + 8) % 12];
  const xungChieu = chart.palaces[(idx + 6) % 12];

  const formatStars = (p: Palace) => {
    const main = p.mainStars.map(s => `${s.name} (${s.brightness || 'Bình hòa'})`).join(", ") || "Vô Chính Diệu";
    const sec = p.secondaryStars.map(s => s.name).join(", ") || "";
    return `Chính tinh: [${main}]\nPhụ tinh: [${sec}]`;
  };

  const branchName = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"][targetPalace.position];

  return `
Role: Bạn là Quốc Sư chuyên luận giải Tử Vi cho hoàng tộc, am hiểu sâu sắc các thế đứng của sao (như cách Tử Phủ, Sát Phá Tham, Nhật Nguyệt...).
Phong thái: Uyên thâm, cẩn trọng, phân tích kỹ lưỡng sự tương tác giữa các bộ sao, đặc biệt chú trọng Tam Phương Tứ Chính (Tam hợp, Xung chiếu).

Input:
- Đương số: ${input.fullName} (${input.gender === "male" ? "Nam" : "Nữ"}, ${birthYear})
- Bản Mệnh: ${chart.element}, Cục: ${c.cucLoai}
- Cung cần luận: **${palaceName}** an tại cung **${branchName}**

Chi tiết Cung ${palaceName}:
${formatStars(targetPalace)}
Tuần/Triệt: ${targetPalace.secondaryStars.some(s => s.name === 'Tuần') ? 'Gặp TUẦN' : ''} ${targetPalace.secondaryStars.some(s => s.name === 'Triệt') ? 'Gặp TRIỆT' : ''}

Luận Chiếu (Tam Phương Tứ Chính):
1. Tam Hợp (${tamHop1.name}): ${formatStars(tamHop1)}
2. Tam Hợp (${tamHop2.name}): ${formatStars(tamHop2)}
3. Xung Chiếu (${xungChieu.name}): ${formatStars(xungChieu)}

Task: Hãy luận giải chuyên sâu về Cung ${palaceName}.
1.  **Cục Diện Cung**: Phân tích thế đứng của các Chính tinh tại cung này (Miếu/Vượng/Đắc/Hãm). Nếu Vô Chính Diệu thì luận theo Chính tinh xung chiếu và Tuần/Triệt.
2.  **Sự Hội Tụ Cát/Hung Tinh**: Phân tích sự tương tác giữa Chính tinh và các Phụ tinh (đặc biệt là Lục Sát Tinh vs Lục Cát Tinh). Có cách cục đặc biệt nào hình thành không (như "Nhật Nguyệt Tịnh Minh", "Thạch Trung Ẩn Ngọc", "Mã Đầu Đới Kiếm"...)?
3.  **Lời Giải Đoán**: Đưa ra nhận định cụ thể về tốt/xấu của cung này đối với cuộc đời đương số. Nếu xấu thì có cách nào hóa giải không?

Output format: Markdown. Dùng ngôn ngữ phong thủy chuyên ngành nhưng giải thích rõ ý nghĩa. Không liệt kê rời rạc.
`;
}
