// SEO Configuration for Traditional Chinese (Taiwan) Market
// Optimized for mental health and psychological assessment keywords

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  alternativeTitle?: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    locale: string;
  };
  structuredData?: {
    name: string;
    description: string;
    category: string;
    duration: string;
    difficulty: string;
  };
}

export const baseSEO = {
  siteName: "文心樂丞診所 - 心理健康評估平台",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://questionnaire.anxiety.com.tw",
  locale: "zh_TW",
  defaultImage: "/og-image.jpg", // Add default OG image
};

export const questionnaireSEO: Record<string, SEOConfig> = {
  // TDQ - Taiwan Depression Questionnaire
  tdq: {
    title: "憂鬱症量表 TDQ | 台灣人憂鬱症篩檢 | 免費線上憂鬱症測試 - 文心樂丞診所",
    description: "專為台灣人設計的憂鬱症量表(TDQ)，免費線上憂鬱症篩檢工具。3分鐘快速評估憂鬱症狀，由專業精神科醫師提供，適合台灣文化背景的憂鬱症自我評估。",
    keywords: [
      "憂鬱症量表", "TDQ", "台灣憂鬱症篩檢", "憂鬱症測試", "憂鬱症自我評估",
      "憂鬱症問卷", "台灣人憂鬱症量表", "憂鬱症檢測", "心理健康評估",
      "憂鬱症診斷", "精神健康篩檢", "免費憂鬱症測試", "線上憂鬱症評估"
    ],
    openGraph: {
      title: "憂鬱症量表 TDQ - 專為台灣人設計的憂鬱症篩檢工具",
      description: "免費線上憂鬱症評估，3分鐘了解您的心理健康狀況。由專業醫師提供，適合台灣文化的憂鬱症量表。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "台灣人憂鬱症量表 (TDQ)",
      description: "專為台灣地區設計的憂鬱症篩檢工具",
      category: "心理健康評估",
      duration: "8-10分鐘",
      difficulty: "中等"
    }
  },

  // PHQ-9 - Patient Health Questionnaire
  "phq-9": {
    title: "PHQ-9 憂鬱症篩檢問卷 | 國際標準憂鬱症量表 | 免費線上測試 - 文心樂丞診所",
    description: "PHQ-9憂鬱症篩檢問卷，國際廣泛使用的憂鬱症評估工具。5分鐘快速檢測憂鬱症狀嚴重程度，由專業精神科醫師提供的標準化憂鬱症量表。",
    keywords: [
      "PHQ-9", "憂鬱症篩檢", "憂鬱症問卷", "Patient Health Questionnaire",
      "憂鬱症量表", "憂鬱症評估", "憂鬱症測試", "憂鬱症診斷工具",
      "心理健康評估", "精神健康篩檢", "憂鬱症檢測", "免費憂鬱症測試"
    ],
    openGraph: {
      title: "PHQ-9 憂鬱症篩檢問卷 - 國際標準憂鬱症評估工具",
      description: "使用國際認證的PHQ-9問卷評估憂鬱症狀，5分鐘了解您的心理健康狀況。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "PHQ-9 憂鬱症篩檢問卷",
      description: "國際標準的憂鬱症評估工具",
      category: "心理健康評估",
      duration: "5-8分鐘",
      difficulty: "簡單"
    }
  },

  // GAD-7 - Generalized Anxiety Disorder
  gad: {
    title: "焦慮症量表 GAD-7 | 廣泛性焦慮症篩檢 | 免費焦慮症測試 - 文心樂丞診所",
    description: "GAD-7廣泛性焦慮症量表，專業焦慮症篩檢工具。3分鐘快速評估焦慮症狀，了解焦慮程度，由精神科醫師提供的標準化焦慮症評估。",
    keywords: [
      "焦慮症量表", "GAD-7", "廣泛性焦慮症", "焦慮症篩檢", "焦慮症測試",
      "焦慮症評估", "焦慮症問卷", "焦慮症檢測", "心理健康評估",
      "精神健康篩檢", "免費焦慮症測試", "線上焦慮症評估", "焦慮症診斷"
    ],
    openGraph: {
      title: "GAD-7 焦慮症量表 - 專業廣泛性焦慮症篩檢工具",
      description: "使用GAD-7量表評估焦慮症狀，3分鐘了解您的焦慮程度和心理健康狀況。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "GAD-7 廣泛性焦慮症量表",
      description: "評估廣泛性焦慮症狀的標準工具",
      category: "心理健康評估",
      duration: "3-5分鐘",
      difficulty: "簡單"
    }
  },

  // HCL-32 - Hypomania Checklist
  "hcl-32": {
    title: "輕躁症量表 HCL-32 | 躁鬱症篩檢 | 雙極性疾患評估 - 文心樂丞診所",
    description: "HCL-32輕躁症自我評估量表，專業躁鬱症篩檢工具。評估雙極性疾患風險，了解輕躁症症狀，由精神科醫師提供的標準化評估工具。",
    keywords: [
      "輕躁症量表", "HCL-32", "躁鬱症篩檢", "雙極性疾患", "躁鬱症測試",
      "輕躁症評估", "bipolar disorder", "躁鬱症診斷", "情緒障礙評估",
      "心理健康評估", "精神健康篩檢", "躁鬱症問卷", "躁鬱症檢測"
    ],
    openGraph: {
      title: "HCL-32 輕躁症量表 - 躁鬱症與雙極性疾患篩檢工具",
      description: "專業的輕躁症評估量表，幫助篩檢躁鬱症風險，了解情緒變化模式。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "HCL-32 輕躁症自我評估量表",
      description: "評估輕躁症症狀和躁鬱症風險",
      category: "心理健康評估",
      duration: "10-15分鐘",
      difficulty: "中等"
    }
  },

  // OCI-R - Obsessive Compulsive Inventory Revised
  "oci-r": {
    title: "強迫症量表 OCI-R | 強迫症篩檢 | OCD自我評估測試 - 文心樂丞診所",
    description: "OCI-R強迫症狀量表修訂版，專業強迫症篩檢工具。評估強迫思考與強迫行為，了解OCD症狀嚴重程度，由精神科醫師提供的標準化評估。",
    keywords: [
      "強迫症量表", "OCI-R", "強迫症篩檢", "OCD測試", "強迫症評估",
      "強迫症自我評估", "強迫思考", "強迫行為", "強迫症檢測",
      "心理健康評估", "精神健康篩檢", "強迫症診斷", "免費強迫症測試"
    ],
    openGraph: {
      title: "OCI-R 強迫症量表 - 專業強迫症篩檢與OCD評估工具",
      description: "使用國際認證的OCI-R量表評估強迫症狀，了解強迫思考與行為的困擾程度。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "OCI-R 強迫症狀量表修訂版",
      description: "評估強迫症狀困擾程度的專業工具",
      category: "心理健康評估",
      duration: "5-8分鐘",
      difficulty: "簡單"
    }
  },

  // ASRS - Adult ADHD Self-Report Scale
  asrs: {
    title: "ADHD量表 ASRS | 成人注意力不足測試 | 過動症篩檢 - 文心樂丞診所",
    description: "ASRS成人ADHD自我評估量表，專業注意力不足過動症篩檢工具。評估成人ADHD症狀，了解注意力不集中與過動傾向，標準化ADHD評估。",
    keywords: [
      "ADHD量表", "ASRS", "成人ADHD", "注意力不足", "過動症篩檢",
      "ADHD測試", "注意力缺失", "過動症評估", "ADHD診斷",
      "注意力不集中", "過動症檢測", "成人注意力評估", "ADHD自我評估"
    ],
    openGraph: {
      title: "ASRS 成人ADHD量表 - 注意力不足過動症專業篩檢工具",
      description: "評估成人ADHD症狀，了解注意力不足與過動傾向，專業的成人注意力評估工具。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "ASRS 成人ADHD自我評估量表",
      description: "評估成人注意力不足過動症症狀",
      category: "心理健康評估",
      duration: "5-8分鐘",
      difficulty: "簡單"
    }
  },

  // SNAP-4 - Children ADHD Assessment
  "snap-4": {
    title: "兒童ADHD量表 SNAP-4 | 過動兒評估 | 兒童注意力篩檢 - 文心樂丞診所",
    description: "SNAP-4兒童ADHD評估問卷，專業過動兒篩檢工具。評估兒童注意力不足、過動衝動症狀，家長填寫的標準化兒童行為評估量表。",
    keywords: [
      "兒童ADHD", "SNAP-4", "過動兒評估", "兒童注意力評估", "兒童過動症",
      "兒童行為評估", "注意力不足兒童", "過動兒篩檢", "兒童ADHD測試",
      "兒童心理評估", "兒童發展評估", "過動兒診斷", "兒童專注力評估"
    ],
    openGraph: {
      title: "SNAP-4 兒童ADHD量表 - 專業過動兒與注意力評估工具",
      description: "家長填寫的兒童ADHD評估問卷，專業評估孩子的注意力、過動與對立行為。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "SNAP-4 兒童ADHD評估問卷",
      description: "評估兒童注意力不足過動症症狀",
      category: "兒童心理評估",
      duration: "10-12分鐘",
      difficulty: "中等"
    }
  },

  // PSQI - Pittsburgh Sleep Quality Index
  psqi: {
    title: "睡眠品質量表 PSQI | 睡眠障礙評估 | 失眠檢測 - 文心樂丞診所",
    description: "PSQI匹茲堡睡眠品質量表，專業睡眠障礙評估工具。評估睡眠品質、入睡困難、睡眠效率，了解睡眠健康狀況的標準化量表。",
    keywords: [
      "睡眠品質量表", "PSQI", "睡眠障礙評估", "失眠測試", "睡眠品質評估",
      "睡眠檢測", "入睡困難", "睡眠效率", "失眠篩檢", "睡眠健康",
      "睡眠問題評估", "睡眠障礙檢測", "睡眠品質檢查", "失眠診斷"
    ],
    openGraph: {
      title: "PSQI 睡眠品質量表 - 專業睡眠障礙與失眠評估工具",
      description: "評估您的睡眠品質和睡眠障礙，了解睡眠健康狀況，改善睡眠品質。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "PSQI 匹茲堡睡眠品質量表",
      description: "評估睡眠品質和睡眠障礙",
      category: "睡眠健康評估",
      duration: "8-10分鐘",
      difficulty: "中等"
    }
  },

  // AD-8 - Dementia Screening
  "ad-8": {
    title: "失智症篩檢表 AD-8 | 早期失智評估 | 認知功能檢測 - 文心樂丞診所",
    description: "AD-8早期失智篩檢表，專業失智症評估工具。快速檢測認知功能變化，早期發現失智症風險，由專業醫師提供的標準化失智症篩檢。",
    keywords: [
      "失智症篩檢", "AD-8", "早期失智評估", "失智症測試", "認知功能評估",
      "失智症檢測", "認知功能退化", "記憶力評估", "失智症診斷",
      "認知障礙篩檢", "老人失智評估", "失智症量表", "認知功能檢查"
    ],
    openGraph: {
      title: "AD-8 失智症篩檢表 - 早期失智與認知功能評估工具",
      description: "快速篩檢失智症風險，評估認知功能變化，早期發現失智症徵兆。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "AD-8 早期失智篩檢表",
      description: "篩檢早期失智症和認知功能變化",
      category: "認知功能評估",
      duration: "3-5分鐘",
      difficulty: "簡單"
    }
  },

  // Big-5 - Personality Assessment
  "big-5": {
    title: "人格測試 Big-5 | 五大人格量表 | 性格分析測驗 - 文心樂丞診所",
    description: "Big-5大五人格量表，專業人格特質評估工具。分析五大人格面向：外向性、親和性、責任感、神經質、開放性，了解個人性格特徵。",
    keywords: [
      "人格測試", "Big-5", "五大人格", "人格量表", "性格測試",
      "人格特質評估", "性格分析", "人格分析", "心理測驗",
      "人格評估", "性格量表", "個性測試", "人格心理學", "性格診斷"
    ],
    openGraph: {
      title: "Big-5 人格測試 - 專業五大人格特質評估工具",
      description: "深度分析您的人格特質，了解外向性、親和性、責任感等五大人格面向。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "Big-5 大五人格量表",
      description: "評估五大人格特質面向",
      category: "人格特質評估",
      duration: "15-20分鐘",
      difficulty: "詳細"
    }
  }
};

// Landing page SEO
export const landingPageSEO: SEOConfig = {
  title: "心理健康評估平台 | 免費線上憂鬱症焦慮症測試 | 文心樂丞診所",
  description: "專業心理健康自我評估平台，提供憂鬱症、焦慮症、ADHD、失智症等免費線上篩檢工具。由精神科醫師陳璿丞提供，包含PHQ-9、GAD-7、TDQ等國際標準量表。",
  keywords: [
    "心理健康評估", "憂鬱症測試", "焦慮症篩檢", "精神健康檢測",
    "心理測驗", "憂鬱症量表", "焦慮症量表", "ADHD測試",
    "失智症篩檢", "睡眠品質評估", "人格測試", "心理健康篩檢",
    "免費心理測驗", "線上心理評估", "精神科", "陳璿丞醫師"
  ],
  openGraph: {
    title: "心理健康評估平台 - 專業免費線上心理測驗",
    description: "由精神科醫師提供的專業心理健康評估平台，包含憂鬱症、焦慮症、ADHD等多種免費篩檢工具。",
    type: "website",
    locale: "zh_TW"
  }
};

// Common structured data for the site
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "文心樂丞診所",
  "url": baseSEO.siteUrl,
  "logo": `${baseSEO.siteUrl}/logo.png`,
  "description": "提供專業心理健康評估和精神科醫療服務",
  "medicalSpecialty": ["Psychiatry", "Mental Health"],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "TW",
    "addressRegion": "台灣"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://anxiety.com.tw"
  }
};