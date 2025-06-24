import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Heart, 
  Brain, 
  Moon, 
  Focus, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Award,
  Utensils
} from "lucide-react";
import { Metadata } from 'next';
import { landingPageSEO, baseSEO, organizationStructuredData } from '@/lib/seo-config';

export const metadata: Metadata = {
  metadataBase: new URL(baseSEO.siteUrl),
  title: landingPageSEO.title,
  description: landingPageSEO.description,
  keywords: landingPageSEO.keywords.join(', '),
  authors: [{ name: '陳璿丞醫師', url: 'https://anxiety.com.tw' }],
  creator: '文心樂丞診所',
  publisher: '文心樂丞診所',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: landingPageSEO.openGraph.title,
    description: landingPageSEO.openGraph.description,
    url: baseSEO.siteUrl,
    siteName: baseSEO.siteName,
    locale: landingPageSEO.openGraph.locale,
    type: 'website',
    images: [
      {
        url: `${baseSEO.siteUrl}${baseSEO.defaultImage}`,
        width: 1200,
        height: 630,
        alt: landingPageSEO.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: landingPageSEO.openGraph.title,
    description: landingPageSEO.openGraph.description,
    images: [`${baseSEO.siteUrl}${baseSEO.defaultImage}`],
    creator: '@anxiety_tw',
  },
  alternates: {
    canonical: baseSEO.siteUrl,
    languages: {
      'zh-TW': baseSEO.siteUrl,
    },
  },
  category: 'Medical',
  classification: 'Mental Health',
};

const questionnaires = {
  emotion: [
    { name: "廣泛性焦慮量表", link: "/gad", time: "3-5分鐘", difficulty: "簡單" },
    { name: "PHQ-9 憂鬱症篩檢問卷", link: "/phq-9", time: "5-8分鐘", difficulty: "簡單" },
    { name: "台灣人憂鬱症量表", link: "/tdq", time: "8-10分鐘", difficulty: "中等" },
    { name: "輕躁症自我評估量表 (Hypomania)", link: "/hcl-32", time: "10-15分鐘", difficulty: "中等" },
    { name: "OCI-R 強迫症狀量表修訂版", link: "/oci-r", time: "5-8分鐘", difficulty: "簡單" },
  ],
  sleep: [
    { name: "PSQI 匹茲堡睡眠品質量表", link: "/psqi", time: "8-10分鐘", difficulty: "中等" },
    { name: "ISI 失眠嚴重度量表", link: "/isi", time: "3-5分鐘", difficulty: "簡單" },
  ],
  attention: [
    { name: "ASRS 成人ADHD自我評估問卷", link: "/asrs", time: "5-8分鐘", difficulty: "簡單" },
    { name: "過動兒家長量表", link: "/snap-4", time: "10-12分鐘", difficulty: "中等" },
  ],
  cognitive: [
    { name: "早期失智篩檢表", link: "/ad-8", time: "3-5分鐘", difficulty: "簡單" },
    { name: "簡易認知功能評估表", link: "/spmsq", time: "5分鐘", difficulty: "簡單" },
    { name: "聖路易大學心智狀態測驗", link: "/slums", time: "10分鐘", difficulty: "中等" },
    { name: "臨床失智症評估量表說明", link: "/cdr", time: "閱讀", difficulty: "專業" },
    { name: "功能性評估分級量表", link: "/fast", time: "5-8分鐘", difficulty: "簡單" },
  ],
  personality: [
    { name: "大五人格量表", link: "/big-5", time: "15-20分鐘", difficulty: "詳細" },
    { name: "麥克連邊緣性人格障礙篩查量表", link: "/msi-bpd", time: "3-5分鐘", difficulty: "簡單" },
  ],
  trauma: [
    { name: "創傷後壓力症候群檢核表", link: "/pcl-5", time: "10-15分鐘", difficulty: "中等" },
    { name: "初級照護PTSD篩檢量表", link: "/pc-ptsd-5", time: "3-5分鐘", difficulty: "簡單" },
  ],
  eating: [
    { name: "SCOFF 飲食障礙篩檢問卷", link: "/scoff", time: "2-3分鐘", difficulty: "簡單" },
    { name: "飲食障礙檢查問卷", link: "/ede-q", time: "15-20分鐘", difficulty: "詳細" },
    { name: "暴食量表", link: "/bes", time: "10-15分鐘", difficulty: "中等" },
  ],
};

const categories = [
  {
    id: "emotion",
    name: "情緒健康",
    icon: Heart,
    description: "評估情緒狀態，識別焦慮與憂鬱",
    color: "bg-red-100 text-red-600",
    questionnaires: questionnaires.emotion,
  },
  {
    id: "sleep",
    name: "睡眠品質",
    icon: Moon,
    description: "分析睡眠模式，改善休息品質",
    color: "bg-blue-100 text-blue-600",
    questionnaires: questionnaires.sleep,
  },
  {
    id: "attention",
    name: "注意力",
    icon: Focus,
    description: "檢測專注力與過動症狀",
    color: "bg-green-100 text-green-600",
    questionnaires: questionnaires.attention,
  },
  {
    id: "cognitive",
    name: "認知功能",
    icon: Brain,
    description: "評估記憶力與認知能力",
    color: "bg-purple-100 text-purple-600",
    questionnaires: questionnaires.cognitive,
  },
  {
    id: "personality",
    name: "人格特質",
    icon: Users,
    description: "了解個人性格與行為模式",
    color: "bg-orange-100 text-orange-600",
    questionnaires: questionnaires.personality,
  },
  {
    id: "trauma",
    name: "創傷評估",
    icon: Shield,
    description: "評估創傷後壓力相關症狀",
    color: "bg-indigo-100 text-indigo-600",
    questionnaires: questionnaires.trauma,
  },
  {
    id: "eating",
    name: "飲食評估",
    icon: Utensils,
    description: "篩檢飲食障礙與飲食行為問題",
    color: "bg-pink-100 text-pink-600",
    questionnaires: questionnaires.eating,
  },
];

const features = [
  {
    icon: Shield,
    title: "醫學實證",
    description: "採用國際認證的標準化量表",
  },
  {
    icon: Clock,
    title: "快速便利",
    description: "3-20分鐘即可完成評估",
  },
  {
    icon: Award,
    title: "專業解讀",
    description: "提供詳細的結果分析與建議",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-warm-cream via-background to-warm-peach/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 warm-gradient opacity-50" />
        <div className="container relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="animate-fade-in space-y-4">
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
                開始你的
                <span className="warm-text-primary"> 心理健康 </span>
                評估之旅
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-2xl">
                由
                <Link
                  href="https://anxiety.com.tw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="warm-text-secondary font-semibold hover:underline"
                >
                  文心樂丞診所
                </Link>
                陳璿丞醫師提供的專業心理健康自我評估平台，幫助您更好地了解自己的心理狀態
              </p>
            </div>
            
            <div className="animate-slide-up flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button 
                size="lg" 
                className="warm-bg-primary hover:warm-bg-secondary text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="#categories">
                  開始評估 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-warm-orange text-warm-orange hover:warm-bg-primary hover:text-white px-8 py-6 text-lg font-semibold"
                asChild
              >
                <Link href="#about">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg hover-lift"
                >
                  <div className="rounded-full warm-bg-accent p-4">
                    <Icon className="h-8 w-8 warm-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 px-4 bg-gradient-to-b from-background to-warm-cream/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">心理健康評估分類</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              選擇適合的評估類別，開始您的心理健康自我了解之旅
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="hover-lift group cursor-pointer border-2 hover:border-warm-orange/50">
                  <CardHeader className="text-center">
                    <div className={`mx-auto rounded-full p-4 w-16 h-16 flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.questionnaires.map((q, idx) => (
                        <Link
                          key={idx}
                          href={q.link}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm group-hover:warm-text-primary transition-colors">
                              {q.name}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {q.time}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-warm-peach/50 text-warm-brown">
                                {q.difficulty}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:warm-text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold md:text-4xl">關於我們</h2>
            
            <Card className="text-left p-8 glass-effect">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full warm-bg-primary p-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">專業醫師團隊</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      我是陳璿丞醫師，希望透過這個簡單的網站，讓更多人能夠快速地進行心理健康自我評估。
                      每個量表都經過嚴格的醫學驗證，確保評估結果的準確性與可靠性。
                    </p>
                  </div>
                </div>
                
                <div className="border-l-4 border-warm-orange pl-6 space-y-3">
                  <h4 className="font-semibold text-warm-brown">重要提醒</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-warm-orange mt-0.5 flex-shrink-0" />
                      <span>這些評估工具僅供參考，不能取代專業的醫學診斷</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-warm-orange mt-0.5 flex-shrink-0" />
                      <span>如發現任何令人擔憂的結果，建議尋求專業醫療協助</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-warm-orange mt-0.5 flex-shrink-0" />
                      <span>定期進行心理健康評估，有助於維護整體身心健康</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="pt-8">
              <Button 
                size="lg" 
                className="warm-bg-primary hover:warm-bg-secondary text-white px-8 py-6 text-lg font-semibold"
                asChild
              >
                <Link href="#categories">
                  立即開始評估 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": baseSEO.siteName,
            "url": baseSEO.siteUrl,
            "description": landingPageSEO.description,
            "inLanguage": "zh-TW",
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${baseSEO.siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            },
            "publisher": organizationStructuredData
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "心理健康評估量表",
            "description": "專業心理健康自我評估工具列表",
            "numberOfItems": Object.values(questionnaires).flat().length,
            "itemListElement": Object.values(questionnaires).flat().map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "url": `${baseSEO.siteUrl}${item.link}`,
              "description": `${item.name} - 評估時間: ${item.time}, 難度: ${item.difficulty}`
            }))
          })
        }}
      />
    </main>
  );
}