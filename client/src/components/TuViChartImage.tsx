import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface Palace {
  name: string;
  mainStars: Array<{ name: string; nature: 'cat' | 'hung' | 'neutral' }>;
  secondaryStars?: Array<{ name: string; nature?: 'cat' | 'hung' | 'neutral' }>;
  trangSinh?: string;
  nguHanh?: string;
}

interface TuViChartImageProps {
  chart: {
    palaces: Palace[];
    element?: string;
    heavenlyStem?: string;
    earthlyBranch?: string;
    chuMenh?: string;
    chuThan?: string;
  };
  input: {
    fullName: string;
    birthDay: number;
    birthMonth: number;
    birthYear: number;
    birthHour: string;
    gender: 'male' | 'female';
  };
}

const PALACE_POSITIONS: Record<string, { row: number; col: number }> = {
  'Mệnh': { row: 0, col: 1 },
  'Phụ Mẫu': { row: 0, col: 2 },
  'Phúc Đức': { row: 1, col: 3 },
  'Điền Trạch': { row: 2, col: 3 },
  'Quan Lộc': { row: 3, col: 2 },
  'Nô Bộc': { row: 3, col: 1 },
  'Thiên Di': { row: 3, col: 0 },
  'Tật Ách': { row: 2, col: 0 },
  'Tài Bạch': { row: 1, col: 0 },
  'Tử Tức': { row: 1, col: 1 },
  'Phu Thê': { row: 1, col: 2 },
  'Huynh Đệ': { row: 0, col: 0 },
};

const PALACE_CHINESE: Record<string, string> = {
  'Mệnh': '命',
  'Phụ Mẫu': '父母',
  'Phúc Đức': '福德',
  'Điền Trạch': '田宅',
  'Quan Lộc': '官祿',
  'Nô Bộc': '奴僕',
  'Thiên Di': '遷移',
  'Tật Ách': '疾厄',
  'Tài Bạch': '財帛',
  'Tử Tức': '子息',
  'Phu Thê': '夫妻',
  'Huynh Đệ': '兄弟',
};

function PalaceCell({ palace }: { palace: Palace | null }) {
  if (!palace) {
    return <div className="border border-amber-900 bg-amber-50 p-2 min-h-[100px]"></div>;
  }

  const mainStars = palace.mainStars?.slice(0, 2) || [];

  return (
    <div className="border border-amber-900 bg-amber-50 p-2 min-h-[100px] flex flex-col">
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-bold text-amber-900">{palace.name}</span>
        <span className="text-xs text-gray-600">{PALACE_CHINESE[palace.name]}</span>
      </div>
      <div className="space-y-0.5 text-xs">
        {mainStars.map((star, i) => (
          <div
            key={i}
            className={`font-bold ${
              star.nature === 'cat' ? 'text-red-600' : star.nature === 'hung' ? 'text-green-700' : 'text-gray-700'
            }`}
          >
            {star.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function CenterInfo({ chart, input }: { chart: any; input: any }) {
  return (
    <div className="col-span-2 row-span-2 border-2 border-amber-900 bg-gradient-to-br from-amber-100 to-orange-50 p-3 flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-amber-900 mb-2">TỬ VI AI</h2>
      <div className="w-full space-y-0.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-700">Họ tên:</span>
          <span className="font-semibold">{input.fullName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Ngày:</span>
          <span className="font-semibold">{input.birthDay}/{input.birthMonth}/{input.birthYear}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Bản mệnh:</span>
          <span className="font-bold text-red-600">{chart.element}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Chủ mệnh:</span>
          <span className="font-semibold">{chart.chuMenh}</span>
        </div>
      </div>
    </div>
  );
}

export default function TuViChartImage({ chart, input }: TuViChartImageProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const grid: (Palace | null)[][] = Array(4)
    .fill(null)
    .map(() => Array(4).fill(null));

  const palaces = chart.palaces || [];
  palaces.forEach((palace: Palace) => {
    const pos = PALACE_POSITIONS[palace.name];
    if (pos) {
      grid[pos.row][pos.col] = palace;
    }
  });

  const handleDownloadImage = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#faf5f0',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `tuvi-${input.fullName}-${input.birthYear}.png`;
      link.click();

      toast.success('Đã tải ảnh lá số thành công!');
    } catch (error) {
      toast.error('Có lỗi khi tạo ảnh');
    }
  };

  const handleShareImage = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#faf5f0',
        scale: 2,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `tuvi-${input.fullName}.png`, { type: 'image/png' });

        if (navigator.share) {
          try {
            await navigator.share({
              title: `Lá số Tử Vi của ${input.fullName}`,
              text: `Xem lá số tử vi chi tiết với mệnh ${chart.element}`,
              files: [file],
            });
          } catch (err) {
            console.log('Share cancelled');
          }
        } else {
          toast.info('Tính năng chia sẻ không được hỗ trợ trên thiết bị này');
        }
      });
    } catch (error) {
      toast.error('Có lỗi khi chia sẻ ảnh');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownloadImage}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Tải Ảnh Lá Số
        </Button>
        <Button
          onClick={handleShareImage}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Chia Sẻ Ảnh
        </Button>
      </div>

      {/* Chart for export */}
      <div
        ref={chartRef}
        className="bg-amber-50 rounded-lg p-6 border-4 border-amber-900"
        style={{ width: '800px', margin: '0 auto' }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-amber-900">LÁ SỐ TỬ VI</h1>
          <p className="text-sm text-amber-700">{input.fullName} - {input.birthYear}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-1 mb-4">
          {/* Row 0 */}
          <PalaceCell palace={grid[0][0]} />
          <PalaceCell palace={grid[0][1]} />
          <PalaceCell palace={grid[0][2]} />
          <PalaceCell palace={grid[0][3]} />

          {/* Row 1 */}
          <PalaceCell palace={grid[1][0]} />
          <CenterInfo chart={chart} input={input} />
          <PalaceCell palace={grid[1][3]} />

          {/* Row 2 */}
          <PalaceCell palace={grid[2][0]} />
          <CenterInfo chart={chart} input={input} />
          <PalaceCell palace={grid[2][3]} />

          {/* Row 3 */}
          <PalaceCell palace={grid[3][0]} />
          <PalaceCell palace={grid[3][1]} />
          <PalaceCell palace={grid[3][2]} />
          <PalaceCell palace={grid[3][3]} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-amber-700 border-t border-amber-300 pt-2">
          <p>Được tạo bởi TỬ VI AI - https://tuvi.my.id</p>
        </div>
      </div>
    </div>
  );
}
