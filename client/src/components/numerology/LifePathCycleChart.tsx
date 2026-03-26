import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface LifePathCycleChartProps {
  cycles: {
    cycle1: number;
    cycle2: number;
    cycle3: number;
  };
  lifePathNumber: number;
}

export function LifePathCycleChart({ cycles, lifePathNumber }: LifePathCycleChartProps) {
  // Calculate transition ages
  const firstCycleEndAge = 36 - lifePathNumber;
  const secondCycleEndAge = firstCycleEndAge + 27;

  const cycleData = [
    {
      label: "Chu kỳ 1",
      number: cycles.cycle1,
      range: `0 - ${firstCycleEndAge} tuổi`,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800"
    },
    {
      label: "Chu kỳ 2",
      number: cycles.cycle2,
      range: `${firstCycleEndAge + 1} - ${secondCycleEndAge} tuổi`,
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300",
      border: "border-indigo-200 dark:border-indigo-800"
    },
    {
      label: "Chu kỳ 3",
      number: cycles.cycle3,
      range: `${secondCycleEndAge + 1}+ tuổi`,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800"
    }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🔄</span>
          Chu Kỳ Đường Đời
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {cycleData.map((cycle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-xl border ${cycle.color} ${cycle.border} relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-bold">{cycle.number}</span>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-1 opacity-80">{cycle.label}</h3>
                <div className="text-3xl font-bold mb-2">{cycle.number}</div>
                <div className="flex items-center gap-2 text-sm opacity-90 font-medium">
                  <span className="px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/30">
                    {cycle.range}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
