/**
 * TuViChartProfessional - Component lá số tử vi chuyên nghiệp
 * Thiết kế theo mẫu truyền thống với 12 cung và ô thông tin trung tâm
 */

import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Download, Share2, ZoomIn, ZoomOut, Eye, EyeOff, Triangle } from 'lucide-react';
import { toast } from 'sonner';
import { PalaceCell } from './PalaceCell';
import PalaceDetailModal from './PalaceDetailModal';

interface Star {
    name: string;
    nameChinese?: string;
    nature?: 'good' | 'bad' | 'neutral' | 'cat' | 'hung';
    type?: 'main' | 'secondary';
    color?: string;
    brightness?: string;
}

interface Palace {
    name: string;
    nameChinese?: string;
    mainStars?: Star[];
    secondaryStars?: Star[];
    stars?: Star[]; // Từ tuvi-exact.ts
    trangSinh?: string;
    nguHanh?: string;
    diaChi?: string;
    earthlyBranch?: string; // Từ tuvi-exact.ts
    position?: number;
    element?: string;
    number?: number; // Từ tuvi-exact.ts
    id?: number; // Từ tuvi-exact.ts
}

// Cấu trúc từ tuvi-exact.ts
interface CenterInfoData {
    name?: string;
    birthYear?: number;
    birthMonth?: number;
    birthDay?: number;
    birthHour?: string;
    gender?: string;
    lunarCalendar?: boolean;
    destiny?: string;
    bodyPalace?: string;
}

interface ChartData {
    palaces: Palace[];
    element?: string;
    heavenlyStem?: string;
    earthlyBranch?: string;
    chuMenh?: string;
    chuThan?: string;
    lunarDate?: { day: number; month: number; year?: number };
    napAm?: string;
    cucLoai?: string;
    mangMenh?: string;
    centerInfo?: CenterInfoData; // Từ tuvi-exact.ts
}

// Mapping tên cung từ UPPERCASE sang Title Case
const PALACE_NAME_MAPPING: Record<string, string> = {
    'TÀI BẠCH': 'Tài Bạch',
    'TỬ TỨC': 'Tử Tức',
    'PHU THÊ': 'Phu Thê',
    'MỆNH': 'Mệnh',
    'PHÁ QUÂN': 'Mệnh', // PHÁ QUÂN trong tuvi-exact.ts có thể là Mệnh hoặc cung khác
    'PHU MẪU': 'Phụ Mẫu',
    'PHÚC ĐỨC': 'Phúc Đức',
    'ĐIỀN TRẠCH': 'Điền Trạch',
    'QUAN LỘC': 'Quan Lộc',
    'NÔ BỘC': 'Nô Bộc',
    'THIÊN DI': 'Thiên Di',
    'TẤT ÁCH': 'Tật Ách',
    'HUYNH ĐỆ': 'Huynh Đệ',
};

// Mapping tên cung theo địa chi (từ tuvi-exact.ts)
const BRANCH_TO_PALACE: Record<string, string> = {
    'Tỵ': 'Mệnh',
    'Ngọ': 'Phụ Mẫu',
    'Mùi': 'Phúc Đức',
    'Thân': 'Điền Trạch',
    'Dậu': 'Quan Lộc',
    'Tuất': 'Nô Bộc',
    'Hợi': 'Thiên Di',
    'Tý': 'Tật Ách',
    'Sửu': 'Tài Bạch',
    'Dần': 'Tử Tức',
    'Mão': 'Phu Thê',
    'Thìn': 'Huynh Đệ',
};

// Hàm normalize tên cung
function normalizePalaceName(name: string): string {
    // Nếu là uppercase, convert sang Title Case
    if (PALACE_NAME_MAPPING[name]) {
        return PALACE_NAME_MAPPING[name];
    }
    return name;
}

// Hàm chuyển đổi màu sao sang tính chất
function colorToNature(color?: string): 'good' | 'bad' | 'neutral' {
    if (!color) return 'neutral';
    if (color === 'red' || color === 'purple' || color === 'orange') return 'good';
    if (color === 'black') return 'bad';
    return 'neutral';
}

interface InputData {
    fullName: string;
    birthDay: number;
    birthMonth: number;
    birthYear: number;
    birthHour: string;
    gender: 'male' | 'female';
    calendarType?: 'lunar' | 'solar';
}

interface TuViChartProfessionalProps {
    chart: ChartData;
    input: InputData;
}

// Địa chi 12 cung theo vị trí truyền thống (theo chiều kim đồng hồ từ Tỵ)
const EARTHLY_BRANCHES_POSITIONS = [
    'Tỵ', 'Ngọ', 'Mùi', 'Thân',    // Row 0
    'Thìn', '', '', 'Dậu',          // Row 1 (center cells empty)
    'Mão', '', '', 'Tuất',          // Row 2 (center cells empty)
    'Dần', 'Sửu', 'Tý', 'Hợi'       // Row 3
];

// Vị trí cung trong grid 4x4 (theo ảnh mẫu)
const PALACE_GRID_POSITIONS: Record<string, { row: number; col: number; branch: string; branchElement: string }> = {
    'Huynh Đệ': { row: 0, col: 0, branch: 'Tỵ', branchElement: 'Hỏa' },
    'Mệnh': { row: 0, col: 1, branch: 'Ngọ', branchElement: 'Hỏa' },
    'Phụ Mẫu': { row: 0, col: 2, branch: 'Mùi', branchElement: 'Thổ' },
    'Phúc Đức': { row: 0, col: 3, branch: 'Thân', branchElement: 'Kim' },
    'Phu Thê': { row: 1, col: 0, branch: 'Thìn', branchElement: 'Thổ' },
    'Điền Trạch': { row: 1, col: 3, branch: 'Dậu', branchElement: 'Kim' },
    'Tử Tức': { row: 2, col: 0, branch: 'Mão', branchElement: 'Mộc' },
    'Quan Lộc': { row: 2, col: 3, branch: 'Tuất', branchElement: 'Thổ' },
    'Tài Bạch': { row: 3, col: 0, branch: 'Dần', branchElement: 'Mộc' },
    'Tật Ách': { row: 3, col: 1, branch: 'Sửu', branchElement: 'Thổ' },
    'Thiên Di': { row: 3, col: 2, branch: 'Tý', branchElement: 'Thủy' },
    'Nô Bộc': { row: 3, col: 3, branch: 'Hợi', branchElement: 'Thủy' },
};

// Tên giờ sinh theo địa chi
const BIRTH_HOUR_NAMES: Record<string, string> = {
    'ty': 'Tý', 'suu': 'Sửu', 'dan': 'Dần', 'mao': 'Mão',
    'thin': 'Thìn', 'ti': 'Tỵ', 'ngo': 'Ngọ', 'mui': 'Mùi',
    'than': 'Thân', 'dau': 'Dậu', 'tuat': 'Tuất', 'hoi': 'Hợi'
};

// Ngũ hành cho giờ sinh 
const HOUR_ELEMENTS: Record<string, string> = {
    'ty': 'Thủy', 'suu': 'Thổ', 'dan': 'Mộc', 'mao': 'Mộc',
    'thin': 'Thổ', 'ti': 'Hỏa', 'ngo': 'Hỏa', 'mui': 'Thổ',
    'than': 'Kim', 'dau': 'Kim', 'tuat': 'Thổ', 'hoi': 'Thủy'
};

// Màu nền theo ngũ hành
const ELEMENT_BG_COLORS: Record<string, string> = {
    'Kim': 'bg-yellow-100',
    'Thủy': 'bg-blue-100',
    'Hỏa': 'bg-red-100',
    'Thổ': 'bg-amber-100',
    'Mộc': 'bg-green-100'
};

// Tam Hợp Cung - 3 cung tạo thành tam giác hợp nhau (Tam Phương)
// Mỗi nhóm 3 cung có ảnh hưởng lẫn nhau
const TAM_HOP_GROUPS: string[][] = [
    ['Dần', 'Ngọ', 'Tuất'],   // Hỏa cục
    ['Thân', 'Tý', 'Thìn'],   // Thủy cục
    ['Tỵ', 'Dậu', 'Sửu'],     // Kim cục
    ['Hợi', 'Mão', 'Mùi'],    // Mộc cục
];

// Cung Đối Xứng (Xung Chiếu) - Tứ Chính
// Cung nằm đối diện qua tâm, có ảnh hưởng mạnh lẫn nhau
const CUNG_DOI_XUNG: Record<string, string> = {
    'Tý': 'Ngọ', 'Ngọ': 'Tý',
    'Sửu': 'Mùi', 'Mùi': 'Sửu',
    'Dần': 'Thân', 'Thân': 'Dần',
    'Mão': 'Dậu', 'Dậu': 'Mão',
    'Thìn': 'Tuất', 'Tuất': 'Thìn',
    'Tỵ': 'Hợi', 'Hợi': 'Tỵ',
};

// Vị trí pixel của mỗi địa chi trên grid 4x4 (dùng để vẽ đường nối)
// Tính theo phần trăm từ góc trên trái - Adjusted to Inner Edges of Palaces (Central Box Boundary)
const BRANCH_POSITIONS: Record<string, { x: number; y: number }> = {
    'Tỵ': { x: 25, y: 25 },      // Row 0, Col 0 (Corner)
    'Ngọ': { x: 37.5, y: 25 },   // Row 0, Col 1 (Edge)
    'Mùi': { x: 62.5, y: 25 },   // Row 0, Col 2 (Edge)
    'Thân': { x: 75, y: 25 },    // Row 0, Col 3 (Corner)
    'Thìn': { x: 25, y: 37.5 },  // Row 1, Col 0 (Edge)
    'Dậu': { x: 75, y: 37.5 },   // Row 1, Col 3 (Edge)
    'Mão': { x: 25, y: 62.5 },   // Row 2, Col 0 (Edge)
    'Tuất': { x: 75, y: 62.5 },  // Row 2, Col 3 (Edge)
    'Dần': { x: 25, y: 75 },     // Row 3, Col 0 (Corner)
    'Sửu': { x: 37.5, y: 75 },   // Row 3, Col 1 (Edge)
    'Tý': { x: 62.5, y: 75 },    // Row 3, Col 2 (Edge)
    'Hợi': { x: 75, y: 75 },     // Row 3, Col 3 (Corner)
};

// Màu cho các loại đường nối
const LINE_COLORS = {
    tamHop: 'rgba(34, 197, 94, 0.6)',      // Xanh lá - tam hợp
    doiXung: 'rgba(239, 68, 68, 0.6)',     // Đỏ - đối xứng/xung chiếu
    highlight: 'rgba(59, 130, 246, 0.8)',  // Xanh dương - highlight
};

function getStarColor(nature: string | undefined): string {
    if (nature === 'cat' || nature === 'good') return 'text-red-600 font-bold';
    if (nature === 'hung' || nature === 'bad') return 'text-blue-700';
    return 'text-gray-800';
}

function getStarType(nature: string | undefined): string {
    if (nature === 'cat' || nature === 'good') return '(M)';
    if (nature === 'hung' || nature === 'bad') return '(D)';
    return '';
}
// Component vẽ layer phủ toàn bộ lá số để nối các cung (Tam Hợp/Đối Xứng full scale)
// Component vẽ layer phủ toàn bộ lá số để nối các cung (Tam Hợp/Đối Xứng full scale)
function MainChartOverlay({
    selectedBranch,
    showTamHop,
    showDoiXung,
    menhBranch
}: {
    selectedBranch: string | null;
    showTamHop: boolean;
    showDoiXung: boolean;
    menhBranch?: string;
}) {
    const elements: React.ReactElement[] = [];
    const getPosition = (branch: string) => BRANCH_POSITIONS[branch] || { x: 50, y: 50 };

    // Logic: Nếu đang chọn cung (selectedBranch) thì hiển thị của cung đó.
    // Nếu không chọn gì thì hiển thị mặc định của cung Mệnh.
    const activeBranch = selectedBranch || menhBranch;

    if (!activeBranch) return null;

    // Tam Hợp (Màu cam, nét đứt, mảnh)
    if (showTamHop) {
        const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(activeBranch));
        if (tamHopGroup) {
            const positions = tamHopGroup.map(branch => getPosition(branch));
            const points = positions.map(p => `${p.x},${p.y}`).join(' ');
            elements.push(
                <polygon
                    key="tam-hop-overlay"
                    points={points}
                    fill="rgba(245, 158, 11, 0.05)"
                    stroke="rgba(245, 158, 11, 0.6)"
                    strokeWidth="0.15"
                    strokeDasharray="0.5 0.5"
                    className="transition-all duration-300"
                />
            );
        }
    }

    // Đối Xứng (Màu đỏ, nét đứt, mảnh)
    if (showDoiXung) {
        const doiXungBranch = CUNG_DOI_XUNG[activeBranch];
        if (doiXungBranch) {
            const p1 = getPosition(activeBranch);
            const p2 = getPosition(doiXungBranch);
            elements.push(
                <line
                    key="doi-xung-overlay"
                    x1={p1.x} y1={p1.y}
                    x2={p2.x} y2={p2.y}
                    stroke="rgba(239, 68, 68, 0.6)"
                    strokeWidth="0.15"
                    strokeDasharray="0.5 0.5"
                    className="transition-all duration-300"
                />
            );
        }
    }

    return (
        <svg
            className="absolute inset-0 pointer-events-none w-full h-full z-10"
            viewBox="0 0 100 100"
        >
            {elements}
        </svg>
    );
}

// Component vẽ đường Tam Phương Tứ Chính nhỏ gọn ở trung tâm
function TamPhuongTuChinhMiniMap({
    selectedBranch,
    showTamHop,
    showDoiXung,
    menhBranch
}: {
    selectedBranch: string | null;
    showTamHop: boolean;
    showDoiXung: boolean;
    menhBranch?: string;
}) {
    // Vẽ la bàn mini ở trung tâm - các địa chi xếp theo vòng tròn
    // Vị trí 12 địa chi theo vòng tròn (góc từ trên theo chiều kim đồng hồ)
    const MINI_POSITIONS: Record<string, { angle: number }> = {
        'Tý': { angle: 180 },    // Dưới
        'Sửu': { angle: 210 },
        'Dần': { angle: 240 },
        'Mão': { angle: 270 },   // Trái
        'Thìn': { angle: 300 },
        'Tỵ': { angle: 330 },
        'Ngọ': { angle: 0 },     // Trên
        'Mùi': { angle: 30 },
        'Thân': { angle: 60 },
        'Dậu': { angle: 90 },    // Phải
        'Tuất': { angle: 120 },
        'Hợi': { angle: 150 },
    };

    const centerX = 50;
    const centerY = 50;
    const radius = 35; // Bán kính vòng tròn nhỏ

    // Hàm tính tọa độ từ góc
    const getPosition = (branch: string) => {
        const { angle } = MINI_POSITIONS[branch];
        const rad = (angle - 90) * Math.PI / 180;
        return {
            x: centerX + radius * Math.cos(rad),
            y: centerY + radius * Math.sin(rad)
        };
    };

    const elements: React.ReactElement[] = [];

    // Vẽ vòng tròn nền
    elements.push(
        <circle
            key="bg-circle"
            cx={centerX}
            cy={centerY}
            r={radius + 5}
            fill="rgba(255, 248, 220, 0.9)"
            stroke="#DEB887"
            strokeWidth="1"
        />
    );

    // Vẽ vòng tròn trong
    elements.push(
        <circle
            key="inner-circle"
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#D2B48C"
            strokeWidth="0.5"
            strokeDasharray="2,2"
        />
    );

    // Vẽ các chấm đại diện 12 địa chi
    Object.entries(MINI_POSITIONS).forEach(([branch]) => {
        const pos = getPosition(branch);
        const isSelected = branch === selectedBranch;
        elements.push(
            <circle
                key={`branch-${branch}`}
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 3 : 2}
                fill={isSelected ? '#8B4513' : '#D2B48C'}
            />
        );
    });

    // Vẽ đường Tam Hợp (tam giác xanh lá nhỏ)
    if (showTamHop && selectedBranch) {
        const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(selectedBranch));
        if (tamHopGroup) {
            const positions = tamHopGroup.map(branch => getPosition(branch));
            const points = positions.map(p => `${p.x},${p.y}`).join(' ');
            elements.push(
                <polygon
                    key="tam-hop-mini"
                    points={points}
                    fill="rgba(34, 197, 94, 0.2)"
                    stroke="rgba(34, 197, 94, 0.8)"
                    strokeWidth="1.5"
                />
            );
            // Chấm nhỏ ở các góc
            positions.forEach((pos, i) => {
                elements.push(
                    <circle
                        key={`tam-hop-dot-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="2.5"
                        fill="rgba(34, 197, 94, 0.9)"
                    />
                );
            });
        }
    }

    // Vẽ đường Đối Xứng (đường đỏ nhỏ)
    if (showDoiXung && selectedBranch) {
        const doiXungBranch = CUNG_DOI_XUNG[selectedBranch];
        if (doiXungBranch) {
            const pos1 = getPosition(selectedBranch);
            const pos2 = getPosition(doiXungBranch);
            elements.push(
                <line
                    key="doi-xung-mini"
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke="rgba(239, 68, 68, 0.8)"
                    strokeWidth="1.5"
                />
            );
            // Chấm ở 2 đầu
            [pos1, pos2].forEach((pos, i) => {
                elements.push(
                    <circle
                        key={`doi-xung-dot-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="2.5"
                        fill="rgba(239, 68, 68, 0.9)"
                    />
                );
            });
        }
    }

    // Vẽ đường Tam Hợp cho cung Mệnh (Luôn hiển thị - Màu cam/vàng)
    if (menhBranch) {
        const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(menhBranch));
        if (tamHopGroup) {
            const positions = tamHopGroup.map(branch => getPosition(branch));
            const points = positions.map(p => `${p.x},${p.y}`).join(' ');
            elements.push(
                <polygon
                    key="tam-hop-menh-mini"
                    points={points}
                    fill="rgba(245, 158, 11, 0.15)"
                    stroke="rgba(245, 158, 11, 0.8)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                />
            );
            positions.forEach((pos, i) => {
                elements.push(
                    <circle
                        key={`tam-hop-menh-dot-mini-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="2"
                        fill="rgba(245, 158, 11, 0.9)"
                    />
                );
            });
        }
    }

    // Chấm giữa
    elements.push(
        <circle
            key="center-dot"
            cx={centerX}
            cy={centerY}
            r="2"
            fill="#8B4513"
        />
    );

    return (
        <svg
            className="absolute pointer-events-none"
            style={{
                width: '100px',
                height: '100px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                opacity: 0.9
            }}
            viewBox="0 0 100 100"
        >
            {elements}
        </svg>
    );
}



const NAP_AM_DESCRIPTIONS: Record<string, string> = {
    'Hải Trung Kim': 'Vàng trong biển',
    'Lư Trung Hỏa': 'Lửa trong lò',
    'Đại Lâm Mộc': 'Gỗ trong rừng già',
    'Lộ Bàng Thổ': 'Đất ven đường',
    'Kiếm Phong Kim': 'Vàng mũi kiếm',
    'Sơn Đầu Hỏa': 'Lửa trên núi',
    'Giản Hạ Thủy': 'Nước dưới khe',
    'Thành Đầu Thổ': 'Đất trên thành',
    'Bạch Lạp Kim': 'Vàng chân đèn',
    'Dương Liễu Mộc': 'Gỗ cây dương liễu',
    'Tuyền Trung Thủy': 'Nước trong suối',
    'Ốc Thượng Thổ': 'Đất trên nóc nhà',
    'Tích Lịch Hỏa': 'Lửa sấm sét',
    'Tùng Bách Mộc': 'Gỗ cây tùng bách',
    'Trường Lưu Thủy': 'Nước chảy dài',
    'Sa Trung Kim': 'Vàng trong cát',
    'Sơn Hạ Hỏa': 'Lửa dưới núi',
    'Bình Địa Mộc': 'Gỗ đồng bằng',
    'Bích Thượng Thổ': 'Đất trên vách',
    'Kim Bạch Kim': 'Vàng pha bạch kim',
    'Phúc Đăng Hỏa': 'Lửa ngọn đèn',
    'Thiên Hà Thủy': 'Nước trên trời',
    'Đại Trạch Thổ': 'Đất nền nhà',
    'Thoa Xuyến Kim': 'Vàng trang sức',
    'Tang Đố Mộc': 'Gỗ cây dâu',
    'Đại Khê Thủy': 'Nước khe lớn',
    'Sa Trung Thổ': 'Đất pha cát',
    'Thiên Thượng Hỏa': 'Lửa trên trời',
    'Thạch Lựu Mộc': 'Gỗ cây thạch lựu',
    'Đại Hải Thủy': 'Nước biển lớn'
};

// Component thông tin trung tâm
function CenterInfo({ chart, input }: { chart: ChartData; input: InputData }) {
    const birthHourName = BIRTH_HOUR_NAMES[input.birthHour.toLowerCase()] || input.birthHour;

    // Lấy thông tin Can Chi năm
    const yearCanChi = `${chart.heavenlyStem || ''} ${chart.earthlyBranch || ''} (${input.birthYear})`.trim();

    // Tính Can Chi tháng (đơn giản hóa)
    const monthCanChi = chart.lunarDate ? `Tháng ${chart.lunarDate.month}` : '';

    // Tính Can Chi ngày (đơn giản hóa)
    const dayCanChi = chart.lunarDate ? `Ngày ${chart.lunarDate.day}` : '';

    // Calculate Nap Am full string
    const napAm = chart.napAm || '';
    const element = chart.element || '';
    const napAmDesc = NAP_AM_DESCRIPTIONS[napAm] || '';
    // Use fallback or ensure napAm is displayed
    // Attempt to force display if element implies it? No.
    // Ensure the string literal is correct.
    const banMenhDisplay = napAm
        ? `${element} (${napAm})`
        : element;
    // If napAm is missing, maybe input.napAm? (Unlikely)

    // Debug: If napAm is missing, check if it's in majorStarGroup? No.
    // Maybe re-read chart props.


    // Tính tương quan Mệnh - Cục
    const MENH_CUC_RELATION: Record<string, Record<string, string>> = {
        'Kim': { 'Thủy': 'Sinh Xuất', 'Mộc': 'Khắc Xuất', 'Thổ': 'Sinh Nhập', 'Hỏa': 'Khắc Nhập', 'Kim': 'Bình Hòa' },
        'Mộc': { 'Hỏa': 'Sinh Xuất', 'Thổ': 'Khắc Xuất', 'Thủy': 'Sinh Nhập', 'Kim': 'Khắc Nhập', 'Mộc': 'Bình Hòa' },
        'Thủy': { 'Mộc': 'Sinh Xuất', 'Hỏa': 'Khắc Xuất', 'Kim': 'Sinh Nhập', 'Thổ': 'Khắc Nhập', 'Thủy': 'Bình Hòa' },
        'Hỏa': { 'Thổ': 'Sinh Xuất', 'Kim': 'Khắc Xuất', 'Mộc': 'Sinh Nhập', 'Thủy': 'Khắc Nhập', 'Hỏa': 'Bình Hòa' },
        'Thổ': { 'Kim': 'Sinh Xuất', 'Thủy': 'Khắc Xuất', 'Hỏa': 'Sinh Nhập', 'Mộc': 'Khắc Nhập', 'Thổ': 'Bình Hòa' }
    };

    const menhEl = chart.element; // "Kim", "Mộc"...
    const cucEl = chart.cucLoai ? chart.cucLoai.split(' ')[0] : '';

    let relationText = '';
    let relationColor = 'text-gray-500';

    if (menhEl && cucEl && MENH_CUC_RELATION[menhEl] && MENH_CUC_RELATION[menhEl][cucEl]) {
        const rel = MENH_CUC_RELATION[menhEl][cucEl];
        if (rel === 'Sinh Nhập') { relationText = 'Cục sinh Mệnh'; relationColor = 'text-green-600'; }
        else if (rel === 'Sinh Xuất') { relationText = 'Mệnh sinh Cục'; relationColor = 'text-blue-500'; }
        else if (rel === 'Khắc Xuất') { relationText = 'Mệnh khắc Cục'; relationColor = 'text-yellow-600'; }
        else if (rel === 'Khắc Nhập') { relationText = 'Cục khắc Mệnh'; relationColor = 'text-red-500'; }
        else if (rel === 'Bình Hòa') { relationText = 'Mệnh Cục hòa'; relationColor = 'text-gray-600'; }
    }


    return (
        <div className="col-span-2 row-span-2 flex flex-col relative overflow-hidden">
            {/* Layer 0: Background and Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#DEB887] border-2 border-[#8B4513] z-0" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                <div className="w-48 h-48 rounded-full border-4 border-[#8B4513]" />
                <div className="absolute w-36 h-36 rounded-full border-2 border-[#8B4513]" />
            </div>

            {/* Header Title */}
            <div className="text-center py-2 border-b border-[#8B4513]/50 relative z-20">
                <h2 className="text-lg font-bold text-[#8B4513] uppercase tracking-wider">Tử Vi Đẩu Số</h2>
                <p className="text-[9px] text-[#A0522D]">https://tuvi.my.id</p>
            </div>

            {/* 2-Column Layout - Aligned Top */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-4 relative z-20"> {/* Removed items-center */}
                {/* Left Column: Personal Info */}
                <div className="text-xs sm:text-sm space-y-1.5 text-left pl-2 flex flex-col justify-start pt-2 font-medium text-gray-800"> {/* Changed justify-center to justify-start pt-2 */}
                    <div className="font-bold text-[#8B4513] border-b border-[#8B4513]/30 mb-2 pb-1 uppercase text-sm sm:text-base">Đương Số</div>
                    <div className="whitespace-nowrap"><span className="text-gray-600">Họ tên:</span> <span className="font-bold block sm:inline sm:ml-2 text-[#8B4513]">{input.fullName}</span></div>
                    <div className="whitespace-nowrap"><span className="text-gray-600">Năm sinh:</span> <span className="font-semibold block sm:inline sm:ml-2">{yearCanChi}</span></div>
                    <div className="whitespace-nowrap"><span className="text-gray-600">Dương lịch:</span> <span className="font-semibold block sm:inline sm:ml-2">{input.calendarType === 'lunar' ? '---' : `${input.birthDay}/${input.birthMonth}/${input.birthYear}`}</span></div>
                    <div className="whitespace-nowrap"><span className="text-gray-600">Âm lịch:</span> <span className="font-semibold block sm:inline sm:ml-2">{chart.lunarDate ? `${chart.lunarDate.day}/${chart.lunarDate.month}` : ''}</span></div>
                    <div className="whitespace-nowrap"><span className="text-gray-600">Giờ:</span> <span className="font-semibold block sm:inline sm:ml-2">{birthHourName}</span></div>
                    <div className="whitespace-nowrap"><span className="text-gray-600">Giới tính:</span> <span className="font-semibold block sm:inline sm:ml-2">{input.gender === 'male' ? 'Nam' : 'Nữ'}</span></div>
                </div>

                {/* Right Column: Destiny Info */}
                <div className="text-xs sm:text-sm space-y-1.5 text-right pr-2 flex flex-col justify-start pt-2 font-medium text-gray-800"> {/* Changed justify-center to justify-start pt-2 */}
                    <div className="font-bold text-[#8B4513] border-b border-[#8B4513]/30 mb-2 pb-1 uppercase text-sm sm:text-base">Mệnh Tạo</div>

                    <div className=""> {/* Display block for long text */}
                        <span className="text-gray-600">Bản Mệnh:</span>
                        <span className="font-bold text-red-600 block text-xs sm:text-sm mt-0.5 leading-tight">{banMenhDisplay}</span>
                    </div>
                    <div className="whitespace-nowrap flex flex-col items-end">
                        <div>
                            <span className="text-gray-600">Cục:</span>
                            <span className="font-bold text-blue-700 ml-1">{chart.cucLoai || (chart as any).cuc || 'Nhị Cục'}</span>
                        </div>
                        {relationText && (
                            <span className={`text-[10px] italic ${relationColor}`}>{relationText}</span>
                        )}
                    </div>
                    <div className="whitespace-nowrap">
                        <span className="text-gray-600">Chủ Mệnh:</span>
                        <span className="font-bold text-[#8B4513] block sm:inline sm:ml-2">{chart.chuMenh || 'Liêm Trinh'}</span>
                    </div>
                    <div className="whitespace-nowrap">
                        <span className="text-gray-600">Chủ Thân:</span>
                        <span className="font-bold text-[#8B4513] block sm:inline sm:ml-2">{chart.chuThan || 'Thiên Lương'}</span>
                    </div>
                </div>
            </div>

            {/* Major Star Group */}
            {(chart as any).majorStarGroup && (
                <div className="px-4 pb-2 text-center relative z-20 mx-2 mb-1 mt-2">
                    {/* Dashed Separator Line */}
                    <div className="w-3/4 mx-auto border-t-2 border-dashed border-[#8B4513]/40 mb-1.5 h-px"></div>

                    <span className="text-[#6A0DAD] font-bold uppercase text-xs sm:text-sm block">
                        {(chart as any).majorStarGroup.name}
                    </span>
                    <p className="text-[10px] text-gray-600 italic leading-tight mt-1 px-2 line-clamp-2">
                        {(chart as any).majorStarGroup.description}
                    </p>
                </div>
            )}

            {/* Footer with Elements */}
            <div className="relative z-20">
                {(() => {
                    const currentElement = chart.element || '';
                    const elementClass = (el: string) =>
                        currentElement.includes(el)
                            ? 'ring-1 ring-offset-0 ring-[#8B4513] font-bold shadow-sm scale-105'
                            : 'opacity-80 grayscale-[0.3]';
                    return (
                        <div className="flex justify-center gap-1.5 sm:gap-3 py-1.5 border-t border-[#8B4513]/30 bg-[#F5DEB3]/30">
                            <span className={`px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Kim')}`}>Kim</span>
                            <span className={`px-2 py-0.5 bg-green-200 text-green-800 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Mộc')}`}>Mộc</span>
                            <span className={`px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Thủy')}`}>Thủy</span>
                            <span className={`px-2 py-0.5 bg-red-200 text-red-800 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Hỏa')}`}>Hỏa</span>
                            <span className={`px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-[8px] sm:text-[9px] cursor-default transition-all ${elementClass('Thổ')}`}>Thổ</span>
                        </div>
                    );
                })()}
            </div>
            {/* Tứ trụ indicators ở các góc */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 rotate-90 text-[7px] text-gray-500">

            </div>
            {/* Note: Tuần/Triệt placement on edge is purely decorative here or needs logic. Just removing placeholder text valid for now */}

        </div>
    );
}

export default function TuViChartProfessional({ chart, input }: TuViChartProfessionalProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [scale, setScale] = useState(1);

    // State cho Tam Phương Tứ Chính
    // State cho Tam Phương Tứ Chính
    const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
    const [chartSelectedBranch, setChartSelectedBranch] = useState<string | null>(null);
    const [showTamHop, setShowTamHop] = useState(true);
    const [showDoiXung, setShowDoiXung] = useState(true);

    const handlePalaceClick = (palace: Palace) => {
        if (palace.earthlyBranch) {
            setChartSelectedBranch(palace.earthlyBranch);
        }
        setSelectedPalace(palace);
        setModalOpen(true);
    };

    // Map palace name -> palace data (hỗ trợ cả 2 định dạng)
    const palaceMap = new Map<string, Palace>();
    (chart.palaces || []).forEach((p: Palace) => {
        // Lưu cả tên gốc và tên đã normalize
        palaceMap.set(p.name, p);
        const normalizedName = normalizePalaceName(p.name);
        if (normalizedName !== p.name) {
            palaceMap.set(normalizedName, p);
        }
        // Lưu theo earthlyBranch nếu có (từ tuvi-exact.ts)
        if (p.earthlyBranch) {
            const branchPalace = BRANCH_TO_PALACE[p.earthlyBranch];
            if (branchPalace) {
                palaceMap.set(branchPalace, p);
            }
        }
    });

    // Hàm lấy palace theo tên (fallback qua nhiều cách)
    const getPalace = (name: string): Palace | null => {
        return palaceMap.get(name) || null;
    };

    // Hàm getPalaceByBranch - Lấy cung theo vị trí Chi
    const getPalaceByBranch = (branch: string): Palace | null => {
        // Map branch name to index (Tý=0...Hợi=11)
        const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
        const branchIndex = branches.indexOf(branch);

        if (branchIndex === -1) return null;

        // Check each palace for matching position
        const found = (chart.palaces || []).find(p => {
            // If palace has `position` property (0-11)
            if (typeof p.position === 'number') {
                return p.position === branchIndex;
            }
            // Fallback: if palace has `earthlyBranch` string
            if (p.earthlyBranch === branch) return true;

            return false;
        });

        return found || null;
    };

    // Helper to find default Mệnh branch
    const getMenhBranch = () => {
        const menh = (chart.palaces || []).find(p => normalizePalaceName(p.name) === 'Mệnh');
        if (!menh) return null;

        if (typeof menh.position === 'number') {
            const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
            return branches[menh.position];
        }
        return menh.earthlyBranch || null;
    };

    // Initialize hoveredBranch with Mệnh
    React.useEffect(() => {
        const menhBranch = getMenhBranch();
        if (menhBranch) {
            setHoveredBranch(menhBranch);
        }
    }, [chart]);

    const isBranchHighlighted = (branch: string): boolean => {
        if (!hoveredBranch) return false;

        // Highlight chính cung đang chọn
        if (hoveredBranch === branch) return true;

        // Kiểm tra tam hợp
        if (showTamHop) {
            const tamHopGroup = TAM_HOP_GROUPS.find(group => group.includes(hoveredBranch));
            if (tamHopGroup && tamHopGroup.includes(branch)) return true;
        }

        // Kiểm tra đối xứng
        if (showDoiXung) {
            if (CUNG_DOI_XUNG[hoveredBranch] === branch || CUNG_DOI_XUNG[branch] === hoveredBranch) return true;
        }

        return false;
    };

    const handleDownloadImage = async () => {
        if (!chartRef.current) return;

        try {
            const dataUrl = await toPng(chartRef.current, {
                backgroundColor: '#FFF8DC',
                pixelRatio: 2,
                cacheBust: true,
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `tuvi-${input.fullName}-${input.birthYear}.png`;
            link.click();

            toast.success('Đã tải ảnh lá số thành công!');
        } catch (error) {
            console.error('Error downloading image:', error);
            toast.error('Có lỗi khi tạo ảnh');
        }
    };

    const handleShareImage = async () => {
        if (!chartRef.current) return;

        try {
            const blob = await toBlob(chartRef.current, {
                backgroundColor: '#FFF8DC',
                pixelRatio: 2,
                cacheBust: true,
            });

            if (!blob) return;

            const file = new File([blob], `tuvi-${input.fullName}.png`, { type: 'image/png' });

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `Lá số Tử Vi của ${input.fullName}`,
                        text: `Xem lá số tử vi chi tiết của ${input.fullName} - Mệnh ${chart.element}`,
                        files: [file],
                    });
                } catch (err) {
                    console.log('Share cancelled');
                }
            } else {
                toast.info('Tính năng chia sẻ không được hỗ trợ trên thiết bị này');
            }
        } catch (error) {
            toast.error('Có lỗi khi chia sẻ ảnh');
        }
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.6));

    return (
        <>
            {/* Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    onClick={handleDownloadImage}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Tải Ảnh Lá Số
                </Button>
                <Button
                    onClick={handleShareImage}
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia Sẻ
                </Button>

                {/* Tam Phương Tứ Chính Controls */}
                <div className="flex items-center gap-1 border-l pl-3 ml-2">
                    <Button
                        variant={showTamHop ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowTamHop(!showTamHop)}
                        className={`text-xs ${showTamHop ? 'bg-green-600 hover:bg-green-700' : 'text-green-700 border-green-300'}`}
                        title="Hiển thị Tam Hợp (tam giác xanh)"
                    >
                        <Triangle className="w-3 h-3 mr-1" />
                        Tam Hợp
                    </Button>
                    <Button
                        variant={showDoiXung ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowDoiXung(!showDoiXung)}
                        className={`text-xs ${showDoiXung ? 'bg-red-600 hover:bg-red-700' : 'text-red-700 border-red-300'}`}
                        title="Hiển thị Đối Xứng (đường đỏ)"
                    >
                        {showDoiXung ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        Đối Xứng
                    </Button>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Chart container with zoom */}
            <div className="overflow-x-auto pb-4">
                <div
                    ref={chartRef}
                    className="bg-[#FFF8DC] border-4 border-[#8B4513] mx-auto"
                    style={{
                        width: '800px',
                        maxWidth: '100vw',
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }}
                >
                    {/* Grid 4x4 với relative positioning cho SVG overlay */}
                    <div className="grid grid-cols-4 gap-0 relative">
                        {/* Overlay toàn bộ lá số (Tam Hợp/Đối Xứng lớn) */}
                        <MainChartOverlay
                            selectedBranch={chartSelectedBranch}
                            showTamHop={showTamHop}
                            showDoiXung={showDoiXung}
                            menhBranch={getMenhBranch() || undefined}
                        />

                        {/* Row 0 */}
                        <PalaceCell
                            palace={getPalaceByBranch('Tỵ')}
                            palaceName={getPalaceByBranch('Tỵ')?.name || ''}
                            branch="Tỵ"
                            branchElement="Hỏa"
                            index={getPalaceByBranch('Tỵ')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Tỵ')}
                        />
                        <PalaceCell
                            palace={getPalaceByBranch('Ngọ')}
                            palaceName={getPalaceByBranch('Ngọ')?.name || ''}
                            branch="Ngọ"
                            branchElement="Hỏa"
                            index={getPalaceByBranch('Ngọ')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Ngọ')}
                        />
                        <PalaceCell
                            palace={getPalaceByBranch('Mùi')}
                            palaceName={getPalaceByBranch('Mùi')?.name || ''}
                            branch="Mùi"
                            branchElement="Thổ"
                            index={getPalaceByBranch('Mùi')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Mùi')}
                        />
                        <PalaceCell
                            palace={getPalaceByBranch('Thân')}
                            palaceName={getPalaceByBranch('Thân')?.name || ''}
                            branch="Thân"
                            branchElement="Kim"
                            index={getPalaceByBranch('Thân')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Thân')}
                        />

                        {/* Row 1 */}
                        <PalaceCell
                            palace={getPalaceByBranch('Thìn')}
                            palaceName={getPalaceByBranch('Thìn')?.name || ''}
                            branch="Thìn"
                            branchElement="Thổ"
                            index={getPalaceByBranch('Thìn')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Thìn')}
                        />
                        <CenterInfo chart={chart} input={input} />
                        <PalaceCell
                            palace={getPalaceByBranch('Dậu')}
                            palaceName={getPalaceByBranch('Dậu')?.name || ''}
                            branch="Dậu"
                            branchElement="Kim"
                            index={getPalaceByBranch('Dậu')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Dậu')}
                        />

                        {/* Row 2 */}
                        <PalaceCell
                            palace={getPalaceByBranch('Mão')}
                            palaceName={getPalaceByBranch('Mão')?.name || ''}
                            branch="Mão"
                            branchElement="Mộc"
                            index={getPalaceByBranch('Mão')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Mão')}
                        />
                        <PalaceCell
                            palace={getPalaceByBranch('Tuất')}
                            palaceName={getPalaceByBranch('Tuất')?.name || ''}
                            branch="Tuất"
                            branchElement="Thổ"
                            index={getPalaceByBranch('Tuất')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Tuất')}
                        />

                        {/* Row 3 */}
                        <PalaceCell
                            palace={getPalaceByBranch('Dần')}
                            palaceName={getPalaceByBranch('Dần')?.name || ''}
                            branch="Dần"
                            branchElement="Mộc"
                            index={getPalaceByBranch('Dần')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Dần')}
                        />
                        <PalaceCell
                            palace={getPalaceByBranch('Sửu')}
                            palaceName={getPalaceByBranch('Sửu')?.name || ''}
                            branch="Sửu"
                            branchElement="Thổ"
                            index={getPalaceByBranch('Sửu')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Sửu')}
                        />
                        <PalaceCell
                            palace={getPalaceByBranch('Tý')}
                            palaceName={getPalaceByBranch('Tý')?.name || ''}
                            branch="Tý"
                            branchElement="Thủy"
                            index={getPalaceByBranch('Tý')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Tý')}
                        />
                        <PalaceCell
                            palace={getPalaceByBranch('Hợi')}
                            palaceName={getPalaceByBranch('Hợi')?.name || ''}
                            branch="Hợi"
                            branchElement="Thủy"
                            index={getPalaceByBranch('Hợi')?.id || 0}
                            onPalaceClick={handlePalaceClick}
                            onHover={setHoveredBranch}
                            isHighlighted={isBranchHighlighted('Hợi')}
                        />
                    </div>

                    {/* Footer indicators */}
                    <div className="flex justify-between items-center px-2 py-1 border-t border-[#8B4513]/50 text-[8px] sm:text-[9px] text-gray-600 bg-[#F5DEB3]">
                        <div className="flex gap-4">
                            <span className="border border-gray-400 px-1 rounded">Triệt</span>
                            <span>Tý</span>
                            <span>·</span>
                            <span>Bệnh</span>
                            <span>+Mộc</span>
                        </div>
                        <div className="flex gap-2">
                            <span>Hợi</span>
                            <span className="border border-gray-400 px-1 rounded">Tuất</span>
                            <span>Đế Vượng</span>
                            <span>+Thủy</span>
                        </div>
                        <div className="flex gap-4">
                            <span>Dậu</span>
                            <span>Lâm Quan</span>
                            <span>-Thủy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Palace Detail Modal */}
            <PalaceDetailModal
                palace={selectedPalace}
                open={modalOpen}
                onOpenChange={setModalOpen}
                input={input ? {
                    fullName: input.fullName,
                    birthDate: `${input.birthYear}-${String(input.birthMonth).padStart(2, '0')}-${String(input.birthDay).padStart(2, '0')}`,
                    birthHour: input.birthHour,
                    gender: input.gender,
                    calendarType: input.calendarType || 'solar'
                } : undefined}
            />
        </>
    );
}
