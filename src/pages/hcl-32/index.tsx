"use client"
import { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import CopyResultButton from '@/components/CopyResultButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const questions = [
  "我需要的睡眠比平時少。",
  "我感覺精力更充沛、活動更多。",
  "我變得更有自信。",
  "我更享受我的工作。",
  "我更喜歡社交（打更多電話、更常出門）。",
  "我更想去旅行，而且/或是旅行得更多。",
  "我開車時傾向開得更快，或冒更多風險。",
  "我花更多錢／花錢如流水。",
  "我在日常生活中（工作及/或其他活動中）冒更多風險。",
  "我的身體活動量更大（運動等）。",
  "我會計畫更多的活動或專案。",
  "我有更多的點子、更有創造力。",
  "我變得比較不害羞或拘謹。",
  "我會穿著更鮮豔、更奢華的服飾／化妝。",
  "我想認識更多人，或實際上也認識了更多人。",
  "我對性方面更感興趣，及/或性慾增強。",
  "我變得更愛調情，及/或性生活更活躍。",
  "我話變得更多。",
  "我思考得更快。",
  "我說話時會說更多笑話或雙關語。",
  "我更容易分心。",
  "我會投入許多新的事物。",
  "我的思緒會從一個主題跳到另一個主題。",
  "我做事變得更迅速及/或更容易。",
  "我變得更沒耐心及/或更容易被激怒。",
  "我可能會讓別人感到筋疲力盡或惱怒。",
  "我更容易與人發生爭吵。",
  "我的情緒更高昂、更樂觀。",
  "我喝更多的咖啡。",
  "我抽更多的香菸。",
  "我喝更多的酒。",
  "我使用更多的藥物（鎮靜劑、抗焦慮藥、興奮劑）。"
];

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score < 14) return '低風險 - 較不可能有輕躁症狀';
  if (score >= 14) return '高風險 - 建議進一步評估輕躁症';
};

const getInterpretation = (score: number | null) => {
  if (score == null) return "";
  if (score < 14) {
    return "您的得分低於篩檢標準，顯示較不可能有輕躁症的經歷。這個結果並不能完全排除雙相性情緒障礙症的可能性，如果您仍有相關疑慮，建議諮詢專業醫師。";
  }
  return "您的得分達到或超過篩檢標準，顯示您可能曾經歷過輕躁症狀。這並不代表確診，而是建議您尋求專業的心理健康評估，以進一步釐清診斷。輕躁症是雙相性情緒障礙症的重要特徵之一。";
};

const Page = () => {
    const {
        answers,
        formSubmitted,
        handleSelectChange,
        handleSubmit,
        score,
        validationMessage: hookValidationMessage,
    } = useQuestionnaireForm(questions.length);

  const [customValidationMessage, setCustomValidationMessage] = useState('');
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
    handleSubmit(e);
    setOpen(true);
  }

  const validationMessage = customValidationMessage || hookValidationMessage;

  const handleAnswerChange = (index: number, value: string) => {
    handleSelectChange(index, value);
    setCustomValidationMessage(''); // Clear validation message when user answers
  };

  const detailItems = useMemo<AnswerDetailItem[]>(
    () =>
      questions.map((q, i) => {
        const v = answers[i];
        return {
          question: q,
          answerLabel: v === '1' ? '是' : v === '0' ? '否' : '未作答',
          score: v === '1' ? 1 : 0,
        };
      }),
    [answers],
  );
  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["hcl-32"]} path="/hcl-32" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">輕躁症自我評估量表 (HCL-32)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            在人生的不同時期，每個人的精力、活動力和心境都會經歷變化或波動（即所謂的「高低起伏」）。
            本問卷的目的在於評估您「心境高漲」時期的特徵。
          </p>
          <p className="mb-3">
            請試著回想一段您處於「心境高漲」的時期（當時並未使用藥物或酒精）。
            在那個狀態下，請回答以下問題是否符合您當時的經驗。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師。
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
                </h3>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="1"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">是</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="0"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">否</span>
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
              <TitleComponent>輕燥症自我評估結果</TitleComponent>
              <DescriptionComponent>
                您的HCL-32量表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 32
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSeverity(score)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getInterpretation(score)}
                  </p>
                </div>

                <AnswerDetailList
                  items={detailItems}
                  totalLabel={`總分 ${score ?? 0} / 32`}
                />

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為篩檢工具，不能作為診斷依據</li>
                    <li>• 篩檢標準為14分，敏感度82%，特異度67%</li>
                    <li>• 建議結合臨床評估進行綜合判斷</li>
                    <li>• 如有疑慮請諮詢精神科專業醫師</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="輕躁症自我評估量表 (HCL-32)"
                    text={`我的得分是${score}分，結果為：${getSeverity(score)}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <div className="flex flex-wrap gap-2">
                <CopyResultButton
                  title="HCL-32 輕躁症自我評估結果"
                  summary={[
                    `總分：${score ?? 0} / 32`,
                    `判讀：${getSeverity(score)}`,
                    getInterpretation(score),
                  ]
                    .filter(Boolean)
                    .join('\n')}
                  groups={[
                    { title: '各題作答明細', items: detailItems, totalLabel: `總分 ${score ?? 0} / 32` },
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
                <strong>原始版權：</strong>瑞士蘇黎世大學精神病院 Jules Angst 教授開發
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Angst, J., Adolfsson, R., Benazzi, F., Gamma, A., Hantouche, E., Meyer, T. D., ... & Scott, J. (2005). 
                The HCL-32: Towards a self-assessment tool for hypomanic symptoms in outpatients. 
                <em>Journal of Affective Disorders</em>, <em>88</em>(2), 217-233. 
                https://doi.org/10.1016/j.jad.2005.05.011
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 本量表經原作者授權供臨床與研究使用，翻譯版本已通過台灣地區信效度驗證研究。
                根據台灣驗證研究，篩檢臨界值為14分，敏感度82%，特異度67%。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;