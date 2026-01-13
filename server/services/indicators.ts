/**
 * Calculate indicators (health, finance, romance, career) from Tử Vi chart
 */

import { TuviChart } from "../../shared/types";

export interface IndicatorScores {
  healthScore: number;
  financeScore: number;
  romanceScore: number;
  careerScore: number;
}

/**
 * Calculate indicator scores based on Tử Vi chart
 * Scores range from 0-100
 */
export function calculateIndicatorScores(chart: TuviChart): IndicatorScores {
  // Base scores
  let healthScore = 50;
  let financeScore = 50;
  let romanceScore = 50;
  let careerScore = 50;

  // Analyze each palace and its stars
  const palaces = chart.palaces || [];

  for (const palace of palaces) {
    const palaceName = palace.name || "";
    const mainStars = palace.mainStars || [];
    const mainStar = mainStars[0]?.name || "";
    const secondaryStars = palace.secondaryStars || [];

    // Health (Tật Ách palace)
    if (palaceName.includes("Tật Ách")) {
      if (mainStar === "Tử" || mainStar === "Thiên Đẳng") {
        healthScore += 20;
      } else if (mainStar === "Phá" || mainStar === "Thiên Phương") {
        healthScore -= 15;
      }
    }

    // Finance (Tài Bạch palace)
    if (palaceName.includes("Tài Bạch")) {
      if (mainStar === "Lộc" || mainStar === "Thiên Phú") {
        financeScore += 25;
      } else if (mainStar === "Thiên Hư") {
        financeScore -= 20;
      }
    }

    // Romance (Phu Thê palace)
    if (palaceName.includes("Phu Thê")) {
      if (mainStar === "Tử" || mainStar === "Tương") {
        romanceScore += 20;
      } else if (mainStar === "Phá" || mainStar === "Thiên Việt") {
        romanceScore -= 15;
      }
    }

    // Career (Quan Lộc palace)
    if (palaceName.includes("Quan Lộc")) {
      if (mainStar === "Tử" || mainStar === "Quyền") {
        careerScore += 25;
      } else if (mainStar === "Phá") {
        careerScore += 10; // Phá can be good for career change
      }
    }

    // Life/Destiny (Mệnh palace)
    if (palaceName.includes("Mệnh")) {
      if (mainStar === "Tử") {
        healthScore += 10;
        careerScore += 10;
        financeScore += 10;
        romanceScore += 10;
      } else if (mainStar === "Phá") {
        healthScore -= 5;
        careerScore += 15;
      }
    }

    // Secondary stars influence
    for (const secondary of secondaryStars) {
      const secondaryName = typeof secondary === 'string' ? secondary : secondary.name || "";

      if (secondaryName.includes("Hỏa")) {
        healthScore -= 5;
        romanceScore -= 10;
      } else if (secondaryName.includes("Nước")) {
        financeScore -= 10;
        careerScore -= 5;
      } else if (secondaryName === "Thiên Cơ") {
        careerScore += 10;
      } else if (secondaryName === "Thiên Ân") {
        healthScore += 5;
        financeScore += 5;
      }
    }
  }

  // Normalize scores to 0-100 range
  healthScore = Math.max(0, Math.min(100, healthScore));
  financeScore = Math.max(0, Math.min(100, financeScore));
  romanceScore = Math.max(0, Math.min(100, romanceScore));
  careerScore = Math.max(0, Math.min(100, careerScore));

  return {
    healthScore: Math.round(healthScore),
    financeScore: Math.round(financeScore),
    romanceScore: Math.round(romanceScore),
    careerScore: Math.round(careerScore),
  };
}

/**
 * Get interpretation text for indicator scores
 */
export function getIndicatorInterpretation(scores: IndicatorScores): string {
  const interpretations: string[] = [];

  const getLevel = (score: number) => {
    if (score >= 80) return "rất tốt";
    if (score >= 60) return "tốt";
    if (score >= 40) return "bình thường";
    return "cần cải thiện";
  };

  if (scores.healthScore >= 70) {
    interpretations.push("Sức khỏe của bạn rất tốt, hãy duy trì lối sống lành mạnh.");
  } else if (scores.healthScore < 40) {
    interpretations.push("Cần chú ý đến sức khỏe, hãy kiểm tra định kỳ và tránh quá sức.");
  }

  if (scores.financeScore >= 70) {
    interpretations.push("Tài chính sẽ khá thuận lợi, đây là thời điểm tốt để đầu tư.");
  } else if (scores.financeScore < 40) {
    interpretations.push("Tài chính cần cẩn thận, hãy quản lý chi tiêu hợp lý.");
  }

  if (scores.romanceScore >= 70) {
    interpretations.push("Tình duyên sẽ phát triển tốt, là thời điểm thuận lợi cho tình yêu.");
  } else if (scores.romanceScore < 40) {
    interpretations.push("Tình duyên cần chú ý, hãy kiên nhẫn và tìm hiểu kỹ đối phương.");
  }

  if (scores.careerScore >= 70) {
    interpretations.push("Sự nghiệp sẽ có bước tiến, hãy tận dụng cơ hội phát triển.");
  } else if (scores.careerScore < 40) {
    interpretations.push("Sự nghiệp cần cố gắng thêm, hãy nâng cao kỹ năng và kinh nghiệm.");
  }

  return interpretations.length > 0
    ? interpretations.join(" ")
    : "Vận mệnh của bạn cân bằng, hãy tiếp tục phát triển từng khía cạnh một cách đều đặn.";
}
