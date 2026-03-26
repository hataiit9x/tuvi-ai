import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalIndicatorProps {
  personalYear: number;
  personalMonth: number;
  year: number;
  month: number;
}

export function PersonalIndicator({ personalYear, personalMonth, year, month }: PersonalIndicatorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Personal Year */}
      <Card className="border-none bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="text-9xl font-bold">{personalYear}</span>
        </div>
        <CardContent className="p-6 relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Năm Cá Nhân {year}</div>
            <h3 className="text-3xl font-bold">Số {personalYear}</h3>
          </div>
          <div className="mt-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              Vận niên hiện tại
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Personal Month */}
      <Card className="border-none bg-white dark:bg-gray-800 overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="text-9xl font-bold text-purple-600 dark:text-purple-400">{personalMonth}</span>
        </div>
        <CardContent className="p-6 relative z-10 h-full flex flex-col justify-between">
           <div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Tháng Cá Nhân {month}/{year}</div>
            <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Số {personalMonth}</h3>
          </div>
          <div className="mt-4">
             <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium">
              Vận khí tháng này
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
