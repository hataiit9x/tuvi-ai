import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Share2, Facebook, Copy, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  description: string;
  url?: string;
  type: "tuvi" | "numerology" | "compatibility";
  data?: {
    name?: string;
    birthDate?: string;
    mainNumber?: number;
    cungMenh?: string;
    score?: number;
  };
}

export default function ShareButtons({ 
  title, 
  description, 
  url,
  type,
  data 
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  
  // Create share text based on type
  const getShareText = () => {
    if (type === "tuvi" && data) {
      return `🌟 Lá Số Tử Vi của ${data.name || "tôi"}
📅 Ngày sinh: ${data.birthDate || ""}
🏛️ Cung Mệnh: ${data.cungMenh || ""}

Khám phá vận mệnh của bạn tại Tử Vi AI!`;
    } else if (type === "numerology" && data) {
      return `🔢 Thần Số Học của ${data.name || "tôi"}
📅 Ngày sinh: ${data.birthDate || ""}
✨ Số Chủ Đạo: ${data.mainNumber || ""}

Khám phá con số vận mệnh của bạn tại Tử Vi AI!`;
    } else if (type === "compatibility" && data) {
      return `💕 Độ Tương Hợp: ${data.name || ""}
❤️ Điểm số: ${data.score || 0}/100

Khám phá độ tương hợp của bạn tại Tử Vi AI!`;
    }
    return description;
  };

  const shareText = getShareText();

  // Share to Facebook
  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
    toast.success("Đã mở cửa sổ chia sẻ Facebook");
  };

  // Share to Zalo
  const shareToZalo = () => {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(shareText)}`;
    window.open(zaloUrl, "_blank", "width=600,height=400");
    toast.success("Đã mở cửa sổ chia sẻ Zalo");
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      const textToCopy = `${shareText}\n\n🔗 ${shareUrl}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Đã sao chép vào clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Không thể sao chép");
    }
  };

  // Native share (mobile)
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Đã chia sẻ thành công");
      } catch (err) {
        // User cancelled or error
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
          onClick={(e) => {
            if (typeof navigator !== 'undefined' && 'share' in navigator) {
              e.preventDefault();
              nativeShare();
            }
          }}
        >
          <Share2 className="w-4 h-4" />
          Chia sẻ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" />
            Chia sẻ kết quả
          </DialogTitle>
          <DialogDescription>
            Chia sẻ kết quả {type === "tuvi" ? "Tử Vi" : "Thần Số Học"} của bạn lên mạng xã hội
          </DialogDescription>
        </DialogHeader>
        
        {/* Preview */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
          <p className="text-sm text-gray-700 whitespace-pre-line">{shareText}</p>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {/* Facebook */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 group"
            onClick={shareToFacebook}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Facebook className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium">Facebook</span>
          </Button>

          {/* Zalo */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 group"
            onClick={shareToZalo}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium">Zalo</span>
          </Button>

          {/* Copy Link */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all duration-200 group"
            onClick={copyToClipboard}
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-green-600" />
              )}
            </div>
            <span className="text-xs font-medium">{copied ? "Đã sao chép" : "Sao chép"}</span>
          </Button>
        </div>

        {/* URL display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Đường dẫn chia sẻ:</p>
          <p className="text-sm text-gray-700 truncate">{shareUrl}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
