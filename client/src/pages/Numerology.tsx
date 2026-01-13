import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Sparkles, Hash, Loader2, Info, Download, ArrowLeft } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Streamdown } from "streamdown";
import { exportNumerologyToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i);

interface NumerologyFormData {
  fullName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

function NumberCard({ 
  number, 
  title, 
  subtitle, 
  description,
  isHighlight = false,
  delay = 0
}: { 
  number: number; 
  title: string; 
  subtitle?: string;
  description?: string;
  isHighlight?: boolean;
  delay?: number;
}) {
  return (
    <div 
      className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up ${
        isHighlight 
          ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-purple-500/20' 
          : 'bg-white border-gray-100 hover:shadow-gray-500/10'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className={`number-badge flex-shrink-0 ${[11, 22, 33].includes(number) ? 'master animate-pulse-glow' : ''}`}>
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-purple-600 font-medium">{subtitle}</p>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BirthChart({ chart }: { chart: number[][] }) {
  const positions = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
          <Info className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Biểu Đồ Ngày Sinh</h3>
          <p className="text-sm text-gray-500">Tần suất xuất hiện các con số</p>
        </div>
      </div>
      
      <div className="max-w-[200px] mx-auto">
        <div className="birth-chart-grid">
          {positions.map((row, rowIdx) =>
            row.map((num, colIdx) => {
              const count = chart[rowIdx][colIdx];
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`birth-chart-cell ${count > 0 ? "has-number" : ""}`}
                  style={{ animationDelay: `${(rowIdx * 3 + colIdx) * 100}ms` }}
                >
                  {count > 0 ? (
                    <div className="text-center">
                      <div className="text-lg font-bold">{num}</div>
                      {count > 1 && (
                        <div className="text-xs opacity-80">x{count}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-300">{num}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 transition-all duration-200 hover:bg-gray-100">
          <span className="text-gray-600">Trục Trí Tuệ (3-6-9)</span>
          <span className={`font-medium ${chart[0].filter(n => n > 0).length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {chart[0].filter(n => n > 0).length > 0 ? "Có" : "Thiếu"}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 transition-all duration-200 hover:bg-gray-100">
          <span className="text-gray-600">Trục Tinh Thần (2-5-8)</span>
          <span className={`font-medium ${chart[1].filter(n => n > 0).length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {chart[1].filter(n => n > 0).length > 0 ? "Có" : "Thiếu"}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 transition-all duration-200 hover:bg-gray-100">
          <span className="text-gray-600">Trục Thể Chất (1-4-7)</span>
          <span className={`font-medium ${chart[2].filter(n => n > 0).length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {chart[2].filter(n => n > 0).length > 0 ? "Có" : "Thiếu"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Numerology() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NumerologyFormData>({
    fullName: "",
    birthDay: 1,
    birthMonth: 1,
    birthYear: 1990,
  });
  const [result, setResult] = useState<any>(null);

  const analyzeMutation = trpc.numerology.analyze.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    
    // Tạo birthDate từ các trường tách biệt
    const birthDate = `${formData.birthYear}-${String(formData.birthMonth).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`;
    
    analyzeMutation.mutate({
      fullName: formData.fullName,
      birthDate,
    });
  };

  const handleExportPDF = () => {
    if (!result) return;
    
    try {
      const birthDate = `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`;
      exportNumerologyToPDF({
        fullName: formData.fullName,
        birthDate,
        lifePathNumber: result.result.lifePathNumber,
        soulNumber: result.result.soulNumber,
        personalityNumber: result.result.personalityNumber,
        destinyNumber: result.result.destinyNumber,
        birthDayNumber: result.result.birthDayNumber,
        birthChart: result.result.birthChart,
        aiAnalysis: result.analysis,
      });
      
      toast.success("Đã tải xuống PDF thành công!");
    } catch (error) {
      toast.error("Có lỗi khi tạo PDF. Vui lòng thử lại.");
    }
  };

  const getMeaningTitle = (num: number) => {
    const meanings: Record<number, string> = {
      1: "Người Tiên Phong",
      2: "Người Hòa Giải",
      3: "Người Sáng Tạo",
      4: "Người Xây Dựng",
      5: "Người Tự Do",
      6: "Người Chăm Sóc",
      7: "Người Tìm Kiếm",
      8: "Người Thành Đạt",
      9: "Người Nhân Đạo",
      11: "Người Trực Giác",
      22: "Người Kiến Tạo",
      33: "Người Thầy",
    };
    return meanings[num] || "";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6 animate-fade-in-down">
              <Hash className="w-4 h-4" />
              Thuật toán Pythagorean chuẩn
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Khám Phá Thần Số Học
            </h1>
            <p className="text-gray-600 animate-fade-in-up animate-delay-100">
              Tìm hiểu con số chủ đạo, số linh hồn, số nhân cách và vận mệnh 
              qua họ tên và ngày sinh của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          {!result ? (
            <div className="max-w-lg mx-auto animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Họ và tên */}
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">
                      Họ và tên đầy đủ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-2 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Nhập đúng họ tên khai sinh, hỗ trợ tiếng Việt có dấu
                    </p>
                  </div>

                  {/* Ngày sinh - tách biệt */}
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Ngày sinh (dương lịch) <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Ngày</Label>
                        <Select
                          value={String(formData.birthDay)}
                          onValueChange={(v) => setFormData({ ...formData, birthDay: parseInt(v) })}
                        >
                          <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Ngày" />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS.map((d) => (
                              <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Tháng</Label>
                        <Select
                          value={String(formData.birthMonth)}
                          onValueChange={(v) => setFormData({ ...formData, birthMonth: parseInt(v) })}
                        >
                          <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Tháng" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS.map((m) => (
                              <SelectItem key={m} value={String(m)}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Năm</Label>
                        <Select
                          value={String(formData.birthYear)}
                          onValueChange={(v) => setFormData({ ...formData, birthYear: parseInt(v) })}
                        >
                          <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Năm" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map((y) => (
                              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium" 
                    disabled={analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Đang tính toán...
                      </>
                    ) : (
                      <>
                        <Hash className="w-5 h-5 mr-2" />
                        Khám Phá Con Số Vận Mệnh
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Action buttons */}
              <div className="flex flex-wrap justify-between items-center gap-4 animate-fade-in-down">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="border-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Xem kết quả khác
                </Button>
                <div className="flex gap-3">
                  <ShareButtons
                    type="numerology"
                    title={`Thần số học của ${formData.fullName}`}
                    description={`Số chủ đạo: ${result.result.lifePathNumber}`}
                  />
                  <Button
                    variant="outline"
                    onClick={handleExportPDF}
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải PDF
                  </Button>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{formData.fullName}</h2>
                    <p className="text-indigo-100">
                      Ngày sinh: {formData.birthDay}/{formData.birthMonth}/{formData.birthYear}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                    <span className="text-indigo-100">Số chủ đạo:</span>
                    <span className="text-3xl font-bold">{result.result.lifePathNumber}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="numbers" className="animate-fade-in-up animate-delay-100">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="numbers">Các Con Số</TabsTrigger>
                  <TabsTrigger value="chart">Biểu Đồ</TabsTrigger>
                  <TabsTrigger value="analysis">Phân Tích AI</TabsTrigger>
                </TabsList>

                <TabsContent value="numbers" className="space-y-4">
                  <NumberCard
                    number={result.result.lifePathNumber}
                    title="Số Chủ Đạo (Life Path)"
                    subtitle={getMeaningTitle(result.result.lifePathNumber)}
                    description="Con số quan trọng nhất, thể hiện con đường cuộc đời và sứ mệnh của bạn."
                    isHighlight={true}
                    delay={0}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <NumberCard
                      number={result.result.soulNumber}
                      title="Số Linh Hồn (Soul)"
                      subtitle={getMeaningTitle(result.result.soulNumber)}
                      description="Thể hiện khát vọng sâu thẳm và động lực bên trong."
                      delay={100}
                    />
                    <NumberCard
                      number={result.result.personalityNumber}
                      title="Số Nhân Cách (Personality)"
                      subtitle={getMeaningTitle(result.result.personalityNumber)}
                      description="Cách người khác nhìn nhận bạn từ bên ngoài."
                      delay={200}
                    />
                    <NumberCard
                      number={result.result.destinyNumber}
                      title="Số Định Mệnh (Destiny)"
                      subtitle={getMeaningTitle(result.result.destinyNumber)}
                      description="Mục tiêu và tiềm năng bạn cần đạt được trong đời."
                      delay={300}
                    />
                    <NumberCard
                      number={result.result.birthDayNumber}
                      title="Số Ngày Sinh (Birthday)"
                      subtitle={getMeaningTitle(result.result.birthDayNumber)}
                      description="Tài năng đặc biệt và khả năng bẩm sinh của bạn."
                      delay={400}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="chart">
                  <BirthChart chart={result.result.birthChart} />
                </TabsContent>

                <TabsContent value="analysis">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Phân Tích AI</h3>
                        <p className="text-sm text-gray-500">Luận giải chi tiết từ trí tuệ nhân tạo</p>
                      </div>
                    </div>
                    <div className="prose prose-purple max-w-none">
                      <Streamdown>{result.analysis}</Streamdown>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
