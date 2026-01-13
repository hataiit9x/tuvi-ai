import { describe, expect, it } from "vitest";
import {
  solarToLunar,
  getHeavenlyStem,
  getEarthlyBranch,
  getYearElement,
  generateTuviChart,
} from "./tuvi";

describe("Tử Vi Service", () => {
  describe("solarToLunar", () => {
    it("converts solar date to lunar date correctly", () => {
      const result = solarToLunar(1990, 5, 15);
      expect(result).toHaveProperty("year");
      expect(result).toHaveProperty("month");
      expect(result).toHaveProperty("day");
      expect(result.year).toBe(1990);
      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
      expect(result.day).toBeGreaterThanOrEqual(1);
      expect(result.day).toBeLessThanOrEqual(30);
    });

    it("handles leap months", () => {
      const result = solarToLunar(2023, 3, 22);
      expect(result.isLeapMonth).toBeDefined();
    });
  });

  describe("getHeavenlyStem", () => {
    it("returns correct heavenly stem for year", () => {
      // 1984 is Giáp Tý year
      expect(getHeavenlyStem(1984)).toBe("Giáp");
      // 1985 is Ất Sửu year
      expect(getHeavenlyStem(1985)).toBe("Ất");
      // 1990 is Canh Ngọ year
      expect(getHeavenlyStem(1990)).toBe("Canh");
    });

    it("returns valid heavenly stem", () => {
      const stem = getHeavenlyStem(2000);
      const validStems = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
      expect(validStems).toContain(stem);
    });
  });

  describe("getEarthlyBranch", () => {
    it("returns correct earthly branch for year", () => {
      // 1984 is Giáp Tý year
      expect(getEarthlyBranch(1984)).toBe("Tý");
      // 1985 is Ất Sửu year
      expect(getEarthlyBranch(1985)).toBe("Sửu");
      // 1990 is Canh Ngọ year
      expect(getEarthlyBranch(1990)).toBe("Ngọ");
    });

    it("returns valid earthly branch", () => {
      const branch = getEarthlyBranch(2000);
      const validBranches = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
      expect(validBranches).toContain(branch);
    });
  });

  describe("getYearElement", () => {
    it("returns valid element", () => {
      const element = getYearElement(1990);
      const validElements = ["Kim", "Thủy", "Hỏa", "Thổ", "Mộc"];
      expect(validElements).toContain(element);
    });

    it("returns consistent element for same year", () => {
      const element1 = getYearElement(1990);
      const element2 = getYearElement(1990);
      expect(element1).toBe(element2);
    });
  });

  describe("generateTuviChart", () => {
    it("generates a complete chart with 12 palaces", () => {
      const chart = generateTuviChart({
        fullName: "Nguyễn Văn A",
        birthDate: "1990-05-15",
        birthHour: "ngo",
        gender: "male",
        calendarType: "solar",
      });

      expect(chart.palaces).toHaveLength(12);
      expect(chart.heavenlyStem).toBeDefined();
      expect(chart.earthlyBranch).toBeDefined();
      expect(chart.element).toBeDefined();
      expect(chart.lunarDate).toBeDefined();
    });

    it("includes all palace names", () => {
      const chart = generateTuviChart({
        fullName: "Trần Thị B",
        birthDate: "1985-12-25",
        birthHour: "ty",
        gender: "female",
        calendarType: "solar",
      });

      const palaceNames = chart.palaces.map((p) => p.name);
      expect(palaceNames).toContain("Mệnh");
      expect(palaceNames).toContain("Phụ Mẫu");
      expect(palaceNames).toContain("Phúc Đức");
      expect(palaceNames).toContain("Điền Trạch");
      expect(palaceNames).toContain("Quan Lộc");
      expect(palaceNames).toContain("Nô Bộc");
      expect(palaceNames).toContain("Thiên Di");
      expect(palaceNames).toContain("Tật Ách");
      expect(palaceNames).toContain("Tài Bạch");
      expect(palaceNames).toContain("Tử Tức");
      expect(palaceNames).toContain("Phu Thê");
      expect(palaceNames).toContain("Huynh Đệ");
    });

    it("assigns stars to palaces", () => {
      const chart = generateTuviChart({
        fullName: "Lê Văn C",
        birthDate: "2000-01-01",
        birthHour: "dan",
        gender: "male",
        calendarType: "solar",
      });

      // At least some palaces should have stars
      const palacesWithStars = chart.palaces.filter(
        (p) => p.mainStars.length > 0 || p.secondaryStars.length > 0
      );
      expect(palacesWithStars.length).toBeGreaterThan(0);
    });

    it("handles lunar calendar input", () => {
      const chart = generateTuviChart({
        fullName: "Phạm Văn D",
        birthDate: "1990-05-15",
        birthHour: "mao",
        gender: "male",
        calendarType: "lunar",
      });

      expect(chart.lunarDate.year).toBe(1990);
      expect(chart.lunarDate.month).toBe(5);
      expect(chart.lunarDate.day).toBe(15);
    });

    it("handles different genders", () => {
      const maleChart = generateTuviChart({
        fullName: "Nguyễn Văn E",
        birthDate: "1990-05-15",
        birthHour: "ngo",
        gender: "male",
        calendarType: "solar",
      });

      const femaleChart = generateTuviChart({
        fullName: "Nguyễn Thị E",
        birthDate: "1990-05-15",
        birthHour: "ngo",
        gender: "female",
        calendarType: "solar",
      });

      // Both should generate valid charts
      expect(maleChart.palaces).toHaveLength(12);
      expect(femaleChart.palaces).toHaveLength(12);
    });

    it("handles all birth hours", () => {
      const hours = ["ty", "suu", "dan", "mao", "thin", "ti", "ngo", "mui", "than", "dau", "tuat", "hoi"];
      
      hours.forEach(hour => {
        const chart = generateTuviChart({
          fullName: "Test User",
          birthDate: "1990-05-15",
          birthHour: hour,
          gender: "male",
          calendarType: "solar",
        });
        expect(chart.palaces).toHaveLength(12);
      });
    });
  });
});
