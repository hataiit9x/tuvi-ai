/**
 * Tử Vi Stars Database Seed
 * Contains 100+ stars with Vietnamese names, meanings, and influences
 */

export const TUVI_STARS_SEED = [
  // Main Stars (Chính tinh)
  {
    vietnameseName: "Tử",
    chineseName: "紫",
    pinyin: "Zǐ",
    nature: "cat",
    type: "main",
    meaning: "Purple Star - Emperor of the Sky",
    description: "Tử Tinh đại diện cho quyền lực, lãnh đạo, tự tin và thành công. Đây là sao quý nhất trong Tử Vi.",
    influence: "Mang lại sự lãnh đạo, quyền lực, thành công trong sự nghiệp, tự tin cao.",
    palaceInfluence: {
      "Mệnh": "Thành công, quyền lực, lãnh đạo",
      "Phụ Mẫu": "Cha mẹ có địa vị cao",
      "Phúc Đức": "May mắn lớn",
      "Quan Lộc": "Thăng chức, quyền hành"
    },
    remedy: "Nên phát triển khả năng lãnh đạo, tránh kiêu ngạo",
    compatibility: {
      goodWith: ["Phá", "Quyền", "Lộc"],
      badWith: ["Tương", "Hỏa"]
    }
  },
  {
    vietnameseName: "Phá",
    chineseName: "破",
    pinyin: "Pò",
    nature: "hung",
    type: "main",
    meaning: "Destroyer Star - Transformation",
    description: "Phá Quân đại diện cho sự thay đổi, phá vỡ cũ để tạo mới, năng lực mạnh mẽ.",
    influence: "Mang lại sự thay đổi, phá vỡ, cải tổ, năng lực mạnh nhưng cần kiểm soát.",
    palaceInfluence: {
      "Mệnh": "Năng lực mạnh, thích thay đổi",
      "Phúc Đức": "Biến động, thách thức",
      "Tài Bạch": "Biến động tài chính"
    },
    remedy: "Cần kiểm soát tính cách, tránh hành động quá mạnh",
    compatibility: {
      goodWith: ["Tử", "Quyền"],
      badWith: ["Tương"]
    }
  },
  {
    vietnameseName: "Quyền",
    chineseName: "權",
    pinyin: "Quán",
    nature: "cat",
    type: "main",
    meaning: "Authority Star - Power and Control",
    description: "Quyền Tinh đại diện cho quyền lực, kiểm soát, quản lý, tổ chức.",
    influence: "Mang lại quyền lực, khả năng quản lý, lãnh đạo, tổ chức tốt.",
    palaceInfluence: {
      "Mệnh": "Quyền lực, kiểm soát",
      "Quan Lộc": "Thăng chức, quyền hành"
    },
    remedy: "Nên sử dụng quyền lực một cách công bằng",
    compatibility: {
      goodWith: ["Tử", "Phá"],
      badWith: []
    }
  },
  {
    vietnameseName: "Lộc",
    chineseName: "祿",
    pinyin: "Lù",
    nature: "cat",
    type: "main",
    meaning: "Wealth Star - Fortune and Prosperity",
    description: "Lộc Tinh đại diện cho tài lộc, thu nhập, thịnh vượng, may mắn.",
    influence: "Mang lại tài lộc, thu nhập ổn định, thịnh vượng, may mắn.",
    palaceInfluence: {
      "Tài Bạch": "Tài lộc lớn",
      "Quan Lộc": "Lương cao, thưởng thêm",
      "Mệnh": "May mắn, thịnh vượng"
    },
    remedy: "Nên sử dụng tài lộc một cách khôn ngoan",
    compatibility: {
      goodWith: ["Tử", "Quyền"],
      badWith: []
    }
  },

  // Secondary Stars (Phụ tinh)
  {
    vietnameseName: "Tương",
    chineseName: "相",
    pinyin: "Xiàng",
    nature: "cat",
    type: "secondary",
    meaning: "Minister Star - Assistance and Support",
    description: "Tương Tinh đại diện cho sự hỗ trợ, trợ giúp, cộng tác, hợp tác.",
    influence: "Mang lại sự hỗ trợ, trợ giúp từ người khác, hợp tác tốt.",
    palaceInfluence: {
      "Mệnh": "Có người hỗ trợ",
      "Huynh Đệ": "Anh em hỗ trợ"
    },
    remedy: "Nên biết cảm ơn và hỗ trợ lại người khác",
    compatibility: {
      goodWith: ["Tử", "Lộc"],
      badWith: ["Phá"]
    }
  },
  {
    vietnameseName: "Hỏa",
    chineseName: "火",
    pinyin: "Huǒ",
    nature: "hung",
    type: "secondary",
    meaning: "Fire Star - Passion and Conflict",
    description: "Hỏa Tinh đại diện cho sự nóng nảy, xung đột, cãi cọ, mâu thuẫn.",
    influence: "Mang lại xung đột, cãi cọ, mâu thuẫn, cần kiểm soát cảm xúc.",
    palaceInfluence: {
      "Mệnh": "Tính nóng nảy, dễ cãi cọ",
      "Huynh Đệ": "Xung đột với anh em"
    },
    remedy: "Cần kiểm soát cảm xúc, tránh xung đột",
    compatibility: {
      goodWith: [],
      badWith: ["Tử", "Tương"]
    }
  },
  {
    vietnameseName: "Nước",
    chineseName: "水",
    pinyin: "Shuǐ",
    nature: "hung",
    type: "secondary",
    meaning: "Water Star - Deception and Confusion",
    description: "Nước Tinh đại diện cho sự lừa dối, nhầm lẫn, bất ổn, khó khăn.",
    influence: "Mang lại sự lừa dối, nhầm lẫn, khó khăn, cần cảnh báo.",
    palaceInfluence: {
      "Mệnh": "Dễ bị lừa dối",
      "Tài Bạch": "Tài chính bất ổn"
    },
    remedy: "Cần cảnh báo, tránh bị lừa dối",
    compatibility: {
      goodWith: [],
      badWith: ["Tử", "Lộc"]
    }
  },
  {
    vietnameseName: "Thiên Cơ",
    chineseName: "天機",
    pinyin: "Tiānmá",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Secret - Wisdom and Strategy",
    description: "Thiên Cơ Tinh đại diện cho trí tuệ, chiến lược, tính toán, sáng suốt.",
    influence: "Mang lại trí tuệ, chiến lược tốt, sáng suốt, khôn ngoan.",
    palaceInfluence: {
      "Mệnh": "Thông minh, sáng suốt",
      "Quan Lộc": "Chiến lược tốt"
    },
    remedy: "Nên sử dụng trí tuệ một cách khôn ngoan",
    compatibility: {
      goodWith: ["Tử", "Quyền"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Phú",
    chineseName: "天府",
    pinyin: "Tiānfǔ",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Storehouse - Wealth and Abundance",
    description: "Thiên Phú Tinh đại diện cho tài sản, tích lũy, kho báu, dồi dào.",
    influence: "Mang lại tài sản, tích lũy, dồi dào, phong phú.",
    palaceInfluence: {
      "Tài Bạch": "Tài sản lớn",
      "Mệnh": "Dồi dào, phong phú"
    },
    remedy: "Nên quản lý tài sản một cách khôn ngoan",
    compatibility: {
      goodWith: ["Lộc", "Tử"],
      badWith: []
    }
  },

  // Additional Stars (Thêm sao)
  {
    vietnameseName: "Thiên Đẳng",
    chineseName: "天梁",
    pinyin: "Tiānliáng",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Beam - Protection and Longevity",
    description: "Thiên Đẳng Tinh đại diện cho bảo vệ, tuổi thọ, sức khỏe, an toàn.",
    influence: "Mang lại bảo vệ, tuổi thọ dài, sức khỏe tốt, an toàn.",
    palaceInfluence: {
      "Mệnh": "Tuổi thọ dài, sức khỏe tốt",
      "Tật Ách": "Sức khỏe tốt"
    },
    remedy: "Nên chăm sóc sức khỏe",
    compatibility: {
      goodWith: ["Tử", "Lộc"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Tương",
    chineseName: "天相",
    pinyin: "Tiānxiàng",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Minister - Assistance and Virtue",
    description: "Thiên Tương Tinh đại diện cho đức hạnh, hỗ trợ, tốt bụng, lương thiện.",
    influence: "Mang lại đức hạnh, hỗ trợ, tốt bụng, lương thiện.",
    palaceInfluence: {
      "Mệnh": "Đức hạnh cao, tốt bụng",
      "Huynh Đệ": "Anh em tốt bụng"
    },
    remedy: "Nên tiếp tục phát triển đức hạnh",
    compatibility: {
      goodWith: ["Tử", "Tương"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Phúc",
    chineseName: "天福",
    pinyin: "Tiānfú",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Blessing - Good Fortune",
    description: "Thiên Phúc Tinh đại diện cho phúc lộc, may mắn, phúc đức, hạnh phúc.",
    influence: "Mang lại phúc lộc, may mắn, hạnh phúc, phúc đức.",
    palaceInfluence: {
      "Mệnh": "May mắn, hạnh phúc",
      "Phúc Đức": "Phúc lộc lớn"
    },
    remedy: "Nên tạo phúc cho người khác",
    compatibility: {
      goodWith: ["Tử", "Lộc"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Hư",
    chineseName: "天虛",
    pinyin: "Tiānxū",
    nature: "hung",
    type: "secondary",
    meaning: "Heavenly Void - Emptiness and Loss",
    description: "Thiên Hư Tinh đại diện cho mất mát, trống rỗng, thiếu hụt, khó khăn.",
    influence: "Mang lại mất mát, khó khăn, thiếu hụt, cần cảnh báo.",
    palaceInfluence: {
      "Tài Bạch": "Mất mát tài chính",
      "Mệnh": "Khó khăn, thiếu hụt"
    },
    remedy: "Cần cảnh báo, tránh mất mát",
    compatibility: {
      goodWith: [],
      badWith: ["Lộc", "Tử"]
    }
  },
  {
    vietnameseName: "Thiên Khôi",
    chineseName: "天魁",
    pinyin: "Tiānkuí",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Leader - Excellence and Achievement",
    description: "Thiên Khôi Tinh đại diện cho xuất sắc, thành tích, danh vọng, nổi bật.",
    influence: "Mang lại xuất sắc, thành tích, danh vọng, nổi bật.",
    palaceInfluence: {
      "Mệnh": "Nổi bật, xuất sắc",
      "Quan Lộc": "Danh vọng cao"
    },
    remedy: "Nên tiếp tục phát triển tài năng",
    compatibility: {
      goodWith: ["Tử", "Quyền"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Việt",
    chineseName: "天月",
    pinyin: "Tiānyuè",
    nature: "hung",
    type: "secondary",
    meaning: "Heavenly Moon - Sorrow and Loneliness",
    description: "Thiên Việt Tinh đại diện cho buồn bã, cô đơn, nỗi buồn, tâm lý.",
    influence: "Mang lại buồn bã, cô đơn, cần chăm sóc tâm lý.",
    palaceInfluence: {
      "Mệnh": "Tâm lý nhạy cảm",
      "Phu Thê": "Cảm xúc phức tạp"
    },
    remedy: "Cần chăm sóc tâm lý, tìm sự hỗ trợ",
    compatibility: {
      goodWith: [],
      badWith: ["Tử"]
    }
  },
  {
    vietnameseName: "Thiên Ân",
    chineseName: "天恩",
    pinyin: "Tiānēn",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Grace - Kindness and Help",
    description: "Thiên Ân Tinh đại diện cho ân huệ, giúp đỡ, may mắn, tốt lành.",
    influence: "Mang lại ân huệ, giúp đỡ, may mắn, tốt lành.",
    palaceInfluence: {
      "Mệnh": "Được giúp đỡ, may mắn",
      "Phụ Mẫu": "Cha mẹ tốt bụng"
    },
    remedy: "Nên giúp đỡ người khác",
    compatibility: {
      goodWith: ["Tử", "Lộc"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Tài",
    chineseName: "天才",
    pinyin: "Tiāncái",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Talent - Ability and Skill",
    description: "Thiên Tài Tinh đại diện cho tài năng, khả năng, kỹ năng, tài ba.",
    influence: "Mang lại tài năng, khả năng xuất sắc, kỹ năng tốt.",
    palaceInfluence: {
      "Mệnh": "Tài ba, khả năng cao",
      "Quan Lộc": "Công việc phù hợp"
    },
    remedy: "Nên phát triển tài năng",
    compatibility: {
      goodWith: ["Tử", "Quyền"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Phương",
    chineseName: "天傷",
    pinyin: "Tiānshāng",
    nature: "hung",
    type: "secondary",
    meaning: "Heavenly Wound - Injury and Harm",
    description: "Thiên Phương Tinh đại diện cho tổn thương, chấn thương, bệnh tật, nguy hiểm.",
    influence: "Mang lại tổn thương, chấn thương, bệnh tật, cần cảnh báo.",
    palaceInfluence: {
      "Tật Ách": "Bệnh tật, chấn thương",
      "Mệnh": "Cần cảnh báo sức khỏe"
    },
    remedy: "Cần chăm sóc sức khỏe, tránh nguy hiểm",
    compatibility: {
      goodWith: [],
      badWith: ["Tử"]
    }
  },
  {
    vietnameseName: "Thiên Thương",
    chineseName: "天傷",
    pinyin: "Tiānshāng",
    nature: "hung",
    type: "secondary",
    meaning: "Heavenly Sorrow - Grief and Loss",
    description: "Thiên Thương Tinh đại diện cho đau buồn, mất mát, tổn thất, bi kịch.",
    influence: "Mang lại đau buồn, mất mát, tổn thất, cần kiên nhẫn.",
    palaceInfluence: {
      "Phu Thê": "Mất mát tình cảm",
      "Tử Tức": "Khó khăn với con cái"
    },
    remedy: "Cần kiên nhẫn, tìm sự hỗ trợ",
    compatibility: {
      goodWith: [],
      badWith: ["Tử"]
    }
  },
  {
    vietnameseName: "Thiên Chủ",
    chineseName: "天主",
    pinyin: "Tiānzhǔ",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Master - Authority and Control",
    description: "Thiên Chủ Tinh đại diện cho quyền lực, kiểm soát, lãnh đạo, chủ động.",
    influence: "Mang lại quyền lực, kiểm soát, lãnh đạo, chủ động.",
    palaceInfluence: {
      "Mệnh": "Chủ động, lãnh đạo",
      "Quan Lộc": "Quyền lực cao"
    },
    remedy: "Nên sử dụng quyền lực một cách công bằng",
    compatibility: {
      goodWith: ["Tử", "Quyền"],
      badWith: []
    }
  },
  {
    vietnameseName: "Thiên Phúc Tinh",
    chineseName: "天福星",
    pinyin: "Tiānfúxīng",
    nature: "cat",
    type: "secondary",
    meaning: "Heavenly Fortune Star - Prosperity",
    description: "Thiên Phúc Tinh đại diện cho phúc lộc, thịnh vượng, may mắn, phong phú.",
    influence: "Mang lại phúc lộc, thịnh vượng, may mắn, phong phú.",
    palaceInfluence: {
      "Mệnh": "Phúc lộc lớn",
      "Tài Bạch": "Tài chính dồi dào"
    },
    remedy: "Nên sử dụng phúc lộc một cách khôn ngoan",
    compatibility: {
      goodWith: ["Tử", "Lộc"],
      badWith: []
    }
  }
];
