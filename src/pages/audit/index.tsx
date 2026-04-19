"use client";
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

// AUDIT Questions based on WHO official Traditional Chinese version
const questions = [
  {
    id: 1,
    english: "How often do you have a drink containing alcohol?",
    chinese: "你多久喝一次酒？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "每月一次或更少" },
      { value: 2, chinese: "每月二至四次" },
      { value: 3, chinese: "每週二至三次" },
      { value: 4, chinese: "每週四次或以上" }
    ]
  },
  {
    id: 2,
    english: "How many drinks containing alcohol do you have on a typical day when you are drinking?",
    chinese: "在有喝酒的日子，你通常喝多少個標準單位的酒？",
    options: [
      { value: 0, chinese: "1-2個單位" },
      { value: 1, chinese: "3-4個單位" },
      { value: 2, chinese: "5-6個單位" },
      { value: 3, chinese: "7-9個單位" },
      { value: 4, chinese: "10個或以上單位" }
    ]
  },
  {
    id: 3,
    english: "How often do you have five or more drinks on one occasion?",
    chinese: "你多久會一次喝下五個或以上單位的酒？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "少於每月一次" },
      { value: 2, chinese: "每月一次" },
      { value: 3, chinese: "每週一次" },
      { value: 4, chinese: "每日或幾乎每日" }
    ]
  },
  {
    id: 4,
    english: "How often during the last year have you found that you were not able to stop drinking once you had started?",
    chinese: "在過去一年，有多少次你一旦開始喝酒就很難停下來？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "少於每月一次" },
      { value: 2, chinese: "每月一次" },
      { value: 3, chinese: "每週一次" },
      { value: 4, chinese: "每日或幾乎每日" }
    ]
  },
  {
    id: 5,
    english: "How often during the last year have you failed to do what was normally expected from you because of drinking?",
    chinese: "在過去一年，有多少次因為飲酒而未能完成一些你應做的事？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "少於每月一次" },
      { value: 2, chinese: "每月一次" },
      { value: 3, chinese: "每週一次" },
      { value: 4, chinese: "每日或幾乎每日" }
    ]
  },
  {
    id: 6,
    english: "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
    chinese: "在過去一年，有多少次在豪飲之後，你需要於第二天早上喝酒才能定神？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "少於每月一次" },
      { value: 2, chinese: "每月一次" },
      { value: 3, chinese: "每週一次" },
      { value: 4, chinese: "每日或幾乎每日" }
    ]
  },
  {
    id: 7,
    english: "How often during the last year have you had a feeling of guilt or remorse after drinking?",
    chinese: "在過去一年，有多少次在喝酒後感到內疚或懊悔？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "少於每月一次" },
      { value: 2, chinese: "每月一次" },
      { value: 3, chinese: "每週一次" },
      { value: 4, chinese: "每日或幾乎每日" }
    ]
  },
  {
    id: 8,
    english: "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
    chinese: "在過去一年，有多少次在喝酒後，你因「斷片」而無法憶起前一晚發生的事？",
    options: [
      { value: 0, chinese: "從不" },
      { value: 1, chinese: "少於每月一次" },
      { value: 2, chinese: "每月一次" },
      { value: 3, chinese: "每週一次" },
      { value: 4, chinese: "每日或幾乎每日" }
    ]
  },
  {
    id: 9,
    english: "Have you or someone else been injured as a result of your drinking?",
    chinese: "你或其他人曾否因你飲酒而受傷？",
    options: [
      { value: 0, chinese: "沒有" },
      { value: 2, chinese: "有，但不是在過去一年" },
      { value: 4, chinese: "有，在過去一年內" }
    ]
  },
  {
    id: 10,
    english: "Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?",
    chinese: "曾否有親戚、朋友、醫師或其他醫護人員，關注你飲酒的情況或建議你減少飲酒？",
    options: [
      { value: 0, chinese: "沒有" },
      { value: 2, chinese: "有，但不是在過去一年" },
      { value: 4, chinese: "有，在過去一年內" }
    ]
  }
];

const getRiskZone = (score: number) => {
  if (score >= 20) return "第四區 (極高風險)";
  if (score >= 15) return "第三區 (高風險)";
  if (score >= 8) return "第二區 (中風險)";
  return "第一區 (低風險)";
};

const getInterpretation = (score: number) => {
  if (score >= 20) {
    return "您的分數落在第四區（20分或以上），強烈暗示很大可能有酒精依賴。此為最高風險區間，表明飲酒行為已失控，並很可能已引發了嚴重的健康及社會問題。必須尋求專業的診斷評估與治療，可能包括藥物治療、心理治療以及參與支持團體。";
  } else if (score >= 15) {
    return "您的分數落在第三區（15-19分），表明飲酒習慣正嚴重危害您的身心健康。飲酒行為很可能已經對個人的身心健康造成了實質的傷害，並且可能已出現中等程度的酒精依賴。強烈建議尋求專業協助，簡單的忠告可能已不足夠。";
  } else if (score >= 8) {
    return "您的分數落在第二區（8-14分），顯示個人的飲酒模式已達到「高風險」或「有害性」的程度。這意味著飲酒行為已增加了對身心健康造成損害的風險。應認真考慮減少飲酒量，此階段是進行「簡易介入」的黃金時機。";
  } else {
    return "您的分數落在第一區（0-7分），代表低風險的飲酒行為。個人的飲酒模式目前對健康造成危害的可能性較低。建議維持目前的飲酒習慣或考慮進一步減少飲酒。";
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
      <SEOHead config={questionnaireSEO["audit"]} path="/audit" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">酒精使用疾患識別測驗 (AUDIT)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是由世界衛生組織開發的酒精使用評估工具，包含10個問題，用於評估<strong>過去一年內</strong>的飲酒模式與相關問題。
          </p>
          <p className="mb-3">
            AUDIT不僅評估飲酒的量與頻率，更涵蓋了酒精依賴的早期症狀以及飲酒所導致的相關傷害。
          </p>
          <div className="bg-white p-4 rounded-lg border border-blue-200 mb-3">
            <h3 className="font-semibold text-blue-800 mb-2">🍺 酒精單位換算參考</h3>
            <p className="text-sm text-gray-700 mb-2">1個標準酒精單位 = 10克純酒精，大約等於：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>🍺</span>
                <span>啤酒 330ml (5%酒精)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🍷</span>
                <span>紅酒 125ml (12%酒精)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🥃</span>
                <span>威士忌 25ml (40%酒精)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🍶</span>
                <span>清酒 180ml (15%酒精)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🍾</span>
                <span>香檳 125ml (12%酒精)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🍸</span>
                <span>調酒 1杯 (依酒精濃度)</span>
              </div>
            </div>
          </div>
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

                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">
                        ({option.value}) {option.chinese}
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
              <TitleComponent>AUDIT 評估結果</TitleComponent>
              <DescriptionComponent>
                您的酒精使用疾患識別測驗結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 40
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {score !== null && getRiskZone(score)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {score !== null && getInterpretation(score)}
                  </p>
                </div>

                <AnswerDetailList
                  items={questions.map<AnswerDetailItem>((q) => {
                    const v = answers[q.id];
                    const opt = v !== undefined ? q.options.find(o => o.value === v) : undefined;
                    return {
                      question: q.chinese,
                      answerLabel: opt ? opt.chinese : '未作答',
                      score: v ?? 0,
                    };
                  })}
                  totalLabel={`總分 ${score ?? 0} / 40`}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">AUDIT評分標準：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>第一區 (0-7分)：</strong>低風險飲酒</li>
                    <li>• <strong>第二區 (8-14分)：</strong>有風險或有害性飲酒</li>
                    <li>• <strong>第三區 (15-19分)：</strong>高風險飲酒</li>
                    <li>• <strong>第四區 (≥20分)：</strong>很大可能有酒精依賴</li>
                  </ul>
                </div>

                {score !== null && score >= 8 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">建議下一步：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 尋求專業醫療評估與諮詢</li>
                      <li>• 考慮酒精治療或諮商服務</li>
                      <li>• 與醫師討論減少飲酒的策略</li>
                      <li>• 如有需要，考慮參與支持團體</li>
                    </ul>
                  </div>
                )}

                <div className="pt-4">
                  <ShareButton 
                    title="酒精使用疾患識別測驗 (AUDIT)"
                    text={score !== null ? `我的得分是${score}分，評估為：${getRiskZone(score)}` : ''}
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
                <strong>開發者：</strong>世界衛生組織 (World Health Organization, WHO)
              </p>
              <p>
                <strong>版權：</strong>公共領域，可免費使用於臨床與研究
              </p>
              <p>
                <strong>中文版來源：</strong>香港特別行政區政府衛生署
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Babor, T. F., Higgins-Biddle, J. C., Saunders, J. B., & Monteiro, M. G. (2001). 
                <em>The Alcohol Use Disorders Identification Test (AUDIT): Guidelines for use in primary care</em> (2nd ed.). 
                World Health Organization.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * AUDIT是WHO開發的全球標準酒精篩檢工具，適用於識別高風險飲酒行為、
                有害性飲酒及早期酒精依賴症狀。本工具已在世界各國廣泛驗證並使用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;