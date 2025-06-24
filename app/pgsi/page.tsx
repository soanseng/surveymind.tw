"use client";
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

// PGSI Questions based on the research paper
const questions = [
  {
    id: 1,
    english: "Have you bet more than you could really afford to lose?",
    chinese: "您是否曾下注的金額超過您實際能負擔的損失？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 2,
    english: "Have you needed to gamble with larger amounts of money to get the same feeling of excitement?",
    chinese: "您是否曾需要用更大量的金錢去賭博，才能得到和以前一樣的刺激感？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 3,
    english: "When you gambled, did you go back another day to try to win back the money you lost?",
    chinese: "當您賭輸錢後，您是否曾在另一天回去，試圖贏回輸掉的錢（追賭）？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 4,
    english: "Have you borrowed money or sold anything to get money to gamble?",
    chinese: "您是否曾借錢或變賣任何東西，以取得金錢去賭博？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 5,
    english: "Have you felt that you might have a problem with gambling?",
    chinese: "您是否曾覺得自己可能有賭博問題？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 6,
    english: "Has gambling caused you any health problems, including stress or anxiety?",
    chinese: "您的賭博行為是否曾對您造成任何健康問題，包括壓力或焦慮？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 7,
    english: "Have people criticized your betting or told you that you had a gambling problem, regardless of whether or not you thought it was true?",
    chinese: "是否曾有人批評您的賭博行為，或告訴您有賭博問題（無論您是否認為那是真的）？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 8,
    english: "Has your gambling caused any financial problems for you or your household?",
    chinese: "您的賭博行為是否曾為您或您的家庭帶來財務問題？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  },
  {
    id: 9,
    english: "Have you felt guilty about the way you gamble or what happens when you gamble?",
    chinese: "您是否曾對自己的賭博方式或賭博時發生的事情感到內疚？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "有時" },
      { value: 2, chinese: "大部分時間" },
      { value: 3, chinese: "幾乎總是" }
    ]
  }
];

const getRiskCategory = (score: number) => {
  if (score >= 8) return "問題賭博";
  if (score >= 3) return "中度風險";
  if (score >= 1) return "低風險";
  return "無問題賭博";
};

const getInterpretation = (score: number) => {
  if (score >= 8) {
    return "您的得分顯示已陷入問題賭博（8分或以上）。您的賭博行為模式已導致顯著的負面後果，並可能已對賭博行為失去控制。強烈建議立即尋求專業協助，包括諮詢精神科醫師、臨床心理師，或聯絡賭博成癮治療機構。問題賭博是可以治療的，專業的幫助能夠協助您重新掌控生活。";
  } else if (score >= 3) {
    return "您的得分顯示中度風險（3-7分）。您已出現一定程度的問題賭博行為，並開始導致一些負面的後果。這是一個重要的警訊，建議您認真評估自己的賭博習慣，考慮尋求專業諮詢，並主動採取措施來控制賭博行為，避免問題進一步惡化。";
  } else if (score >= 1) {
    return "您的得分顯示低風險（1-2分）。您展現出一些問題賭博的行為，但負面後果極少或尚未出現。建議您保持警覺，監控自己的賭博習慣，確保不會發展成更嚴重的問題。可以考慮設定賭博限額或尋求相關資訊以了解負責任賭博的原則。";
  } else {
    return "您的得分顯示無問題賭博（0分）。在過去一年中，您沒有展現出任何問題賭博的跡象。請繼續保持負責任的賭博行為，如果有參與賭博活動，記得設定合理的限額並將其視為娛樂而非賺錢方式。";
  }
};

const Page = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScore = () => {
    return Object.values(answers).reduce((total, value) => total + value, 0);
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
    
    const totalScore = calculateScore();
    setScore(totalScore);
    setValidationMessage('');
    setOpen(true);
  };

  const completedQuestions = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["pgsi"]} path="/pgsi" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">問題賭博嚴重程度指數 (PGSI)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一份包含9個問題的自填式量表，專門用於在一般群體中篩檢問題賭博行為。
            本量表評估<strong>過去12個月內</strong>的賭博相關經驗與後果。
          </p>
          <p className="mb-3">
            PGSI能有效地捕捉到從無問題、低風險到問題賭博的整個光譜，
            適用於那些可能尚未意識到自己問題嚴重性的個體，也可用於追蹤治療過程中的變化。
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
              <strong>指導語：</strong>以下問題關乎您在<strong>過去12個月內</strong>的經驗。請根據您的實際情況誠實回答。
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
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                  }`}>
                    {question.id}. {question.chinese}
                    {isUnanswered && validationMessage && (
                      <span className="ml-2 text-red-600 text-sm">*未作答</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 italic mb-3">
                    {question.english}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {question.options.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                        className="mr-2 h-4 w-4 text-blue-600"
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
          <ContentComponent className="sm:max-w-[500px]">
            <HeaderComponent>
              <TitleComponent>PGSI 評估結果</TitleComponent>
              <DescriptionComponent>
                您的問題賭博嚴重程度指數結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 27
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {score !== null && getRiskCategory(score)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {score !== null && getInterpretation(score)}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">PGSI評分標準：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>0分：</strong>無問題賭博</li>
                    <li>• <strong>1-2分：</strong>低風險賭博</li>
                    <li>• <strong>3-7分：</strong>中度風險賭博</li>
                    <li>• <strong>8-27分：</strong>問題賭博</li>
                  </ul>
                </div>

                {score !== null && score >= 3 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">建議下一步：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 尋求專業諮詢或治療</li>
                      <li>• 聯絡賭博成癮支援機構</li>
                      <li>• 設定嚴格的賭博限額</li>
                      <li>• 考慮自我排除機制</li>
                      <li>• 告知信任的親友尋求支持</li>
                    </ul>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">求助資源：</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 張老師專線：1980</li>
                    <li>• 生命線：1995</li>
                    <li>• 台灣展翅協會戒賭專線</li>
                    <li>• 各大醫院精神科門診</li>
                    <li>• 賭博匿名戒賭會</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="問題賭博嚴重程度指數 (PGSI)"
                    text={score !== null ? `我的得分是${score}分，評估為：${getRiskCategory(score)}` : ''}
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
                <strong>開發機構：</strong>加拿大問題賭博研究中心
              </p>
              <p>
                <strong>版權：</strong>可免費用於非商業性研究與臨床用途
              </p>
              <p>
                <strong>適用對象：</strong>一般成年群體
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Ferris, J., & Wynne, H. (2001). 
                <em>The Canadian Problem Gambling Index: Final Report</em>. 
                Canadian Centre on Substance Abuse.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * PGSI是專門為一般群體設計的問題賭博篩檢工具，能有效識別從低風險到問題賭博的完整光譜。
                此量表已在多國驗證，具有良好的心理計量特性。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;