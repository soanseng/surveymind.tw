"use client"
import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const questions = [
  {
    id: "1a",
    text: "入睡困難",
    category: "失眠問題的嚴重程度"
  },
  {
    id: "1b", 
    text: "無法維持較長的睡眠（睡眠中斷）",
    category: "失眠問題的嚴重程度"
  },
  {
    id: "1c",
    text: "太早醒來",
    category: "失眠問題的嚴重程度"
  },
  {
    id: "2",
    text: "您滿意自己「最近」的睡眠狀態嗎？",
    category: null,
    options: ["非常滿意", "滿意", "中等", "不滿意", "非常不滿意"]
  },
  {
    id: "3",
    text: "睡眠問題是否有干擾到您的日常生活功能？(如：白天疲倦、情緒、工作/日常事務、專注力、記憶力等)",
    category: null,
    options: ["完全無干擾", "一點", "稍微", "很多", "非常多"]
  },
  {
    id: "4",
    text: "他人(如：家人、朋友)是否有注意到您的生活品質因睡眠問題受到影響？",
    category: null,
    options: ["完全沒注意", "一點", "稍微", "很多", "非常注意"]
  },
  {
    id: "5",
    text: "「最近」的睡眠問題是否令您感到擔心/困擾？",
    category: null,
    options: ["完全不擔心", "一點", "稍微", "很多", "非常擔心"]
  }
];

const defaultOptions = ["無", "輕度", "中度", "重度", "非常嚴重"];

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score <= 7) return '無臨床意義之失眠';
  if (score <= 14) return '輕度失眠 (或閾下失眠)';
  if (score <= 21) return '中度臨床失眠';
  return '重度臨床失眠';
};

const getInterpretation = (score: number | null) => {
  if (score == null) return "";
  if (score <= 7) {
    return "您的睡眠狀況在正常範圍內。可持續維持良好的睡眠衛生習慣。";
  } else if (score <= 14) {
    return "您可能偶爾有睡眠困擾，或症狀較輕微。建議檢視並加強睡眠衛生習慣，並持續觀察睡眠狀況。";
  } else if (score <= 21) {
    return "您的失眠問題已達到臨床上需要關注的程度，並可能已對您的日間功能產生明顯影響。建議考慮尋求專業醫療協助。";
  }
  return "您的失眠問題已相當嚴重，極可能已嚴重影響您的身心健康與生活品質。強烈建議尋求專業醫療協助。";
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

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["isi"]} path="/isi" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">失眠嚴重度量表 (ISI)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            此量表旨在評估您在過去兩週內對失眠本質、嚴重性及其對日間功能的影響的主觀感受。
            請根據您「最近兩週」的睡眠狀況，選擇最符合您情況的答案。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢睡眠專科醫師。
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
          {/* Category header for first three questions */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-800">1. 評估失眠問題的嚴重程度：</h3>
          </div>

          {questions.map((question, index) => {
            const isUnanswered = answers[index] === null || answers[index] === '';
            const options = question.options || defaultOptions;
            const displayNumber = question.id === "1a" ? "a" : 
                               question.id === "1b" ? "b" : 
                               question.id === "1c" ? "c" : 
                               question.id;
            
            return (
              <div 
                key={index} 
                className={`bg-white p-4 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered && validationMessage 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                } ${question.category ? 'ml-4' : ''}`}
              >
                <h3 className={`text-base font-medium mb-3 ${
                  isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                }`}>
                  {question.category ? `    ${displayNumber}. ` : `${displayNumber}. `}
                  {question.text}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={optionIndex.toString()}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{option}</span>
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
              <TitleComponent>失眠嚴重度評估結果</TitleComponent>
              <DescriptionComponent>
                您的ISI量表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 28
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
                  items={questions.map<AnswerDetailItem>((q, i) => {
                    const v = answers[i];
                    const n = v !== null && v !== '' ? parseInt(v, 10) : null;
                    const options = q.options || defaultOptions;
                    return {
                      question: q.text,
                      answerLabel: n !== null ? options[n] : '未作答',
                      score: n ?? 0,
                    };
                  })}
                  totalLabel={`總分 ${score ?? 0} / 28`}
                />

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為篩檢工具，不能作為診斷依據</li>
                    <li>• ISI總分達到15分或以上表示失眠問題具有臨床意義</li>
                    <li>• 建議結合睡眠日誌進行綜合評估</li>
                    <li>• 如有疑慮請諮詢睡眠專科醫師或精神科醫師</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="失眠嚴重度量表 (ISI)"
                    text={`我的得分是${score}分，結果為：${getSeverity(score)}`}
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

        {/* Copyright and Citation Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與版權</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>原始版權：</strong>© Morin, C.M. 1993, 1996, 2000, 2006，由 Mapi Research Trust 管理授權
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Morin, C. M., Belleville, G., Bélanger, L., & Ivers, H. (2011). 
                The Insomnia Severity Index: Psychometric indicators to detect insomnia cases and evaluate treatment response. 
                <em>Sleep</em>, <em>34</em>(5), 601-608. 
                https://doi.org/10.1093/sleep/34.5.601
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 本繁體中文版本綜合參考臺北榮民總醫院睡眠醫學中心與政治大學睡眠實驗室版本，
                中文版ISI (ISI-C) 的信度與效度已在台灣的學術研究中得到驗證。
                個人可在非商業目的下進行自我評估使用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;