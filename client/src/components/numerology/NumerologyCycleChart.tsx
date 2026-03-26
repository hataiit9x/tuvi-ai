import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface CycleForecast {
  year: number;
  personalYear: number;
  energyLevel: number;
  description: string;
}

interface NumerologyCycleChartProps {
  data: CycleForecast[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CycleForecast;
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-purple-100 dark:border-purple-800 shadow-xl">
        <p className="font-bold text-gray-900 dark:text-white mb-1">Năm {label}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <p className="font-medium text-purple-600 dark:text-purple-400">
            Năm cá nhân số {data.personalYear}
          </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
          {data.description}
        </p>
      </div>
    );
  }
  return null;
};

export function NumerologyCycleChart({ data }: NumerologyCycleChartProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full h-[300px] sm:h-[400px] mt-8 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="lineColors" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#e2e8f0" 
            className="dark:stroke-gray-800"
            opacity={0.5}
          />
          
          <XAxis 
            dataKey="year" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickMargin={10}
            padding={{ left: 20, right: 20 }}
          />

          <YAxis 
            domain={[0, 10]} 
            hide={true} // Hide the raw energy level axis to match the clean look
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
          <ReferenceLine 
            x={currentYear} 
            stroke="#10b981" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Hiện tại', 
              position: 'top', 
              fill: '#10b981', 
              fontSize: 12 
            }} 
          />

          <Line
            type="monotone"
            dataKey="energyLevel"
            stroke="url(#lineColors)"
            strokeWidth={4}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              // Render custom dot that shows the personalYear number above it!
              return (
                <g key={`dot-${payload.year}`}>
                  <circle cx={cx} cy={cy} r={4} fill="#fff" stroke="#8b5cf6" strokeWidth={2} />
                  <text x={cx} y={cy - 12} fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">
                    {payload.personalYear}
                  </text>
                </g>
              );
            }}
            activeDot={{ r: 8, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 3 }}
            filter="url(#glow)"
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="text-center mt-2">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Chu kỳ vận số của bạn (9 năm)
        </h4>
      </div>
    </div>
  );
}
