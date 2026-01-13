import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface IndicatorsRadarChartProps {
  healthScore: number;
  financeScore: number;
  romanceScore: number;
  careerScore: number;
}

export function IndicatorsRadarChart({
  healthScore,
  financeScore,
  romanceScore,
  careerScore,
}: IndicatorsRadarChartProps) {
  const data = [
    {
      name: "Sức Khỏe",
      score: healthScore,
      fullMark: 100,
    },
    {
      name: "Tài Chính",
      score: financeScore,
      fullMark: 100,
    },
    {
      name: "Tình Duyên",
      score: romanceScore,
      fullMark: 100,
    },
    {
      name: "Sự Nghiệp",
      score: careerScore,
      fullMark: 100,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981"; // Green
    if (score >= 60) return "#f59e0b"; // Amber
    if (score >= 40) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return "Rất tốt";
    if (score >= 60) return "Tốt";
    if (score >= 40) return "Bình thường";
    return "Cần cải thiện";
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Biểu Đồ Chỉ Số Vận Mệnh</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="name" stroke="#6b7280" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#d1d5db" />
            <Radar
              name="Điểm"
              dataKey="score"
              stroke="#7c3aed"
              fill="#7c3aed"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value) => `${value}/100`}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Sức Khỏe", score: healthScore, icon: "💪" },
          { label: "Tài Chính", score: financeScore, icon: "💰" },
          { label: "Tình Duyên", score: romanceScore, icon: "💕" },
          { label: "Sự Nghiệp", score: careerScore, icon: "🎯" },
        ].map((item) => (
          <div key={item.label} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <h4 className="font-semibold text-gray-900">{item.label}</h4>
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: getScoreColor(item.score) }}
              >
                {item.score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${item.score}%`,
                  backgroundColor: getScoreColor(item.score),
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {getScoreInterpretation(item.score)}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">📊 Giải Thích Chỉ Số</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            <strong>80-100:</strong> Rất tốt - Vận mệnh thuận lợi, hãy tận dụng cơ hội
          </li>
          <li>
            <strong>60-79:</strong> Tốt - Vận mệnh ổn định, tiếp tục phát triển
          </li>
          <li>
            <strong>40-59:</strong> Bình thường - Cần nỗ lực thêm để cải thiện
          </li>
          <li>
            <strong>0-39:</strong> Cần cải thiện - Hãy cẩn thận và tìm cách hóa giải
          </li>
        </ul>
      </div>
    </div>
  );
}
