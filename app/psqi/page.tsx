"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { Input } from '@/components/ui/input';

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
    validationMessage,
    formSubmitted,
    setFormSubmitted,
  } = useQuestionnaireForm<string>(questions.length, questionsPerPage); 

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

  const canGoForward = currentPage < totalPages - 1 && currentPageQuestionsAnswered
  const canGoBack = currentPage > 0;

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


// Modify handleSubmit to use calculateScores
const customHandleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (allQuestionsAnswered()) {
    const scores = calculateScores(); // Use the new function to calculate scores
    console.log("Total score:", scores);
    setFormSubmitted(true)
    setScores(scores)
  } else {
    console.log("please answer all questions");
  }
  setFormSubmitted(true);
};


  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8">
        PSQI 匹茲堡睡眠品質量表
      </h1>
      <p className="text-center mb-4">
        下列問題是要調查您過去這一個月來的睡眠習慣，請您以平均狀況回答。
      </p>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form
        onSubmit={customHandleSubmit}
        className="bg-white p-6 rounded shadow"
      >
        {questionsToShow.map((question, index) => {
          const isUnanswered =
            answers[firstQuestionIndex + index] === null ||
            answers[firstQuestionIndex + index] === "";

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
              <div className="mb-4" key={index}>
                <label className="block mb-2 text-lg font-bold">
                  {question.id}. {question.question}
                </label>
              </div>
            );
          }

          return (
            <div className="mb-4" key={index}>
              <label className="block mb-2 text-lg">
                {isUnanswered && <span className="text-red-500">*</span>}
                {question.id}. {question.question}:
              </label>
              {selectionType === "time" ? (
                <Input
                  type="time"
                  name={`question-${question.id}`}
                  value={answers[firstQuestionIndex + index] || ""}
                  onChange={(e) =>
                    handleSelectChange(
                      firstQuestionIndex + index,
                      e.target.value
                    )
                  }
                  style={{ maxWidth: "300px" }}
                  required={selectionType === "time"}
                />
              ) : (
                <div className="flex space-x-2">
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
                      className="inline-flex items-center"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value.toString()}
                        checked={
                          answers[firstQuestionIndex + index] ===
                          option.value.toString()
                        }
                        onChange={(e) =>
                          handleSelectChange(
                            firstQuestionIndex + index,
                            e.target.value
                          )
                        }
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">{option.description}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <Pagination
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={prevPage}
          onForward={nextPage}
        />
        {currentPage === totalPages - 1 && allQuestionsAnswered() && (
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              開始測量
            </button>
          </div>
        )}
      </form>
      {formSubmitted && (
        <div>
          <h2 className="text-2xl font-bold text-center my-8">
            您的睡眠品質分數是:
          </h2>
          <div className="text-center">
            <p>
              主觀睡眠品質: {scores.component1Score}{" "}
              <span>(分數越低代表睡眠品質越好)</span>
            </p>
            <p>
              入睡時間（睡眠潛伏期）: {scores.component2Score}{" "}
              <span>(分數越低代表入睡時間越短)</span>
            </p>
            <p>
              睡眠持續時間: {scores.component3Score}{" "}
              <span>(分數越低代表睡眠時間越長)</span>
            </p>
            <p>
              睡眠效率: {scores.component4Score}{" "}
              <span>(分數越低代表睡眠效率越高)</span>
            </p>
            <p>
              睡眠障礙: {scores.component5Score}{" "}
              <span>(分數越低代表睡眠障礙越少)</span>
            </p>
            <p>
              使用睡眠藥物: {scores.component6Score}{" "}
              <span>(分數越低代表較少依賴睡眠藥物)</span>
            </p>
            <p>
              日間功能障礙: {scores.component7Score}{" "}
              <span>(分數越低代表日間功能障礙越少)</span>
            </p>
          </div>
          <div className="text-center mt-4 border-4 border-blue-500 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              總分數: {scores.globalScore}
            </h3>
            {scores.globalScore <= 5 && (
              <p>
                您的睡眠品質很好。這表示您的睡眠狀況在過去一個月內是相當良好的。
              </p>
            )}
            {scores.globalScore > 5 && scores.globalScore <= 10 && (
              <p>
                您的睡眠品質一般。這表示您的睡眠狀況在過去一個月內是普通，可能有改善的空間。
              </p>
            )}
            {scores.globalScore > 10 && (
              <p>
                您可能需要改善睡眠品質。這表示您的睡眠狀況在過去一個月內可能不是很理想，建議尋求專業建議。
              </p>
            )}
          </div>
        </div>
      )}
      <p className="text-center mt-8 text-sm">
        Buysse, DJ, Reynolds CF, Monk TH, Berman SR, Kupfer DJ: The Pittsburgh
        Sleep Quality Index (PSQI): A new instrument for psychiatric research
        and practice. Psychiatry Research 28:193-213, 1989{" "}
      </p>
    </div>
  );
};

export default PSQIndex;



