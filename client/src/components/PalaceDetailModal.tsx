import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { Sparkles, Loader2 } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface Star {
  name: string;
  nature?: string;
}

interface Palace {
  name: string;
  mainStars?: Star[];
  secondaryStars?: Star[];
  trangSinh?: string;
  nguHanh?: string;
}

interface TuviInput {
  fullName: string;
  birthDate: string;
  birthHour: string;
  gender: "male" | "female";
  calendarType: "lunar" | "solar";
}

interface PalaceDetailModalProps {
  palace: Palace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  input?: TuviInput;
}

const PALACE_EXPLANATIONS: Record<string, { chinese: string; meaning: string; influence: string }> = {
  'Mệnh': {
    chinese: '命',
    meaning: 'Cung Mệnh đại diện cho tính cách, vận mệnh và con đường sống của người. Đây là cung quan trọng nhất trong lá số tử vi.',
    influence: 'Ảnh hưởng đến tổng thể vận mệnh, tính cách, khả năng lãnh đạo, sự tự tin và định hướng cuộc sống'
  },
  'Phụ Mẫu': {
    chinese: '父母',
    meaning: 'Cung Phụ Mẫu liên quan đến mối quan hệ với cha mẹ, những người bảo trợ và người hướng dẫn.',
    influence: 'Ảnh hưởng đến mối quan hệ gia đình, sự hỗ trợ từ người lớn tuổi, di sản gia đình'
  },
  'Phúc Đức': {
    chinese: '福德',
    meaning: 'Cung Phúc Đức thể hiện phúc báo, tài lộc, sự may mắn và hạnh phúc tinh thần trong cuộc sống.',
    influence: 'Ảnh hưởng đến tài chính, phúc lộc, sự hài lòng, tâm trạng và hạnh phúc nội tâm'
  },
  'Điền Trạch': {
    chinese: '田宅',
    meaning: 'Cung Điền Trạch liên quan đến bất động sản, nhà cửa, đất đai và tài sản cố định.',
    influence: 'Ảnh hưởng đến bất động sản, tài sản, nơi ở, di sản gia đình, môi trường sống'
  },
  'Quan Lộc': {
    chinese: '官祿',
    meaning: 'Cung Quan Lộc đại diện cho sự nghiệp, công việc, địa vị xã hội và thành công trong công việc.',
    influence: 'Ảnh hưởng đến sự nghiệp, công việc, địa vị, danh vọng, sự phát triển chuyên môn'
  },
  'Nô Bộc': {
    chinese: '奴僕',
    meaning: 'Cung Nô Bộc liên quan đến mối quan hệ với nhân viên, cấp dưới, bạn bè và đồng nghiệp.',
    influence: 'Ảnh hưởng đến mối quan hệ công việc, tình bạn, mối quan hệ cấp dưới, hợp tác'
  },
  'Thiên Di': {
    chinese: '遷移',
    meaning: 'Cung Thiên Di đại diện cho những thay đổi, di chuyển, du lịch và những cuộc hành trình.',
    influence: 'Ảnh hưởng đến du lịch, di cư, những thay đổi trong cuộc sống, phát triển bên ngoài'
  },
  'Tật Ách': {
    chinese: '疾厄',
    meaning: 'Cung Tật Ách liên quan đến sức khỏe, bệnh tật, những trở ngại và khó khăn cần vượt qua.',
    influence: 'Ảnh hưởng đến sức khỏe, bệnh tật, những khó khăn, khả năng vượt qua thử thách'
  },
  'Tài Bạch': {
    chinese: '財帛',
    meaning: 'Cung Tài Bạch đại diện cho tài chính, tiền bạc, thu nhập và tài sản động.',
    influence: 'Ảnh hưởng đến tài chính, tiền bạc, thu nhập, tài sản động, khả năng kiếm tiền'
  },
  'Tử Tức': {
    chinese: '子息',
    meaning: 'Cung Tử Tức liên quan đến con cái, những người kế thừa và mối quan hệ với con em.',
    influence: 'Ảnh hưởng đến con cái, tình yêu, mối quan hệ với con em, sự truyền thừa'
  },
  'Phu Thê': {
    chinese: '夫妻',
    meaning: 'Cung Phu Thê đại diện cho hôn nhân, tình yêu, mối quan hệ lãng mạn và đôi lứa.',
    influence: 'Ảnh hưởng đến hôn nhân, tình yêu, mối quan hệ đôi lứa, sự hòa hợp trong gia đình'
  },
  'Huynh Đệ': {
    chinese: '兄弟',
    meaning: 'Cung Huynh Đệ liên quan đến anh em ruột, người anh chị em và mối quan hệ anh em.',
    influence: 'Ảnh hưởng đến mối quan hệ anh em, sự hỗ trợ từ gia đình, tình cảm gia đình'
  },
};

const STAR_MEANINGS: Record<string, string> = {
  'Tử': 'Sao Tử - Sao chính của cung Tử Tức, tượng trưng cho sự phát triển, tài năng',
  'Phá': 'Sao Phá - Sao hung, tượng trưng cho sự phá vỡ, thay đổi',
  'Thăng': 'Sao Thăng - Sao cát, tượng trưng cho sự lên tiến, phát triển',
  'Liêm': 'Sao Liêm - Sao cát, tượng trưng cho sự liêm chính, tốt bụng',
  'Trinh': 'Sao Trinh - Sao cát, tượng trưng cho sự trinh khiết, thánh thiện',
  'Vũ': 'Sao Vũ - Sao hung, tượng trưng cho sự hung tợn, mạnh mẽ',
  'Tương': 'Sao Tương - Sao cát, tượng trưng cho sự hỗ trợ, giúp đỡ',
  'Hóa': 'Sao Hóa - Sao cát, tượng trưng cho sự hóa giải, chuyển hóa',
};

export default function PalaceDetailModal({ palace, open, onOpenChange, input }: PalaceDetailModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const analyzePalaceMutation = trpc.tuvi.analyzePalace.useMutation({
    onSuccess: (data: any) => {
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      setAiAnalysis(content);
    },
    onError: (error: any) => {
      console.error("Lỗi AI:", error.message);
      setAiAnalysis("Không thể phân tích lúc này. Vui lòng thử lại sau.");
    },
  });

  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      setAiAnalysis(null); // Reset AI analysis when opening new palace
    }
  }, [open]);

  const handleAnalyzePalace = () => {
    if (!input || !palace) return;
    analyzePalaceMutation.mutate({
      ...input,
      palaceName: palace.name,
    });
  };

  if (!palace) return null;

  const explanation = PALACE_EXPLANATIONS[palace.name] || {
    chinese: '?',
    meaning: 'Thông tin chi tiết không khả dụng',
    influence: 'Ảnh hưởng chưa được xác định'
  };

  const mainStars = palace.mainStars || [];
  const secondaryStars = palace.secondaryStars || [];

  return (
    <>
      {/* CSS Animation */}
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .palace-modal-content {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .palace-modal-overlay {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .palace-header {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .palace-section {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .palace-section:nth-child(2) {
          animation-delay: 0.1s;
        }

        .palace-section:nth-child(3) {
          animation-delay: 0.2s;
        }

        .palace-section:nth-child(4) {
          animation-delay: 0.3s;
        }

        .palace-section:nth-child(5) {
          animation-delay: 0.4s;
        }

        .palace-star-item {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .palace-badge {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto palace-modal-content">
          <DialogHeader className="palace-header">
            <DialogTitle className="text-2xl">
              <span className="text-amber-900">{palace.name}</span>
              <span className="text-amber-600 ml-2 text-lg">({explanation.chinese})</span>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              {/* Ý nghĩa cung */}
              <div className="palace-section">
                <h3 className="font-bold text-amber-900 mb-2">Ý Nghĩa Cung</h3>
                <p className="text-gray-700 leading-relaxed">{explanation.meaning}</p>
              </div>

              {/* Ảnh hưởng */}
              <div className="palace-section">
                <h3 className="font-bold text-amber-900 mb-2">Ảnh Hưởng</h3>
                <p className="text-gray-700 leading-relaxed">{explanation.influence}</p>
              </div>

              {/* Sao chính */}
              {mainStars.length > 0 && (
                <div className="palace-section">
                  <h3 className="font-bold text-amber-900 mb-3">Sao Chính (Chính Tinh)</h3>
                  <div className="space-y-2">
                    {mainStars.map((star, i) => (
                      <div key={i} className="palace-star-item bg-amber-50 p-3 rounded-lg border border-amber-200" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`font-bold ${star.nature === 'cat' ? 'text-red-600' :
                              star.nature === 'hung' ? 'text-green-700' : 'text-gray-700'
                              }`}>
                              {star.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {STAR_MEANINGS[star.name] || `Sao ${star.name}`}
                            </p>
                          </div>
                          <Badge className={`palace-badge ${star.nature === 'cat' ? 'bg-red-100 text-red-800' :
                            star.nature === 'hung' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {star.nature === 'cat' ? 'Cát' : star.nature === 'hung' ? 'Hung' : 'Trung'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sao phụ */}
              {secondaryStars.length > 0 && (
                <div className="palace-section">
                  <h3 className="font-bold text-amber-900 mb-3">Sao Phụ (Phụ Tinh)</h3>
                  <div className="flex flex-wrap gap-2">
                    {secondaryStars.map((star, i) => (
                      <Badge
                        key={i}
                        className={`palace-badge px-3 py-1.5 ${star.nature === 'cat' ? 'bg-red-100 text-red-800' :
                          star.nature === 'hung' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {star.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tràng Sinh */}
              {palace.trangSinh && (
                <div className="palace-section">
                  <h3 className="font-bold text-amber-900 mb-2">Tràng Sinh</h3>
                  <p className="text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    {palace.trangSinh}
                  </p>
                </div>
              )}

              {/* Ngũ Hành */}
              {palace.nguHanh && (
                <div className="palace-section">
                  <h3 className="font-bold text-amber-900 mb-2">Ngũ Hành</h3>
                  <p className="text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    {palace.nguHanh}
                  </p>
                </div>
              )}

              {/* AI Analysis Section */}
              {input && (
                <div className="palace-section border-t-2 border-purple-100 pt-6 mt-6">
                  <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Luận Giải Chi Tiết (AI)
                  </h3>

                  {!aiAnalysis ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4 text-sm">
                        Nhận phân tích chuyên sâu về cung {palace.name} từ AI Master
                      </p>
                      <Button
                        onClick={handleAnalyzePalace}
                        disabled={analyzePalaceMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        {analyzePalaceMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang phân tích...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Luận giải ngay
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-200">
                      <div className="prose prose-sm prose-purple max-w-none">
                        <Streamdown>{aiAnalysis}</Streamdown>
                      </div>
                    </div>
                  )}
                </div>
              )}


            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
