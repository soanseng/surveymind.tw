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

  // ISI - Insomnia Severity Index
  isi: {
    title: "失眠嚴重度量表 ISI | 失眠症評估 | 睡眠困難檢測 - 文心樂丞診所",
    description: "ISI失眠嚴重度量表，專業失眠症篩檢工具。快速評估失眠嚴重程度、睡眠困擾對日常生活的影響，由精神科醫師提供的標準化失眠評估。",
    keywords: [
      "失眠嚴重度量表", "ISI", "失眠症評估", "失眠測試", "失眠篩檢",
      "睡眠困擾評估", "失眠症量表", "失眠診斷", "睡眠問題檢測",
      "失眠嚴重程度", "睡眠障礙", "失眠自我評估", "線上失眠測試"
    ],
    openGraph: {
      title: "ISI 失眠嚴重度量表 - 專業失眠症篩檢評估工具",
      description: "快速評估失眠嚴重程度，了解睡眠困擾對日常生活的影響，改善睡眠品質。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "ISI 失眠嚴重度量表",
      description: "評估失眠嚴重程度和對生活的影響",
      category: "睡眠健康評估",
      duration: "3-5分鐘",
      difficulty: "簡單"
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
  },

  // SPMSQ - Simple Portable Mental Status Questionnaire
  spmsq: {
    title: "簡易認知功能評估表 SPMSQ | 失智症篩檢 | 認知功能測試 - 文心樂丞診所",
    description: "SPMSQ簡易認知功能評估表，專業失智症篩檢工具。快速評估基本心智狀態、定向感和記憶力，10題認知功能檢測，適合社區篩檢使用。",
    keywords: [
      "SPMSQ", "簡易認知功能評估", "失智症篩檢", "認知功能測試", "心智狀態評估",
      "記憶力評估", "定向感檢測", "失智症測試", "認知障礙篩檢",
      "老人認知評估", "認知功能檢查", "失智症量表", "認知功能退化"
    ],
    openGraph: {
      title: "SPMSQ 簡易認知功能評估表 - 專業失智症篩檢工具",
      description: "快速評估認知功能狀態，10題簡易測試，有效篩檢失智症風險。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "SPMSQ 簡易認知功能評估表",
      description: "篩檢基本心智狀態和認知功能",
      category: "認知功能評估",
      duration: "5分鐘",
      difficulty: "簡單"
    }
  },

  // SLUMS - Saint Louis University Mental Status
  slums: {
    title: "聖路易大學心智狀態測驗 SLUMS | 輕度認知障礙篩檢 | MCI檢測 - 文心樂丞診所",
    description: "SLUMS聖路易大學心智狀態測驗，免費認知功能評估工具。對輕度認知障礙(MCI)具高敏感度，30分量表評估記憶、注意力、執行功能等認知領域。",
    keywords: [
      "SLUMS", "聖路易大學心智狀態測驗", "輕度認知障礙", "MCI篩檢", "認知功能評估",
      "失智症篩檢", "記憶力測試", "注意力評估", "執行功能檢測",
      "認知障礙篩檢", "免費認知測驗", "失智症早期篩檢", "認知功能檢查"
    ],
    openGraph: {
      title: "SLUMS 聖路易大學心智狀態測驗 - 輕度認知障礙專業篩檢工具",
      description: "免費的認知功能評估工具，對MCI具有高敏感度，適合早期認知障礙篩檢。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "SLUMS 聖路易大學心智狀態測驗",
      description: "評估認知功能和篩檢輕度認知障礙",
      category: "認知功能評估",
      duration: "10分鐘",
      difficulty: "中等"
    }
  },

  // CDR - Clinical Dementia Rating
  cdr: {
    title: "臨床失智症評估量表 CDR | 失智症分期 | 長照資源申請評估 - 文心樂丞診所",
    description: "CDR臨床失智症評估量表，失智症分期黃金標準工具。評估六大功能領域，台灣申請失智共照中心和外籍看護的重要依據，專業失智症嚴重度評估。",
    keywords: [
      "CDR", "臨床失智症評估量表", "失智症分期", "失智症評估", "長照資源申請",
      "失智共照中心", "外籍看護申請", "失智症嚴重度", "認知功能評估",
      "失智症診斷", "失智症照護", "CDR評分", "失智症量表"
    ],
    openGraph: {
      title: "CDR 臨床失智症評估量表 - 失智症分期與長照資源評估工具",
      description: "了解CDR評估的重要性，台灣申請失智照護資源的關鍵評估工具。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "CDR 臨床失智症評估量表",
      description: "評估失智症嚴重程度和功能分期",
      category: "認知功能評估",
      duration: "專業評估",
      difficulty: "專業"
    }
  },

  // FAST - Functional Assessment Staging Tool
  fast: {
    title: "功能性評估分級量表 FAST | 失智症功能分期 | 照護需求評估 - 文心樂丞診所",
    description: "FAST功能性評估分級量表，阿茲海默症功能退化評估工具。7個階段功能分期，幫助了解照護需求、預期病程變化，制定適當的照護計畫。",
    keywords: [
      "FAST", "功能性評估分級量表", "失智症分期", "阿茲海默症分期", "功能評估",
      "照護需求評估", "失智症照護", "功能退化評估", "失智症病程",
      "照護計畫", "安寧療護評估", "失智症功能", "日常生活功能評估"
    ],
    openGraph: {
      title: "FAST 功能性評估分級量表 - 失智症功能分期與照護需求評估",
      description: "了解失智症功能退化階段，評估照護需求，制定適當的照護計畫。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "FAST 功能性評估分級量表",
      description: "評估失智症功能退化階段",
      category: "認知功能評估",
      duration: "5-8分鐘",
      difficulty: "簡單"
    }
  },

  // PCL-5 - PTSD Checklist for DSM-5
  "pcl-5": {
    title: "創傷後壓力症候群檢核表 PCL-5 | PTSD評估 | 創傷症狀篩檢 - 文心樂丞診所",
    description: "PCL-5創傷後壓力症候群檢核表，DSM-5標準PTSD評估工具。20題全面評估創傷症狀，包含闖入、逃避、認知情緒、警覺反應四大症狀群集。",
    keywords: [
      "PCL-5", "創傷後壓力症候群", "PTSD評估", "創傷症狀篩檢", "創傷量表",
      "PTSD檢核表", "創傷後壓力評估", "DSM-5", "創傷心理評估",
      "PTSD自我評估", "創傷症狀量表", "心理創傷評估", "創傷篩檢工具"
    ],
    openGraph: {
      title: "PCL-5 創傷後壓力症候群檢核表 - DSM-5標準PTSD評估工具",
      description: "權威的PTSD自我評估工具，全面評估創傷後症狀，符合最新DSM-5診斷標準。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "PCL-5 創傷後壓力症候群檢核表",
      description: "評估PTSD症狀和創傷後壓力反應",
      category: "創傷心理評估",
      duration: "10-15分鐘",
      difficulty: "中等"
    }
  },

  // PC-PTSD-5 - Primary Care PTSD Screen for DSM-5
  "pc-ptsd-5": {
    title: "初級照護PTSD篩檢量表 PC-PTSD-5 | 快速創傷篩檢 | PTSD初篩 - 文心樂丞診所",
    description: "PC-PTSD-5初級照護PTSD篩檢量表，快速創傷後壓力症候群篩檢工具。兩階段評估：創傷史確認及5題症狀篩檢，適合初步評估使用。",
    keywords: [
      "PC-PTSD-5", "初級照護PTSD篩檢", "快速創傷篩檢", "PTSD初篩", "創傷篩檢",
      "PTSD快速評估", "創傷後壓力初篩", "基層醫療篩檢", "創傷症狀快篩",
      "PTSD篩檢工具", "創傷心理篩檢", "初步創傷評估", "簡易PTSD測試"
    ],
    openGraph: {
      title: "PC-PTSD-5 初級照護PTSD篩檢量表 - 快速創傷後壓力症候群篩檢",
      description: "簡潔有效的PTSD快速篩檢工具，適合初步評估創傷後壓力症狀。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "PC-PTSD-5 初級照護PTSD篩檢量表",
      description: "快速篩檢PTSD症狀的初級照護工具",
      category: "創傷心理評估",
      duration: "3-5分鐘",
      difficulty: "簡單"
    }
  },

  // MSI-BPD - McLean Screening Instrument for Borderline Personality Disorder
  "msi-bpd": {
    title: "邊緣性人格障礙篩檢量表 MSI-BPD | BPD測試 | 人格障礙評估 - 文心樂丞診所",
    description: "MSI-BPD麥克連邊緣性人格障礙篩查量表，專業BPD篩檢工具。10題快速評估邊緣性人格障礙風險，由哈佛醫學院專家開發的標準化篩檢量表。",
    keywords: [
      "MSI-BPD", "邊緣性人格障礙", "BPD篩檢", "人格障礙測試", "邊緣性人格測試",
      "人格障礙評估", "邊緣性人格篩檢", "BPD評估", "人格障礙診斷",
      "邊緣性人格障礙量表", "人格障礙篩檢", "麥克連量表", "BPD自我評估"
    ],
    openGraph: {
      title: "MSI-BPD 邊緣性人格障礙篩檢量表 - 專業BPD評估工具",
      description: "哈佛醫學院開發的邊緣性人格障礙篩檢工具，10題快速評估BPD風險。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "MSI-BPD 麥克連邊緣性人格障礙篩查量表",
      description: "篩檢邊緣性人格障礙的專業工具",
      category: "人格特質評估",
      duration: "3-5分鐘",
      difficulty: "簡單"
    }
  },

  // SCOFF - Eating Disorder Screening Questionnaire
  scoff: {
    title: "SCOFF 飲食障礙篩檢問卷 | 厭食症暴食症篩檢 | 飲食障礙測試 - 文心樂丞診所",
    description: "SCOFF飲食障礙篩檢問卷，簡易5題快速篩檢厭食症和暴食症風險。由英國聖喬治醫院開發，具100%敏感度的標準化飲食障礙篩檢工具。",
    keywords: [
      "SCOFF", "飲食障礙篩檢", "厭食症篩檢", "暴食症篩檢", "飲食障礙測試",
      "飲食障礙評估", "厭食症測試", "暴食症測試", "飲食行為評估",
      "飲食問題篩檢", "進食障礙篩檢", "飲食障礙量表", "免費飲食障礙測試"
    ],
    openGraph: {
      title: "SCOFF 飲食障礙篩檢問卷 - 專業厭食症暴食症篩檢工具",
      description: "英國開發的飲食障礙篩檢工具，5題快速評估厭食症和暴食症風險。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "SCOFF 飲食障礙篩檢問卷",
      description: "篩檢厭食症和暴食症的簡易工具",
      category: "飲食健康評估",
      duration: "2-3分鐘",
      difficulty: "簡單"
    }
  },

  // EDE-Q - Eating Disorder Examination Questionnaire 6.0
  "ede-q": {
    title: "飲食障礙檢查問卷 EDE-Q | 飲食障礙評估 | 追蹤工具 - 文心樂丞診所",
    description: "EDE-Q飲食障礙檢查問卷6.0版，28題全面評估飲食障礙相關思想、感受與行為。黃金標準評估工具，適合追蹤病情變化，由牛津大學開發。",
    keywords: [
      "EDE-Q", "飲食障礙檢查問卷", "飲食障礙評估", "飲食障礙追蹤", "EDE-Q 6.0",
      "飲食障礙量表", "體型擔憂評估", "體重擔憂評估", "飲食限制評估",
      "暴食評估", "飲食障礙黃金標準", "飲食行為評估", "免費飲食障礙評估"
    ],
    openGraph: {
      title: "EDE-Q 飲食障礙檢查問卷 - 飲食障礙評估黃金標準工具",
      description: "牛津大學開發的飲食障礙評估工具，28題全面評估，適合追蹤病情變化。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "EDE-Q 飲食障礙檢查問卷",
      description: "全面評估飲食障礙相關症狀的詳細工具",
      category: "飲食健康評估",
      duration: "15-20分鐘",
      difficulty: "詳細"
    }
  },

  // BES - Binge Eating Scale
  bes: {
    title: "暴食量表 BES | 暴食症評估 | 嗜食症篩檢 - 文心樂丞診所",
    description: "BES暴食量表，16題專門評估暴食行為相關症狀嚴重程度。評估暴食的行為、情緒與認知層面，適用於有暴食困擾的個體評估。",
    keywords: [
      "BES", "暴食量表", "暴食症評估", "嗜食症篩檢", "暴食行為評估",
      "暴食症測試", "暴食困擾評估", "暴食嚴重程度", "暴食症量表",
      "飲食失控評估", "暴食心理評估", "免費暴食測試", "暴食症篩檢工具"
    ],
    openGraph: {
      title: "BES 暴食量表 - 專業暴食症評估工具",
      description: "專門評估暴食相關症狀的量表，16題深入評估暴食行為、情緒與認知。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "BES 暴食量表",
      description: "評估暴食相關症狀嚴重程度的專業工具",
      category: "飲食健康評估",
      duration: "10-15分鐘",
      difficulty: "中等"
    }
  },

  // AUDIT - Alcohol Use Disorders Identification Test
  audit: {
    title: "AUDIT 酒精使用疾患識別測驗 | 酒精依賴篩檢 | 飲酒問題評估 - 文心樂丞診所",
    description: "WHO開發的AUDIT酒精使用疾患識別測驗，10題評估過去一年飲酒模式與相關問題。全球標準酒精篩檢工具，識別高風險飲酒、有害性飲酒及早期酒精依賴。",
    keywords: [
      "AUDIT", "酒精使用疾患", "酒精依賴篩檢", "飲酒問題評估", "酒精成癮測試",
      "WHO酒精篩檢", "酒精使用障礙", "飲酒風險評估", "酒精依賴量表",
      "酒精問題篩檢", "飲酒習慣評估", "免費酒精測試", "酒精使用評估工具"
    ],
    openGraph: {
      title: "AUDIT 酒精使用疾患識別測驗 - WHO標準酒精篩檢工具",
      description: "世界衛生組織開發的酒精使用評估工具，10題快速識別飲酒相關問題。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "AUDIT 酒精使用疾患識別測驗",
      description: "WHO開發的全球標準酒精使用評估工具",
      category: "成癮行為評估",
      duration: "5-8分鐘",
      difficulty: "中等"
    }
  },

  // FTND - Fagerström Test for Nicotine Dependence
  ftnd: {
    title: "FTND 尼古丁依賴量表 | 法格史壯量表 | 菸癮評估 | 戒菸評估 - 文心樂丞診所",
    description: "FTND法格史壯尼古丁依賴量表，6題評估尼古丁生理依賴程度。國際標準戒菸評估工具，預測戒斷症狀嚴重程度，指導尼古丁替代療法選擇。",
    keywords: [
      "FTND", "尼古丁依賴量表", "法格史壯量表", "菸癮評估", "戒菸評估",
      "尼古丁依賴測試", "吸菸依賴程度", "戒菸前評估", "菸癮程度測試",
      "尼古丁成癮評估", "戒菸準備評估", "免費菸癮測試", "戒菸難度評估"
    ],
    openGraph: {
      title: "FTND 尼古丁依賴量表 - 國際標準菸癮評估工具",
      description: "評估尼古丁生理依賴程度的專業工具，6題快速了解戒菸難度與所需支持。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "FTND 法格史壯尼古丁依賴量表",
      description: "評估尼古丁生理依賴程度的國際標準工具",
      category: "成癮行為評估",
      duration: "3-5分鐘",
      difficulty: "簡單"
    }
  },

  // SAS - Zung Self-Rating Anxiety Scale
  sas: {
    title: "Zung氏自我評估焦慮量表 SAS | 經典焦慮症篩檢 | 焦慮症狀評估 - 文心樂丞診所",
    description: "Zung氏自我評估焦慮量表(SAS)，經典20題焦慮症篩檢工具。評估情感與身體症狀，包含反向計分題目，提供焦慮程度的全面評估。",
    keywords: [
      "SAS焦慮量表", "Zung氏焦慮量表", "Zung Self-Rating Anxiety Scale", "焦慮症篩檢",
      "焦慮症評估", "焦慮症測試", "焦慮症狀評估", "經典焦慮量表",
      "心理健康評估", "精神健康篩檢", "免費焦慮測試", "焦慮程度評估"
    ],
    openGraph: {
      title: "Zung氏自我評估焦慮量表 - 經典焦慮症篩檢工具",
      description: "20題評估焦慮症狀的經典量表，涵蓋情感與身體症狀的全面評估。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "Zung氏自我評估焦慮量表 (SAS)",
      description: "評估焦慮症狀的經典量表，包含情感與身體症狀",
      category: "心理健康評估",
      duration: "8-10分鐘",
      difficulty: "中等"
    }
  },

  // PGSI - Problem Gambling Severity Index
  pgsi: {
    title: "PGSI 問題賭博嚴重程度指數 | 賭博成癮評估 | 病態賭博篩檢 - 文心樂丞診所",
    description: "PGSI問題賭博嚴重程度指數，9題評估過去12個月賭博行為與相關後果。專為一般群體設計的賭博問題篩檢工具，識別從低風險到問題賭博的完整光譜。",
    keywords: [
      "PGSI", "問題賭博", "賭博成癮評估", "病態賭博篩檢", "賭博依賴測試",
      "賭博問題評估", "賭博風險篩檢", "賭博障礙評估", "賭博行為評估",
      "賭博成癮測試", "賭博習慣評估", "免費賭博篩檢", "賭博問題量表"
    ],
    openGraph: {
      title: "PGSI 問題賭博嚴重程度指數 - 專業賭博成癮篩檢工具",
      description: "加拿大開發的賭博問題評估工具，9題評估賭博風險等級與相關後果。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "PGSI 問題賭博嚴重程度指數",
      description: "評估賭博問題嚴重程度的專業篩檢工具",
      category: "成癮行為評估",
      duration: "5-8分鐘",
      difficulty: "中等"
    }
  },

  // IGDS9-SF - Internet Gaming Disorder Scale Short Form
  "igds9-sf": {
    title: "IGDS9-SF 網路遊戲障礙量表 | 遊戲成癮評估 | 網路成癮篩檢 - 文心樂丞診所",
    description: "IGDS9-SF網路遊戲障礙量表簡式版，9題直接對應DSM-5診斷標準。雙重評分系統評估網路遊戲成癮風險，適合追蹤治療進展與跨文化比較。",
    keywords: [
      "IGDS9-SF", "網路遊戲障礙", "遊戲成癮評估", "網路成癮篩檢", "DSM-5遊戲障礙",
      "線上遊戲成癮", "手機遊戲成癮", "電玩成癮評估", "遊戲依賴測試",
      "網路遊戲依賴", "遊戲障礙篩檢", "免費遊戲成癮測試", "遊戲成癮量表"
    ],
    openGraph: {
      title: "IGDS9-SF 網路遊戲障礙量表 - DSM-5標準遊戲成癮評估",
      description: "對應DSM-5診斷標準的遊戲障礙評估工具，9題雙重評分系統。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "IGDS9-SF 網路遊戲障礙量表簡式版",
      description: "對應DSM-5標準的網路遊戲障礙評估工具",
      category: "成癮行為評估",
      duration: "8-10分鐘",
      difficulty: "中等"
    }
  },

  // SAST - Sexual Addiction Screening Test
  sast: {
    title: "SAST 性成癮篩查測驗 | 強迫性性行為評估 | 性成癮篩檢 - 文心樂丞診所",
    description: "SAST性成癮篩查測驗，20題評估強迫性性行為模式。專業篩檢工具識別可能需要協助的性行為模式，引發自我覺察與專業諮詢。",
    keywords: [
      "SAST", "性成癮篩查", "強迫性性行為", "性成癮評估", "性依賴測試",
      "性行為評估", "性成癮篩檢", "強迫性性行為障礙", "性衝動控制",
      "性成癮量表", "性行為問題篩檢", "性成癮自我評估", "性健康評估"
    ],
    openGraph: {
      title: "SAST 性成癮篩查測驗 - 強迫性性行為專業篩檢工具",
      description: "評估強迫性性行為模式的專業篩檢工具，幫助識別需要專業協助的行為模式。",
      type: "website",
      locale: "zh_TW"
    },
    structuredData: {
      name: "SAST 性成癮篩查測驗",
      description: "評估強迫性性行為模式的專業篩檢工具",
      category: "成癮行為評估",
      duration: "10-15分鐘",
      difficulty: "中等"
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