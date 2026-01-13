import React, { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import ShareButtons from "@/components/ShareButtons";
import TuViChartProfessional from "@/components/TuViChartProfessional";
import { TuviAnalysisPanel } from "@/components/TuviAnalysisPanel";
import { BirthDateSelector } from "@/components/BirthDateSelector";
import {
  Star, Loader2, Sparkles, Download, ArrowLeft, ArrowUp,
  User, Calendar, Clock, Moon, Sun, Image as ImageIcon
} from "lucide-react";
import { Streamdown } from "streamdown";
import { exportTuViToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from 'html2canvas';

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

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i);

interface TuviFormData {
  fullName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour: string;
  gender: "male" | "female";
  calendarType: "lunar" | "solar";
}

export default function TuVi() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<TuviFormData>({
    fullName: "",
    birthDay: 1,
    birthMonth: 1,
    birthYear: 1990,
    birthHour: "ty",
    gender: "male",
    calendarType: "solar",
  });
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top button visibility
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generateChartMutation = trpc.tuvi.generateChart.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    },
  });

  const analyzeMutation = trpc.tuvi.analyze.useMutation({
    onSuccess: (data: any) => {
      setResult((prev: any) => ({
        ...prev,
        aiAnalysis: data.analysis
      }));
    },
    onError: (error: any) => {
      toast.error("Có lỗi khi luận giải AI: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    const birthDate = `${formData.birthYear}-${String(formData.birthMonth).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`;

    generateChartMutation.mutate({
      fullName: formData.fullName,
      birthDate,
      birthHour: formData.birthHour,
      gender: formData.gender,
      calendarType: formData.calendarType,
    });
  };

  const handleAnalyzeAI = () => {
    const birthDate = `${formData.birthYear}-${String(formData.birthMonth).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`;
    analyzeMutation.mutate({
      fullName: formData.fullName,
      birthDate,
      birthHour: formData.birthHour,
      gender: formData.gender,
      calendarType: formData.calendarType,
    });
  };

  const handleExportPDF = async () => {
    if (!result) return;
    setIsExporting(true);
    try {
      const birthDate = `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`;
      await exportTuViToPDF({
        fullName: formData.fullName,
        birthDate,
        gender: formData.gender === "male" ? "Nam" : "Nữ",
        palaces: result.chart?.palaces || [],
        element: result.chart?.element || "",
        heavenlyStem: result.chart?.heavenlyStem || "",
        earthlyBranch: result.chart?.earthlyBranch || "",
        aiAnalysis: result.aiAnalysis || "",
      });
      toast.success("Đã tải PDF thành công!");
    } catch (error) {
      toast.error("Có lỗi khi tạo PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `lasotuvi_${formData.fullName.trim().replace(/\s+/g, '_')}.png`;
      link.click();
      toast.success("Đã tải ảnh thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi tạo ảnh");
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setResult(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-64px)] pb-20">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 mix-blend-multiply" />
        </div>

        <div className="container pt-8 md:pt-12">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="max-w-3xl mx-auto"
              >
                {/* Header Section */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-100 to-amber-100 border border-white/50 rounded-full text-purple-800 text-sm font-medium mb-6 shadow-sm backdrop-blur-sm"
                  >
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>Thuật toán Tử Vi Đẩu Số & AI</span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
                    Khám Phá Vận Mệnh
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Kết hợp tinh hoa tử vi truyền thống và trí tuệ nhân tạo để giải mã chi tiết cuộc đời bạn.
                  </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500 opacity-50" />

                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    {/* Họ tên */}
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-500" />
                        Họ và tên
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="fullName"
                          placeholder="Ví dụ: Nguyễn Văn A"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="h-14 pl-4 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all rounded-xl text-lg shadow-sm group-hover/input:border-purple-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Giới tính */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-500" />
                          Giới tính
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            onClick={() => setFormData({ ...formData, gender: 'male' })}
                            className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 border-2 ${formData.gender === 'male'
                              ? 'bg-blue-50/80 border-blue-500 text-blue-700 shadow-md transform scale-[1.02]'
                              : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                              }`}
                          >
                            <User className="w-6 h-6 text-blue-600" />
                            <span className="font-medium">Nam</span>
                          </div>
                          <div
                            onClick={() => setFormData({ ...formData, gender: 'female' })}
                            className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 border-2 ${formData.gender === 'female'
                              ? 'bg-pink-50/80 border-pink-500 text-pink-700 shadow-md transform scale-[1.02]'
                              : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                              }`}
                          >
                            <User className="w-6 h-6 text-pink-600" />
                            <span className="font-medium">Nữ</span>
                          </div>
                        </div>
                      </div>

                      {/* Loại lịch */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          Loại lịch
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            onClick={() => setFormData({ ...formData, calendarType: 'solar' })}
                            className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 border-2 ${formData.calendarType === 'solar'
                              ? 'bg-amber-50/80 border-amber-500 text-amber-700 shadow-md transform scale-[1.02]'
                              : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                              }`}
                          >
                            <Sun className="w-6 h-6" />
                            <span className="font-medium">Dương lịch</span>
                          </div>
                          <div
                            onClick={() => setFormData({ ...formData, calendarType: 'lunar' })}
                            className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 border-2 ${formData.calendarType === 'lunar'
                              ? 'bg-indigo-50/80 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]'
                              : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                              }`}
                          >
                            <Moon className="w-6 h-6" />
                            <span className="font-medium">Âm lịch</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ngày tháng năm sinh & Giờ sinh */}
                    <BirthDateSelector
                      birthDay={formData.birthDay}
                      birthMonth={formData.birthMonth}
                      birthYear={formData.birthYear}
                      birthHour={formData.birthHour}
                      onBirthDayChange={(day) => setFormData({ ...formData, birthDay: day })}
                      onBirthMonthChange={(month) => setFormData({ ...formData, birthMonth: month })}
                      onBirthYearChange={(year) => setFormData({ ...formData, birthYear: year })}
                      onBirthHourChange={(hour) => setFormData({ ...formData, birthHour: hour })}
                      showHour
                    />

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full h-16 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-purple-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                        disabled={generateChartMutation.isPending}
                      >
                        {generateChartMutation.isPending ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                            Đang lập lá số...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6 mr-2" />
                            Lập Lá Số Tử Vi
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
                className="space-y-8"
              >
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại nhập liệu
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownloadImage}
                      variant="outline"
                      className="bg-white hover:bg-purple-50 text-purple-700 border-purple-200"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Tải ảnh
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      variant="outline"
                      className="bg-white hover:bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                      Xuất PDF
                    </Button>
                    <ShareButtons
                      type="tuvi"
                      title={`Lá số Tử Vi của ${formData.fullName}`}
                      description={`Xem lá số tử vi chi tiết với mệnh ${result?.chart?.element || ""}`}
                    />
                  </div>
                </div>

                {/* Main Content Grid */}
                {result?.chart && (
                  <div className="space-y-8">
                    {/* Chart Container */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                    >
                      <div className="bg-purple-50/50 p-4 border-b border-purple-100 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <h3 className="text-lg font-bold text-gray-800">Thiên Bàn & Địa Bàn</h3>
                      </div>
                      <div className="p-2 md:p-6 overflow-x-auto" ref={chartRef}>
                        <TuViChartProfessional
                          chart={result.chart}
                          input={formData}
                        />
                      </div>
                    </motion.div>

                    {/* AI Analysis Panel with Tabs */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {result?.aiAnalysis ? (
                        <TuviAnalysisPanel
                          palaces={result.chart.palaces}
                          overviewAnalysis={result.aiAnalysis}
                          input={{
                            fullName: formData.fullName,
                            birthDate: `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`,
                            birthHour: formData.birthHour,
                            gender: formData.gender,
                            calendarType: formData.calendarType
                          }}
                        />
                      ) : (
                        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 h-full flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">Luận Giải Tổng Quan Bằng AI</h3>
                          <p className="text-gray-500 max-w-md">
                            Sử dụng công nghệ AI tiên tiến để phân tích tổng quan lá số, vận hạn và đưa ra lời khuyên cốt lõi.<br />
                            <span className="text-sm text-purple-600 font-medium">Tip: Sau khi phân tích, bạn có thể chuyển tab để xem chi tiết từng cung!</span>
                          </p>
                          <Button
                            onClick={handleAnalyzeAI}
                            disabled={analyzeMutation.isPending}
                            className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105"
                            size="lg"
                          >
                            {analyzeMutation.isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Đang phân tích...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Luận giải ngay
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-2xl shadow-purple-500/50 transition-all hover:scale-110 active:scale-95"
              title="Quay lên đầu trang"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
