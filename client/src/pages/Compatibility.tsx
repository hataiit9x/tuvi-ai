import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import ShareButtons from "@/components/ShareButtons";
import { Heart, Loader2, Sparkles, Users, ArrowLeft } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i);

interface PersonFormData {
  fullName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

function ScoreCircle({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mt-2">{label}</p>
    </div>
  );
}

function PersonCard({ person, color }: { person: any; color: string }) {
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} border animate-fade-in-up`}>
      <h3 className="font-bold text-lg text-gray-900 mb-4">{person.name}</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Năm sinh:</span>
          <span className="font-semibold">{person.birthYear}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Con giáp:</span>
          <span className="font-semibold">{person.zodiacVN}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Mệnh:</span>
          <span className="font-semibold">{person.element}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Số chủ đạo:</span>
          <span className="font-semibold text-purple-700">{person.lifePathNumber}</span>
        </div>
      </div>
    </div>
  );
}

function PersonForm({ 
  person, 
  setPerson, 
  title, 
  icon 
}: { 
  person: PersonFormData; 
  setPerson: (p: PersonFormData) => void; 
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-pink-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {/* Họ và tên */}
        <div>
          <Label className="text-gray-700 font-medium">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Nhập họ tên đầy đủ"
            value={person.fullName}
            onChange={(e) => setPerson({ ...person, fullName: e.target.value })}
            className="mt-2 h-11 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        
        {/* Ngày sinh - tách biệt */}
        <div>
          <Label className="text-gray-700 font-medium">
            Ngày sinh <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Ngày</Label>
              <Select
                value={String(person.birthDay)}
                onValueChange={(v) => setPerson({ ...person, birthDay: parseInt(v) })}
              >
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
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
                value={String(person.birthMonth)}
                onValueChange={(v) => setPerson({ ...person, birthMonth: parseInt(v) })}
              >
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
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
                value={String(person.birthYear)}
                onValueChange={(v) => setPerson({ ...person, birthYear: parseInt(v) })}
              >
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
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
      </div>
    </div>
  );
}

export default function Compatibility() {
  const [person1, setPerson1] = useState<PersonFormData>({ 
    fullName: "", 
    birthDay: 1, 
    birthMonth: 1, 
    birthYear: 1990 
  });
  const [person2, setPerson2] = useState<PersonFormData>({ 
    fullName: "", 
    birthDay: 1, 
    birthMonth: 1, 
    birthYear: 1990 
  });
  const [result, setResult] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const formatBirthDate = (p: PersonFormData) => {
    return `${p.birthYear}-${String(p.birthMonth).padStart(2, "0")}-${String(p.birthDay).padStart(2, "0")}`;
  };

  const calculateMutation = trpc.compatibility.calculate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setShowResult(true);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    },
  });

  const analyzeMutation = trpc.compatibility.analyze.useMutation({
    onSuccess: (data) => {
      setResult(data.result);
      setAnalysis(typeof data.analysis === 'string' ? data.analysis : '');
      setShowResult(true);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi phân tích AI");
    },
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!person1.fullName.trim() || !person2.fullName.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin cả hai người");
      return;
    }
    setAnalysis("");
    calculateMutation.mutate({ 
      person1: { fullName: person1.fullName, birthDate: formatBirthDate(person1) }, 
      person2: { fullName: person2.fullName, birthDate: formatBirthDate(person2) } 
    });
  };

  const handleAnalyze = () => {
    if (!person1.fullName.trim() || !person2.fullName.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin cả hai người");
      return;
    }
    analyzeMutation.mutate({ 
      person1: { fullName: person1.fullName, birthDate: formatBirthDate(person1) }, 
      person2: { fullName: person2.fullName, birthDate: formatBirthDate(person2) } 
    });
  };

  const isLoading = calculateMutation.isPending || analyzeMutation.isPending;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-6 animate-fade-in-down">
              <Heart className="w-4 h-4" />
              Tương hợp tình duyên
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Xem Độ Tương Hợp
            </h1>
            <p className="text-gray-600 animate-fade-in-up animate-delay-100">
              Khám phá mức độ hòa hợp giữa hai người dựa trên Tử Vi, Ngũ Hành và Thần Số Học.
              Nhận phân tích chi tiết và lời khuyên từ AI.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {!showResult ? (
              <form onSubmit={handleCalculate} className="space-y-8 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-8 relative">
                  {/* Person 1 */}
                  <PersonForm 
                    person={person1} 
                    setPerson={setPerson1} 
                    title="Người thứ nhất"
                    icon={<Users className="w-5 h-5 text-pink-600" />}
                  />

                  {/* Heart Icon in center */}
                  <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Person 2 */}
                  <PersonForm 
                    person={person2} 
                    setPerson={setPerson2} 
                    title="Người thứ hai"
                    icon={<Users className="w-5 h-5 text-purple-600" />}
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-pink-600 hover:bg-pink-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {calculateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang tính toán...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        Xem Độ Tương Hợp
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAnalyze}
                    className="h-12 px-8 border-purple-200 text-purple-700 hover:bg-purple-50"
                    disabled={isLoading}
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang phân tích AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Phân Tích AI Chi Tiết
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-8 animate-fade-in-up">
                {/* Back button */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowResult(false);
                    setResult(null);
                    setAnalysis("");
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>

                {/* Person cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <PersonCard 
                    person={result?.person1} 
                    color="from-pink-50 to-rose-50 border-pink-200" 
                  />
                  <PersonCard 
                    person={result?.person2} 
                    color="from-purple-50 to-indigo-50 border-purple-200" 
                  />
                </div>

                {/* Overall score */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-center text-white">
                  <h3 className="text-xl font-bold mb-4">Điểm Tương Hợp Tổng Thể</h3>
                  <div className="text-6xl font-bold mb-2">{result?.overallScore || 0}</div>
                  <p className="text-pink-100">
                    {result?.overallScore >= 80 ? "Rất hợp nhau" : 
                     result?.overallScore >= 60 ? "Khá hợp nhau" :
                     result?.overallScore >= 40 ? "Bình thường" : "Cần nỗ lực"}
                  </p>
                </div>

                {/* Detail scores */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-6 text-center">Chi Tiết Tương Hợp</h3>
                  <div className="flex flex-wrap justify-center gap-8">
                    <ScoreCircle 
                      score={result?.elementScore || 0} 
                      label="Ngũ Hành" 
                      color="#f59e0b" 
                    />
                    <ScoreCircle 
                      score={result?.zodiacScore || 0} 
                      label="Con Giáp" 
                      color="#ec4899" 
                    />
                    <ScoreCircle 
                      score={result?.numerologyScore || 0} 
                      label="Thần Số Học" 
                      color="#8b5cf6" 
                    />
                  </div>
                </div>

                {/* Compatibility details */}
                {result?.details && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Phân Tích Chi Tiết</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2">Ngũ Hành</h4>
                        <p className="text-gray-700">{result.details.element}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-pink-50 border border-pink-200">
                        <h4 className="font-semibold text-pink-800 mb-2">Con Giáp</h4>
                        <p className="text-gray-700">{result.details.zodiac}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Thần Số Học</h4>
                        <p className="text-gray-700">{result.details.numerology}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advice */}
                {result?.advice && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                    <h3 className="font-bold text-lg text-green-800 mb-4">Lời Khuyên</h3>
                    <p className="text-gray-700">{result.advice}</p>
                  </div>
                )}

                {/* AI Analysis */}
                {analysis && (
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
                      <Streamdown>{analysis}</Streamdown>
                    </div>
                  </div>
                )}

                {/* Share buttons */}
                <div className="flex justify-center">
                  <ShareButtons
                    type="compatibility"
                    title={`Độ tương hợp giữa ${person1.fullName} và ${person2.fullName}`}
                    description={`Điểm tương hợp: ${result?.overallScore || 0}/100`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
