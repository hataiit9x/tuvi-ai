import { describe, expect, it } from "vitest";
import { calculateCompatibility } from "./compatibility";

describe("Compatibility Service", () => {
  describe("calculateCompatibility", () => {
    it("calculates compatibility between two people", () => {
      const result = calculateCompatibility(
        { fullName: "Nguyễn Văn A", birthDate: "1990-05-15" },
        { fullName: "Trần Thị B", birthDate: "1992-08-20" }
      );

      expect(result).toBeDefined();
      expect(result.person1.name).toBe("Nguyễn Văn A");
      expect(result.person2.name).toBe("Trần Thị B");
      expect(result.person1.birthYear).toBe(1990);
      expect(result.person2.birthYear).toBe(1992);
    });

    it("returns zodiac information for both people", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1988-01-01" },
        { fullName: "Test B", birthDate: "1996-06-15" }
      );

      expect(result.person1.zodiac).toBeDefined();
      expect(result.person1.zodiacVN).toBeDefined();
      expect(result.person2.zodiac).toBeDefined();
      expect(result.person2.zodiacVN).toBeDefined();
    });

    it("returns element information for both people", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.person1.element).toBeDefined();
      expect(result.person2.element).toBeDefined();
    });

    it("returns life path numbers for both people", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.person1.lifePathNumber).toBeGreaterThanOrEqual(1);
      expect(result.person2.lifePathNumber).toBeGreaterThanOrEqual(1);
    });

    it("returns element compatibility with score and type", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.elementCompatibility).toBeDefined();
      expect(result.elementCompatibility.score).toBeGreaterThanOrEqual(0);
      expect(result.elementCompatibility.score).toBeLessThanOrEqual(100);
      expect(result.elementCompatibility.type).toBeDefined();
      expect(result.elementCompatibility.description).toBeDefined();
    });

    it("returns zodiac compatibility with score and type", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.zodiacCompatibility).toBeDefined();
      expect(result.zodiacCompatibility.score).toBeGreaterThanOrEqual(0);
      expect(result.zodiacCompatibility.score).toBeLessThanOrEqual(100);
      expect(result.zodiacCompatibility.type).toBeDefined();
      expect(result.zodiacCompatibility.description).toBeDefined();
    });

    it("returns numerology compatibility with score", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.numerologyCompatibility).toBeDefined();
      expect(result.numerologyCompatibility.score).toBeGreaterThanOrEqual(0);
      expect(result.numerologyCompatibility.score).toBeLessThanOrEqual(100);
      expect(result.numerologyCompatibility.description).toBeDefined();
    });

    it("returns overall score between 0 and 100", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it("returns overall description", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.overallDescription).toBeDefined();
      expect(typeof result.overallDescription).toBe("string");
      expect(result.overallDescription.length).toBeGreaterThan(0);
    });

    it("returns advice array", () => {
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1990-01-01" },
        { fullName: "Test B", birthDate: "1995-06-15" }
      );

      expect(result.advice).toBeDefined();
      expect(Array.isArray(result.advice)).toBe(true);
      expect(result.advice.length).toBeGreaterThan(0);
    });

    it("identifies Tam Hợp zodiac pairs correctly", () => {
      // Tý (1996) và Thìn (2000) are Tam Hợp
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1996-01-01" },
        { fullName: "Test B", birthDate: "2000-06-15" }
      );

      expect(result.zodiacCompatibility.type).toBe("Tam Hợp");
      expect(result.zodiacCompatibility.score).toBe(95);
    });

    it("identifies Xung zodiac pairs correctly", () => {
      // Tý (1996) và Ngọ (1990) are Xung
      const result = calculateCompatibility(
        { fullName: "Test A", birthDate: "1996-01-01" },
        { fullName: "Test B", birthDate: "1990-06-15" }
      );

      expect(result.zodiacCompatibility.type).toBe("Xung");
      expect(result.zodiacCompatibility.score).toBe(35);
    });
  });
});
