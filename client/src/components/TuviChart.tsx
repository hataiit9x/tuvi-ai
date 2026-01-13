import React from 'react';

interface TuviStar {
  name: string;
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'black';
  brightness?: 'bright' | 'dim';
}

interface TuviPalace {
  id: number;
  name: string;
  earthlyBranch: string;
  number: number;
  stars: TuviStar[];
  elements: string[];
}

interface TuviChartProps {
  palaces: TuviPalace[];
  centerInfo: {
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: string;
    gender: string;
    lunarCalendar: boolean;
    destiny: string;
    bodyPalace: string;
  };
}

const getStarColor = (color: string): string => {
  const colorMap = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    black: 'text-gray-800'
  };
  return colorMap[color as keyof typeof colorMap] || 'text-gray-800';
};

const TuviPalaceCell: React.FC<{ palace: TuviPalace; isCorner?: boolean }> = ({
  palace,
  isCorner = false
}) => {
  return (
    <div className={`
      border border-gray-400 bg-yellow-50 p-2 h-32 text-xs
      ${isCorner ? 'relative' : ''}
    `}>
      {/* Palace header */}
      <div className="flex justify-between items-start mb-1">
        <span className="font-bold text-gray-700">{palace.earthlyBranch}</span>
        <span className="font-bold text-purple-700">{palace.name}</span>
        <span className="font-bold text-gray-700">{palace.number}</span>
      </div>

      {/* Stars */}
      <div className="space-y-0.5">
        {palace.stars.map((star, index) => (
          <div key={index} className={`${getStarColor(star.color)} font-medium leading-tight`}>
            {star.name}
            {star.brightness === 'bright' && ' (M)'}
            {star.brightness === 'dim' && ' (Đ)'}
          </div>
        ))}
      </div>

      {/* Elements */}
      {palace.elements.length > 0 && (
        <div className="mt-1 text-gray-600">
          {palace.elements.join(', ')}
        </div>
      )}

      {/* Corner indicators */}
      {isCorner && (
        <>
          <div className="absolute bottom-1 left-1 bg-gray-700 text-white px-1 text-xs rounded">
            Triệt
          </div>
          <div className="absolute bottom-1 right-1 bg-gray-700 text-white px-1 text-xs rounded">
            Tuần
          </div>
        </>
      )}
    </div>
  );
};

const TuviCenterInfo: React.FC<{ centerInfo: TuviChartProps['centerInfo'] }> = ({
  centerInfo
}) => {
  return (
    <div className="bg-yellow-100 p-4 text-center border border-gray-400">
      <h2 className="text-red-600 font-bold text-lg mb-2">NHÂN TƯỚNG VN</h2>
      <p className="text-sm text-gray-700 mb-2">XEM TƯỚNG HIỂU MÌNH - KHAI MỞ VẬN MỆNH</p>
      <p className="text-blue-600 text-sm mb-2">https://nhantuong.vn</p>

      <div className="flex justify-center mb-2">
        <div className="flex text-yellow-500">
          {'★'.repeat(5)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="font-semibold">Họ tên:</span>
          <span className="text-blue-600 ml-1">{centerInfo.name}</span>
        </div>
        <div>
          <span className="font-semibold">Năm:</span>
          <span className="text-blue-600 ml-1">{centerInfo.birthYear}</span>
        </div>
        <div>
          <span className="font-semibold">Tháng:</span>
          <span className="text-blue-600 ml-1">{centerInfo.birthMonth} ({centerInfo.birthMonth})</span>
        </div>
        <div>
          <span className="font-semibold">Ngày:</span>
          <span className="text-blue-600 ml-1">{centerInfo.birthDay} ({centerInfo.birthDay})</span>
        </div>
        <div>
          <span className="font-semibold">Giờ:</span>
          <span className="text-blue-600 ml-1">{centerInfo.birthHour}</span>
        </div>
        <div>
          <span className="font-semibold">Âm dương:</span>
          <span className="text-blue-600 ml-1">{centerInfo.gender}</span>
        </div>
        <div>
          <span className="font-semibold">Bản mệnh:</span>
          <span className="text-blue-600 ml-1">{centerInfo.destiny}</span>
        </div>
        <div>
          <span className="font-semibold">Chủ mệnh:</span>
          <span className="text-blue-600 ml-1">{centerInfo.bodyPalace}</span>
        </div>
      </div>

      {/* Five elements circle */}
      <div className="mt-4 relative">
        <div className="flex justify-center items-center space-x-4">
          <span className="text-yellow-600 font-bold">Kim</span>
          <span className="text-blue-600 font-bold">Thủy</span>
          <span className="text-red-600 font-bold">Hỏa</span>
          <span className="text-orange-600 font-bold">Thổ</span>
          <span className="text-green-600 font-bold">Mộc</span>
        </div>
      </div>
    </div>
  );
};

export const TuviChart: React.FC<TuviChartProps> = ({ palaces, centerInfo }) => {
  // Create 4x4 grid layout
  const grid = Array(4).fill(null).map(() => Array(4).fill(null));

  // Map palaces to grid positions based on traditional layout
  const palacePositions = [
    { palace: 4, row: 0, col: 0 }, // Tỵ - MỆNH
    { palace: 5, row: 0, col: 1 }, // Ngọ - PHÁ QUÂN  
    { palace: 6, row: 0, col: 2 }, // Mùi - PHU MẪU
    { palace: 7, row: 0, col: 3 }, // Thân - PHÚC ĐỨC
    { palace: 3, row: 1, col: 0 }, // Thìn - PHU THÊ
    { palace: 8, row: 1, col: 3 }, // Dậu - ĐIỀN TRẠCH
    { palace: 2, row: 2, col: 0 }, // Mão - TỬ TỨC  
    { palace: 9, row: 2, col: 3 }, // Tuất - QUAN LỘC
    { palace: 1, row: 3, col: 0 }, // Dần - TÀI BẠCH
    { palace: 12, row: 3, col: 1 }, // Sửu - TẤT ÁCH
    { palace: 11, row: 3, col: 2 }, // Tý - THIÊN DI
    { palace: 10, row: 3, col: 3 }, // Hợi - NÔ BỘC
  ];

  // Fill grid with palaces
  palacePositions.forEach(({ palace, row, col }) => {
    const palaceData = palaces.find(p => p.id === palace);
    if (palaceData) {
      grid[row][col] = palaceData;
    }
  });

  return (
    <div className="max-w-4xl mx-auto bg-white border-2 border-gray-800">
      <div className="grid grid-cols-4 gap-0">
        {/* Row 1 */}
        <TuviPalaceCell palace={grid[0][0]} isCorner />
        <TuviPalaceCell palace={grid[0][1]} />
        <TuviPalaceCell palace={grid[0][2]} />
        <TuviPalaceCell palace={grid[0][3]} isCorner />

        {/* Row 2 */}
        <TuviPalaceCell palace={grid[1][0]} />
        <div className="col-span-2">
          <TuviCenterInfo centerInfo={centerInfo} />
        </div>
        <TuviPalaceCell palace={grid[1][3]} />

        {/* Row 3 */}
        <TuviPalaceCell palace={grid[2][0]} />
        <div className="col-span-2 h-32"></div>
        <TuviPalaceCell palace={grid[2][3]} />

        {/* Row 4 */}
        <TuviPalaceCell palace={grid[3][0]} isCorner />
        <TuviPalaceCell palace={grid[3][1]} />
        <TuviPalaceCell palace={grid[3][2]} />
        <TuviPalaceCell palace={grid[3][3]} isCorner />
      </div>
    </div>
  );
};
