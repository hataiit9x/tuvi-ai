import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { Sparkles, Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";

const ZODIAC_ANIMALS = [
  { id: "rat", name: "Tý (Chuột)", emoji: "🐀", years: [1948, 1960, 1972, 1984, 1996, 2008, 2020] },
  { id: "ox", name: "Sửu (Trâu)", emoji: "🐂", years: [1949, 1961, 1973, 1985, 1997, 2009, 2021] },
  { id: "tiger", name: "Dần (Hổ)", emoji: "🐅", years: [1950, 1962, 1974, 1986, 1998, 2010, 2022] },
  { id: "rabbit", name: "Mão (Mèo)", emoji: "🐇", years: [1951, 1963, 1975, 1987, 1999, 2011, 2023] },
  { id: "dragon", name: "Thìn (Rồng)", emoji: "🐉", years: [1952, 1964, 1976, 1988, 2000, 2012, 2024] },
  { id: "snake", name: "Tỵ (Rắn)", emoji: "🐍", years: [1953, 1965, 1977, 1989, 2001, 2013, 2025] },
  { id: "horse", name: "Ngọ (Ngựa)", emoji: "🐴", years: [1954, 1966, 1978, 1990, 2002, 2014, 2026] },
  { id: "goat", name: "Mùi (Dê)", emoji: "🐐", years: [1955, 1967, 1979, 1991, 2003, 2015, 2027] },
  { id: "monkey", name: "Thân (Khỉ)", emoji: "🐒", years: [1956, 1968, 1980, 1992, 2004, 2016, 2028] },
  { id: "rooster", name: "Dậu (Gà)", emoji: "🐓", years: [1957, 1969, 1981, 1993, 2005, 2017, 2029] },
  { id: "dog", name: "Tuất (Chó)", emoji: "🐕", years: [1958, 1970, 1982, 1994, 2006, 2018, 2030] },
  { id: "pig", name: "Hợi (Lợn)", emoji: "🐷", years: [1959, 1971, 1983, 1995, 2007, 2019, 2031] },
];

type ZodiacAnimal = typeof ZODIAC_ANIMALS[number]["id"];

function ZodiacCard({ 
  animal, 
  isSelected, 
  onClick 
}: { 
  animal: typeof ZODIAC_ANIMALS[number]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button 
      className={`zodiac-card text-center p-4 ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="zodiac-icon">{animal.emoji}</div>
      <div className="font-semibold text-gray-900 text-sm">{animal.name}</div>
      <div className="text-xs text-gray-500 mt-1">
        {animal.years.slice(-3).join(", ")}...
      </div>
    </button>
  );
}

export default function Zodiac() {
  const [selectedAnimal, setSelectedAnimal] = useState<ZodiacAnimal | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<any>(null);

  const zodiacFromYear = trpc.zodiac.fromYear.useQuery(
    { year: parseInt(birthYear) },
    { enabled: birthYear.length === 4 }
  );

  const forecastMutation = trpc.zodiac.forecast.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
    },
  });

  const handleYearChange = (year: string) => {
    setBirthYear(year);
    if (year.length === 4) {
      const yearNum = parseInt(year);
      if (yearNum >= 1900 && yearNum <= 2100) {
        const index = (yearNum - 4) % 12;
        setSelectedAnimal(ZODIAC_ANIMALS[index].id as ZodiacAnimal);
      }
    }
  };

  const handleGetForecast = () => {
    if (selectedAnimal) {
      forecastMutation.mutate({ animal: selectedAnimal as any, year: 2026 });
    }
  };

  const selectedZodiac = ZODIAC_ANIMALS.find(z => z.id === selectedAnimal);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Dự báo năm Bính Ngọ 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tử Vi 12 Con Giáp 2026
            </h1>
            <p className="text-gray-600">
              Dự báo chi tiết vận mệnh năm 2026 cho 12 con giáp về sự nghiệp, 
              tài chính, tình duyên và sức khỏe.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          {!result ? (
            <div className="space-y-8">
              {/* Year Input */}
              <div className="max-w-md mx-auto">
                <div className="result-card">
                  <h3 className="font-bold text-gray-900 mb-2 text-center">Nhập năm sinh để tìm con giáp</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Hoặc chọn trực tiếp con giáp bên dưới
                  </p>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="VD: 1990"
                      value={birthYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      min="1900"
                      max="2100"
                      className="form-input"
                    />
                    {zodiacFromYear.data && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-100">
                        <span className="text-2xl">
                          {ZODIAC_ANIMALS.find(z => z.id === zodiacFromYear.data.animal)?.emoji}
                        </span>
                        <span className="font-medium text-purple-700">{zodiacFromYear.data.vietnameseName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Zodiac Grid */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
                  Chọn Con Giáp Của Bạn
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
                  {ZODIAC_ANIMALS.map((animal) => (
                    <ZodiacCard
                      key={animal.id}
                      animal={animal}
                      isSelected={selectedAnimal === animal.id}
                      onClick={() => setSelectedAnimal(animal.id as ZodiacAnimal)}
                    />
                  ))}
                </div>
              </div>

              {/* Get Forecast Button */}
              {selectedAnimal && (
                <div className="text-center">
                  <div className="result-card inline-block">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">
                        {selectedZodiac?.emoji}
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-gray-900">
                          {selectedZodiac?.name}
                        </div>
                        <div className="text-gray-500">
                          Dự báo vận mệnh năm 2026
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleGetForecast}
                      className="btn-primary w-full"
                      disabled={forecastMutation.isPending}
                    >
                      {forecastMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Đang tạo dự báo...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Xem Dự Báo Năm 2026
                        </>
                      )}
                    </Button>
                  </div>
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
                  Chọn con giáp khác
                </Button>
              </div>

              {/* Result Header */}
              <div className="result-card text-center">
                <div className="text-6xl mb-4">
                  {ZODIAC_ANIMALS.find(z => z.id === result.animal)?.emoji}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Dự Báo {result.vietnameseName} Năm {result.year}
                </h2>
                <p className="text-gray-500">
                  Phân tích chi tiết vận mệnh theo từng tháng
                </p>
              </div>

              {/* Forecast Content */}
              <div className="result-card">
                <div className="result-header">
                  <div className="result-icon bg-gradient-to-br from-amber-100 to-orange-100">
                    <Sparkles className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Dự Báo Chi Tiết</h3>
                    <p className="text-gray-500">Phân tích từ trí tuệ nhân tạo</p>
                  </div>
                </div>
                <div className="prose prose-gray max-w-none">
                  <Streamdown>{result.forecast}</Streamdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
