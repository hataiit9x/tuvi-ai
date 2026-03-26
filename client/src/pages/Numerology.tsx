import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Sparkles, Hash, Loader2, Info, Download, ArrowLeft, Send, Bot, User2, MessageSquarePlus } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Streamdown } from "streamdown";
import { exportNumerologyToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";
import { LifePathCycleChart } from "@/components/numerology/LifePathCycleChart";
import { PyramidChart } from "@/components/numerology/PyramidChart";
import { PersonalIndicator } from "@/components/numerology/PersonalIndicator";
import { NumerologyCycleChart } from "@/components/numerology/NumerologyCycleChart";
import { LifePathNumber } from "@/components/numerology/LifePathNumber";

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
  delay = 0,
  className = ""
}: { 
  number: number; 
  title: string; 
  subtitle?: string;
  description?: string;
  isHighlight?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div 
      className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 hover:shadow-lg group ${
        isHighlight 
          ? 'bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white border-transparent shadow-violet-500/20' 
          : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700'
      } ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center text-center gap-2 relative z-10">
        <h3 className={`text-xs uppercase tracking-wider font-semibold ${isHighlight ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
          {title}
        </h3>
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg font-bold text-2xl shadow-inner ${
          isHighlight 
            ? 'bg-white/20 text-white backdrop-blur-md' 
            : 'bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/50 dark:to-slate-900 text-purple-700 dark:text-purple-300'
        }`}>
          {number}
        </div>
        {subtitle && (
          <p className={`text-xs font-medium ${isHighlight ? 'text-white/80' : 'text-purple-600 dark:text-purple-400'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function BirthChart({ chart }: { chart: number[][] }) {
  // Flatten chart for grid rendering 3x3
  // Chart is [Row1, Row2, Row3] -> [3,6,9], [2,5,8], [1,4,7]
  const rows = chart;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center w-full mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent flex-1"></div>
        <div className="bg-gradient-to-r from-amber-600 to-amber-400 px-6 py-1.5 mx-4 rounded-sm shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <h3 className="font-bold text-white uppercase tracking-widest text-lg md:text-xl">Sơ Đồ Sức Mạnh</h3>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent flex-1"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-8 text-center">(Thế mạnh hoặc khiếm khuyết nổi trội ảnh hưởng đến năng lực của bạn)</p>

      <div className="relative p-6 md:p-10 bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg">
        <div className="grid grid-cols-3 gap-0 relative z-10 border-2 border-amber-200 dark:border-amber-700/50 bg-white dark:bg-slate-900 mx-auto">
          {/* Row 3 (Top in visual grid): 3 6 9 */}
          {rows[0].map((count, i) => (
             <div key={`r0-${i}`} className="w-full aspect-square flex items-center justify-center border border-amber-200 dark:border-amber-700/50 relative">
                {count > 0 && (
                  <span className="text-3xl md:text-4xl font-medium text-slate-800 dark:text-white tracking-widest">
                    {Array(count).fill(3 + i * 3).join(" ")}
                  </span>
                )}
             </div>
          ))}

          {/* Row 2: 2 5 8 */}
          {rows[1].map((count, i) => (
             <div key={`r1-${i}`} className="w-full aspect-square flex items-center justify-center border border-amber-200 dark:border-amber-700/50 relative">
                {count > 0 && (
                  <span className="text-3xl md:text-4xl font-medium text-slate-800 dark:text-white tracking-widest">
                    {Array(count).fill(2 + i * 3).join(" ")}
                  </span>
                )}
             </div>
          ))}

          {/* Row 1: 1 4 7 */}
          {rows[2].map((count, i) => (
             <div key={`r2-${i}`} className="w-full aspect-square flex items-center justify-center border border-amber-200 dark:border-amber-700/50 relative">
                {count > 0 && (
                  <span className="text-3xl md:text-4xl font-medium text-slate-800 dark:text-white tracking-widest">
                    {Array(count).fill(1 + i * 3).join(" ")}
                  </span>
                )}
             </div>
          ))}
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
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const analyzeMutation = trpc.numerology.analyze.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
      setChatMessages([]); // Reset chat whenever a new reading is done
    },
  });

  const chatMutation = trpc.numerology.chat.useMutation({
    onSuccess: (data) => {
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    },
    onError: (err) => {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Xin lỗi, có lỗi xảy ra: ${err.message}` }]);
    },
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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

  const handleSendChat = () => {
    const question = chatInput.trim();
    if (!question || !result || chatMutation.isPending) return;

    const birthDate = `${formData.birthYear}-${String(formData.birthMonth).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`;
    const r = result.result;

    setChatMessages(prev => [...prev, { role: 'user', content: question }]);
    setChatInput("");

    chatMutation.mutate({
      fullName: formData.fullName,
      birthDate,
      numerologyContext: {
        lifePathNumber: r.lifePathNumber,
        soulNumber: r.soulNumber,
        personalityNumber: r.personalityNumber,
        destinyNumber: r.destinyNumber,
        birthDayNumber: r.birthDayNumber,
        pinnacles: r.pinnacles,
        challenges: r.challenges,
        personalYear: r.personalYear,
      },
      messages: chatMessages,
      question,
    });
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
      {/* Hero Section - Hidden when result is shown to focus on dashboard */}
      {!result && (
        <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-background dark:to-background py-12">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 animate-fade-in-down border border-transparent dark:border-indigo-500/30">
                <Hash className="w-4 h-4" />
                Thuật toán Pythagorean chuẩn
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
                Khám Phá Thần Số Học
              </h1>
              <p className="text-gray-600 dark:text-gray-300 animate-fade-in-up animate-delay-100">
                Tìm hiểu con số chủ đạo, số linh hồn, số nhân cách và vận mệnh 
                qua họ tên và ngày sinh của bạn.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className={`py-12 ${result ? 'pt-4' : ''}`}>
        <div className="container">
          {!result ? (
            <div className="max-w-lg mx-auto animate-fade-in-up">
              <div className="bg-white dark:bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Họ và tên */}
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-200 font-medium">
                      Họ và tên đầy đủ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-2 h-12 bg-gray-50 dark:bg-muted/50 border-gray-200 dark:border-border focus:bg-white dark:focus:bg-card dark:text-foreground"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Nhập đúng họ tên khai sinh, hỗ trợ tiếng Việt có dấu
                    </p>
                  </div>

                  {/* Ngày sinh - tách biệt */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-200 font-medium">
                      Ngày sinh (dương lịch) <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div>
                        <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Ngày</Label>
                        <Select
                          value={String(formData.birthDay)}
                          onValueChange={(v) => setFormData({ ...formData, birthDay: parseInt(v) })}
                        >
                          <SelectTrigger className="h-12 bg-gray-50 dark:bg-muted/50 border-gray-200 dark:border-border dark:text-foreground">
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
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50" 
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
                        Khám Phá Bản Thân
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in-up">
              {/* Back & Actions */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
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
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500/50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải PDF
                  </Button>
                </div>
              </div>

              {/* DASHBOARD TABS */}
              <Tabs defaultValue="charts" className="animate-fade-in-up">
                <div className="flex justify-center mb-8">
                  <TabsList className="grid grid-cols-3 bg-white/50 dark:bg-white/5 p-1 rounded-full border border-purple-100 dark:border-purple-800/50">
                    <TabsTrigger value="charts" className="rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Tổng Quan & Biểu Đồ
                    </TabsTrigger>
                     <TabsTrigger value="analysis" className="rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Luận Giải Chi Tiết
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-1.5">
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      Hỏi AI
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="charts" className="space-y-8">
                  {/* 1. Cycle of Destiny Chart (Full Width) */}
                  <div className="bg-white/60 dark:bg-card/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-lg relative z-10 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                          Biểu Đồ Vận Số (Cycle of Destiny)
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          Năng lượng từng năm trong chu kỳ 9 năm
                        </p>
                      </div>
                    </div>
                    
                    {result.result.cycleForecast && (
                       <NumerologyCycleChart data={result.result.cycleForecast} />
                    )}
                  </div>
                  
                  {/* 2. Core Numbers Grid - Matches user reference */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <NumberCard
                      number={result.result.lifePathNumber}
                      title="Chủ Đạo"
                      isHighlight={true}
                      delay={100}
                    />
                    <NumberCard
                      number={result.result.soulNumber}
                      title="Linh Hồn"
                      delay={200}
                    />
                    <NumberCard
                      number={result.result.destinyNumber}
                      title="Sứ Mệnh"
                      delay={300}
                    />
                     <NumberCard
                      number={result.result.personalityNumber}
                      title="Nhân Cách"
                      delay={400}
                    />
                     <NumberCard
                      number={5} // Placeholder for 'Thái độ' - User ref has it, we might calculate it later
                      title="Thái Độ"
                      delay={500}
                    />
                     <NumberCard
                      number={result.result.birthDayNumber}
                      title="Ngày Sinh"
                      delay={550}
                    />
                  </div>

                  {/* 3. Charts Row: Pyramid & Birth Chart */}
                  <div className="grid lg:grid-cols-2 gap-8">
                      {/* Pyramid */}
                      <div className="bg-white/60 dark:bg-card/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-lg">
                        <PyramidChart
                          pinnacles={result.result.pinnacles}
                          challenges={result.result.challenges}
                          birthDate={`${formData.birthYear}-${String(formData.birthMonth).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`}
                        />
                      </div>

                      {/* Birth Chart */}
                      <div className="bg-white/60 dark:bg-card/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-lg flex flex-col items-center justify-center">
                         <BirthChart chart={result.result.birthChart} />
                      </div>
                  </div>
                </TabsContent>

                <TabsContent value="analysis">
                  <div className="bg-white/80 dark:bg-card/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden min-h-[600px]">
                    <div className="p-6 md:p-8">
                       <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Luận Giải Chi Tiết</h3>
                          <p className="text-sm text-gray-500">Phân tích chuyên sâu từng khía cạnh</p>
                        </div>
                      </div>

                      {/* Content of analysis - splitting logic would go here, currently treating as one block but wrapped nicely */}
                      <div className="prose prose-purple dark:prose-invert max-w-none">
                        <Streamdown>{result.analysis}</Streamdown>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* CHAT TAB */}
                <TabsContent value="chat">
                  <div className="bg-white/80 dark:bg-card/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden flex flex-col" style={{ minHeight: '600px', maxHeight: '80vh' }}>
                    {/* Header */}
                    <div className="p-5 border-b border-purple-100 dark:border-purple-900/30 flex items-center gap-3 flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Số Học AI</h3>
                        <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Sẵn sàng tư vấn cho {formData.fullName}</p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-70">
                          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                            <MessageSquarePlus className="w-8 h-8 text-purple-500" />
                          </div>
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Hỏi bất kỳ điều gì về thần số học</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Ví dụ: "Số chủ đạo 7 có phù hợp kinh doanh không?", "Năm cá nhân của tôi ảnh hưởng thế nào đến tình cảm?"</p>
                          <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {["Sự nghiệp của tôi ra sao?", "Tháng tốt nhất năm nay?", "Tôi hợp với số mấy?"].map(q => (
                              <button key={q} onClick={() => { setChatInput(q); chatInputRef.current?.focus(); }}
                                className="text-xs px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-1 shadow">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-purple-600 text-white rounded-tr-none'
                              : 'bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/30 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'
                          }`}>
                            {msg.role === 'assistant'
                              ? <div className="prose prose-sm prose-purple dark:prose-invert max-w-none"><Streamdown>{msg.content}</Streamdown></div>
                              : msg.content
                            }
                          </div>
                          {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                              <User2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </div>
                          )}
                        </div>
                      ))}

                      {chatMutation.isPending && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/30 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-sm text-gray-500 shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang suy nghĩ...
                          </div>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="p-4 border-t border-purple-100 dark:border-purple-900/30 flex-shrink-0">
                      <div className="flex gap-2">
                        <input
                          ref={chatInputRef}
                          type="text"
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                          placeholder="Hỏi về thần số học của bạn..."
                          disabled={chatMutation.isPending}
                          className="flex-1 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                        />
                        <button
                          onClick={handleSendChat}
                          disabled={!chatInput.trim() || chatMutation.isPending}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shadow flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
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
