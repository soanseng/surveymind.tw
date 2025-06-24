"use client"
import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

const questions = [
  {
    id: 1,
    question: "今天是幾號？",
    instruction: "年、月、日都對才算正確",
    type: "date"
  },
  {
    id: 2,
    question: "今天是星期幾？",
    instruction: "星期對才算正確",
    type: "day"
  },
  {
    id: 3,
    question: "這是什麼地方？",
    instruction: "對所在地的任何描述都算正確（如「我的家」、醫院名稱）",
    type: "text"
  },
  {
    id: 4,
    question: "您的電話號碼是幾號？",
    instruction: "經確認號碼無誤即算正確。若無電話，可改問住址",
    type: "text"
  },
  {
    id: 5,
    question: "您幾歲了？",
    instruction: "年齡與出生年月日符合才算正確",
    type: "number"
  },
  {
    id: 6,
    question: "您的出生年月日？",
    instruction: "年、月、日都對才算正確",
    type: "birthdate"
  },
  {
    id: 7,
    question: "現任的總統是誰？",
    instruction: "姓氏正確即可",
    type: "text"
  },
  {
    id: 8,
    question: "前任的總統是誰？",
    instruction: "姓氏正確即可",
    type: "text"
  },
  {
    id: 9,
    question: "您媽媽叫什麼名字？",
    instruction: "說出一個與他不同的女性姓名即可，不需特別證實",
    type: "text"
  },
  {
    id: 10,
    question: "從20減3開始算，一直減3減下去",
    instruction: "20-3=17, 17-3=14, 14-3=11... 期間任何錯誤或無法繼續即算錯誤",
    type: "calculation"
  }
];

const getSeverity = (errorCount: number) => {
  if (errorCount <= 2) return '心智功能完整';
  if (errorCount <= 4) return '輕度心智功能障礙';
  if (errorCount <= 7) return '中度心智功能障礙';
  return '重度心智功能障礙';
};

const getInterpretation = (errorCount: number) => {
  if (errorCount <= 2) {
    return "您的心智功能測試結果在正常範圍內。繼續保持健康的生活方式，包括規律運動、社交互動和智力活動。";
  }
  if (errorCount <= 4) {
    return "測試顯示輕度的心智功能障礙。建議您密切觀察認知功能的變化，保持積極的生活方式，並考慮與醫師討論您的狀況。";
  }
  if (errorCount <= 7) {
    return "測試顯示中度的心智功能障礙。強烈建議您盡快前往神經內科或精神科進行專業評估，以確定是否需要進一步的檢查和治療。";
  }
  return "測試顯示重度的心智功能障礙。請立即尋求神經內科或精神科的專業協助，進行全面的認知功能評估和必要的醫療介入。";
};

const Page = () => {
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
  const [correctness, setCorrectness] = useState<(boolean | null)[]>(new Array(questions.length).fill(null));
  const [errorCount, setErrorCount] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setValidationMessage('');
  };

  const handleCorrectnessChange = (index: number, isCorrect: boolean) => {
    const newCorrectness = [...correctness];
    newCorrectness[index] = isCorrect;
    setCorrectness(newCorrectness);
  };

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    correctness.forEach((correct, index) => {
      if (correct === null) {
        unanswered.push(index + 1);
      }
    });
    return unanswered;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unansweredQuestions = getUnansweredQuestions();
    
    if (unansweredQuestions.length > 0) {
      if (unansweredQuestions.length > 5) {
        setValidationMessage(`還有 ${unansweredQuestions.length} 題尚未評分，請為所有題目標記正確或錯誤後再提交。`);
      } else {
        setValidationMessage(`請為第 ${unansweredQuestions.join('、')} 題標記正確或錯誤後再提交。`);
      }
      return;
    }
    
    const errors = correctness.filter(c => c === false).length;
    setErrorCount(errors);
    setFormSubmitted(true);
    setValidationMessage('');
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["spmsq"]} path="/spmsq" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">簡易認知功能評估表 (SPMSQ)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            本評估表用於篩檢基本心智狀態，主要評估定向感、記憶力和計算能力。
            請直接向受測者提問以下問題，並根據其回答標記「正確」或「錯誤」。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。
            若答錯三題以上（≥3題），建議立即前往神經內科或精神科進行進一步檢查。
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">評分進度</span>
            <span className="text-sm text-gray-600">
              {correctness.filter(c => c !== null).length} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(correctness.filter(c => c !== null).length / questions.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, index) => {
            const isUnanswered = correctness[index] === null;
            return (
              <div 
                key={q.id} 
                className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered && validationMessage 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <h3 className={`text-lg font-medium mb-2 ${
                  isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                }`}>
                  {q.id}. {q.question}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未評分</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{q.instruction}</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      受測者的回答：
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="請輸入受測者的回答（選填）"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      評分：
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`correctness-${index}`}
                          value="correct"
                          onChange={() => handleCorrectnessChange(index, true)}
                          className="mr-2 h-4 w-4 text-green-600"
                        />
                        <span className="text-sm">正確</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`correctness-${index}`}
                          value="incorrect"
                          onChange={() => handleCorrectnessChange(index, false)}
                          className="mr-2 h-4 w-4 text-red-600"
                        />
                        <span className="text-sm">錯誤</span>
                      </label>
                    </div>
                  </div>
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
          <ContentComponent className="sm:max-w-[425px]">
            <HeaderComponent>
              <TitleComponent>SPMSQ 評估結果</TitleComponent>
              <DescriptionComponent>
                簡易認知功能評估表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    錯誤題數：{errorCount} / 10
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {errorCount !== null && getSeverity(errorCount)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {errorCount !== null && getInterpretation(errorCount)}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">評分標準：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 錯0-2題：心智功能完整</li>
                    <li>• 錯3-4題：輕度心智功能障礙</li>
                    <li>• 錯5-7題：中度心智功能障礙</li>
                    <li>• 錯8-10題：重度心智功能障礙</li>
                    <li className="pt-2 font-semibold">• 若答錯三題以上，建議就醫評估</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="簡易認知功能評估表 (SPMSQ)"
                    text={`評估結果：錯誤${errorCount}題，${errorCount !== null && getSeverity(errorCount)}`}
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
                <strong>原始版權：</strong>Pfeiffer, E. (1975) 開發
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Pfeiffer, E. (1975). A short portable mental status questionnaire for the assessment of organic brain deficit in elderly patients. 
                <em>Journal of the American Geriatrics Society</em>, <em>23</em>(10), 433-441.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 本量表在台灣社區衛生單位廣泛使用，已經過本地化驗證。資料來源：
                台灣失智症協會、衛生福利部失智症診療手冊（研究論文第9、10項引用）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;