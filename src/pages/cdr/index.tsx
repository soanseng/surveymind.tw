"use client"
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import ShareButton from '@/components/ShareButton';

const domains = [
  {
    name: "記憶力",
    stages: [
      { score: "0", label: "正常", description: "無記憶減退" },
      { score: "0.5", label: "疑似/極輕度", description: "經常性輕度遺忘，「良性」健忘" },
      { score: "1", label: "輕度", description: "中度記憶減退，影響日常生活" },
      { score: "2", label: "中度", description: "嚴重記憶減退，新事物很快忘記" },
      { score: "3", label: "重度", description: "僅存片段記憶" }
    ]
  },
  {
    name: "定向感",
    stages: [
      { score: "0", label: "正常", description: "完全能定向" },
      { score: "0.5", label: "疑似/極輕度", description: "時間關聯性稍有困難" },
      { score: "1", label: "輕度", description: "時間關聯性有中度困難，可能地理定向障礙" },
      { score: "2", label: "中度", description: "時間及地點皆有定向障礙" },
      { score: "3", label: "重度", description: "僅對人物有定向力" }
    ]
  },
  {
    name: "判斷力與問題解決",
    stages: [
      { score: "0", label: "正常", description: "判斷力良好" },
      { score: "0.5", label: "疑似/極輕度", description: "分析相似性與差異性稍有困難" },
      { score: "1", label: "輕度", description: "分析相似性與差異性有中度困難" },
      { score: "2", label: "中度", description: "嚴重障礙，社會價值判斷受影響" },
      { score: "3", label: "重度", description: "無法做判斷或解決問題" }
    ]
  },
  {
    name: "社區事務",
    stages: [
      { score: "0", label: "正常", description: "獨立處理事務" },
      { score: "0.5", label: "疑似/極輕度", description: "這些活動稍有障礙" },
      { score: "1", label: "輕度", description: "無法單獨參與，但外觀尚似正常" },
      { score: "2", label: "中度", description: "無法獨立處理事務，外觀似正常" },
      { score: "3", label: "重度", description: "外觀明顯可知病情，無法在外活動" }
    ]
  },
  {
    name: "家居與嗜好",
    stages: [
      { score: "0", label: "正常", description: "維持良好" },
      { score: "0.5", label: "疑似/極輕度", description: "稍有障礙" },
      { score: "1", label: "輕度", description: "輕度障礙，放棄較複雜的嗜好" },
      { score: "2", label: "中度", description: "僅能做簡單家事，興趣極少" },
      { score: "3", label: "重度", description: "無法做家事" }
    ]
  },
  {
    name: "個人照料",
    stages: [
      { score: "0", label: "正常", description: "完全自我照料" },
      { score: "0.5", label: "疑似/極輕度", description: "完全自我照料" },
      { score: "1", label: "輕度", description: "需旁人督促或提醒" },
      { score: "2", label: "中度", description: "穿衣、衛生等需幫忙" },
      { score: "3", label: "重度", description: "需仰賴他人照料，常大小便失禁" }
    ]
  }
];

const Page = () => {
  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["cdr"]} path="/cdr" />
      
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">臨床失智症評估量表 (CDR)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">關於CDR量表</h2>
          <p className="mb-3">
            臨床失智症評估量表（CDR）是全球廣泛使用的失智症嚴重程度評估工具，
            也是台灣申請長照資源的重要依據。
          </p>
          <div className="bg-white p-4 rounded mt-4">
            <h3 className="font-semibold mb-2">CDR在台灣的重要性：</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">▶</span>
                <span><strong>CDR ≥ 0.5分：</strong>可申請失智共照中心服務</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">▶</span>
                <span><strong>CDR ≥ 1分：</strong>可申請外籍家庭看護工</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            <strong>重要提醒：</strong>CDR需由受過訓練的專業人員進行評估，
            包括同時訪談個案本人及熟悉其狀況的家屬或照顧者。
            以下資訊僅供了解評估內容，不能用於自我診斷。
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">CDR六大功能領域評估</h2>
          <p className="text-gray-600 mb-6">
            CDR評估涵蓋以下六個功能領域，每個領域根據嚴重程度分為0-3分：
          </p>
          
          <div className="space-y-8">
            {domains.map((domain, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold">{domain.name}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {domain.stages.map((stage, stageIndex) => (
                      <div key={stageIndex} className="text-center">
                        <div className={`mb-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          stage.score === "0" ? "bg-green-100 text-green-800" :
                          stage.score === "0.5" ? "bg-yellow-100 text-yellow-800" :
                          stage.score === "1" ? "bg-orange-100 text-orange-800" :
                          stage.score === "2" ? "bg-red-100 text-red-800" :
                          "bg-purple-100 text-purple-800"
                        }`}>
                          CDR {stage.score}
                        </div>
                        <div className="font-medium text-sm mb-1">{stage.label}</div>
                        <div className="text-xs text-gray-600">{stage.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">如何進行CDR評估？</h3>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">1</span>
              <div>
                <strong>預約專業評估：</strong>
                前往神經內科、精神科或記憶門診，由專業醫師安排評估
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">2</span>
              <div>
                <strong>準備評估資料：</strong>
                記錄個案的日常生活表現、功能變化等具體事例
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">3</span>
              <div>
                <strong>參與評估過程：</strong>
                評估需要個案本人及一位熟悉其狀況的家屬共同參與
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">4</span>
              <div>
                <strong>取得評估結果：</strong>
                醫師會綜合各領域表現給出整體CDR分數
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">CDR整體分期說明</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold mr-3">CDR 0</span>
              <div>
                <strong>正常：</strong>無認知功能障礙
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-semibold mr-3">CDR 0.5</span>
              <div>
                <strong>疑似/極輕度失智：</strong>輕微認知功能障礙，可申請失智共照中心服務
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold mr-3">CDR 1</span>
              <div>
                <strong>輕度失智：</strong>明顯認知功能障礙，影響日常生活，可申請外籍看護
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold mr-3">CDR 2</span>
              <div>
                <strong>中度失智：</strong>嚴重認知功能障礙，需要他人協助日常生活
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold mr-3">CDR 3</span>
              <div>
                <strong>重度失智：</strong>完全依賴他人照顧
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <ShareButton 
            title="臨床失智症評估量表 (CDR) 說明"
            text="了解CDR評估的六大功能領域及在台灣申請長照資源的重要性"
            url={typeof window !== 'undefined' ? window.location.href : ''}
          />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與引用</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>開發單位：</strong>美國華盛頓大學（Washington University）
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Morris, J. C. (1993). The Clinical Dementia Rating (CDR): Current version and scoring rules. 
                <em>Neurology</em>, <em>43</em>(11), 2412-2414.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * CDR是全球失智症評估的黃金標準，在台灣具有重要的行政功能。
                資料來源：研究論文第25-30項引用，台灣衛生福利部失智照護服務計畫。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;