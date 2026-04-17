'use client'
import React, { useState } from 'react';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const optionLabels = [
  "沒有或極少(1天以下)",
  "有時(1-2天)",
  "時常(3-4天)",
  "常常或總是(5-7天)"
];

const questions = [
  "我常常覺得想哭",
  "我覺得心情不好",
  "我覺得比以前容易發脾氣",
  "我睡不好",
  "我覺得不想吃東西",
  "我覺得胸口悶悶的(心肝頭或胸坎綁綁的)",
  "我覺得不輕鬆、不舒服(不爽快)",
  "我覺得身體疲勞虛弱、無力(身體很虛、沒力氣、元氣及體力)",
  "我覺得很煩",
  "我覺得記憶力不好",
  "我覺得做事時無法專心",
  "我覺得想事情或做事時，比平常要緩慢",
  "我覺得比以前沒信心",
  "我覺得比較會往壞處想",
  "我覺得想不開、甚至想死",
  "我覺得對什麼事都失去興趣",
  "我覺得身體不舒服(如頭痛、頭暈、心悸、肚子不舒服…等)",
  "我覺得自己很沒用"
];

const questionsPerPage = 9;

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score < 9) return '無憂鬱傾向';
  if (score < 15) return '輕度憂鬱傾向';
  if (score < 19) return '中度憂鬱傾向';
  if (score < 29) return '中重度憂鬱傾向';
  return '重度憂鬱傾向';
};

const getTdqInterpretation = (score: number) => {
  let message = "";
  if (score >= 29) {
    message = "您目前可能有重度憂鬱傾向。建議您立即尋求專業醫療協助，包括精神科醫師或心理師的專業評估和治療。記住，尋求幫助是勇敢的表現，您並不孤單。";
  } else if (score >= 19) {
    message = "您目前可能有中重度憂鬱傾向。建議您尋求專業心理健康服務，與醫師討論適合的治療方案。早期介入治療效果更好。";
  } else if (score >= 15) {
    message = "您目前可能有中度憂鬱傾向。建議關注自己的心理健康狀況，考慮尋求專業協助，並與親友分享您的感受。";
  } else if (score >= 9) {
    message = "您目前可能有輕度憂鬱傾向。建議多關注自己的情緒變化，保持規律作息，適度運動，必要時尋求專業建議。";
  } else {
    message = "您目前的心理狀態良好，沒有明顯的憂鬱傾向。請繼續保持健康的生活方式和正向的心理狀態。";
  }
  return message;
};

const TdqForm: React.FC = () => {
  const {
    answers,
    currentPage,
    handleSelectChange,
    handleSubmit,
    nextPage,
    prevPage,
    validationMessage: hookValidationMessage,
    allQuestionsAnswered,
    formSubmitted,
    setFormSubmitted,
  } = useQuestionnaireForm<string>(questions.length, questionsPerPage);

  const [customValidationMessage, setCustomValidationMessage] = useState('');

  // Calculate the index of the first and last question on the current page
  const firstQuestionIndex = currentPage * questionsPerPage;
  const lastQuestionIndex = Math.min(firstQuestionIndex + questionsPerPage, questions.length);
  const questionsToShow = questions.slice(firstQuestionIndex, lastQuestionIndex);

  const currentPageQuestionsAnswered = questionsToShow.every((_, index) => {
    const questionIndex = firstQuestionIndex + index;
    return answers[questionIndex] !== null && answers[questionIndex] !== '';
  });

  const canGoForward = currentPage < Math.ceil(questions.length / questionsPerPage) - 1;
  const canGoBack = currentPage > 0;

  const getUnansweredQuestionsOnCurrentPage = () => {
    const unanswered: number[] = [];
    questionsToShow.forEach((_, index) => {
      const questionIndex = firstQuestionIndex + index;
      if (answers[questionIndex] === null || answers[questionIndex] === '') {
        unanswered.push(questionIndex + 1);
      }
    });
    return unanswered;
  };

  const handleNextPage = () => {
    const unansweredQuestions = getUnansweredQuestionsOnCurrentPage();
    
    if (unansweredQuestions.length > 0) {
      if (unansweredQuestions.length > 5) {
        setCustomValidationMessage(`本頁還有 ${unansweredQuestions.length} 題尚未作答，請完成本頁所有題目後再繼續。`);
      } else {
        setCustomValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再繼續下一頁。`);
      }
      return;
    }
    
    setCustomValidationMessage('');
    nextPage();
  };

  const handleAnswerChange = (index: number, value: string) => {
    handleSelectChange(index, value);
    setCustomValidationMessage('');
  };

  // Calculate scores
  const calculateScores = () => {
    const totalScores = answers.reduce((acc, curr) => acc + Number(curr), 0);
    return { totalScores, message: getTdqInterpretation(totalScores) };
  };

  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    setOpen(true);
    setFormSubmitted(true);
  };

  const { totalScores, message } = calculateScores();

  const validationMessage = customValidationMessage || hookValidationMessage;

  // Overall progress calculation
  const totalAnswered = answers.filter(answer => answer !== null && answer !== '').length;
  const overallProgress = (totalAnswered / questions.length) * 100;

  return (
    <div className="container mx-auto px-4">
      <SEOHead 
        config={questionnaireSEO.tdq} 
        path="/tdq"
      />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">台灣人憂鬱症量表 (TDQ)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            <strong>題目：</strong>請您根據最近一星期以來，身體與情緒的真正感覺，勾選最符合的一項！
          </p>
          <p className="mb-3">
            TDQ 是專為台灣地區設計的憂鬱症篩檢工具，融入本地的文化語言表達方式，更適合台灣民眾使用。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師。
          </p>
        </div>

        {/* Overall Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">總體完成進度</span>
            <span className="text-sm text-gray-600">
              {totalAnswered} / {questions.length} 題
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            第 {currentPage + 1} 頁，共 {Math.ceil(questions.length / questionsPerPage)} 頁
          </div>
        </div>

        <form onSubmit={customHandleSubmit} className="space-y-6">
          {questionsToShow.map((question, index) => {
            const questionIndex = firstQuestionIndex + index;
            const isUnanswered = answers[questionIndex] === null || answers[questionIndex] === '';
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
                  {questionIndex + 1}. {question}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["0", "1", "2", "3"].map((value) => (
                    <label key={value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={value}
                        checked={answers[questionIndex] === value}
                        onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{optionLabels[parseInt(value)]}</span>
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

          {/* Enhanced Pagination */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevPage}
              disabled={!canGoBack}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                canGoBack 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              上一頁
            </button>

            {canGoForward ? (
              <button
                type="button"
                onClick={handleNextPage}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                下一頁
              </button>
            ) : (
              <button
                type="submit"
                className={`font-medium py-3 px-8 rounded-lg transition-colors ${
                  allQuestionsAnswered()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!allQuestionsAnswered()}
              >
                完成評估
              </button>
            )}
          </div>
        </form>

        <Content open={open} onOpenChange={setOpen}>
          <ContentComponent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
            <HeaderComponent>
              <TitleComponent>TDQ 台灣人憂鬱症量表結果</TitleComponent>
              <DescriptionComponent>
                您的憂鬱症狀評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{totalScores} / 54
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSeverity(totalScores)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {message}
                  </p>
                </div>

                <AnswerDetailList
                  items={questions.map<AnswerDetailItem>((q, i) => {
                    const v = answers[i];
                    const n = v !== null && v !== '' ? parseInt(v, 10) : null;
                    return {
                      question: q,
                      answerLabel: n !== null ? optionLabels[n] : '未作答',
                      score: n ?? 0,
                    };
                  })}
                  totalLabel={`總分 ${totalScores} / 54`}
                />

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">分數解釋：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 8分以下：無憂鬱傾向</li>
                    <li>• 9-14分：輕度憂鬱傾向</li>
                    <li>• 15-18分：中度憂鬱傾向</li>
                    <li>• 19-28分：中重度憂鬱傾向</li>
                    <li>• 29分以上：重度憂鬱傾向</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="台灣人憂鬱症量表 (TDQ)"
                    text={`我的得分是${totalScores}分，結果為：${getSeverity(totalScores)}`}
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
                <strong>開發團隊：</strong>李昱、楊明仁、賴德仁、邱念陸、周騰達
              </p>
              <p>
                <strong>審訂專家：</strong>宋維村醫師、黃國彥教授、胡維顧問醫師、張本聖副教授
              </p>
              <p>
                <strong>資助單位：</strong>行政院國家科學委員會、董氏基金會
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                李昱, 楊明仁, 賴德仁, 邱念陸, & 周騰達 (2004). 
                台灣人憂鬱問卷之發展研究. 
                <em>行政院國家科學委員會專題研究計畫成果報告</em>. 
                計畫編號：NSC93-2314-B-006-126.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 本量表經董氏基金會大規模實測，建立具信效度之常模分數。
                專為台灣地區設計，融入本地文化語言表達方式。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TdqForm;