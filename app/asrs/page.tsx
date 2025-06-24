"use client"
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

const questions = [
"當必須進行一件枯燥或困難的計劃時，你會多常粗心犯錯？",
"當正在做枯燥或重複性的工作時，你多常有持續專注的困難？",
"即使有人直接對你說話，你會多常有困難專注於別人跟你講話的內容？",
"一旦完成任何計劃中最具挑戰的部份之後，你多常有完成計劃最後細節的困難？",
"當必須從事需要有組織規劃性的任務時，你會多常有困難井然有序地去做？",
"當有一件需要多費心思考的工作時，你會多常逃避或是延後開始去做？",
"在家裡或是在工作時，你會多常沒有把東西放對地方或是找不到東西？",
"你會多常因身旁的活動或聲音而分心？",
"你會多常有問題去記得約會或是必須要做的事？",
"當你必須長時間坐著時，你會多常坐不安穩或扭動手腳？",
"你會多常在開會時或在其他被期待坐好的場合中離開座位？",
"你會多常覺得靜不下來或煩躁不安？",
"當有自己獨處的時間時，你會多常覺得有困難使自己平靜和放鬆？",
"你會多常像被馬達所驅動一樣，覺得自己過度地活躍，不得不做事情？",
"在社交場合中，你會多常發現自己話講得太多？",
"當與他人交談時，你會多常在別人還沒把話講完前就插嘴或接話替對方把話講完？",
"在需要輪流排隊的場合時，你會多常有困難輪流等待？",
"你會多常在別人忙碌時打斷別人？"
]

const questionsPerPage = 9

const ASRSForm: React.FC = () => {
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


  //calculate the index of the first and last question on the current page
  const firstQuestionIndex = currentPage * questionsPerPage;
  const lastQuestionIndex = Math.min(firstQuestionIndex + 9, questions.length);
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

  //calculate scores
  const calculateScores = () => {
    const partAScores = answers.slice(0, 9).reduce((acc, curr) => acc + Number(curr), 0);
    const partBScores = answers.slice(9, 18).reduce((acc, curr) => acc + Number(curr), 0);
    return { partAScores, partBScores };
  };

  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unansweredQuestions = getUnansweredQuestionsOnCurrentPage();
    
    if (unansweredQuestions.length > 0) {
      if (unansweredQuestions.length > 5) {
        setCustomValidationMessage(`本頁還有 ${unansweredQuestions.length} 題尚未作答，請完成本頁所有題目後再提交。`);
      } else {
        setCustomValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
      }
      return;
    }
    
    setCustomValidationMessage('');
    handleSubmit(e);
    setFormSubmitted(true);
    setOpen(true);
  };

  // Determine ADHD likelihood based on scores
  const getADHDLikelihood = (score: number) => {
    if (score >= 24) return "非常可能有ADHD 😲";
    if (score >= 17) return "很可能有ADHD 🤔";
    return "不太可能有ADHD 🙂";
  };

  const { partAScores, partBScores } = calculateScores();
  const resultA = getADHDLikelihood(partAScores);
  const resultB = getADHDLikelihood(partBScores);

  const validationMessage = customValidationMessage || hookValidationMessage;

  // Overall progress calculation
  const totalAnswered = answers.filter(answer => answer !== null && answer !== '').length;
  const overallProgress = (totalAnswered / questions.length) * 100;


  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO.asrs} path="/asrs" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">ASRS 成人ADHD自我評估問卷</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            <strong>題目：</strong>請根據以下問題回答您過去六個月的感受與行為。
          </p>
          <p className="mb-3">
            ASRS 是世界衛生組織開發的成人ADHD篩檢工具，分為A部分（不專心症狀）和B部分（過動/衝動症狀）。
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
            {currentPage === 0 && <span className="ml-2 text-blue-600">（A部分：不專心症狀）</span>}
            {currentPage === 1 && <span className="ml-2 text-blue-600">（B部分：過動/衝動症狀）</span>}
            {currentPage === 2 && <span className="ml-2 text-blue-600">（B部分續：過動/衝動症狀）</span>}
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["0", "1", "2", "3", "4"].map((value) => {
                    const labels = ["從不", "很少", "有時", "常常", "非常頻繁"];
                    return (
                      <label key={value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={value}
                          checked={answers[questionIndex] === value}
                          onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{labels[parseInt(value)]}</span>
                      </label>
                    );
                  })}
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
              allQuestionsAnswered() && (
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  完成評估
                </button>
              )
            )}
          </div>
        </form>

        <Content open={open} onOpenChange={setOpen}>
          <ContentComponent className="sm:max-w-[500px]">
            <HeaderComponent>
              <TitleComponent>ASRS 成人ADHD評估結果</TitleComponent>
              <DescriptionComponent>
                您的ADHD症狀評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600 mb-2">
                      A部分：{partAScores} / 36
                    </div>
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      不專心症狀
                    </div>
                    <div className="text-sm text-blue-700">
                      {resultA.replace('😲', '').replace('🤔', '').replace('🙂', '')}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600 mb-2">
                      B部分：{partBScores} / 36
                    </div>
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      過動/衝動症狀
                    </div>
                    <div className="text-sm text-green-700">
                      {resultB.replace('😲', '').replace('🤔', '').replace('🙂', '')}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    如果您在任一部分的得分指向「很可能有ADHD」或「非常可能有ADHD」，建議進行更完整的評估以了解損害和病史。
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    即使得分顯示「不太可能有ADHD」，如果您仍有疑慮，也值得進一步探討，因為有時成年ADHD患者即使症狀輕微也可能遭受顯著損害。
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">評分標準：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 不太可能有ADHD：得分 &lt; 17</li>
                    <li>• 很可能有ADHD：得分 17-23</li>
                    <li>• 非常可能有ADHD：得分 ≥ 24</li>
                    <li>• 建議尋求專業評估以確定診斷</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="ASRS 成人ADHD自我評估問卷"
                    text={`A部分得分：${partAScores} - ${resultA.replace('😲', '').replace('🤔', '').replace('🙂', '')}；B部分得分：${partBScores} - ${resultB.replace('😲', '').replace('🤔', '').replace('🙂', '')}`}
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
                <strong>開發組織：</strong>世界衛生組織 (WHO) 開發的成人ADHD自我報告量表
              </p>
              <p>
                <strong>研究團隊：</strong>Kessler, R.C., Adler, L., Ames, M., 等學者
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Kessler, R. C., Adler, L., Ames, M., Demler, O., Faraone, S., Hiripi, E., ... & Walters, E. E. (2005). 
                The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. 
                <em>Psychological Medicine</em>, <em>35</em>(2), 245-256. 
                https://doi.org/10.1017/S0033291704002892
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * ASRS-v1.1是WHO開發的18題版本，具有良好的信效度。
                A部分9題用於篩檢不專心症狀，B部分9題用於篩檢過動/衝動症狀。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASRSForm;



