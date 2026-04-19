"use client";
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

// SAST Questions based on the research paper
const questions = [
  {
    id: 1,
    english: "Do you often find yourself preoccupied with sexual thoughts?",
    chinese: "您是否經常發現自己專注於性的想法？"
  },
  {
    id: 2,
    english: "Do you feel that your sexual behavior is not normal?",
    chinese: "您是否覺得自己的性行為不正常？"
  },
  {
    id: 3,
    english: "Do you ever feel bad about your sexual behavior?",
    chinese: "您是否曾對自己的性行為感到糟糕？"
  },
  {
    id: 4,
    english: "Has your sexual behavior ever created problems for you and your family?",
    chinese: "您的性行為是否曾為您和您的家庭帶來問題？"
  },
  {
    id: 5,
    english: "Have you ever sought help for sexual behavior you did not like?",
    chinese: "您是否曾因不喜歡自己的某種性行為而尋求協助？"
  },
  {
    id: 6,
    english: "Have you been hurt emotionally because of your sexual behavior?",
    chinese: "是否曾有人因為您的性行為而在情感上受到傷害？"
  },
  {
    id: 7,
    english: "Are any of your sexual activities against the law?",
    chinese: "您的性活動中是否有任何是違法的？"
  },
  {
    id: 8,
    english: "Have you ever tried to stop some part of your sexual activity and failed?",
    chinese: "您是否曾努力戒除某種性活動但失敗了？"
  },
  {
    id: 9,
    english: "Do you hide some of your sexual behavior from others?",
    chinese: "您是否會對他人隱瞞自己的一些性行為？"
  },
  {
    id: 10,
    english: "Have you ever attempted to stop a part of your sexual activity?",
    chinese: "您是否曾嘗試停止自己的一部分性活動？"
  },
  {
    id: 11,
    english: "Have you felt degraded by your sexual behavior?",
    chinese: "您是否曾因自己的性行為而感到被貶低？"
  },
  {
    id: 12,
    english: "When you have sex, do you feel depressed afterwards?",
    chinese: "當您發生性行為後，是否會感到沮喪？"
  },
  {
    id: 13,
    english: "Do you feel controlled by your sexual desire?",
    chinese: "您是否覺得自己被性慾所控制？"
  },
  {
    id: 14,
    english: "Do important parts of your life (work, family, friends, leisure) suffer because you spend too much time on sex?",
    chinese: "您生活中重要的部分（如工作、家庭、朋友、休閒）是否因花太多時間在性上面而被忽略？"
  },
  {
    id: 15,
    english: "Do you ever feel that your sexual desire is stronger than you are?",
    chinese: "您是否曾覺得自己的性慾比您自己更強大？"
  },
  {
    id: 16,
    english: "Is sex almost all you think about?",
    chinese: "性是否幾乎是您唯一在想的事情？"
  },
  {
    id: 17,
    english: "Has sex (or romantic fantasies) become a way for you to escape your problems?",
    chinese: "性（或浪漫幻想）是否已成為您逃避問題的一種方式？"
  },
  {
    id: 18,
    english: "Has sex become the most important thing in your life?",
    chinese: "性是否已成為您生命中最重要的事情？"
  },
  {
    id: 19,
    english: "Are you in crisis over sexual matters?",
    chinese: "您是否因性的事情而處於危機之中？"
  },
  {
    id: 20,
    english: "Were you sexually abused as a child or adolescent?",
    chinese: "您是否曾在童年或青少年時期遭受性虐待？"
  }
];

const getRiskLevel = (score: number) => {
  if (score >= 13) return "高風險";
  if (score >= 6) return "中等風險";
  if (score >= 1) return "低風險";
  return "無風險指標";
};

const getInterpretation = (score: number) => {
  if (score >= 13) {
    return "您的得分顯示高風險（13分或以上），強烈暗示可能存在強迫性性行為問題。這個分數表明您的性行為模式可能已對自己或他人造成困擾或傷害，並且已失去適當的控制。強烈建議尋求專業協助，如諮詢專精於性健康、親密關係或衝動控制議題的心理師或醫師。請記住，強迫性性行為疾患是一種可治療的狀況。";
  } else if (score >= 6) {
    return "您的得分顯示中等風險（6-12分），表明您的性行為模式可能存在一些令人擔憂的特徵。這並不意味著您一定有問題，但建議您仔細檢視自己的性行為模式，並考慮尋求專業諮詢以進行更深入的評估。專業人士能幫助您判斷這些行為是否對您的生活造成負面影響。";
  } else if (score >= 1) {
    return "您的得分顯示低風險（1-5分），表明您可能在某些性行為方面有輕微的擔憂，但整體而言風險較低。這個分數通常不代表嚴重問題，但如果您對任何答案感到困擾，或者這些行為對您的生活造成任何負面影響，建議諮詢專業人士。";
  } else {
    return "您的得分顯示無風險指標（0分），表明您目前沒有展現出強迫性性行為的典型特徵。這是一個積極的結果，但如果您仍有任何與性行為相關的擔憂，請不要猶豫尋求專業諮詢。";
  }
};

const Page = () => {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScore = () => {
    return Object.values(answers).filter(value => value === true).length;
  };

  const handleAnswerChange = (questionId: number, value: boolean) => {
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
      <SEOHead config={questionnaireSEO["sast"]} path="/sast" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">性成癮篩檢測驗 (SAST)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一份包含20個問題的篩檢工具，用於評估是否存在強迫性性行為的模式。
            請根據您在<strong>過去12個月</strong>的經驗，誠實回答每個問題。
          </p>
          <p className="mb-3">
            這個評估的目的是引發自我覺察，幫助識別可能需要專業協助的行為模式。
            所有資料完全保密，不會被儲存或分享。
          </p>
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>重要提醒：</strong>本量表為篩檢工具，不能提供診斷。如有疑慮請諮詢專精於性健康或衝動控制的專業人士。
              如果您曾經歷創傷，建議在專業人士陪同下進行評估。
            </p>
          </div>
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

                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="yes"
                      onChange={() => handleAnswerChange(question.id, true)}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">是</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="no"
                      onChange={() => handleAnswerChange(question.id, false)}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">否</span>
                  </label>
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
              <TitleComponent>SAST 評估結果</TitleComponent>
              <DescriptionComponent>
                您的性成癮篩檢測驗結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 20
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {score !== null && getRiskLevel(score)}
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
                    return {
                      question: q.chinese,
                      answerLabel: v === true ? '是' : v === false ? '否' : '未作答',
                      score: v === true ? 1 : 0,
                    };
                  })}
                  totalLabel={`總分 ${score ?? 0} / 20`}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">SAST評分參考：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>0分：</strong>無風險指標</li>
                    <li>• <strong>1-5分：</strong>低風險</li>
                    <li>• <strong>6-12分：</strong>中等風險</li>
                    <li>• <strong>13-20分：</strong>高風險，強烈建議專業評估</li>
                  </ul>
                </div>

                {score !== null && score >= 6 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">建議資源：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 尋求專精於性健康的心理師</li>
                      <li>• 諮詢衝動控制障礙專家</li>
                      <li>• 考慮認知行為治療 (CBT)</li>
                      <li>• 尋找支持團體</li>
                      <li>• 若有創傷史，尋求創傷治療</li>
                    </ul>
                  </div>
                )}

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• 這個評估不能取代專業診斷</li>
                    <li>• 強迫性性行為是可以治療的</li>
                    <li>• 尋求幫助是勇敢和負責任的行為</li>
                    <li>• 專業治療具有保密性</li>
                    <li>• 復原是一個過程，需要時間和支持</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="性成癮篩檢測驗 (SAST)"
                    text={score !== null ? `我完成了性成癮篩檢評估，評估為：${getRiskLevel(score)}` : ''}
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
                <strong>開發者：</strong>Dr. Patrick Carnes
              </p>
              <p>
                <strong>版權：</strong>可免費用於初步篩檢用途
              </p>
              <p>
                <strong>適用範圍：</strong>成年人強迫性性行為篩檢
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Carnes, P. (1983). 
                <em>Out of the Shadows: Understanding Sexual Addiction</em>. 
                CompCare Publishers.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * SAST是用於強迫性性行為初步篩檢的工具，目的在於引發自我覺察。
                台灣已有學者針對男性樣本進行相關研究，顯示此議題在本地臨床實務中受到關注。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;