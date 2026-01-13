import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
];
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i);

const BIRTH_HOURS = [
    { value: "ty", label: "Tý (23h - 01h)" },
    { value: "suu", label: "Sửu (01h - 03h)" },
    { value: "dan", label: "Dần (03h - 05h)" },
    { value: "mao", label: "Mão (05h - 07h)" },
    { value: "thin", label: "Thìn (07h - 09h)" },
    { value: "ti", label: "Tỵ (09h - 11h)" },
    { value: "ngo", label: "Ngọ (11h - 13h)" },
    { value: "mui", label: "Mùi (13h - 15h)" },
    { value: "than", label: "Thân (15h - 17h)" },
    { value: "dau", label: "Dậu (17h - 19h)" },
    { value: "tuat", label: "Tuất (19h - 21h)" },
    { value: "hoi", label: "Hợi (21h - 23h)" },
];

interface BirthDateSelectorProps {
    birthDay: number;
    birthMonth: number;
    birthYear: number;
    birthHour?: string;
    onBirthDayChange: (day: number) => void;
    onBirthMonthChange: (month: number) => void;
    onBirthYearChange: (year: number) => void;
    onBirthHourChange?: (hour: string) => void;
    showHour?: boolean;
}

export const BirthDateSelector: React.FC<BirthDateSelectorProps> = ({
    birthDay,
    birthMonth,
    birthYear,
    birthHour,
    onBirthDayChange,
    onBirthMonthChange,
    onBirthYearChange,
    onBirthHourChange,
    showHour = false,
}) => {
    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                {showHour ? 'Ngày tháng năm sinh & Giờ sinh' : 'Ngày tháng năm sinh'}
            </Label>
            <div className={`grid ${showHour ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-3`}>
                {/* Ngày */}
                <Select
                    value={String(birthDay)}
                    onValueChange={(v) => onBirthDayChange(parseInt(v))}
                >
                    <SelectTrigger className="h-14 bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl text-base font-medium shadow-sm transition-all">
                        <SelectValue placeholder="Ngày" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        {DAYS.map((d) => (
                            <SelectItem
                                key={d}
                                value={String(d)}
                                className="cursor-pointer hover:bg-purple-50 font-medium"
                            >
                                Ngày {d}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Tháng */}
                <Select
                    value={String(birthMonth)}
                    onValueChange={(v) => onBirthMonthChange(parseInt(v))}
                >
                    <SelectTrigger className="h-14 bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl text-base font-medium shadow-sm transition-all">
                        <SelectValue placeholder="Tháng" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        {MONTHS.map((m) => (
                            <SelectItem
                                key={m.value}
                                value={String(m.value)}
                                className="cursor-pointer hover:bg-purple-50 font-medium"
                            >
                                {m.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Năm */}
                <Select
                    value={String(birthYear)}
                    onValueChange={(v) => onBirthYearChange(parseInt(v))}
                >
                    <SelectTrigger className="h-14 bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl text-base font-medium shadow-sm transition-all">
                        <SelectValue placeholder="Năm" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                        {YEARS.map((y) => (
                            <SelectItem
                                key={y}
                                value={String(y)}
                                className="cursor-pointer hover:bg-purple-50 font-medium"
                            >
                                Năm {y}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Giờ sinh (optional) */}
                {showHour && onBirthHourChange && (
                    <Select
                        value={birthHour}
                        onValueChange={onBirthHourChange}
                    >
                        <SelectTrigger className="h-14 bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200 hover:border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl text-base font-medium shadow-sm transition-all">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <SelectValue placeholder="Giờ sinh" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {BIRTH_HOURS.map((hour) => (
                                <SelectItem
                                    key={hour.value}
                                    value={hour.value}
                                    className="py-3 cursor-pointer hover:bg-amber-50"
                                >
                                    <span className="font-medium">{hour.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
};
