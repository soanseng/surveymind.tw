"use client"
import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

const questions = [
  {
    id: 1,
    question: "定向感測試",
    items: [
      { question: "今天是星期幾？", points: 1 },
      { question: "今年是西元幾年？", points: 1 },
      { question: "我們現在在哪一個縣市？", points: 1 }
    ],
    maxPoints: 3,
    type: "orientation"
  },
  {
    id: 2,
    question: "短期記憶（登錄）",
    instruction: "請記住以下五個詞：蘋果、筆、領帶、房子、車子",
    items: [{ question: "是否能重複說出這五個詞？", points: 0 }],
    maxPoints: 0,
    type: "memory-registration"
  },
  {
    id: 3,
    question: "計算能力",
    instruction: "您有100元，買了一打3元的糖果（共12顆），還買了一個20元的杯子。",
    items: [
      { question: "您花了多少錢？（正確答案：32元）", points: 1 },
      { question: "還剩下多少錢？（正確答案：68元）", points: 2 }
    ],
    maxPoints: 3,
    type: "calculation"
  },
  {
    id: 4,
    question: "語言流暢度",
    instruction: "請在一分鐘內盡可能地說出不同的動物名稱",
    items: [
      { question: "0-4隻動物", points: 0 },
      { question: "5-9隻動物", points: 1 },
      { question: "10-14隻動物", points: 2 },
      { question: "15隻以上動物", points: 3 }
    ],
    maxPoints: 3,
    type: "fluency"
  },
  {
    id: 5,
    question: "短期記憶（回憶）",
    instruction: "請回憶剛剛請您記住的五樣東西",
    items: [
      { question: "蘋果", points: 1 },
      { question: "筆", points: 1 },
      { question: "領帶", points: 1 },
      { question: "房子", points: 1 },
      { question: "車子", points: 1 }
    ],
    maxPoints: 5,
    type: "memory-recall"
  },
  {
    id: 6,
    question: "數字倒背",
    items: [
      { question: "能否倒著念出「6、4、9」（答案：9、4、6）", points: 1 },
      { question: "能否倒著念出「8、5、3、7」（答案：7、3、5、8）", points: 1 }
    ],
    maxPoints: 2,
    type: "digit-span"
  },
  {
    id: 7,
    question: "畫鐘測驗",
    instruction: "在圓形內畫出時鐘的所有刻度，並將時間指在十點十一分",
    items: [
      { question: "刻度位置正確", points: 2 },
      { question: "指針時間正確（時針和分針位置都對）", points: 2 }
    ],
    maxPoints: 4,
    type: "clock"
  },
  {
    id: 8,
    question: "圖形辨識",
    instruction: "看著三角形、正方形、長方形的圖",
    items: [
      { question: "能在三角形裡打X", points: 1 },
      { question: "能指出哪個圖形最大", points: 1 }
    ],
    maxPoints: 2,
    type: "visuospatial"
  },
  {
    id: 9,
    question: "故事記憶",
    instruction: "聽完以下故事後回答問題：小玉是一個很成功的股票經紀人。她在股票市場賺了很多錢。後來她遇見了英俊的傑克。她嫁給他並生了三個孩子。他們住在芝加哥。後來她辭去工作在家帶小孩。當孩子們進入青少年期後，她又回去工作。她和傑克從此過著幸福快樂的日子。",
    items: [
      { question: "女生的名字叫什麼？（小玉）", points: 2 },
      { question: "她做什麼工作？（股票經紀人）", points: 2 },
      { question: "她什麼時候回去上班？（孩子們進入青少年期）", points: 2 },
      { question: "她住在哪一個城市？（芝加哥）", points: 2 }
    ],
    maxPoints: 8,
    type: "story"
  }
];

const getSeverity = (score: number, hasHighSchool: boolean) => {
  if (hasHighSchool) {
    if (score >= 27) return '正常';
    if (score >= 21) return '輕度認知障礙 (MCI)';
    return '失智症 (Dementia)';
  } else {
    if (score >= 25) return '正常';
    if (score >= 20) return '輕度認知障礙 (MCI)';
    return '失智症 (Dementia)';
  }
};

const getInterpretation = (score: number, hasHighSchool: boolean) => {
  const severity = getSeverity(score, hasHighSchool);
  
  if (severity === '正常') {
    return "您的認知功能測試結果在正常範圍內。建議繼續保持健康的生活方式，包括規律運動、充足睡眠、社交互動和智力活動。";
  }
  if (severity === '輕度認知障礙 (MCI)') {
    return "測試結果顯示可能存在輕度認知障礙。這並不代表一定會發展成失智症，但建議您尋求神經內科或精神科醫師的專業評估，並採取積極的預防措施。早期介入可能有助於延緩認知功能的退化。";
  }
  return "測試結果顯示可能存在失智症的跡象。強烈建議您盡快前往神經內科或精神科進行全面的專業評估。早期診斷和治療對於管理症狀和維持生活品質非常重要。";
};

const Page = () => {
  const [scores, setScores] = useState<{[key: string]: number}>({});
  const [hasHighSchool, setHasHighSchool] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const handleScoreChange = (questionId: number, itemIndex: number, points: number) => {
    const key = `${questionId}-${itemIndex}`;
    setScores(prev => ({
      ...prev,
      [key]: points
    }));
    setValidationMessage('');
  };

  const handleRadioSelect = (questionId: number, selectedIndex: number, items: any[]) => {
    // Clear all scores for this question first
    items.forEach((_, index) => {
      const key = `${questionId}-${index}`;
      setScores(prev => ({
        ...prev,
        [key]: 0
      }));
    });
    
    // Set the selected item's score
    const key = `${questionId}-${selectedIndex}`;
    setScores(prev => ({
      ...prev,
      [key]: items[selectedIndex].points
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  const isQuestionAnswered = (questionId: number, items: any[]) => {
    return items.some((_, index) => {
      const key = `${questionId}-${index}`;
      return scores[key] !== undefined;
    });
  };

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    questions.forEach((q) => {
      if (!isQuestionAnswered(q.id, q.items)) {
        unanswered.push(q.id);
      }
    });
    return unanswered;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasHighSchool === null) {
      setValidationMessage('請選擇您的教育程度');
      return;
    }
    
    const unansweredQuestions = getUnansweredQuestions();
    
    if (unansweredQuestions.length > 0) {
      setValidationMessage(`請完成第 ${unansweredQuestions.join('、')} 題後再提交。`);
      return;
    }
    
    const total = calculateTotalScore();
    setTotalScore(total);
    setFormSubmitted(true);
    setValidationMessage('');
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["slums"]} path="/slums" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">聖路易大學心智狀態測驗 (SLUMS)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            SLUMS是一個對輕度認知障礙（MCI）具有高敏感度的免費篩檢工具。
            本測驗包含多個認知領域的評估，總分為30分。
          </p>
          <p className="mb-3">
            <strong>注意：</strong>某些項目（如畫鐘測驗）需要實際操作，
            建議在可能的情況下由專業人員施測。此線上版本為自我評估參考。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。
            如結果顯示可能有認知障礙，請諮詢神經內科或精神科醫師。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <h3 className="text-lg font-medium mb-4">教育程度</h3>
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="education"
                  value="high"
                  onChange={() => setHasHighSchool(true)}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-sm">高中（含）以上學歷</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="education"
                  value="low"
                  onChange={() => setHasHighSchool(false)}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-sm">高中以下學歷</span>
              </label>
            </div>
          </div>

          {questions.map((q) => {
            const isUnanswered = !isQuestionAnswered(q.id, q.items) && validationMessage;
            const isRadioType = q.type === 'fluency';
            
            return (
              <div 
                key={q.id} 
                className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <h3 className={`text-lg font-medium mb-2 ${
                  isUnanswered ? 'text-red-800' : 'text-gray-900'
                }`}>
                  {q.id}. {q.question}
                  {isUnanswered && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                </h3>
                
                {q.instruction && (
                  <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded">
                    {q.instruction}
                  </p>
                )}
                
                <div className="space-y-3">
                  {isRadioType ? (
                    q.items.map((item, index) => (
                      <label key={index} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          onChange={() => handleRadioSelect(q.id, index, q.items)}
                          className="mr-3 h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{item.question}</span>
                      </label>
                    ))
                  ) : (
                    q.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm flex-1">{item.question}</span>
                        {item.points > 0 && (
                          <div className="flex items-center space-x-4 ml-4">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${q.id}-${index}`}
                                onChange={() => handleScoreChange(q.id, index, item.points)}
                                className="mr-2 h-4 w-4 text-green-600"
                              />
                              <span className="text-sm">正確 ({item.points}分)</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${q.id}-${index}`}
                                onChange={() => handleScoreChange(q.id, index, 0)}
                                className="mr-2 h-4 w-4 text-red-600"
                              />
                              <span className="text-sm">錯誤 (0分)</span>
                            </label>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {validationMessage && (
            <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <span className="text-red-600 mr-2 text-lg">⚠️</span>
                <span className="font-medium">{validationMessage}</span>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              提交評估
            </button>
          </div>
        </form>

        <Content open={open} onOpenChange={setOpen}>
          <ContentComponent className="sm:max-w-[500px]">
            <HeaderComponent>
              <TitleComponent>SLUMS 評估結果</TitleComponent>
              <DescriptionComponent>
                聖路易大學心智狀態測驗評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{totalScore} / 30
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {totalScore !== null && hasHighSchool !== null && getSeverity(totalScore, hasHighSchool)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {totalScore !== null && hasHighSchool !== null && getInterpretation(totalScore, hasHighSchool)}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">評分標準（依教育程度）：</h4>
                  <div className="text-sm text-yellow-700 space-y-2">
                    <div>
                      <strong>高中（含）以上學歷：</strong>
                      <ul className="ml-4 mt-1">
                        <li>• 27-30分：正常</li>
                        <li>• 21-26分：輕度認知障礙 (MCI)</li>
                        <li>• 1-20分：失智症</li>
                      </ul>
                    </div>
                    <div>
                      <strong>高中以下學歷：</strong>
                      <ul className="ml-4 mt-1">
                        <li>• 25-30分：正常</li>
                        <li>• 20-24分：輕度認知障礙 (MCI)</li>
                        <li>• 1-19分：失智症</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="聖路易大學心智狀態測驗 (SLUMS)"
                    text={`評估結果：總分${totalScore}分，${totalScore !== null && hasHighSchool !== null && getSeverity(totalScore, hasHighSchool)}`}
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
                <strong>開發單位：</strong>美國聖路易大學（Saint Louis University）
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Tariq, S. H., Tumosa, N., Chibnall, J. T., Perry III, M. H., & Morley, J. E. (2006). 
                Comparison of the Saint Louis University mental status examination and the mini-mental state examination for detecting dementia and mild neurocognitive disorder—a pilot study. 
                <em>The American Journal of Geriatric Psychiatry</em>, <em>14</em>(11), 900-910.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * SLUMS為完全免費的評估工具，對於偵測輕度認知障礙的敏感度優於傳統MMSE。
                資料來源：研究論文第11、20、21項引用。台灣已有翻譯版本（第22項引用）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;