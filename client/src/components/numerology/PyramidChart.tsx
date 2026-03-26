import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PyramidChartProps {
  pinnacles: number[];
  challenges: number[];
  birthDate: string;
}

export function PyramidChart({ pinnacles = [], challenges = [], birthDate }: PyramidChartProps) {
  // Pinnacles from backend: [P1, P2, P3, P4]
  // Challenges from backend: [C1, C2, C3, C4]
  
  const [year, month, day] = birthDate.split('-').map(Number);
  
  // Helper to reduce number
  const reduce = (n: number) => {
    let sum = n;
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  };

  // Helper to reduce number strictly to single digit (1-9)
  const reduceStrict = (n: number) => {
    let sum = n;
    while (sum > 9) {
      sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  };

  const baseDay = reduce(day);
  const baseMonth = reduce(month);
  const baseYear = reduce(year);

  // Calculate Life Path Number for Age Calculation (Strictly single digit)
  const lifePath = reduceStrict(reduceStrict(day) + reduceStrict(month) + reduceStrict(year));
  
  const ageP1 = 36 - lifePath;
  const ageP2 = ageP1 + 9;
  const ageP3 = ageP2 + 9;
  const ageP4 = ageP3 + 9;

  const birthYear = year;
  
  const yearP1 = birthYear + ageP1;
  const yearP2 = birthYear + ageP2;
  const yearP3 = birthYear + ageP3;
  const yearP4 = birthYear + ageP4;

  // SVG Configuration
  const width = 600;
  const height = 650;
  const cx = width / 2;
  const cy = height / 2 + 30; // Shift center slightly down

  // Positions (10-Node Diamond Structure)
  // Center Line (Base): Month - Day - Year
  const posMonth = { x: cx - 180, y: cy };
  const posDay = { x: cx, y: cy };
  const posYear = { x: cx + 180, y: cy };

  // Upper Level 1 (Pinnacles P1, P2)
  const posP1 = { x: cx - 90, y: cy - 100 };
  const posP2 = { x: cx + 90, y: cy - 100 };

  // Upper Level 2 (Pinnacle P3)
  const posP3 = { x: cx, y: cy - 200 };

  // Upper Level 3 (Pinnacle P4) - Topmost
  const posP4 = { x: cx, y: cy - 300 }; 

  // Lower Level 1 (Challenges C1, C2)
  const posC1 = { x: cx - 90, y: cy + 100 };
  const posC2 = { x: cx + 90, y: cy + 100 };

  // Lower Level 2 (Challenge C3) - Bottommost
  const posC3 = { x: cx, y: cy + 200 };

  const NodeCircle = ({ x, y, value, label, subLabel, colorClass, highlight }: any) => (
    <g transform={`translate(${x}, ${y})`}>
      <circle r="30" className={`${colorClass} fill-white dark:fill-slate-900 stroke-[3px]`} />
      <text x="0" y="6" textAnchor="middle" className="text-xl font-bold fill-slate-800 dark:fill-white font-sans">
        {value}
      </text>
      {label && (
        <text x="0" y="-40" textAnchor="middle" className="text-xs font-bold fill-slate-500 dark:fill-slate-400 uppercase tracking-wider bg-white/50 backdrop-blur-sm px-2 rounded-full">
          {label}
        </text>
      )}
      {subLabel && (
        <foreignObject x="-75" y="32" width="150" height="60">
           <div className="text-center text-[10px] sm:text-[11px] leading-tight text-slate-500 dark:text-slate-400 font-medium whitespace-pre-wrap">
             {subLabel}
           </div>
        </foreignObject>
      )}
    </g>
  );

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-visible w-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl md:text-2xl font-bold uppercase text-slate-800 dark:text-white mb-2">
          10 Đỉnh Cao Cuộc Đời
        </CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">(10 năm quan trọng nhất ảnh hưởng lớn đến hành trình cuộc đời bạn)</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[600px] flex justify-center pb-8 border-2 border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 mx-4 md:mx-0 shadow-sm">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Connecting Lines */}
            
            {/* Upper Lines (Pinnacles) */}
            <line x1={posDay.x} y1={posDay.y} x2={posP1.x} y2={posP1.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={posMonth.x} y1={posMonth.y} x2={posP1.x} y2={posP1.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            <line x1={posMonth.x} y1={posMonth.y} x2={posP2.x} y2={posP2.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={posYear.x} y1={posYear.y} x2={posP2.x} y2={posP2.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

            <line x1={posP1.x} y1={posP1.y} x2={posP3.x} y2={posP3.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={posP2.x} y1={posP2.y} x2={posP3.x} y2={posP3.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

            {/* Long lines from Base to P4 */}
            <line x1={posDay.x} y1={posDay.y} x2={posP4.x} y2={posP4.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={posYear.x} y1={posYear.y} x2={posP4.x} y2={posP4.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

            {/* Lower Lines (Challenges) */}
            <line x1={posDay.x} y1={posDay.y} x2={posC1.x} y2={posC1.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={posMonth.x} y1={posMonth.y} x2={posC1.x} y2={posC1.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

            <line x1={posMonth.x} y1={posMonth.y} x2={posC2.x} y2={posC2.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={posYear.x} y1={posYear.y} x2={posC2.x} y2={posC2.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

            <line x1={posC1.x} y1={posC1.y} x2={posC3.x} y2={posC3.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={posC2.x} y1={posC2.y} x2={posC3.x} y2={posC3.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />

            {/* Nodes */}
            {/* Center Line (Base) - Muted Indigo */}
            <NodeCircle x={posMonth.x} y={posMonth.y} value={String(month).padStart(2,'0')} colorClass="stroke-indigo-400" label="Tháng" />
            <NodeCircle x={posDay.x} y={posDay.y} value={String(day).padStart(2,'0')} colorClass="stroke-indigo-400" label="Ngày" />
            <NodeCircle x={posYear.x} y={posYear.y} value={String(year)} colorClass="stroke-indigo-400" label="Năm" />

            {/* Upper Pinnacles - Purple */}
            <NodeCircle 
              x={posP1.x} y={posP1.y} 
              value={pinnacles[0]} 
              subLabel={`Đỉnh 1: ${ageP1} tuổi\n(${yearP1})`}
              colorClass="stroke-violet-500" 
            />
            <NodeCircle 
              x={posP2.x} y={posP2.y} 
              value={pinnacles[1]} 
              subLabel={`Đỉnh 2: ${ageP2} tuổi\n(${yearP2})`}
              colorClass="stroke-violet-500" 
            />
            <NodeCircle 
              x={posP3.x} y={posP3.y} 
              value={pinnacles[2]} 
              subLabel={`Đỉnh 3: ${ageP3} tuổi\n(${yearP3})`}
              colorClass="stroke-violet-500" 
            />
            <NodeCircle 
              x={posP4.x} y={posP4.y} 
              value={pinnacles[3]} 
              subLabel={`Đỉnh 4: ${ageP4} tuổi\n(${yearP4})`}
              colorClass="stroke-violet-500" 
            />

            {/* Lower Challenges - Gray/Slate */}
            <NodeCircle 
              x={posC1.x} y={posC1.y} 
              value={challenges[0]} 
              subLabel={`Thử thách 1`}
              colorClass="stroke-slate-400" 
            />
            <NodeCircle 
              x={posC2.x} y={posC2.y} 
              value={challenges[1]} 
              subLabel={`Thử thách 2`}
              colorClass="stroke-slate-400" 
            />
            <NodeCircle 
              x={posC3.x} y={posC3.y} 
              value={challenges[2]} 
              subLabel={`Thử thách 3`}
              colorClass="stroke-slate-400" 
            />

          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
