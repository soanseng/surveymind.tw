"use client"
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const questions = [
  "無法專注於細節的部分，或在學校作業或其他活動時，出現粗心的錯誤",
  "很難持續專注於作業或遊戲活動",
  "看起來好像沒有在聽別人對他(她)說話的內容",
  "沒有辦法遵循指示，也無法完成學校作業或家事((並不是由於對立性行為或無法了解指示的內容))",
  "組織規劃工作及活動有困難",
  "逃避，或表達不願意，或有困難於需要持續性動腦的工作(例如學校作業或家庭作業)",
  "會弄丟工作上或活動所必須的東西(例如學校作業、鉛筆、書、工具或玩具)",
  "很容易受外在刺激影響而分心",
  "在日常生活中忘東忘西的",
  "在座位上玩弄手腳或不好好坐著",
  "在教室或其他必須持續坐著的場合，會任意離開座位",
  "在不適當的場合，亂跑或爬高爬低",
  "很難安靜地玩或參與休閒活動",
  "總是一直在動或是像被馬達所驅動",
  "話很多",
  "在問題還沒問完前就急著回答",
  "在遊戲中或團體活動中，無法排隊或等待輪流",
  "打斷或干擾別人(例如：插嘴或打斷別人的遊戲)",
  "發脾氣",
  "與大人爭論",
  "主動地反抗或拒絕大人的要求與規定",
  "故意地做一些事去干擾別人",
  "因自己犯的錯或不適當的行為而怪罪別人",
  "易怒的或很容易被別人激怒",
  "生氣的及怨恨的",
  "惡意的或有報復心的",
]; ;

const questionsPerPage = 9;

const SNAP4Form: React.FC = () => {
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

  // Calculate scores for Inattention, Hyperactivity/Impulsivity, and Oppositional Defiant Disorder
  const calculateScores = () => {
    const inattentionScores = answers.slice(0, 9).reduce((acc, curr) => acc + Number(curr), 0);
    const hyperactivityImpulsivityScores = answers.slice(9, 18).reduce((acc, curr) => acc + Number(curr), 0);
    const oppositionalDefiantScores = answers.slice(18, 26).reduce((acc, curr) => acc + Number(curr), 0);
    return { inattentionScores, hyperactivityImpulsivityScores, oppositionalDefiantScores };
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

  // Interpret scores to determine symptom severity
  const interpretScore = (score: number, subset: 'inattention' | 'hyperactivityImpulsivity' | 'oppositionalDefiant') => {
    if (subset === 'inattention' || subset === 'hyperactivityImpulsivity') {
      if (score < 13) return "症狀不具臨床意義";
      if (score >= 13 && score <= 17) return "輕度症狀";
      if (score >= 18 && score <= 22) return "中度症狀";
      if (score >= 23) return "重度症狀";
    } else if (subset === 'oppositionalDefiant') {
      if (score < 8) return "症狀不具臨床意義";
      if (score >= 8 && score <= 13) return "輕度症狀";
      if (score >= 14 && score <= 18) return "中度症狀";
      if (score >= 19) return "重度症狀";
    }
    return "評分錯誤"; // Fallback error message
  };

  const { inattentionScores, hyperactivityImpulsivityScores, oppositionalDefiantScores } = calculateScores();
  const inattentionResult = interpretScore(inattentionScores, 'inattention');
  const hyperactivityImpulsivityResult = interpretScore(hyperactivityImpulsivityScores, 'hyperactivityImpulsivity');
  const oppositionalDefiantResult = interpretScore(oppositionalDefiantScores, 'oppositionalDefiant');

  const validationMessage = customValidationMessage || hookValidationMessage;

  // Overall progress calculation
  const totalAnswered = answers.filter(answer => answer !== null && answer !== '').length;
  const overallProgress = (totalAnswered / questions.length) * 100;

  // Section information for progress display
  const getSectionInfo = (currentPage: number) => {
    if (currentPage <= 0) return 'A部分：注意力不足症狀 (1-9題)';
    if (currentPage === 1) return 'B部分：過動/衝動症狀 (10-18題)';
    if (currentPage === 2) return 'C部分：對立反抗症狀 (19-26題)';
    return '';
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["snap-4"]} path="/snap-4" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">SNAP-IV 兒童ADHD評估問卷</h1>
        
        <div className="bg-orange-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">家長評估說明</h2>
          <p className="mb-3">
            <strong>評估對象：</strong>請根據您過去六個月觀察到的孩子行為進行評估。
          </p>
          <p className="mb-3">
            <strong>設計者：</strong>史瓦森 (James M. Swanson, Ph.D)；中文翻譯：高淑芬醫師
          </p>
          <p className="mb-3">
            SNAP-IV 是評估兒童ADHD症狀的標準化工具，包含注意力不足、過動/衝動、以及對立反抗三個面向的評估。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢兒童精神科醫師。
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
              className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            第 {currentPage + 1} 頁，共 {Math.ceil(questions.length / questionsPerPage)} 頁
            <div className="mt-1 text-orange-600 font-medium">
              {getSectionInfo(currentPage)}
            </div>
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
                  {["0", "1", "2", "3"].map((value) => {
                    const labels = ["完全沒有", "有一點點", "還算不少", "非常的多"];
                    return (
                      <label key={value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={value}
                          checked={answers[questionIndex] === value}
                          onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                          className="mr-2 h-4 w-4 text-orange-600"
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
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
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
          <ContentComponent className="sm:max-w-[600px]">
            <HeaderComponent>
              <TitleComponent>SNAP-IV 兒童ADHD評估結果</TitleComponent>
              <DescriptionComponent>
                您孩子的ADHD症狀評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 mb-1">
                        注意力不足：{inattentionScores} / 27
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {inattentionResult}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 mb-1">
                        過動/衝動：{hyperactivityImpulsivityScores} / 27
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {hyperactivityImpulsivityResult}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600 mb-1">
                        對立反抗：{oppositionalDefiantScores} / 24
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {oppositionalDefiantResult}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    SNAP-IV 量表評估三個主要面向的兒童行為症狀。每個面向的得分反映該領域症狀的嚴重程度。
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    如果您的孩子在任一面向顯示中度或重度症狀，建議尋求兒童精神科或行為發展專業醫師進一步評估。
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">評分標準：</h4>
                  <div className="text-sm text-yellow-700 space-y-2">
                    <div>
                      <strong>注意力不足 & 過動/衝動：</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• &lt; 13分：症狀不具臨床意義</li>
                        <li>• 13-17分：輕度症狀</li>
                        <li>• 18-22分：中度症狀</li>
                        <li>• ≥ 23分：重度症狀</li>
                      </ul>
                    </div>
                    <div>
                      <strong>對立反抗：</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• &lt; 8分：症狀不具臨床意義</li>
                        <li>• 8-13分：輕度症狀</li>
                        <li>• 14-18分：中度症狀</li>
                        <li>• ≥ 19分：重度症狀</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="SNAP-IV 兒童ADHD評估問卷"
                    text={`孩子的SNAP-IV評估結果：注意力不足 ${inattentionScores}分 (${inattentionResult})、過動/衝動 ${hyperactivityImpulsivityScores}分 (${hyperactivityImpulsivityResult})、對立反抗 ${oppositionalDefiantScores}分 (${oppositionalDefiantResult})`}
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
                <strong>原始開發者：</strong>James M. Swanson, Ph.D.
              </p>
              <p>
                <strong>中文翻譯：</strong>高淑芬醫師
              </p>
              <p>
                <strong>量表說明：</strong>SNAP-IV 26題版本是史瓦森、諾蘭與佩勒姆量表(SNAP)的簡化版本
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-orange-500 font-mono text-xs leading-relaxed">
                Swanson, J. M. (1992). 
                School-based assessments and interventions for ADD students. 
                <em>KC Publishing</em>. 
                <br/>Swanson, J. M., Sandman, C. A., Deutsch, C., & Baren, M. (1983). 
                Methylphenidate hydrochloride given with or before breakfast: I. Behavioral, cognitive, and electrophysiologic effects. 
                <em>Pediatrics</em>, <em>72</em>(1), 49-55.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * SNAP-IV 已獲得廣泛驗證，是評估兒童ADHD症狀的標準化工具。
                適用於6-18歲兒童青少年，由家長或教師填寫評估。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SNAP4Form; 