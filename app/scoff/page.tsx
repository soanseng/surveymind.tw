"use client";
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const questions = [
  {
    key: "S",
    english: "Do you make yourself Sick because you feel uncomfortably full?",
    chinese: "您是否曾因為感到飽脹不適而讓自己嘔吐 (Sick)？"
  },
  {
    key: "C", 
    english: "Do you worry you have lost Control over how much you eat?",
    chinese: "您是否會擔心自己對飲食的份量失去控制 (Control)？"
  },
  {
    key: "O",
    english: "Have you recently lost more than One stone (approx. 6.4 kg or 14 lbs) in a 3-month period?",
    chinese: "在過去三個月內，您的體重是否曾減輕超過 6.5 公斤 (One stone)？"
  },
  {
    key: "F",
    english: "Do you believe yourself to be Fat when others say you are too thin?", 
    chinese: "當別人說您太瘦時，您是否仍覺得自己很胖 (Fat)？"
  },
  {
    key: "F",
    english: "Would you say that Food dominates your life?",
    chinese: "您是否覺得食物 (Food) 掌控了您的生活？"
  }
];

const getSeverity = (score: number) => {
  if (score >= 2) return '陽性篩檢結果 - 建議專業評估';
  return '陰性篩檢結果 - 低風險';
};

const getInterpretation = (score: number) => {
  if (score >= 2) {
    return "您的得分達到陽性篩檢標準（≥2分），這表示您很可能有厭食症或暴食症的風險。SCOFF問卷具有100%的敏感度，但約12.5%的偽陽性率。強烈建議您尋求專業醫療人員（如精神科醫師、臨床心理師或家庭醫師）進行更全面、詳細的評估。請記住，陽性結果不等於正式診斷，而是一個需要嚴肅對待並採取後續行動的警示信號。";
  }
  return "您的得分低於篩檢標準（<2分），表示您目前較不可能有厭食症或暴食症的風險。然而，SCOFF主要針對典型的厭食症和暴食症，對其他飲食問題（如嗜食症）的識別能力較為有限。如果您仍有飲食相關的困擾，建議諮詢專業人士以了解其他可能的原因。";
};

const Page = () => {
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
  const [score, setScore] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScore = () => {
    return answers.reduce((total, answer) => {
      return total + (answer === 'yes' ? 1 : 0);
    }, 0);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setValidationMessage('');
  };

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    answers.forEach((answer, index) => {
      if (answer === null || answer === '') {
        unanswered.push(index + 1);
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
    setFormSubmitted(true);
    setValidationMessage('');
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["scoff"]} path="/scoff" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">SCOFF 飲食障礙篩檢問卷</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            SCOFF是一個由5個問題組成的簡易篩檢工具，用於快速篩檢厭食症和暴食症的風險。
            SCOFF是由問題關鍵字組成的縮寫詞，設計簡潔易記。
          </p>
          <p className="mb-3">
            請根據您的實際情況誠實回答每個問題。每個問題請回答「是」或「否」。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師或相關專業人員。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">完成進度</span>
              <span className="text-sm text-gray-600">
                {answers.filter(answer => answer !== null && answer !== '').length} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${(answers.filter(answer => answer !== null && answer !== '').length / questions.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {questions.map((question, index) => {
            const isUnanswered = answers[index] === null || answers[index] === '';
            return (
              <div 
                key={index} 
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
                    {question.key}. {question.chinese}
                    {isUnanswered && validationMessage && (
                      <span className="ml-2 text-red-600 text-sm">*未作答</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 italic">
                    English: {question.english}
                  </p>
                </div>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="yes"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">是 (Yes)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="no"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">否 (No)</span>
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
              <TitleComponent>SCOFF 評估結果</TitleComponent>
              <DescriptionComponent>
                您的飲食障礙篩檢結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 5
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSeverity(score || 0)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getInterpretation(score || 0)}
                  </p>
                </div>

                <AnswerDetailList
                  items={questions.map<AnswerDetailItem>((q, i) => {
                    const v = answers[i];
                    return {
                      question: q.chinese,
                      answerLabel: v === 'yes' ? '是' : v === 'no' ? '否' : '未作答',
                      score: v === 'yes' ? 1 : 0,
                      note: q.key,
                    };
                  })}
                  totalLabel={`總分 ${score ?? 0} / 5`}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">SCOFF篩檢標準：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>≥2分：</strong>陽性篩檢結果，建議專業評估</li>
                    <li>• <strong>&lt;2分：</strong>陰性篩檢結果，低風險</li>
                    <li>• <strong>敏感度：</strong>100%（能找出所有潛在個案）</li>
                    <li>• <strong>特異度：</strong>87.5%（約12.5%偽陽性率）</li>
                  </ul>
                </div>

                {score !== null && score >= 2 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">建議下一步：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 尋求精神科醫師或臨床心理師的專業評估</li>
                      <li>• 考慮進行更詳細的飲食障礙評估（如EDE-Q）</li>
                      <li>• 與家庭醫師討論您的情況</li>
                      <li>• 必要時可邀請家人陪同就醫</li>
                    </ul>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為篩檢工具，不能作為診斷依據</li>
                    <li>• 主要針對厭食症和暴食症，對其他飲食問題敏感度較低</li>
                    <li>• 陽性結果需要進一步專業評估確認</li>
                    <li>• 如有任何飲食相關困擾，建議諮詢專業人士</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="SCOFF 飲食障礙篩檢問卷"
                    text={`我的得分是${score}分，結果為：${getSeverity(score || 0)}`}
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
                <strong>開發者：</strong>Morgan、Reid 與 Lacey 等學者
              </p>
              <p>
                <strong>開發單位：</strong>英國聖喬治醫院醫學院
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Morgan, J. F., Reid, F., & Lacey, J. H. (1999). 
                The SCOFF questionnaire: assessment of a new screening tool for eating disorders. 
                <em>BMJ</em>, 319(7223), 1467-1468.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * SCOFF問卷為公開領域工具，廣泛用於臨床場域的飲食障礙篩檢。
                其簡潔的設計使其適合非專科人員使用，是早期識別飲食障礙風險的有效工具。
                台灣已有中文版本應用於臨床實務。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;