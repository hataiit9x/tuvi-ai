import { useState } from 'react';
import PalaceDetailModal from './PalaceDetailModal';

interface Star {
  name: string;
  nature?: string;
  type?: string;
}

interface Palace {
  name: string;
  mainStars: Star[];
  secondaryStars?: Star[];
  trangSinh?: string;
  nguHanh?: string;
  diaChi?: string;
}

interface ChartData {
  palaces: Palace[];
  element?: string;
  heavenlyStem?: string;
  earthlyBranch?: string;
  chuMenh?: string;
  chuThan?: string;
  lunarDate?: { day: number; month: number };
}

interface InputData {
  fullName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour: string;
  gender: 'male' | 'female';
  calendarType: 'lunar' | 'solar';
}

interface TuViChartGridProps {
  chart: ChartData;
  input: InputData;
}

// Vị trí 12 cung theo thứ tự truyền thống
const PALACE_POSITIONS: Record<string, number> = {
  'Huynh Đệ': 0,
  'Mệnh': 1,
  'Phụ Mẫu': 2,
  'Phúc Đức': 3,
  'Phu Thê': 4,
  'Điền Trạch': 7,
  'Tử Tức': 8,
  'Quan Lộc': 11,
  'Tài Bạch': 12,
  'Tật Ách': 13,
  'Thiên Di': 14,
  'Nô Bộc': 15,
};

function getStarColor(nature: string | undefined): string {
  if (nature === 'cat' || nature === 'good') return 'text-red-700';
  if (nature === 'hung' || nature === 'bad') return 'text-blue-800';
  return 'text-gray-800';
}

function PalaceCell({ 
  palace, 
  onPalaceClick 
}: { 
  palace: Palace | null; 
  onPalaceClick?: (palace: Palace) => void;
}) {
  if (!palace) {
    return <div className="bg-[#FDF6E3] border border-[#8B4513] min-h-[120px]" />;
  }

  const mainStars = palace.mainStars || [];
  const secondaryStars = palace.secondaryStars || [];

  return (
    <div
      className="bg-[#FDF6E3] border border-[#8B4513] p-2 min-h-[120px] flex flex-col cursor-pointer hover:bg-[#F5ECD3] transition-colors"
      onClick={() => onPalaceClick?.(palace)}
    >
      {/* Tên cung - góc phải trên */}
      <div className="text-right mb-1">
        <span className="text-[#8B4513] font-bold text-xs">{palace.name}</span>
      </div>

      {/* Sao chính */}
      <div className="flex-1 space-y-0.5">
        {mainStars.slice(0, 5).map((star, i) => (
          <div
            key={i}
            className={`font-medium text-[11px] leading-tight ${getStarColor(star.nature)}`}
          >
            {star.name}
          </div>
        ))}
      </div>

      {/* Sao phụ */}
      {secondaryStars.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-1 text-[9px] text-gray-600">
          {secondaryStars.slice(0, 4).map((star, i) => (
            <span key={i}>{star.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function CenterInfo({ chart, input }: { chart: ChartData; input: InputData }) {
  return (
    <div className="col-span-2 row-span-2 bg-[#FDEBD0] border-2 border-[#8B4513] flex flex-col">
      {/* Header */}
      <div className="text-center py-3 border-b border-[#8B4513]/30">
        <h2 className="text-lg font-bold text-[#8B4513] tracking-wider">NHÂN TƯƠNG VN</h2>
        <p className="text-[10px] text-[#A0522D] mt-1">XEM TƯƠNG HIỂU MINH - KHAI MỞ VẬN MỆNH</p>
      </div>

      {/* Thông tin chính - 2 cột */}
      <div className="flex-1 p-3">
        <div className="grid grid-cols-2 gap-x-6 text-[11px]">
          {/* Cột trái */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Họ tên</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Năm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tháng</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giờ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Âm/Dương</span>
            </div>
          </div>

          {/* Cột phải */}
          <div className="space-y-1 text-right">
            <div className="flex justify-between">
              <span className="text-gray-600">Nạp Âm</span>
              <span className="font-semibold text-[#8B4513]">{input.fullName}</span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">{input.birthYear}</span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">{input.birthMonth}</span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">{input.birthDay}</span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">{input.birthHour}</span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">{input.gender === 'male' ? 'Dương Nam' : 'Dương Nữ'}</span>
            </div>
          </div>
        </div>

        {/* Bản mệnh, Chủ mệnh, Chủ thân */}
        <div className="mt-4 pt-3 border-t border-[#8B4513]/30 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-gray-600">Bản mệnh</span>
            <span className="font-bold text-red-600">{chart.element || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chủ mệnh</span>
            <span className="font-semibold">{chart.chuMenh || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chủ thân</span>
            <span className="font-semibold">{chart.chuThan || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TuViChartGrid({ chart, input }: TuViChartGridProps) {
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePalaceClick = (palace: Palace) => {
    setSelectedPalace(palace);
    setModalOpen(true);
  };

  // Map tên cung -> palace data
  const palaceMap = new Map<string, Palace>();
  (chart.palaces || []).forEach((p: Palace) => {
    palaceMap.set(p.name, p);
  });

  const getPalaceAtPosition = (pos: number): Palace | null => {
    for (const [name, position] of Object.entries(PALACE_POSITIONS)) {
      if (position === pos) {
        return palaceMap.get(name) || null;
      }
    }
    return null;
  };

  return (
    <>
      <div className="bg-[#FDF6E3] border-4 border-[#8B4513] max-w-4xl mx-auto">
        {/* Grid 4x4 */}
        <div className="grid grid-cols-4">
          {/* Row 0 */}
          <PalaceCell palace={getPalaceAtPosition(0)} onPalaceClick={handlePalaceClick} />
          <PalaceCell palace={getPalaceAtPosition(1)} onPalaceClick={handlePalaceClick} />
          <PalaceCell palace={getPalaceAtPosition(2)} onPalaceClick={handlePalaceClick} />
          <PalaceCell palace={getPalaceAtPosition(3)} onPalaceClick={handlePalaceClick} />

          {/* Row 1 */}
          <PalaceCell palace={getPalaceAtPosition(4)} onPalaceClick={handlePalaceClick} />
          <CenterInfo chart={chart} input={input} />
          <PalaceCell palace={getPalaceAtPosition(7)} onPalaceClick={handlePalaceClick} />

          {/* Row 2 */}
          <PalaceCell palace={getPalaceAtPosition(8)} onPalaceClick={handlePalaceClick} />
          <PalaceCell palace={getPalaceAtPosition(11)} onPalaceClick={handlePalaceClick} />

          {/* Row 3 */}
          <PalaceCell palace={getPalaceAtPosition(12)} onPalaceClick={handlePalaceClick} />
          <PalaceCell palace={getPalaceAtPosition(13)} onPalaceClick={handlePalaceClick} />
          <PalaceCell palace={getPalaceAtPosition(14)} onPalaceClick={handlePalaceClick} />
          <PalaceCell palace={getPalaceAtPosition(15)} onPalaceClick={handlePalaceClick} />
        </div>
      </div>

      <PalaceDetailModal
        palace={selectedPalace}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}