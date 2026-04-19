"use client"
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

const stages = [
  {
    stage: 1,
    severity: "正常成人",
    description: "沒有客觀或主觀的功能困難",
    details: [
      "認知功能完全正常",
      "工作和社交能力未受影響", 
      "日常生活完全獨立"
    ]
  },
  {
    stage: 2,
    severity: "正常老化",
    description: "主觀感覺找詞困難或忘記物品位置",
    details: [
      "偶爾忘記名字或約會",
      "通常稍後會想起來",
      "不影響工作或社交功能"
    ]
  },
  {
    stage: 3,
    severity: "輕度認知障礙",
    description: "在要求高的工作或社交場合中出現功能困難",
    details: [
      "同事注意到工作表現下降",
      "在不熟悉的地方容易迷路",
      "閱讀後記憶內容有困難",
      "記不住剛認識的人的名字"
    ]
  },
  {
    stage: 4,
    severity: "輕度失智症",
    description: "處理複雜的工具性日常生活活動（IADL）有困難",
    details: [
      "處理個人財務有困難（如平衡收支、繳費）",
      "準備複雜餐點有困難",
      "購物時選擇物品有困難",
      "可能否認有問題存在"
    ]
  },
  {
    stage: 5,
    severity: "中度失智症",
    description: "需要協助選擇合適的衣物",
    details: [
      "無法在沒有協助下獨立生活",
      "無法記住重要資訊（如地址、電話）",
      "經常不知道時間或地點",
      "選擇適合天氣或場合的衣物有困難"
    ]
  },
  {
    stage: 6,
    severity: "中重度失智症",
    description: "基本日常生活活動需要協助",
    subStages: [
      { id: "6a", description: "穿衣困難（如扣釦子、分辨衣物正反面）" },
      { id: "6b", description: "沐浴困難（如調節水溫、清洗身體）" },
      { id: "6c", description: "如廁困難（如忘記沖水、擦拭不當）" },
      { id: "6d", description: "尿失禁" },
      { id: "6e", description: "大便失禁" }
    ]
  },
  {
    stage: 7,
    severity: "重度失智症", 
    description: "語言和基本能力嚴重喪失",
    subStages: [
      { id: "7a", description: "語言能力限制在約5-6個詞" },
      { id: "7b", description: "語言能力僅剩1個清晰的詞" },
      { id: "7c", description: "無法獨立行走" },
      { id: "7d", description: "無法獨立坐起" },
      { id: "7e", description: "無法微笑" },
      { id: "7f", description: "無法抬起頭部" }
    ]
  }
];

const getInterpretation = (stage: number) => {
  if (stage <= 2) {
    return "目前功能狀態在正常範圍內。建議保持健康的生活方式，包括規律運動、充足睡眠、社交互動和認知刺激活動。如有疑慮，可考慮進行更詳細的認知評估。";
  }
  if (stage === 3) {
    return "顯示有輕度認知障礙的跡象。建議尋求神經內科或精神科醫師的專業評估，並採取積極的預防措施。早期介入可能有助於延緩認知功能的退化。";
  }
  if (stage === 4) {
    return "符合輕度失智症的功能表現。強烈建議盡快就醫進行全面評估和診斷。此階段仍保有相當的生活功能，適當的治療和支持可以維持生活品質。";
  }
  if (stage === 5) {
    return "已進展至中度失智症階段。需要持續的照顧和監督。建議聯繫失智共照中心，申請相關長照資源，並為照顧者提供支持和喘息服務。";
  }
  if (stage === 6) {
    return "處於中重度失智症階段。日常生活需要大量協助。建議評估是否需要全天候照護，考慮申請外籍看護或機構照護。注意預防跌倒和其他安全問題。";
  }
  return "已達重度失智症階段。需要全天候的專業照護。此階段可能需要考慮安寧療護的選項。重點在於維持舒適和尊嚴，預防併發症。";
};

const Page = () => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedSubStage, setSelectedSubStage] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const handleStageSelect = (stage: number) => {
    setSelectedStage(stage);
    setSelectedSubStage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStage === null) return;
    
    setFormSubmitted(true);
    setOpen(true);
  };

  const getSelectedStageDetails = () => {
    if (selectedStage === null) return null;
    return stages.find(s => s.stage === selectedStage);
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["fast"]} path="/fast" />
      
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">功能性評估分級量表 (FAST)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            FAST量表評估阿茲海默症個案的功能退化程度，從正常到重度失智共分為7個階段。
            請選擇最符合個案目前功能狀態的階段。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表主要用於已診斷失智症的個案追蹤，
            不能用於初步診斷。如需診斷請諮詢專業醫師。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">請選擇最符合的功能階段：</h3>
          
          {stages.map((stage) => (
            <div key={stage.stage} className="bg-white rounded-lg shadow-sm">
              <label 
                className={`block p-6 cursor-pointer border-2 rounded-lg transition-all ${
                  selectedStage === stage.stage 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="stage"
                    value={stage.stage}
                    checked={selectedStage === stage.stage}
                    onChange={() => handleStageSelect(stage.stage)}
                    className="mt-1 mr-4 h-4 w-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mr-3 ${
                        stage.stage <= 2 ? 'bg-green-100 text-green-800' :
                        stage.stage === 3 ? 'bg-yellow-100 text-yellow-800' :
                        stage.stage === 4 ? 'bg-orange-100 text-orange-800' :
                        stage.stage === 5 ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        第 {stage.stage} 期
                      </span>
                      <span className="text-lg font-semibold">{stage.severity}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{stage.description}</p>
                    
                    {stage.details && (
                      <ul className="space-y-1 text-sm text-gray-600">
                        {stage.details.map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {stage.subStages && selectedStage === stage.stage && (
                      <div className="mt-4 ml-6 space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          請選擇最早出現的症狀（用於更精確分期）：
                        </p>
                        {stage.subStages.map((subStage) => (
                          <label key={subStage.id} className="flex items-start cursor-pointer">
                            <input
                              type="radio"
                              name="subStage"
                              value={subStage.id}
                              checked={selectedSubStage === subStage.id}
                              onChange={() => setSelectedSubStage(subStage.id)}
                              className="mt-1 mr-3 h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">
                              <span className="font-medium">{subStage.id}.</span> {subStage.description}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>
          ))}

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={selectedStage === null}
              className={`font-medium py-3 px-8 rounded-lg transition-colors ${
                selectedStage === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              查看評估結果
            </button>
          </div>
        </form>

        <Content open={open} onOpenChange={setOpen}>
          <ContentComponent className="sm:max-w-[500px]">
            <HeaderComponent>
              <TitleComponent>FAST 評估結果</TitleComponent>
              <DescriptionComponent>
                功能性評估分級量表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    第 {selectedStage} 期
                    {selectedSubStage && ` (${selectedSubStage})`}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSelectedStageDetails()?.severity}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">功能狀態：</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {getSelectedStageDetails()?.description}
                  </p>
                  {getSelectedStageDetails()?.details && (
                    <ul className="space-y-1 text-sm text-gray-600">
                      {getSelectedStageDetails()?.details?.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">建議與指引：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedStage !== null && getInterpretation(selectedStage)}
                  </p>
                </div>

                {selectedStage && selectedStage >= 6 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">照護重點：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 確保環境安全，預防跌倒和走失</li>
                      <li>• 維持規律作息和營養攝取</li>
                      <li>• 提供適當的感官刺激和情感支持</li>
                      <li>• 照顧者需要充分的支持和喘息服務</li>
                      {selectedStage === 7 && <li>• 考慮安寧療護選項，注重舒適和尊嚴</li>}
                    </ul>
                  </div>
                )}

                <div className="pt-4">
                  <ShareButton 
                    title="功能性評估分級量表 (FAST)"
                    text={`評估結果：第${selectedStage}期${selectedSubStage ? `(${selectedSubStage})` : ''} - ${getSelectedStageDetails()?.severity}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <CloseComponent className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded">
                關閉
              </CloseComponent>
            </FooterComponent>
          </ContentComponent>
        </Content>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與引用</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>開發者：</strong>Barry Reisberg, M.D.
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Reisberg, B. (1988). Functional assessment staging (FAST). 
                <em>Psychopharmacology Bulletin</em>, <em>24</em>(4), 653-659.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * FAST量表特別適用於追蹤阿茲海默症的功能退化進程，其後期階段（第7期）
                常用於評估安寧療護的適用性。資料來源：研究論文第6、31、32項引用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;