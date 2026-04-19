"use client"
import { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import CopyResultButton from '@/components/CopyResultButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const optionLabels: Record<string, string> = {
  "1": "沒有或很少時間",
  "2": "有時",
  "3": "經常",
  "4": "持續/總是",
};

const questions = [
  "我覺得比平常容易緊張和著急。",
  "我無緣無故地感到害怕。",
  "我容易心裡煩亂或覺得驚恐。",
  "我覺得我可能快要崩潰了(或感覺快要發瘋)。",
  "我覺得一切都很好，也不會發生什麼不幸。", // Reverse
  "我的手腳會發抖。",
  "我因為頭痛、頸痛和背痛而苦惱。",
  "我感覺容易衰弱和疲乏。",
  "我覺得心平氣和，並且可以安靜地坐著。", // Reverse
  "我覺得心跳很快。",
  "我因為一陣陣頭暈而苦惱。",
  "我有暈倒的感覺或覺得快要暈倒。",
  "我呼吸順暢。", // Reverse
  "我的手指和腳趾有麻木或刺痛感。",
  "我因胃痛和消化不良而苦惱。",
  "我常常需要小便。",
  "我的手心通常是溫暖且乾燥的。", // Reverse
  "我臉頰發紅、發熱。",
  "我容易入睡並且一夜安眠。", // Reverse
  "我會做惡夢。"
];

// Reverse scored items (zero-based index)
const reverseItems = [4, 8, 12, 16, 18];

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score >= 75) return '極重度焦慮';
  if (score >= 60) return '中至重度焦慮';
  if (score >= 45) return '輕至中度焦慮';
  return '正常範圍';
};

const getInterpretation = (score: number | null) => {
  if (score == null) return "";
  if (score >= 75) {
    return "您的得分顯示可能正經歷嚴重的焦慮困擾（75-80分）。這個分數表明您的焦慮症狀已達到極重度水準，可能顯著影響日常生活功能。強烈建議立即尋求專業醫療人員的協助，包括精神科醫師或臨床心理師的評估與治療。";
  }
  if (score >= 60) {
    return "您的得分顯示可能存在顯著的焦慮困擾（60-74分）。您可能正經歷中度至重度的焦慮症狀，這些症狀可能已對您的生活品質造成相當程度的影響。建議尋求專業的心理諮詢或評估，以獲得適當的支持與治療。";
  }
  if (score >= 45) {
    return "您的得分顯示可能存在輕微至中等的焦慮困擾（45-59分）。雖然焦慮程度尚屬輕度，但建議您留意情緒變化，並練習壓力管理技巧。如症狀持續或加重，請考慮尋求專業協助。";
  }
  return "您的得分落在正常範圍內（20-44分），表示目前的焦慮困擾程度較低。這是一個良好的結果，但仍建議保持健康的生活方式，並在需要時運用適當的壓力管理策略。";
};

const Page = () => {
  const {
    answers,
    formSubmitted,
    handleSelectChange,
    handleSubmit,
    score: rawScore,
    validationMessage: hookValidationMessage,
  } = useQuestionnaireForm(questions.length);

  const [customValidationMessage, setCustomValidationMessage] = useState('');
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    answers.forEach((answer, index) => {
      if (answer === null || answer === '') {
        unanswered.push(index + 1);
      }
    });
    return unanswered;
  };

  const calculateCustomScore = () => {
    let totalScore = 0;
    answers.forEach((answer, index) => {
      if (answer !== null && answer !== '') {
        const numAnswer = parseInt(answer);
        if (reverseItems.includes(index)) {
          // Reverse scoring: 1->4, 2->3, 3->2, 4->1
          totalScore += (5 - numAnswer);
        } else {
          totalScore += numAnswer;
        }
      }
    });
    return totalScore;
  };

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unansweredQuestions = getUnansweredQuestions();
    
    if (unansweredQuestions.length > 0) {
      if (unansweredQuestions.length > 5) {
        setCustomValidationMessage(`還有 ${unansweredQuestions.length} 題尚未作答，請完成所有題目後再提交。`);
      } else {
        setCustomValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
      }
      return;
    }
    
    setCustomValidationMessage('');
    const score = calculateCustomScore();
    setCalculatedScore(score);
    handleSubmit(e);
    setOpen(true);
  }

  const validationMessage = customValidationMessage || hookValidationMessage;

  const handleAnswerChange = (index: number, value: string) => {
    handleSelectChange(index, value);
    setCustomValidationMessage('');
  };

  const detailItems = useMemo<AnswerDetailItem[]>(
    () =>
      questions.map((q, i) => {
        const v = answers[i];
        const n = v !== null && v !== '' ? parseInt(v, 10) : null;
        const isReverse = reverseItems.includes(i);
        const itemScore = n === null ? 0 : isReverse ? 5 - n : n;
        return {
          question: q,
          answerLabel: n !== null ? optionLabels[String(n)] : '未作答',
          score: itemScore,
          note: isReverse ? '反向計分' : undefined,
        };
      }),
    [answers],
  );

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["sas"]} path="/sas" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Zung氏自我評估焦慮量表 (SAS)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一份包含20個題目的自評量表，用於快速評估與量化焦慮症狀的嚴重程度。
            內容涵蓋了焦慮的兩大核心面向：<strong>情感症狀</strong>（如恐懼、緊張、恐慌）與<strong>身體症狀</strong>（如顫抖、頭痛、心跳加速、呼吸困難等）。
          </p>
          <p className="mb-3">
            請根據您<strong>過去一星期</strong>的實際感覺，選擇最適合的答案。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師或臨床心理師。
          </p>
        </div>

        {/* Progress Indicator */}
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

        <form onSubmit={customHandleSubmit} className="space-y-6">
          {questions.map((question, index) => {
            const isUnanswered = answers[index] === null || answers[index] === '';
            const isReverse = reverseItems.includes(index);
            return (
              <div 
                key={index} 
                className={`bg-white p-4 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered && validationMessage 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <h3 className={`text-base font-medium mb-3 ${
                  isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                }`}>
                  {index + 1}. {question}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                  {isReverse && (
                    <span className="ml-2 text-xs text-gray-500">(反向計分)</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="1"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">沒有或很少時間</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="2"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">有時</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="3"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">經常</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="4"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">持續/總是</span>
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
              <TitleComponent>焦慮自我評估結果</TitleComponent>
              <DescriptionComponent>
                您的SAS量表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{calculatedScore} / 80
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSeverity(calculatedScore)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getInterpretation(calculatedScore)}
                  </p>
                </div>

                <AnswerDetailList
                  items={detailItems}
                  totalLabel={`總分 ${calculatedScore ?? 0} / 80`}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">SAS評分標準：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>20-44分：</strong>正常範圍</li>
                    <li>• <strong>45-59分：</strong>輕至中度焦慮</li>
                    <li>• <strong>60-74分：</strong>中至重度焦慮</li>
                    <li>• <strong>75-80分：</strong>極重度焦慮</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為篩檢工具，不能作為診斷依據</li>
                    <li>• 包含5題反向計分題目（第5、9、13、17、19題）</li>
                    <li>• 評估焦慮的情感與身體症狀</li>
                    <li>• 建議結合臨床評估進行綜合判斷</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="Zung氏自我評估焦慮量表 (SAS)"
                    text={`我的得分是${calculatedScore}分，結果為：${getSeverity(calculatedScore)}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <div className="flex flex-wrap gap-2">
                <CopyResultButton
                  title="SAS 焦慮自我評估量表結果"
                  summary={[
                    `總分：${calculatedScore ?? 0} / 80`,
                    `判讀：${getSeverity(calculatedScore)}`,
                    getInterpretation(calculatedScore),
                  ]
                    .filter(Boolean)
                    .join('\n')}
                  groups={[
                    { title: '各題作答明細', items: detailItems, totalLabel: `總分 ${calculatedScore ?? 0} / 80` },
                  ]}
                />
                <CloseComponent className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded">
                  關閉
                </CloseComponent>
              </div>
            </FooterComponent>
          </ContentComponent>
        </Content>

        {/* Copyright and Citation Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與版權</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>原始開發者：</strong>William W.K. Zung 博士 (1971)
              </p>
              <p>
                <strong>版權狀態：</strong>學術期刊已全文刊出，個人與學術研究可非商業性使用
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Zung, W. W. K. (1971). 
                A rating instrument for anxiety disorders. 
                <em>Psychosomatics</em>, <em>12</em>(6), 371-379. 
                https://doi.org/10.1016/S0033-3182(71)71479-0
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 本量表經原作者發表於學術期刊，廣泛用於臨床與研究。
                繁體中文版本綜合參考多個臨床與線上版本，以求語意通順且精確。
                量表評估焦慮的情感症狀（恐懼、緊張、恐慌）與身體症狀（顫抖、頭痛、心跳加速等）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;