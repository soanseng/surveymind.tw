"use client";
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

// IGDS9-SF Questions based on the research paper
const questions = [
  {
    id: 1,
    english: "Do you feel preoccupied with your gaming behavior? (Some examples: Do you think about previous gaming activity or anticipate the next gaming session? Do you think gaming has become the dominant activity in your daily life?)",
    chinese: "您是否時常專注於思考遊戲相關的事情？（例如：回想過去的遊戲活動、期待下次的遊戲，或覺得遊戲已成為您生活的主宰？）",
    dsm5Criterion: "專注性 (Preoccupation)"
  },
  {
    id: 2,
    english: "Do you feel more irritated, anxious or even sad when you try to either reduce or stop your gaming activity?",
    chinese: "當您嘗試減少或停止遊戲時，是否會感到煩躁、焦慮或悲傷？",
    dsm5Criterion: "戒斷症狀 (Withdrawal)"
  },
  {
    id: 3,
    english: "Do you feel the need to spend increasing amounts of time engaged in gaming in order to achieve satisfaction or pleasure?",
    chinese: "您是否覺得需要花費越來越多的時間在遊戲上，才能達到滿足感或樂趣？（耐受性）",
    dsm5Criterion: "耐受性 (Tolerance)"
  },
  {
    id: 4,
    english: "Do you systematically fail when trying to control or cease your gaming activity?",
    chinese: "您是否在嘗試控制或停止遊戲活動時，總是以失敗告終？",
    dsm5Criterion: "控制失敗 (Loss of Control)"
  },
  {
    id: 5,
    english: "Have you lost interest in previous hobbies and other entertainment activities as a result of your engagement with the game?",
    chinese: "您是否因為投入遊戲，而對以前的嗜好或其他娛樂活動失去興趣？",
    dsm5Criterion: "失去興趣 (Loss of Interest)"
  },
  {
    id: 6,
    english: "Have you continued your gaming activity despite knowing it was causing problems between you and other people?",
    chinese: "儘管知道遊戲已在您與他人之間造成問題，您是否仍繼續進行遊戲活動？",
    dsm5Criterion: "持續使用 (Continued Use)"
  },
  {
    id: 7,
    english: "Have you deceived any of your family members, therapists or others because of the amount of your gaming activity?",
    chinese: "您是否曾因遊戲時間的長短，而欺騙您的家人、治療師或其他人？",
    dsm5Criterion: "欺騙行為 (Deception)"
  },
  {
    id: 8,
    english: "Do you play in order to temporarily escape or relieve a negative mood (e.g., helplessness, guilt, anxiety)?",
    chinese: "您是否會為了暫時逃避或舒緩負面情緒（如：無助、內疚、焦慮）而玩遊戲？",
    dsm5Criterion: "逃避情緒 (Escape)"
  },
  {
    id: 9,
    english: "Have you jeopardized or lost an important relationship, job, or educational or career opportunity because of your gaming activity?",
    chinese: "您是否曾因遊戲活動，而危及或失去重要的關係、工作、教育或職業機會？",
    dsm5Criterion: "功能損害 (Functional Impairment)"
  }
];

const options = [
  { value: 1, chinese: "從不" },
  { value: 2, chinese: "很少" },
  { value: 3, chinese: "有時" },
  { value: 4, chinese: "經常" },
  { value: 5, chinese: "非常頻繁" }
];

const getSeverityLevel = (score: number) => {
  if (score >= 36) return "極高風險";
  if (score >= 27) return "高風險";
  if (score >= 18) return "中等風險";
  return "低風險";
};

const getCategoricalResult = (answers: Record<number, number>) => {
  const veryOftenCount = Object.values(answers).filter(value => value === 5).length;
  return {
    count: veryOftenCount,
    hasDisorder: veryOftenCount >= 5
  };
};

const getInterpretation = (dimensionalScore: number, categoricalResult: { count: number; hasDisorder: boolean }) => {
  if (categoricalResult.hasDisorder) {
    return `根據DSM-5建議的分類標準，您在9項診斷標準中有${categoricalResult.count}項達到「非常頻繁」的程度，這可能構成臨床上有意義的網路遊戲障礙。這是一個高風險警訊，強烈建議尋求專業評估。您的連續性分數為${dimensionalScore}分，也處於${getSeverityLevel(dimensionalScore)}水準。建議諮詢精神科醫師或臨床心理師進行全面評估。`;
  } else if (dimensionalScore >= 27) {
    return `您的連續性分數為${dimensionalScore}分，處於${getSeverityLevel(dimensionalScore)}水準，顯示您的網路遊戲使用模式可能已對生活造成一定程度的影響。雖然在分類標準上未達到障礙診斷門檻（9項中有${categoricalResult.count}項為「非常頻繁」），但仍建議您關注自己的遊戲習慣，考慮尋求專業諮詢。`;
  } else if (dimensionalScore >= 18) {
    return `您的連續性分數為${dimensionalScore}分，處於${getSeverityLevel(dimensionalScore)}水準。這表示您的遊戲行為可能存在一些值得關注的模式，但整體影響尚屬中等。建議您監控自己的遊戲時間，確保遊戲不會干擾到重要的生活功能。`;
  } else {
    return `您的連續性分數為${dimensionalScore}分，處於${getSeverityLevel(dimensionalScore)}水準。這表示您目前的遊戲行為模式相對健康，網路遊戲障礙的風險較低。繼續保持平衡的遊戲習慣，確保遊戲只是生活中的一部分而非全部。`;
  }
};

const Page = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<{ dimensional: number; categorical: { count: number; hasDisorder: boolean } } | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScores = () => {
    const dimensionalScore = Object.values(answers).reduce((total, value) => total + value, 0);
    const categoricalResult = getCategoricalResult(answers);
    return {
      dimensional: dimensionalScore,
      categorical: categoricalResult
    };
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setValidationMessage('');
  };

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    questions.forEach(q => {
      if (answers[q.id] === undefined) {
        unanswered.push(q.id);
      }
    });
    return unanswered;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const unansweredQuestions = getUnansweredQuestions();
    
    if (unansweredQuestions.length > 0) {
      setValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
      return;
    }
    
    const calculatedScores = calculateScores();
    setScores(calculatedScores);
    setValidationMessage('');
    setOpen(true);
  };

  const completedQuestions = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["igds9-sf"]} path="/igds9-sf" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">網路遊戲障礙量表-簡式 (IGDS9-SF)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一份包含9個問題的評估工具，直接對應DSM-5的網路遊戲障礙診斷標準。
            評估您在<strong>過去12個月內</strong>的遊戲活動與相關影響。
          </p>
          <p className="mb-3">
            我們所說的遊戲活動，是指在任何裝置（如電腦、遊戲機、手機、平板等）上進行的任何線上或離線遊戲。
            本量表提供兩種評分方式：連續性總分（適合追蹤變化）和分類標準（對應診斷）。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表為篩檢工具，不能取代專業診斷。如有疑慮請諮詢精神科醫師或臨床心理師。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">完成進度</span>
              <span className="text-sm text-gray-600">
                {completedQuestions} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(completedQuestions / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>指導語：</strong>以下問題關乎您在<strong>過去12個月內</strong>的遊戲活動。
              請根據您的實際情況選擇最符合的選項。
            </p>
          </div>

          {questions.map((question) => {
            const isUnanswered = answers[question.id] === undefined;
            return (
              <div 
                key={question.id} 
                className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered && validationMessage 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <h3 className={`text-lg font-semibold ${
                      isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                    }`}>
                      {question.id}. {question.chinese}
                      {isUnanswered && validationMessage && (
                        <span className="ml-2 text-red-600 text-sm">*未作答</span>
                      )}
                    </h3>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 mb-3 inline-block">
                    DSM-5標準：{question.dsm5Criterion}
                  </div>
                  <p className="text-sm text-gray-600 italic mb-3">
                    {question.english}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {options.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                        className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0"
                      />
                      <span className="text-sm">
                        {option.value}: {option.chinese}
                      </span>
                    </label>
                  ))}
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
          <ContentComponent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
            <HeaderComponent>
              <TitleComponent>IGDS9-SF 評估結果</TitleComponent>
              <DescriptionComponent>
                您的網路遊戲障礙量表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    連續性分數：{scores?.dimensional} / 45
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {scores && getSeverityLevel(scores.dimensional)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">雙重評分結果：</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-blue-800">連續性評分</div>
                      <div>{scores?.dimensional}/45分</div>
                      <div className="text-xs text-gray-600">適合追蹤變化</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-purple-800">分類標準</div>
                      <div>{scores?.categorical.count}/9項達標</div>
                      <div className="text-xs text-gray-600">對應DSM-5診斷</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {scores && getInterpretation(scores.dimensional, scores.categorical)}
                  </p>
                </div>

                <AnswerDetailList
                  items={questions.map<AnswerDetailItem>((q) => {
                    const v = answers[q.id];
                    const opt = v !== undefined ? options.find(o => o.value === v) : undefined;
                    return {
                      question: q.chinese,
                      answerLabel: opt ? opt.chinese : '未作答',
                      score: v ?? 0,
                      note: `DSM-5：${q.dsm5Criterion}`,
                    };
                  })}
                  totalLabel={`總分 ${scores?.dimensional ?? 0} / 45`}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">評分標準說明：</h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    <div><strong>連續性評分：</strong></div>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>9-18分：低風險</li>
                      <li>19-27分：中等風險</li>
                      <li>28-36分：高風險</li>
                      <li>37-45分：極高風險</li>
                    </ul>
                    <div className="mt-2"><strong>分類標準：</strong></div>
                    <ul className="list-disc list-inside ml-2">
                      <li>5項或以上「非常頻繁」= 可能構成障礙</li>
                    </ul>
                  </div>
                </div>

                {scores && (scores.categorical.hasDisorder || scores.dimensional >= 27) && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">建議下一步：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 尋求專業心理評估</li>
                      <li>• 考慮認知行為治療</li>
                      <li>• 設定遊戲時間限制</li>
                      <li>• 培養其他興趣活動</li>
                      <li>• 尋求家人朋友支持</li>
                    </ul>
                  </div>
                )}

                <div className="pt-4">
                  <ShareButton 
                    title="網路遊戲障礙量表-簡式 (IGDS9-SF)"
                    text={scores ? `我的連續性分數是${scores.dimensional}分，評估為：${getSeverityLevel(scores.dimensional)}` : ''}
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
                <strong>開發者：</strong>Halley M. Pontes & Mark D. Griffiths
              </p>
              <p>
                <strong>版權：</strong>可免費用於學術研究與臨床用途
              </p>
              <p>
                <strong>對應標準：</strong>DSM-5網路遊戲障礙診斷標準
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Pontes, H. M., & Griffiths, M. D. (2015). 
                Measuring DSM-5 internet gaming disorder: Development and validation of a short psychometric scale. 
                <em>Computers in Human Behavior</em>, 45, 137-143.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * IGDS9-SF是第一個直接對應DSM-5網路遊戲障礙診斷標準的簡式量表，
                已在世界多國驗證，具有優良的心理計量特性。適合追蹤治療進展與進行跨文化比較。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;