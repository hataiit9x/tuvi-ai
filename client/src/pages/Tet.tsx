import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Sparkles, Gift, Loader2, Home, Palette, Banknote } from "lucide-react";
import { Streamdown } from "streamdown";

function XongDatTab() {
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<any>(null);

  const xongDatMutation = trpc.tet.xongDat.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthYear) return;
    xongDatMutation.mutate({ ownerBirthYear: parseInt(birthYear) });
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="result-card max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Home className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Xông Đất Đầu Năm</h3>
            <p className="text-gray-500">Tìm tuổi hợp xông đất cho gia chủ</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="ownerYear" className="form-label">Năm sinh gia chủ</Label>
              <Input
                id="ownerYear"
                type="number"
                placeholder="VD: 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="form-input"
                min="1900"
                max="2100"
                required
              />
            </div>
            <Button type="submit" className="btn-primary w-full" disabled={xongDatMutation.isPending}>
              {xongDatMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tính toán...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Xem Tuổi Xông Đất
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setResult(null)} className="btn-secondary">
            Tính lại
          </Button>

          <div className="result-card">
            <div className="result-header">
              <div className="result-icon bg-gradient-to-br from-red-100 to-pink-100">
                <Home className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Kết Quả Xông Đất</h3>
                <p className="text-gray-500">Gia chủ tuổi {result.ownerZodiac} - Mệnh {result.ownerElement}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">Tuổi Hợp Xông Đất</h4>
                <div className="flex flex-wrap gap-2">
                  {result.suitableZodiacs.map((zodiac: string) => (
                    <span key={zodiac} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      {zodiac}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Các tuổi: {result.suitableAges.join(", ")}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">Tuổi Nên Tránh</h4>
                <div className="flex flex-wrap gap-2">
                  {result.avoidZodiacs.map((zodiac: string) => (
                    <span key={zodiac} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                      {zodiac}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Các tuổi: {result.avoidAges.join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="result-card">
            <div className="result-header">
              <div className="result-icon bg-gradient-to-br from-amber-100 to-yellow-100">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Hướng Dẫn Chi Tiết</h3>
                <p className="text-gray-500">Phân tích từ trí tuệ nhân tạo</p>
              </div>
            </div>
            <div className="prose prose-gray max-w-none">
              <Streamdown>{result.aiAdvice}</Streamdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LuckyColorsTab() {
  const [birthYear, setBirthYear] = useState("");
  
  const luckyColors = trpc.tet.luckyColors.useQuery(
    { birthYear: parseInt(birthYear) },
    { enabled: birthYear.length === 4 && parseInt(birthYear) >= 1900 }
  );

  return (
    <div className="space-y-6">
      <div className="result-card max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <Palette className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Màu Sắc May Mắn</h3>
          <p className="text-gray-500">Tìm màu sắc hợp mệnh cho năm mới</p>
        </div>
        <div>
          <Label htmlFor="colorYear" className="form-label">Năm sinh của bạn</Label>
          <Input
            id="colorYear"
            type="number"
            placeholder="VD: 1990"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="form-input"
            min="1900"
            max="2100"
          />
        </div>
      </div>

      {luckyColors.data && (
        <div className="result-card max-w-2xl mx-auto">
          <div className="result-header">
            <div className="result-icon bg-gradient-to-br from-amber-100 to-yellow-100">
              <Palette className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Màu Sắc Cho {luckyColors.data.zodiac}</h3>
              <p className="text-gray-500">Mệnh {luckyColors.data.element}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Màu May Mắn</h4>
              <div className="flex flex-wrap gap-3">
                {luckyColors.data.luckyColors.map((color: string) => (
                  <div key={color} className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                    <span className="font-medium text-green-700">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Màu Nên Tránh</h4>
              <div className="flex flex-wrap gap-3">
                {luckyColors.data.avoidColors.map((color: string) => (
                  <div key={color} className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                    <span className="font-medium text-red-700">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LuckyMoneyTab() {
  const [birthYear, setBirthYear] = useState("");
  
  const luckyMoney = trpc.tet.luckyMoney.useQuery(
    { recipientBirthYear: parseInt(birthYear) },
    { enabled: birthYear.length === 4 && parseInt(birthYear) >= 1900 }
  );

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="result-card max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <Banknote className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Gợi Ý Lì Xì</h3>
          <p className="text-gray-500">Số tiền lì xì may mắn theo mệnh người nhận</p>
        </div>
        <div>
          <Label htmlFor="recipientYear" className="form-label">Năm sinh người nhận</Label>
          <Input
            id="recipientYear"
            type="number"
            placeholder="VD: 2010"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="form-input"
            min="1900"
            max="2100"
          />
        </div>
      </div>

      {luckyMoney.data && (
        <div className="result-card max-w-2xl mx-auto">
          <div className="result-header">
            <div className="result-icon bg-gradient-to-br from-yellow-100 to-amber-100">
              <Banknote className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Lì Xì Cho {luckyMoney.data.zodiac}</h3>
              <p className="text-gray-500">Mệnh {luckyMoney.data.element} - Số may mắn: {luckyMoney.data.luckyNumbers.join(", ")}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Số Tiền Gợi Ý</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {luckyMoney.data.suggestedAmounts.slice(0, 8).map((amount: number) => (
                <div
                  key={amount}
                  className="p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 text-center"
                >
                  <span className="font-bold text-yellow-700">
                    {formatMoney(amount)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Các số tiền trên được tính toán dựa trên mệnh và số may mắn của người nhận
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FullAdviceTab() {
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<any>(null);

  const fullAdviceMutation = trpc.tet.fullAdvice.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthYear) return;
    fullAdviceMutation.mutate({ birthYear: parseInt(birthYear) });
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="result-card max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tư Vấn Tết Toàn Diện</h3>
            <p className="text-gray-500">Nhận tư vấn đầy đủ về màu sắc, lì xì và phong thủy Tết</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullYear" className="form-label">Năm sinh của bạn</Label>
              <Input
                id="fullYear"
                type="number"
                placeholder="VD: 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="form-input"
                min="1900"
                max="2100"
                required
              />
            </div>
            <Button type="submit" className="btn-primary w-full" disabled={fullAdviceMutation.isPending}>
              {fullAdviceMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo tư vấn...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Nhận Tư Vấn Tết 2026
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setResult(null)} className="btn-secondary">
            Tư vấn khác
          </Button>

          <div className="result-card text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tư Vấn Tết 2026 Cho {result.zodiac}
            </h2>
            <p className="text-gray-500">Mệnh {result.element}</p>
          </div>

          <div className="result-card">
            <div className="result-header">
              <div className="result-icon bg-gradient-to-br from-red-100 to-pink-100">
                <Sparkles className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tư Vấn Chi Tiết</h3>
                <p className="text-gray-500">Phân tích từ trí tuệ nhân tạo</p>
              </div>
            </div>
            <div className="prose prose-gray max-w-none">
              <Streamdown>{result.fullAdvice}</Streamdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tet() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              Năm Bính Ngọ 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Công Cụ Tết 2026
            </h1>
            <p className="text-gray-600">
              Xông đất, màu may mắn và gợi ý lì xì theo mệnh - Chuẩn bị cho một năm mới thịnh vượng.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="xongdat" className="w-full">
              <TabsList className="tab-list flex-wrap h-auto gap-1 mb-8">
                <TabsTrigger value="xongdat" className="tab-trigger">
                  <Home className="w-4 h-4" />
                  Xông Đất
                </TabsTrigger>
                <TabsTrigger value="colors" className="tab-trigger">
                  <Palette className="w-4 h-4" />
                  Màu May Mắn
                </TabsTrigger>
                <TabsTrigger value="money" className="tab-trigger">
                  <Banknote className="w-4 h-4" />
                  Gợi Ý Lì Xì
                </TabsTrigger>
                <TabsTrigger value="full" className="tab-trigger">
                  <Gift className="w-4 h-4" />
                  Tư Vấn Toàn Diện
                </TabsTrigger>
              </TabsList>

              <TabsContent value="xongdat" className="mt-0">
                <XongDatTab />
              </TabsContent>
              <TabsContent value="colors" className="mt-0">
                <LuckyColorsTab />
              </TabsContent>
              <TabsContent value="money" className="mt-0">
                <LuckyMoneyTab />
              </TabsContent>
              <TabsContent value="full" className="mt-0">
                <FullAdviceTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
