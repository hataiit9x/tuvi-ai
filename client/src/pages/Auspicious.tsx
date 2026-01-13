import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Sparkles, Calendar, Loader2, Heart, Store, Shovel, Plane, Home } from "lucide-react";
import { Streamdown } from "streamdown";

const PURPOSES = [
  { id: "wedding", name: "Cưới hỏi", icon: Heart, description: "Chọn ngày tốt cho lễ cưới, ăn hỏi", emoji: "💒" },
  { id: "business_opening", name: "Khai trương", icon: Store, description: "Mở cửa hàng, công ty, văn phòng", emoji: "🏪" },
  { id: "groundbreaking", name: "Động thổ", icon: Shovel, description: "Khởi công xây dựng, sửa chữa nhà", emoji: "🏗️" },
  { id: "travel", name: "Xuất hành", icon: Plane, description: "Du lịch, công tác, di chuyển xa", emoji: "✈️" },
  { id: "moving_house", name: "Nhập trạch", icon: Home, description: "Dọn về nhà mới, chuyển nhà", emoji: "🏠" },
];

type Purpose = typeof PURPOSES[number]["id"];

interface FormData {
  purpose: Purpose;
  startDate: string;
  endDate: string;
  ownerBirthYear: string;
}

function PurposeCard({ 
  purpose, 
  isSelected, 
  onClick 
}: { 
  purpose: typeof PURPOSES[number]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = purpose.icon;
  
  return (
    <button 
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        isSelected 
          ? "border-emerald-500 bg-emerald-50" 
          : "border-gray-200 hover:border-emerald-200 bg-white"
      }`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
        isSelected 
          ? "bg-emerald-500 text-white" 
          : "bg-emerald-100 text-emerald-600"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="font-semibold text-gray-900">{purpose.name}</div>
      <div className="text-xs text-gray-500 mt-1">
        {purpose.description}
      </div>
    </button>
  );
}

export default function Auspicious() {
  const [formData, setFormData] = useState<FormData>({
    purpose: "",
    startDate: "",
    endDate: "",
    ownerBirthYear: "",
  });
  const [result, setResult] = useState<any>(null);

  const getDatesMutation = trpc.auspicious.getDates.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purpose || !formData.startDate || !formData.endDate) {
      return;
    }
    getDatesMutation.mutate({
      purpose: formData.purpose as any,
      startDate: formData.startDate,
      endDate: formData.endDate,
      ownerBirthYear: formData.ownerBirthYear ? parseInt(formData.ownerBirthYear) : undefined,
    });
  };

  // Set default date range (next 3 months)
  const today = new Date();
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  const defaultStartDate = today.toISOString().split("T")[0];
  const defaultEndDate = threeMonthsLater.toISOString().split("T")[0];

  const selectedPurpose = PURPOSES.find(p => p.id === formData.purpose);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Chọn ngày theo phong thủy
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ngày Đẹp Giờ Tốt
            </h1>
            <p className="text-gray-600">
              Chọn ngày tốt theo mục đích và xem giờ hoàng đạo cho các việc quan trọng trong cuộc sống.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          {!result ? (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Purpose Selection */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Chọn Mục Đích
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  Bạn muốn xem ngày tốt cho việc gì?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {PURPOSES.map((purpose) => (
                    <PurposeCard
                      key={purpose.id}
                      purpose={purpose}
                      isSelected={formData.purpose === purpose.id}
                      onClick={() => setFormData({ ...formData, purpose: purpose.id })}
                    />
                  ))}
                </div>
              </div>

              {/* Date Range Form */}
              {formData.purpose && (
                <div className="result-card max-w-xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Chọn Khoảng Thời Gian</h3>
                      <p className="text-sm text-gray-500">Hệ thống sẽ tìm các ngày tốt trong khoảng thời gian bạn chọn</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate" className="form-label">Từ ngày</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate || defaultStartDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="form-input"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate" className="form-label">Đến ngày</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate || defaultEndDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ownerBirthYear" className="form-label">Năm sinh gia chủ (tùy chọn)</Label>
                      <Input
                        id="ownerBirthYear"
                        type="number"
                        placeholder="VD: 1990"
                        value={formData.ownerBirthYear}
                        onChange={(e) => setFormData({ ...formData, ownerBirthYear: e.target.value })}
                        className="form-input"
                        min="1900"
                        max="2100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Nhập năm sinh để xem ngày hợp tuổi
                      </p>
                    </div>

                    <Button type="submit" className="btn-primary w-full" disabled={getDatesMutation.isPending}>
                      {getDatesMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Đang tìm ngày tốt...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Xem Ngày Đẹp Giờ Tốt
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="btn-secondary"
                >
                  Tìm kiếm khác
                </Button>
              </div>

              {/* Result Header */}
              <div className="result-card text-center">
                <div className="text-4xl mb-4">{selectedPurpose?.emoji}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ngày Tốt Cho {selectedPurpose?.name}
                </h2>
                <p className="text-gray-500">
                  Từ {new Date(result.dateRange.start).toLocaleDateString("vi-VN")} đến {new Date(result.dateRange.end).toLocaleDateString("vi-VN")}
                </p>
              </div>

              {/* Result Content */}
              <div className="result-card">
                <div className="result-header">
                  <div className="result-icon bg-gradient-to-br from-emerald-100 to-teal-100">
                    <Sparkles className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Kết Quả Xem Ngày</h3>
                    <p className="text-gray-500">Phân tích từ trí tuệ nhân tạo</p>
                  </div>
                </div>
                <div className="prose prose-gray max-w-none">
                  <Streamdown>{result.result}</Streamdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
