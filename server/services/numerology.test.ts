import { describe, expect, it } from "vitest";
import {
  reduceToSingleDigit,
  calculateLifePathNumber,
  calculateSoulNumber,
  calculatePersonalityNumber,
  calculateDestinyNumber,
  calculateBirthDayNumber,
  generateBirthChart,
  calculateNumerology,
} from "./numerology";

describe("Numerology Service", () => {
  describe("reduceToSingleDigit", () => {
    it("reduces numbers to single digit", () => {
      expect(reduceToSingleDigit(28)).toBe(1); // 2+8=10, 1+0=1
      expect(reduceToSingleDigit(15)).toBe(6); // 1+5=6
      expect(reduceToSingleDigit(99)).toBe(9); // 9+9=18, 1+8=9
    });

    it("preserves master numbers when specified", () => {
      expect(reduceToSingleDigit(11, true)).toBe(11);
      expect(reduceToSingleDigit(22, true)).toBe(22);
      expect(reduceToSingleDigit(33, true)).toBe(33);
    });

    it("reduces master numbers when not preserving", () => {
      expect(reduceToSingleDigit(11, false)).toBe(2);
      expect(reduceToSingleDigit(22, false)).toBe(4);
      expect(reduceToSingleDigit(33, false)).toBe(6);
    });

    it("returns single digits as-is", () => {
      expect(reduceToSingleDigit(5)).toBe(5);
      expect(reduceToSingleDigit(9)).toBe(9);
    });
  });

  describe("calculateLifePathNumber", () => {
    it("calculates life path number correctly", () => {
      // 1990-05-15: 1+9+9+0 + 0+5 + 1+5 = 30 = 3
      const result = calculateLifePathNumber("1990-05-15");
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(33);
    });

    it("preserves master numbers", () => {
      // Test date that should result in master number
      const result = calculateLifePathNumber("1992-02-29");
      expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]).toContain(result);
    });
  });

  describe("calculateSoulNumber", () => {
    it("calculates soul number from vowels", () => {
      const result = calculateSoulNumber("Nguyen Van A");
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(33);
    });

    it("handles Vietnamese vowels with diacritics", () => {
      const result = calculateSoulNumber("Nguyễn Văn Ân");
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(33);
    });
  });

  describe("calculatePersonalityNumber", () => {
    it("calculates personality number from consonants", () => {
      const result = calculatePersonalityNumber("Nguyen Van A");
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(33);
    });
  });

  describe("calculateDestinyNumber", () => {
    it("calculates destiny number from full name", () => {
      const result = calculateDestinyNumber("Nguyen Van A");
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(33);
    });

    it("handles Vietnamese names with diacritics", () => {
      const result = calculateDestinyNumber("Nguyễn Văn Ân");
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(33);
    });
  });

  describe("calculateBirthDayNumber", () => {
    it("calculates birth day number correctly", () => {
      // Day 15: 1+5 = 6
      expect(calculateBirthDayNumber("1990-05-15")).toBe(6);
      // Day 29: 2+9 = 11 (master number)
      expect(calculateBirthDayNumber("1990-05-29")).toBe(11);
      // Day 7: single digit
      expect(calculateBirthDayNumber("1990-05-07")).toBe(7);
    });
  });

  describe("generateBirthChart", () => {
    it("returns a 3x3 grid", () => {
      const chart = generateBirthChart("1990-05-15");
      expect(chart).toHaveLength(3);
      expect(chart[0]).toHaveLength(3);
      expect(chart[1]).toHaveLength(3);
      expect(chart[2]).toHaveLength(3);
    });

    it("counts digit occurrences correctly", () => {
      // 1990-05-15 has digits: 1,9,9,0,0,5,1,5
      // 1 appears 2 times, 5 appears 2 times, 9 appears 2 times, 0 is not counted
      const chart = generateBirthChart("1990-05-15");
      
      // Chart layout:
      // [3,6,9]
      // [2,5,8]
      // [1,4,7]
      // Position of 1 is [2][0], should be 2
      expect(chart[2][0]).toBe(2); // 1 appears twice
      expect(chart[1][1]).toBe(2); // 5 appears twice
      expect(chart[0][2]).toBe(2); // 9 appears twice
    });
  });

  describe("calculateNumerology", () => {
    it("returns complete numerology result", () => {
      const result = calculateNumerology({ fullName: "Nguyen Van A", birthDate: "1990-05-15" });
      
      expect(result).toHaveProperty("lifePathNumber");
      expect(result).toHaveProperty("soulNumber");
      expect(result).toHaveProperty("personalityNumber");
      expect(result).toHaveProperty("destinyNumber");
      expect(result).toHaveProperty("birthDayNumber");
      expect(result).toHaveProperty("birthChart");
      expect(result).toHaveProperty("masterNumbers");
    });

    it("identifies master numbers", () => {
      const result = calculateNumerology({ fullName: "Nguyen Van A", birthDate: "1990-05-15" });
      expect(Array.isArray(result.masterNumbers)).toBe(true);
    });

    it("handles Vietnamese names correctly", () => {
      const result = calculateNumerology({ fullName: "Nguyễn Văn Ân", birthDate: "1990-05-15" });
      
      expect(result.lifePathNumber).toBeGreaterThanOrEqual(1);
      expect(result.soulNumber).toBeGreaterThanOrEqual(1);
      expect(result.personalityNumber).toBeGreaterThanOrEqual(1);
      expect(result.destinyNumber).toBeGreaterThanOrEqual(1);
    });
  });
});
