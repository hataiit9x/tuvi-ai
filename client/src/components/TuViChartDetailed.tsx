import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TuviChart, Palace, Star } from '@shared/types';

interface TuViChartDetailedProps {
  data: {
    name: string;
    day: number;
    month: number;
    year: number;
    hour: string;
    gender: 'male' | 'female';
    destiny: string;
    mainStar: string;
    palaces: Palace[];
  };
}

interface PalaceExplanation {
  name: string;
  chineseName: string;
  meaning: string;
  influence: string;
}

interface StarExplanation {
  name: string;
  nature: 'cát' | 'hung';
  meaning: string;
  influence: string;
}

const PALACE_EXPLANATIONS: Record<number, PalaceExplanation> = {
  1: {
    name: 'Mệnh',
    chineseName: '命',
    meaning: 'Cung Mệnh đại diện cho tính cách, vận mệnh và con đường sống của người',
    influence: 'Ảnh hưởng đến tổng thể vận mệnh, tính cách, khả năng lãnh đạo'
  },
  2: {
    name: 'Phụ Mẫu',
    chineseName: '父母',
    meaning: 'Cung Phụ Mẫu liên quan đến mối quan hệ với cha mẹ và những người bảo trợ',
    influence: 'Ảnh hưởng đến mối quan hệ gia đình, sự hỗ trợ từ người lớn tuổi'
  },
  3: {
    name: 'Phúc Đức',
    chineseName: '福德',
    meaning: 'Cung Phúc Đức thể hiện phúc báo, tài lộc và sự may mắn trong cuộc sống',
    influence: 'Ảnh hưởng đến tài chính, phúc lộc, sự hài lòng trong cuộc sống'
  },
  4: {
    name: 'Điền Trạch',
    chineseName: '田宅',
    meaning: 'Cung Điền Trạch liên quan đến bất động sản, nhà cửa và tài sản cố định',
    influence: 'Ảnh hưởng đến bất động sản, tài sản, nơi ở, di sản gia đình'
  },
  5: {
    name: 'Quan Lộc',
    chineseName: '官祿',
    meaning: 'Cung Quan Lộc đại diện cho sự nghiệp, công việc và địa vị xã hội',
    influence: 'Ảnh hưởng đến sự nghiệp, công việc, địa vị, danh vọng'
  },
  6: {
    name: 'Nô Bộc',
    chineseName: '奴僕',
    meaning: 'Cung Nô Bộc liên quan đến mối quan hệ với nhân viên, cấp dưới và bạn bè',
    influence: 'Ảnh hưởng đến mối quan hệ công việc, tình bạn, mối quan hệ cấp dưới'
  },
  7: {
    name: 'Thiên Di',
    chineseName: '遷移',
    meaning: 'Cung Thiên Di đại diện cho những thay đổi, di chuyển và những cuộc hành trình',
    influence: 'Ảnh hưởng đến du lịch, di cư, những thay đổi trong cuộc sống'
  },
  8: {
    name: 'Tật Ách',
    chineseName: '疾厄',
    meaning: 'Cung Tật Ách liên quan đến sức khỏe, bệnh tật và những trở ngại',
    influence: 'Ảnh hưởng đến sức khỏe, bệnh tật, những khó khăn cần vượt qua'
  },
  9: {
    name: 'Tài Bạch',
    chineseName: '財帛',
    meaning: 'Cung Tài Bạch đại diện cho tài chính, tiền bạc và thu nhập',
    influence: 'Ảnh hưởng đến tài chính, tiền bạc, thu nhập, tài sản động'
  },
  10: {
    name: 'Tử Tức',
    chineseName: '子息',
    meaning: 'Cung Tử Tức liên quan đến con cái và những người kế thừa',
    influence: 'Ảnh hưởng đến con cái, tình yêu, mối quan hệ với con em'
  },
  11: {
    name: 'Phu Thê',
    chineseName: '夫妻',
    meaning: 'Cung Phu Thê đại diện cho hôn nhân, tình yêu và mối quan hệ lãng mạn',
    influence: 'Ảnh hưởng đến hôn nhân, tình yêu, mối quan hệ đôi lứa'
  },
  12: {
    name: 'Huynh Đệ',
    chineseName: '兄弟',
    meaning: 'Cung Huynh Đệ liên quan đến anh chị em, bạn bè thân thiết',
    influence: 'Ảnh hưởng đến mối quan hệ anh chị em, bạn bè, đồng nghiệp'
  }
};

const STAR_EXPLANATIONS: Record<string, StarExplanation> = {
  '紫': { name: 'Tử', nature: 'cát', meaning: 'Sao Tử - Sao chính, đại diện cho quyền lực và lãnh đạo', influence: 'Tăng cường quyền lực, khả năng lãnh đạo, thành công' },
  '破': { name: 'Phá', nature: 'hung', meaning: 'Sao Phá - Sao phá hoại, đại diện cho sự thay đổi và phá vỡ', influence: 'Gây ra thay đổi, mất mát, cần cẩn thận' },
  '廉': { name: 'Liêm', nature: 'cát', meaning: 'Sao Liêm - Sao chính, đại diện cho sự liêm chính và thẳng thắn', influence: 'Tăng cường chính trực, tính cách thẳng thắn' },
  '武': { name: 'Võ', nature: 'cát', meaning: 'Sao Võ - Sao chính, đại diện cho sức mạnh và quyết đoán', influence: 'Tăng cường sức mạnh, quyết đoán, hành động' },
  '相': { name: 'Tương', nature: 'cát', meaning: 'Sao Tương - Sao phụ, đại diện cho sự hỗ trợ và hợp tác', influence: 'Tăng cường hợp tác, sự hỗ trợ từ người khác' },
  '殺': { name: 'Sát', nature: 'hung', meaning: 'Sao Sát - Sao phụ, đại diện cho sự hung dữ và nguy hiểm', influence: 'Gây ra xung đột, mâu thuẫn, cần cẩn thận' },
  '祿': { name: 'Lộc', nature: 'cát', meaning: 'Sao Lộc - Sao phụ, đại diện cho tài lộc và may mắn', influence: 'Tăng cường tài lộc, may mắn, tài chính' },
  '權': { name: 'Quyền', nature: 'cát', meaning: 'Sao Quyền - Sao phụ, đại diện cho quyền lực và kiểm soát', influence: 'Tăng cường quyền lực, kiểm soát tình huống' },
  '科': { name: 'Khoa', nature: 'cát', meaning: 'Sao Khoa - Sao phụ, đại diện cho tài năng và thành tựu', influence: 'Tăng cường tài năng, thành công học tập' },
  '忌': { name: 'Kỵ', nature: 'hung', meaning: 'Sao Kỵ - Sao phụ, đại diện cho sự cản trở và khó khăn', influence: 'Gây ra cản trở, khó khăn, cần cẩn thận' }
};



export default function TuViChartDetailed({ data }: TuViChartDetailedProps) {
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<string | null>(null);

  const getPalacePosition = (index: number): string => {
    // 4x4 grid layout
    // Top row: 1, 2, 3, 4
    // Second row: 12, center, center, 5
    // Third row: 11, center, center, 6
    // Bottom row: 10, 9, 8, 7
    const positions: Record<number, string> = {
      1: 'top-0 left-0',
      2: 'top-0 left-1/3',
      3: 'top-0 left-2/3',
      4: 'top-0 right-0',
      5: 'top-1/3 right-0',
      6: 'top-2/3 right-0',
      7: 'bottom-0 right-0',
      8: 'bottom-0 right-1/3',
      9: 'bottom-0 left-1/3',
      10: 'bottom-0 left-0',
      11: 'top-2/3 left-0',
      12: 'top-1/3 left-0'
    };
    return positions[index] || '';
  };

  const getStarColor = (nature: string | undefined): string => {
    return nature === 'cát' || nature === 'good' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900';
  };

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square bg-amber-50 border-4 border-amber-900 rounded-lg overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-amber-200" />
          ))}
        </div>

        {/* Center panel */}
        <div className="absolute inset-1/3 bg-amber-100 border-2 border-amber-900 flex flex-col items-center justify-center p-4 z-10">
          <h3 className="text-lg font-bold text-amber-900">{data.name}</h3>
          <p className="text-sm text-amber-800">
            {data.day}/{data.month}/{data.year}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Giờ {data.hour} - {data.gender === 'male' ? 'Nam' : 'Nữ'}
          </p>
          <div className="mt-2 text-xs text-amber-700">
            <p>Bản mệnh: {data.destiny}</p>
            <p>Chủ mệnh: {data.mainStar}</p>
          </div>
        </div>

        {/* Palaces */}
        {data.palaces.map((palace: any, index: number) => (
          <div
            key={index}
            className={`absolute w-1/3 h-1/3 border border-amber-900 p-2 cursor-pointer hover:bg-amber-200 transition-colors ${getPalacePosition(index + 1)}`}
            onClick={() => setSelectedPalace(index + 1)}
          >
            <div className="text-xs font-bold text-amber-900">
              {PALACE_EXPLANATIONS[index + 1]?.name}
            </div>
            <div className="text-xs text-amber-800 mt-1">
              {palace.mainStars.map((star: any, i: number) => (
                <div
                  key={i}
                  className={`${getStarColor(star.nature)} px-1 rounded text-xs cursor-pointer hover:opacity-80`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStar(star.name);
                  }}
                >
                  {star.name}
                </div>
              ))}
            </div>
            <div className="text-xs text-amber-700 mt-1">
              {palace.secondaryStars.slice(0, 2).map((star: any, i: number) => (
                <div key={i} className="text-xs">
                  {star.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Palace Detail Dialog */}
      <Dialog open={selectedPalace !== null} onOpenChange={(open) => !open && setSelectedPalace(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPalace && PALACE_EXPLANATIONS[selectedPalace]?.name}
              <span className="text-2xl ml-2">
                {selectedPalace && PALACE_EXPLANATIONS[selectedPalace]?.chineseName}
              </span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-4 pr-4">
              {selectedPalace && (
                <>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Ý Nghĩa</h4>
                    <p className="text-sm text-gray-700">
                      {PALACE_EXPLANATIONS[selectedPalace]?.meaning}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Ảnh Hưởng</h4>
                    <p className="text-sm text-gray-700">
                      {PALACE_EXPLANATIONS[selectedPalace]?.influence}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Các Sao Trong Cung</h4>
                    <div className="space-y-2">
                      {data.palaces[selectedPalace - 1]?.mainStars.map((star: any, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <Badge className={getStarColor(star.nature)}>
                            {star.name}
                          </Badge>
                          <span className="text-sm text-gray-700">
                            {STAR_EXPLANATIONS[star.name]?.meaning || 'Không có thông tin'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Star Detail Dialog */}
      <Dialog open={selectedStar !== null} onOpenChange={(open) => !open && setSelectedStar(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStar && STAR_EXPLANATIONS[selectedStar]?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-4 pr-4">
              {selectedStar && (
                <>
                  <div>
                  <Badge className={getStarColor(STAR_EXPLANATIONS[selectedStar]?.nature)}>
                    {STAR_EXPLANATIONS[selectedStar]?.nature === 'cát' ? 'Cát' : 'Hung'}
                  </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Ý Nghĩa</h4>
                    <p className="text-sm text-gray-700">
                      {STAR_EXPLANATIONS[selectedStar]?.meaning}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Ảnh Hưởng</h4>
                    <p className="text-sm text-gray-700">
                      {STAR_EXPLANATIONS[selectedStar]?.influence}
                    </p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
