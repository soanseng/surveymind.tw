"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { Input } from '@/components/ui/input';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

const questions = [
  {id: 1, question: "過去一個月來，您晚上通常幾點上床睡覺？"},
  {id: 2, question: "過去一個月來，您在上床後，通常躺多久才能入睡？"},
  {id: 3, question: "過去一個月來，您早上通常幾點起床？"},
  {id: 4, question: "過去一個月來，您每天晚上真正睡著的時間約多少(這可能和您躺在床上所花的時間不同)?"},
  {id: 5, question: "過去一個月來，您的睡眠有多少次受到下列干擾?"},
  {id: "5a", question: "無法在 30 分鐘入睡"},
  {id: "5b", question: "半夜或清晨醒來"},
  {id: "5c", question: "需要起床上廁所"},
  {id: "5d", question: "呼吸不順暢"},
  {id: "5e", question: "咳嗽或大聲打鼾"},
  {id: "5f", question: "感覺很冷"},
  {id: "5g", question: "感覺很熱"},
  {id: "5h", question: "作惡夢"},
  {id: "5i", question: "疼痛"},
  {id: "5j", question: "其他情況請說明:"},
{id: 6, question: "過去一個月來，您有多少次需要藉助藥物(醫師處方或成藥)來幫助睡眠?"},
{id: 7, question:  "過去一個月來，當您在開車、用餐、從事日常社交活動時，有多少次覺得難以保持清醒狀態?"},
{id: 8, question: "過去一個月來，要打起精神來完成您應該做的事情對您 有多少困擾?"},
{id: 9, question: "過去一個月來，您對您自己的睡眠品質整體評價如何?"},
]

const selectionA =  [{value: 0, description: "從未發生"}, {value: 1, description: "每週少於 1次"}, {value: 2, description: "每週1-2次"}, {value: 3, description: "每週3次以上"} ]
const selection2 =  [{value: 0, description: "小於15分鐘"}, {value: 1, description: "16-30分鐘"}, {value: 2, description: "31-60分鐘"}, {value: 3, description: "大於60分鐘"} ]
const selection4 =  [{value: 0, description: "大於7小時"}, {value: 1, description: "6-7小時"}, {value: 2, description: "5-6小時"}, {value: 3, description: "少於5小時"} ]
const selection8 =  [{value: 0, description: "完全沒有困擾"}, {value: 1, description: "只有很少困擾"}, {value: 2, description: "有些困擾"}, {value: 3, description: "有很大的困擾"} ]
const selection9 =  [{value: 0, description: "非常好"}, {value: 1, description: "好"}, {value: 2, description: "不好"}, {value: 3, description: "非常不好"} ]



  const questionsPerPage = 10;

const PSQIndex: React.FC = () => {
  const {
    answers,
    currentPage,
    handleSelectChange,
    handleSubmit,
    nextPage,
    prevPage,
    validationMessage: hookValidationMessage,
    formSubmitted,
    setFormSubmitted,
  } = useQuestionnaireForm<string>(questions.length, questionsPerPage);

  const [customValidationMessage, setCustomValidationMessage] = useState(''); 

  const allQuestionsAnswered = () => {
    return questions.every((question, index) => {
      // Skip check for questions with IDs 5 and 10
      if (question.id === 5 ) {
        return true;
      }
      const answer = answers[index];
      return answer !== null && answer !== '';
    });
  };

  const adjustedQuestionCount = questions.length -1; // Assuming questions 5 is the ones without answers
  const totalPages = Math.ceil(adjustedQuestionCount / questionsPerPage);
  
  //calculate the index of the first and last question on the current page
  const firstQuestionIndex = currentPage * questionsPerPage;
  const questionsToShow = questions.slice(firstQuestionIndex, firstQuestionIndex + questionsPerPage);

  const currentPageQuestionsAnswered = questionsToShow.every((question, index) => {

      if (question.id === 5 ) {
        return true;
      }
    const questionIndex = firstQuestionIndex + index;
    return answers[questionIndex] !== null && answers[questionIndex] !== '';
  });

  const canGoForward = currentPage < totalPages - 1;
  const canGoBack = currentPage > 0;

  const getUnansweredQuestionsOnCurrentPage = () => {
    const unanswered: number[] = [];
    questionsToShow.forEach((question, index) => {
      if (question.id === 5) return; // Skip the section title
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
        setCustomValidationMessage(`請完成未作答的題目後再繼續下一頁。`);
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

  interface ScoreResults {
    component1Score: number;
    component2Score: number;
    component3Score: number;
    component4Score: number;
    component5Score: number;
    component6Score: number;
    component7Score: number;
    globalScore: number;
  }
  const [scores, setScores] = useState<ScoreResults>({
    component1Score: 0,
    component2Score: 0,
    component3Score: 0,
    component4Score: 0,
    component5Score: 0,
    component6Score: 0,
    component7Score: 0,
    globalScore: 0,
  });

// Add this function inside the useQuestionnaireForm hook
const calculateScores = () => {
  // Component 1: Subjective sleep quality
  const component1Score = answers[8] ? parseInt(answers[8], 10) : 0; // Assuming answers are stored as strings and question 9's answer is at index 8

  // Component 2: Sleep latency
  const q2Subscore = answers[1] ? parseInt(answers[1], 10) : 0; // Question 2's answer
  const q5aSubscore = answers[5] ? parseInt(answers[5], 10) : 0; // Assuming question 5a's answer is stored at index 5
  const component2Score = Math.min(Math.floor((q2Subscore + q5aSubscore) / 2), 3);

  // Component 3: Sleep duration
  const component3Score = answers[3] ? parseInt(answers[3], 10) : 0; // Question 4's answer

  // Component 4: Sleep efficiency
  // This requires calculation from questions 1, 3, and 4. You'll need to parse these answers and calculate sleep efficiency.
  // Assuming you have a function to calculate sleep efficiency based on these answers
  const component4Score = calculateSleepEfficiency(answers[0], answers[2], answers[3]);

  // Component 5: Sleep disturbance
  // Sum scores from questions 5b to 5j
  const disturbanceScores = answers.slice(6, 15).map(answer => parseInt(answer, 10) || 0); // Assuming these answers are stored starting from index 6
  const component5Score = Math.min(Math.floor(disturbanceScores.reduce((acc, curr) => acc + curr, 0) / 3), 3);

  // Component 6: Use of sleep medication
  const component6Score = answers[15] ? parseInt(answers[15], 10) : 0; // Assuming question 6's answer is stored at index 15

  // Component 7: Daytime dysfunction
  const q7Subscore = answers[16] ? parseInt(answers[16], 10) : 0; // Question 7's answer
  const q8Subscore = answers[17] ? parseInt(answers[17], 10) : 0; // Question 8's answer
  const component7Score = Math.min(Math.floor((q7Subscore + q8Subscore) / 2), 3);

  // Calculate global score
  const globalScore = component1Score + component2Score + component3Score + component4Score + component5Score + component6Score + component7Score;

  return {
    component1Score,
    component2Score,
    component3Score,
    component4Score,
    component5Score,
    component6Score,
    component7Score,
    globalScore,
  } 
};
const calculateSleepEfficiency = (q1Answer: string, q3Answer: string, q4Answer: string): number => {
  // Convert time inputs (HH:MM AM/PM) to 24-hour format for easier calculation
  const convertTo24HourFormat = (time: string) => {
    let [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes; // Convert hours to minutes
  };

  const bedTimeInMinutes = convertTo24HourFormat(q1Answer);
  const wakeTimeInMinutes = convertTo24HourFormat(q3Answer);
  const hoursSlept = parseInt(q4Answer, 10); // Assuming answers are direct hours

  // Calculate total minutes in bed
  let totalMinutesInBed = wakeTimeInMinutes - bedTimeInMinutes;
  if (totalMinutesInBed < 0) {
    // Handles the case where the person goes to bed before midnight and wakes up after midnight
    totalMinutesInBed += 24 * 60;
  }

  const sleepEfficiency = (hoursSlept * 60 / totalMinutesInBed) * 100; // Convert hoursSlept to minutes for calculation

  // Map sleep efficiency to the component 4 score
  if (sleepEfficiency > 85) return 0;
  if (sleepEfficiency >= 75) return 1;
  if (sleepEfficiency >= 65) return 2;
  return 3;
};


  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

// Modify handleSubmit to use calculateScores
const customHandleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const unansweredQuestions = getUnansweredQuestionsOnCurrentPage();
  
  if (unansweredQuestions.length > 0) {
    if (unansweredQuestions.length > 5) {
      setCustomValidationMessage(`本頁還有 ${unansweredQuestions.length} 題尚未作答，請完成本頁所有題目後再提交。`);
    } else {
      setCustomValidationMessage(`請完成未作答的題目後再提交。`);
    }
    return;
  }
  
  if (allQuestionsAnswered()) {
    const scores = calculateScores(); // Use the new function to calculate scores
    console.log("Total score:", scores);
    setCustomValidationMessage('');
    setFormSubmitted(true);
    setScores(scores);
    setOpen(true);
  } else {
    setCustomValidationMessage('請完成所有題目後再提交。');
  }
};


  const validationMessage = customValidationMessage || hookValidationMessage;

  // Overall progress calculation
  const totalAnswered = answers.filter((answer, index) => {
    const question = questions[index];
    if (question && question.id === 5) return true; // Skip section titles
    return answer !== null && answer !== '';
  }).length;
  const totalRealQuestions = questions.filter(q => q.id !== 5).length;
  const overallProgress = (totalAnswered / totalRealQuestions) * 100;

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>PSQI 匹茲堡睡眠品質量表 - 文心樂丞診所</title>
        <meta name="description" content="PSQI匹茲堡睡眠品質量表，用於評估睡眠品質和睡眠障礙" />
      </Head>
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">PSQI 匹茲堡睡眠品質量表</h1>
        
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            <strong>調查期間：</strong>下列問題是要調查您過去這一個月來的睡眠習慣。
          </p>
          <p className="mb-3">
            <strong>回答方式：</strong>請您以平均狀況回答，每個問題都請仔細作答。
          </p>
          <p className="mb-3">
            PSQI 是國際廣泛使用的睡眠品質評估工具，包含七個面向的睡眠評估。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有睡眠問題請諮詢睡眠專科醫師。
          </p>
        </div>

        {/* Overall Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">完成進度</span>
            <span className="text-sm text-gray-600">
              {totalAnswered} / {totalRealQuestions} 題
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            第 {currentPage + 1} 頁，共 {totalPages} 頁
          </div>
        </div>

        <form onSubmit={customHandleSubmit} className="space-y-6">
          {questionsToShow.map((question, index) => {
            const questionIndex = firstQuestionIndex + index;
            const isUnanswered = answers[questionIndex] === null || answers[questionIndex] === '';
            const isTitle = question.id === 5 || question.id === 11;

            let selectionType;
            if (
              (typeof question.id === "number" && question.id === 1) ||
              question.id === 3
            ) {
              selectionType = "time";
            } else if (question.id === 2) {
              selectionType = "selection2";
            } else if (question.id === 4) {
              selectionType = "selection4";
            } else if (
              (question.id >= "5a" && question.id <= "5j") ||
              question.id === 6 ||
              question.id === 7 ||
              (question.id >= "11a" && question.id <= "11e")
            ) {
              selectionType = "selectionA";
            } else if (question.id === 8) {
              selectionType = "selection8";
            } else if (question.id === 9) {
              selectionType = "selection9";
            }

            // Render title without selection options for questions 5 and 11
            if (isTitle) {
              return (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-bold text-purple-800 bg-purple-100 p-4 rounded-lg">
                    {question.id}. {question.question}
                  </h3>
                </div>
              );
            }

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
                  {question.id}. {question.question}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                </h3>
                
                {selectionType === "time" ? (
                  <Input
                    type="time"
                    name={`question-${question.id}`}
                    value={answers[questionIndex] || ""}
                    onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                    className="max-w-xs"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(selectionType === "selectionA"
                      ? selectionA
                      : selectionType === "selection8"
                      ? selection8
                      : selectionType === "selection9"
                      ? selection9
                      : selectionType === "selection4"
                      ? selection4
                      : selectionType === "selection2"
                      ? selection2
                      : []
                    ).map((option: { value: any; description: string }) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer p-2 rounded hover:bg-purple-50"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value.toString()}
                          checked={answers[questionIndex] === option.value.toString()}
                          onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                          className="mr-2 h-4 w-4 text-purple-600"
                        />
                        <span className="text-sm">{option.description}</span>
                      </label>
                    ))}
                  </div>
                )}
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
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
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
              <TitleComponent>PSQI 睡眠品質評估結果</TitleComponent>
              <DescriptionComponent>
                您的睡眠品質評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            {formSubmitted && (
              <div className="py-4">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg border">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      總分：{scores.globalScore} / 21
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      {scores.globalScore <= 5 && '睡眠品質很好'}
                      {scores.globalScore > 5 && scores.globalScore <= 10 && '睡眠品質一般'}
                      {scores.globalScore > 10 && '需要改善睡眠品質'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">各面向詳細分數：</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>主觀睡眠品質:</span>
                        <span className="font-medium">{scores.component1Score}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>入睡時間:</span>
                        <span className="font-medium">{scores.component2Score}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>睡眠持續時間:</span>
                        <span className="font-medium">{scores.component3Score}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>睡眠效率:</span>
                        <span className="font-medium">{scores.component4Score}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>睡眠障礙:</span>
                        <span className="font-medium">{scores.component5Score}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>使用睡眠藥物:</span>
                        <span className="font-medium">{scores.component6Score}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>日間功能障礙:</span>
                        <span className="font-medium">{scores.component7Score}/3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">結果解釋：</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {scores.globalScore <= 5 && '您的睡眠品質很好。這表示您的睡眠狀況在過去一個月內是相當良好的。請繼續保持良好的睡眠習慣。'}
                      {scores.globalScore > 5 && scores.globalScore <= 10 && '您的睡眠品質一般。這表示您的睡眠狀況在過去一個月內是普通，可能有改善的空間。建議關注睡眠衛生和放鬆技巧。'}
                      {scores.globalScore > 10 && '您可能需要改善睡眠品質。這表示您的睡眠狀況在過去一個月內可能不是很理想，建議尋求睡眠專科醫師的專業建議。'}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">評分標準：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 0-5分：睡眠品質很好</li>
                      <li>• 6-10分：睡眠品質一般</li>
                      <li>• 11-21分：睡眠品質差，建議尋求專業協助</li>
                      <li>• 分數越低表示睡眠品質越好</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <ShareButton 
                      title="PSQI 匹茲堡睡眠品質量表"
                      text={`我的睡眠品質分數是 ${scores.globalScore}分，結果為：${scores.globalScore <= 5 ? '睡眠品質很好' : scores.globalScore <= 10 ? '睡眠品質一般' : '需要改善睡眠品質'}`}
                      url={typeof window !== 'undefined' ? window.location.href : ''}
                    />
                  </div>
                </div>
              </div>
            )}

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
                <strong>原始開發者：</strong>Daniel J. Buysse, MD, Charles F. Reynolds III, MD, Timothy H. Monk, PhD 等學者
              </p>
              <p>
                <strong>開發單位：</strong>匹茲堡大學醫學院精神科
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-purple-500 font-mono text-xs leading-relaxed">
                Buysse, D. J., Reynolds III, C. F., Monk, T. H., Berman, S. R., & Kupfer, D. J. (1989). 
                The Pittsburgh Sleep Quality Index: a new instrument for psychiatric practice and research. 
                <em>Psychiatry Research</em>, <em>28</em>(2), 193-213. 
                https://doi.org/10.1016/0165-1781(89)90047-4
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * PSQI 是國際廣泛使用的睡眠品質評估工具，具有良好的信效度。
                量表範圍0-21分，分數越高表示睡眠品質越差。臨床上以&gt;5分作為睡眠品質差的切點。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSQIndex;



