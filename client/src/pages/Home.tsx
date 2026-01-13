import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { 
  Sparkles, 
  Star, 
  Calendar, 
  Gift, 
  Hash,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Heart
} from "lucide-react";

const features = [
  {
    id: "tuvi",
    title: "Xem Lá Số Tử Vi",
    description: "Khám phá chi tiết 12 cung trong lá số tử vi với thuật toán chính xác và phân tích AI chuyên sâu.",
    icon: Star,
    href: "/tuvi",
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "from-purple-50 to-indigo-50"
  },
  {
    id: "numerology",
    title: "Thần Số Học",
    description: "Tìm hiểu con số chủ đạo, số linh hồn, số nhân cách và vận mệnh qua họ tên và ngày sinh.",
    icon: Hash,
    href: "/numerology",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50"
  },
  {
    id: "compatibility",
    title: "Xem Tương Hợp",
    description: "Khám phá độ tương hợp giữa hai người dựa trên Tử Vi, Ngũ Hành và Thần Số Học.",
    icon: Heart,
    href: "/compatibility",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50"
  },
  {
    id: "zodiac",
    title: "Tử Vi 12 Con Giáp 2026",
    description: "Dự báo chi tiết vận mệnh năm 2026 cho 12 con giáp về sự nghiệp, tài chính, tình duyên.",
    icon: Sparkles,
    href: "/zodiac",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50"
  },
  {
    id: "auspicious",
    title: "Ngày Đẹp Giờ Tốt",
    description: "Chọn ngày tốt theo mục đích và xem giờ hoàng đạo cho các việc quan trọng trong cuộc sống.",
    icon: Calendar,
    href: "/auspicious",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50"
  },
  {
    id: "tet",
    title: "Công Cụ Tết 2026",
    description: "Xông đất, màu may mắn và gợi ý lì xì theo mệnh - Chuẩn bị cho một năm mới thịnh vượng.",
    icon: Gift,
    href: "/tet",
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-50 to-pink-50"
  }
];

const highlights = [
  {
    icon: Zap,
    title: "AI Tiên Tiến",
    description: "Sử dụng mô hình ngôn ngữ lớn để phân tích chuyên sâu"
  },
  {
    icon: Shield,
    title: "Thuật Toán Chuẩn",
    description: "Dựa trên kiến thức tử vi đẩu số truyền thống"
  },
  {
    icon: Clock,
    title: "Kết Quả Tức Thì",
    description: "Nhận phân tích chi tiết chỉ trong vài giây"
  }
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              Kết hợp trí tuệ nhân tạo & thuật toán truyền thống
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              Khám Phá{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Vận Mệnh
              </span>
              <br />
              Của Bạn
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed animate-fade-in-up animate-delay-100">
              Tử Vi AI kết hợp thuật toán tử vi đẩu số truyền thống với công nghệ AI hiện đại, 
              mang đến những phân tích chuyên sâu và chính xác về vận mệnh của bạn.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
              <Link href="/tuvi">
                <Button className="btn-primary text-base px-8 py-4 h-auto group">
                  <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Xem Lá Số Tử Vi
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/numerology">
                <Button variant="outline" className="btn-secondary text-base px-8 py-4 h-auto group">
                  <Hash className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Khám Phá Thần Số Học
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <item.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50/50">
        <div className="container">
          <div className="section-title animate-fade-in-up">
            <h2>Các Tính Năng Nổi Bật</h2>
            <p>
              Khám phá bộ công cụ tử vi và phong thủy toàn diện, được phát triển dựa trên 
              kiến thức truyền thống và công nghệ AI tiên tiến.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.id} href={feature.href}>
                <div 
                  className="feature-card h-full group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`feature-card-icon bg-gradient-to-br ${feature.bgGradient}`}>
                    <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} style={{ color: feature.gradient.includes('purple') ? '#7c3aed' : feature.gradient.includes('amber') ? '#f59e0b' : feature.gradient.includes('emerald') ? '#10b981' : feature.gradient.includes('red') ? '#ef4444' : '#6366f1' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-purple-600 text-sm font-medium">
                    Khám phá ngay
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Công nghệ AI tiên tiến
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Phân Tích Chuyên Sâu Bằng{" "}
                <span className="text-gradient-purple">Trí Tuệ Nhân Tạo</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Tử Vi AI sử dụng các mô hình ngôn ngữ lớn (LLM) tiên tiến nhất để phân tích 
                và luận giải lá số tử vi, thần số học một cách chi tiết và chính xác.
              </p>
              <ul className="space-y-4">
                {[
                  "Thuật toán tử vi đẩu số truyền thống chính xác",
                  "Phân tích AI chuyên sâu cho từng cung mệnh",
                  "Hỗ trợ tiếng Việt có dấu trong thần số học",
                  "Dự báo chi tiết theo từng tháng, từng năm"
                ].map((item, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative animate-fade-in-right">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-indigo-200/50 rounded-3xl blur-2xl animate-pulse" />
              
              {/* Content */}
              <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                {/* Birth chart preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Biểu đồ ngày sinh</h4>
                  <div className="birth-chart-grid">
                    {[3, 6, 9, 2, 5, 8, 1, 4, 7].map((num, index) => (
                      <div 
                        key={index} 
                        className={`birth-chart-cell ${[1, 2, 5, 9].includes(num) ? 'has-number' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">
                    Khám phá con số vận mệnh của bạn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up">
              Bắt Đầu Khám Phá Vận Mệnh Ngay Hôm Nay
            </h2>
            <p className="text-purple-100 text-lg mb-8 animate-fade-in-up animate-delay-100">
              Đăng nhập để lưu lịch sử tra cứu và nhận phân tích chi tiết hơn từ AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
              <Link href="/tuvi">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 h-auto text-base font-semibold group hover:scale-105 transition-all duration-200">
                  Xem Lá Số Tử Vi
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/numerology">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 h-auto text-base hover:scale-105 transition-all duration-200">
                  Khám Phá Thần Số Học
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
