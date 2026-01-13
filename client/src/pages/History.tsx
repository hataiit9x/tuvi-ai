import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { getLoginUrl } from "@/const";
import { History as HistoryIcon, Star, Hash, Loader2, Calendar, User, Eye, Clock, Download, Trash2 } from "lucide-react";
import { Streamdown } from "streamdown";
import { exportTuViToPDF, exportNumerologyToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";
import ShareButtons from "@/components/ShareButtons";
import { formatDateVN, formatDateTimeVN } from "@/lib/dateUtils";

function TuviHistory() {
  const utils = trpc.useUtils();
  const { data: readings, isLoading } = trpc.tuvi.history.useQuery();
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = trpc.tuvi.delete.useMutation({
    onSuccess: () => {
      toast.success("Đã xóa kết quả tra cứu");
      utils.tuvi.history.invalidate();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Không thể xóa kết quả");
    },
  });

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  const handleExportPDF = (reading: any) => {
    try {
      const chartData = typeof reading.chartData === 'string' 
        ? JSON.parse(reading.chartData) 
        : reading.chartData;
      
      exportTuViToPDF({
        fullName: reading.fullName,
        birthDate: reading.birthDate,
        birthHour: reading.birthHour,
        gender: reading.gender,
        calendarType: reading.calendarType,
        palaces: chartData.palaces || [],
        element: chartData.element,
        heavenlyStem: chartData.heavenlyStem,
        earthlyBranch: chartData.earthlyBranch,
        aiAnalysis: reading.aiAnalysis,
      });
      toast.success("Đã tải xuống file PDF");
    } catch (error) {
      toast.error("Không thể tạo file PDF");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <div className="result-card text-center py-12 animate-fade-in-up">
        <Star className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="font-bold text-lg text-gray-900 mb-2">Chưa có lịch sử</h3>
        <p className="text-gray-500 mb-4">
          Bạn chưa xem lá số tử vi nào. Hãy bắt đầu khám phá!
        </p>
        <Link href="/tuvi">
          <Button className="btn-primary">Xem Lá Số Tử Vi</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {readings.map((reading: any, index: number) => (
          <div 
            key={reading.id} 
            className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 animate-fade-in-up cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedReading(reading)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{reading.fullName}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDateVN(reading.birthDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {reading.gender === "male" ? "Nam" : "Nữ"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {reading.birthHour}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <HistoryIcon className="w-3 h-3" />
                  {formatDateTimeVN(reading.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleDelete(reading.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 mr-1" />
                  Xem
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kết quả tra cứu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
              <Star className="w-6 h-6" />
              Lá Số Tử Vi - {selectedReading?.fullName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedReading && (
            <div className="space-y-6">
              {/* Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Ngày sinh</p>
                  <p className="font-semibold text-gray-900">{formatDateVN(selectedReading.birthDate)}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Giờ sinh</p>
                  <p className="font-semibold text-gray-900">{selectedReading.birthHour}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Giới tính</p>
                  <p className="font-semibold text-gray-900">{selectedReading.gender === "male" ? "Nam" : "Nữ"}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Loại lịch</p>
                  <p className="font-semibold text-gray-900">{selectedReading.calendarType === "lunar" ? "Âm lịch" : "Dương lịch"}</p>
                </div>
              </div>

              {/* AI Analysis */}
              {selectedReading.aiAnalysis && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                  <h4 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Phân Tích AI
                  </h4>
                  <div className="prose prose-gray max-w-none prose-sm">
                    <Streamdown>{selectedReading.aiAnalysis}</Streamdown>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <ShareButtons
                  title="Lá Số Tử Vi"
                  description={`Lá số tử vi của ${selectedReading.fullName}`}
                  type="tuvi"
                  data={{
                    name: selectedReading.fullName,
                    birthDate: formatDateVN(selectedReading.birthDate),
                  }}
                />
                <Button
                  onClick={() => handleExportPDF(selectedReading)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function NumerologyHistory() {
  const utils = trpc.useUtils();
  const { data: readings, isLoading } = trpc.numerology.history.useQuery();
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = trpc.numerology.delete.useMutation({
    onSuccess: () => {
      toast.success("Đã xóa kết quả tra cứu");
      utils.numerology.history.invalidate();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Không thể xóa kết quả");
    },
  });

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  const handleExportPDF = (reading: any) => {
    try {
      const birthChart = typeof reading.birthChart === 'string' 
        ? JSON.parse(reading.birthChart) 
        : reading.birthChart;
      
      exportNumerologyToPDF({
        fullName: reading.fullName,
        birthDate: reading.birthDate,
        lifePathNumber: reading.lifePathNumber,
        soulNumber: reading.soulNumber,
        personalityNumber: reading.personalityNumber,
        destinyNumber: reading.destinyNumber,
        birthDayNumber: reading.birthDayNumber,
        birthChart: birthChart || [],
        aiAnalysis: reading.aiAnalysis,
      });
      toast.success("Đã tải xuống file PDF");
    } catch (error) {
      toast.error("Không thể tạo file PDF");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <div className="result-card text-center py-12 animate-fade-in-up">
        <Hash className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="font-bold text-lg text-gray-900 mb-2">Chưa có lịch sử</h3>
        <p className="text-gray-500 mb-4">
          Bạn chưa xem thần số học nào. Hãy bắt đầu khám phá!
        </p>
        <Link href="/numerology">
          <Button className="btn-primary">Khám Phá Thần Số Học</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {readings.map((reading: any, index: number) => (
          <div 
            key={reading.id} 
            className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 animate-fade-in-up cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedReading(reading)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Hash className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{reading.fullName}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDateVN(reading.birthDate)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                    Số Chủ Đạo: {reading.lifePathNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                    Linh Hồn: {reading.soulNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                    Định Mệnh: {reading.destinyNumber}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <HistoryIcon className="w-3 h-3" />
                  {formatDateTimeVN(reading.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleDelete(reading.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 mr-1" />
                  Xem
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kết quả tra cứu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
              <Hash className="w-6 h-6" />
              Thần Số Học - {selectedReading?.fullName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedReading && (
            <div className="space-y-6">
              {/* Numbers Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 text-center">
                  <p className="text-3xl font-bold text-purple-700">{selectedReading.lifePathNumber}</p>
                  <p className="text-xs text-purple-600 mt-1">Số Chủ Đạo</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 text-center">
                  <p className="text-3xl font-bold text-amber-700">{selectedReading.soulNumber}</p>
                  <p className="text-xs text-amber-600 mt-1">Số Linh Hồn</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 text-center">
                  <p className="text-3xl font-bold text-blue-700">{selectedReading.personalityNumber}</p>
                  <p className="text-xs text-blue-600 mt-1">Số Nhân Cách</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 text-center">
                  <p className="text-3xl font-bold text-emerald-700">{selectedReading.destinyNumber}</p>
                  <p className="text-xs text-emerald-600 mt-1">Số Định Mệnh</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-200 text-center">
                  <p className="text-3xl font-bold text-rose-700">{selectedReading.birthDayNumber}</p>
                  <p className="text-xs text-rose-600 mt-1">Số Ngày Sinh</p>
                </div>
              </div>

              {/* AI Analysis */}
              {selectedReading.aiAnalysis && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                  <h4 className="font-bold text-indigo-700 mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Phân Tích AI
                  </h4>
                  <div className="prose prose-gray max-w-none prose-sm">
                    <Streamdown>{selectedReading.aiAnalysis}</Streamdown>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <ShareButtons
                  title="Thần Số Học"
                  description={`Kết quả thần số học của ${selectedReading.fullName}`}
                  type="numerology"
                  data={{
                    name: selectedReading.fullName,
                    birthDate: formatDateVN(selectedReading.birthDate),
                    mainNumber: selectedReading.lifePathNumber,
                  }}
                />
                <Button
                  onClick={() => handleExportPDF(selectedReading)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function History() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container">
            <div className="max-w-md mx-auto text-center animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                <HistoryIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Đăng Nhập Để Xem Lịch Sử
              </h1>
              <p className="text-gray-500 mb-8">
                Bạn cần đăng nhập để xem lịch sử tra cứu Tử Vi và Thần Số Học của mình.
              </p>
              <a href={getLoginUrl()}>
                <Button className="btn-primary">
                  Đăng Nhập Ngay
                </Button>
              </a>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-6 animate-fade-in-down">
              <HistoryIcon className="w-4 h-4" />
              Lịch sử tra cứu
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Lịch Sử Tra Cứu
            </h1>
            <p className="text-gray-600 animate-fade-in-up animate-delay-100">
              Xem lại các lá số tử vi và kết quả thần số học bạn đã tra cứu.
              Click vào mỗi kết quả để xem chi tiết, hoặc xóa những kết quả không cần thiết.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="tuvi" className="w-full">
              <TabsList className="tab-list mb-8 animate-fade-in-up">
                <TabsTrigger value="tuvi" className="tab-trigger">
                  <Star className="w-4 h-4" />
                  Tử Vi
                </TabsTrigger>
                <TabsTrigger value="numerology" className="tab-trigger">
                  <Hash className="w-4 h-4" />
                  Thần Số Học
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tuvi" className="mt-0 animate-fade-in">
                <TuviHistory />
              </TabsContent>
              
              <TabsContent value="numerology" className="mt-0 animate-fade-in">
                <NumerologyHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
