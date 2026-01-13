import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Palace } from '@shared/types';
import { Streamdown } from 'streamdown';

interface TuviAnalysisPanelProps {
    palaces: Palace[];
    overviewAnalysis?: string;
    input: {
        fullName: string;
        birthDate: string;
        birthHour: string;
        gender: 'male' | 'female';
        calendarType: 'lunar' | 'solar';
    };
}

const PALACE_NAMES = [
    { id: 'overview', name: 'Tổng Quan', icon: '📊' },
    { id: 'Mệnh', name: 'Mệnh', icon: '✨' },
    { id: 'Phụ Mẫu', name: 'Phụ Mẫu', icon: '👨‍👩‍👧' },
    { id: 'Phúc Đức', name: 'Phúc Đức', icon: '🙏' },
    { id: 'Điền Trạch', name: 'Điền Trạch', icon: '🏠' },
    { id: 'Quan Lộc', name: 'Quan Lộc', icon: '💼' },
    { id: 'Nô Bộc', name: 'Nô Bộc', icon: '👥' },
    { id: 'Thiên Di', name: 'Thiên Di', icon: '✈️' },
    { id: 'Tật Ách', name: 'Tật Ách', icon: '🏥' },
    { id: 'Tài Bạch', name: 'Tài Bạch', icon: '💰' },
    { id: 'Tử Tức', name: 'Tử Tức', icon: '👶' },
    { id: 'Phu Thê', name: 'Phu Thê', icon: '💑' },
    { id: 'Huynh Đệ', name: 'Huynh Đệ', icon: '👫' },
];

// Progressive loading messages based on time elapsed
const LOADING_MESSAGES_PHASE_1 = [ // 0-30s: Bắt đầu tìm kiếm
    "Thầy đang đi coi trộm Thiên Cơ, chờ xíu nhé... 🔮",
    "Đang mở cánh cổng thiên đình để xem lá số... 🚪✨",
    "Các vị thần đang kiểm tra hồ sơ của bạn... 👼📋",
    "Đang leo lên cung trăng hỏi Thái Âm... 🌙🪜",
    "Tử Vi sao đang tra cứu sổ sách vận mệnh... 📚🔍",
    "Đang gõ cửa điện Ngọc Hoàng xin phép xem... �️👊",
];

const LOADING_MESSAGES_PHASE_2 = [ // 30-60s: Tìm thấy, đang phân tích
    "Tìm thấy rồi! Đang đọc kỹ nội dung... 👀📜",
    "Thiên Cơ đã mở kho bí mật, đang xem xét... 🗝️💎",
    "Các vì sao đang họp bàn về vận mệnh bạn... ⭐🗣️",
    "Phá Quân và Tham Lang đang tranh luận kịch liệt... ⚔️💬",
    "Đang phân tích 108 triệu vì sao... 🌌�",
    "Thiên Lương đang cân nhắc từng chi tiết... ⚖️🤔",
];

const LOADING_MESSAGES_PHASE_3 = [ // 60-90s: Đang dịch/chuẩn bị
    "Đang dịch từ ngôn ngữ thiên thần ra tiếng Việt... 🗣️✍️",
    "AI Master đang viết thư pháp cho đẹp... 🖌️�",
    "Đang định dạng lại cho dễ đọc... �✨",
    "Sắp xong rồi, đang kiểm tra lần cuối... ✅�",
    "Đang thêm emoji cho sinh động... �🎨",
    "Thiên Thư đang đóng dấu xác nhận... 📬🔖",
];

const LOADING_MESSAGES_PHASE_4 = [ // 90s+: Sắp hoàn thành
    "99% rồi, sắp ra kết quả đây! 🎯⏱️",
    "Chỉ còn vài giây nữa thôi... 🏁⏳",
    "Đang in ấn bản thảo cuối cùng... �️📃",
    "Chuẩn bị đóng gói gửi xuống trần gian... 📦⬇️",
    "Sắp deliver rồi, mở to mắt đón nhận nhé! 👁️✨",
];

const getProgressiveLoadingMessage = (elapsedSeconds: number) => {
    let messages: string[];

    if (elapsedSeconds < 30) {
        messages = LOADING_MESSAGES_PHASE_1;
    } else if (elapsedSeconds < 60) {
        messages = LOADING_MESSAGES_PHASE_2;
    } else if (elapsedSeconds < 90) {
        messages = LOADING_MESSAGES_PHASE_3;
    } else {
        messages = LOADING_MESSAGES_PHASE_4;
    }

    return messages[Math.floor(Math.random() * messages.length)];
};

export const TuviAnalysisPanel: React.FC<TuviAnalysisPanelProps> = ({
    palaces,
    overviewAnalysis,
    input,
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [palaceAnalyses, setPalaceAnalyses] = useState<Record<string, string>>({});
    const [loadingPalace, setLoadingPalace] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // Track elapsed time and rotate loading message every 20 seconds while loading
    React.useEffect(() => {
        if (loadingPalace) {
            // Reset and start
            setElapsedSeconds(0);
            setLoadingMessage(getProgressiveLoadingMessage(0));

            // Update elapsed time every second
            const timeInterval = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);

            // Rotate message every 20 seconds
            const messageInterval = setInterval(() => {
                setElapsedSeconds(prev => {
                    const newElapsed = prev + 1;
                    setLoadingMessage(getProgressiveLoadingMessage(newElapsed));
                    return newElapsed;
                });
            }, 20000);

            return () => {
                clearInterval(timeInterval);
                clearInterval(messageInterval);
            };
        }
    }, [loadingPalace]);

    const analyzePalaceMutation = trpc.tuvi.analyzePalace.useMutation({
        onSuccess: (data, variables) => {
            setPalaceAnalyses(prev => ({
                ...prev,
                [variables.palaceName]: data.analysis
            }));
            setLoadingPalace(null);
        },
        onError: () => {
            setLoadingPalace(null);
        }
    });

    const handlePalaceAnalysis = (palaceName: string) => {
        if (palaceAnalyses[palaceName] || loadingPalace) return;

        setLoadingPalace(palaceName);
        analyzePalaceMutation.mutate({
            ...input,
            palaceName
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    Luận Giải Tử Vi - AI Master
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tab List - Scrollable for mobile */}
                    <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-1 h-auto bg-purple-50 p-2">
                        {PALACE_NAMES.map((palace) => (
                            <TabsTrigger
                                key={palace.id}
                                value={palace.id}
                                className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs"
                            >
                                <span className="text-lg">{palace.icon}</span>
                                <span className="font-medium">{palace.name}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-purple-700">
                                    📊 Phân Tích Tổng Quan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {overviewAnalysis ? (
                                    <div className="prose prose-lg prose-purple max-w-none">
                                        <Streamdown>{overviewAnalysis}</Streamdown>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Chưa có phân tích tổng quan.</p>
                                        <p className="text-sm mt-2">Vui lòng nhấn nút "Phân Tích Bằng AI" để xem phân tích.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Individual Palace Tabs */}
                    {PALACE_NAMES.slice(1).map((palaceInfo) => {
                        const palace = palaces.find(p => p.name === palaceInfo.id);
                        if (!palace) return null;

                        const analysis = palaceAnalyses[palaceInfo.id];
                        const isLoading = loadingPalace === palaceInfo.id;
                        const isCached = analyzePalaceMutation.data?.cached && analyzePalaceMutation.variables?.palaceName === palaceInfo.id;

                        return (
                            <TabsContent key={palaceInfo.id} value={palaceInfo.id} className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl text-purple-700 flex items-center gap-2">
                                                <span className="text-2xl">{palaceInfo.icon}</span>
                                                Cung {palaceInfo.name}
                                                {(palace as any).earthlyBranch && (
                                                    <span className="text-sm text-gray-500">({(palace as any).earthlyBranch})</span>
                                                )}
                                            </CardTitle>
                                            {isCached && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    ⚡ Cached
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Palace Info */}
                                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600 mb-2">Chủ Tinh</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {palace.mainStars.map((star, idx) => (
                                                        <Badge key={idx} variant="default" className="bg-purple-600">
                                                            {star.name}
                                                        </Badge>
                                                    ))}
                                                    {palace.mainStars.length === 0 && (
                                                        <span className="text-sm text-gray-500">Không có</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-600 mb-2">Phụ Tinh</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {palace.secondaryStars.slice(0, 8).map((star, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                            {star.name}
                                                        </Badge>
                                                    ))}
                                                    {palace.secondaryStars.length > 8 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{palace.secondaryStars.length - 8}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Analysis Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                                    Luận Giải Chi Tiết (AI)
                                                </h4>
                                                {!analysis && !isLoading && (
                                                    <Button
                                                        onClick={() => handlePalaceAnalysis(palaceInfo.id)}
                                                        size="sm"
                                                        className="bg-purple-600 hover:bg-purple-700"
                                                    >
                                                        <Sparkles className="w-4 h-4 mr-1" />
                                                        Luận giải ngay
                                                    </Button>
                                                )}
                                            </div>

                                            {isLoading && (
                                                <div className="flex flex-col items-center justify-center py-12 text-purple-600">
                                                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                                    <p className="text-sm font-medium animate-pulse">{loadingMessage}</p>
                                                </div>
                                            )}

                                            {analysis && (
                                                <div className="prose prose-lg prose-purple max-w-none bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
                                                    <Streamdown>{analysis}</Streamdown>
                                                </div>
                                            )}

                                            {!analysis && !isLoading && (
                                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-600 font-medium">Nhấn "Luận giải ngay" để xem phân tích chi tiết</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        AI Master sẽ phân tích chuyên sâu về cung {palaceInfo.name}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </CardContent>
        </Card>
    );
};
