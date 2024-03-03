"use client"
import React from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';

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
{id: 10, question: "你有睡伴和室友嗎?"},
{id: 11, question: "假如有睡伴或室友，請你問他並繼續作答；過去一個月來，下列情形每星期約出現幾次？"},
{id: "11a", question: "大聲打鼾" },
{id: "11b", question: "入睡中出現一陣子停止呼吸現象"},
{id: "11c", question: "入睡中出現腳（包括腿部）抽動或顫動現象"},
{id: "11d", question: "夜間起來出現意識混亂或人時地分不清楚現象"},
{id: "11e", question: "其他入睡中的躁動與不安情形"}
]

const selectionA =  [{value: 0, description: "從未發生"}, {value: 1, description: "每週少於 1次"}, {value: 2, description: "每週1-2次"}, {value: 3, description: "每週3次以上"} ]
const selection8 =  [{value: 0, description: "完全沒有困擾"}, {value: 1, description: "只有很少困擾"}, {value: 2, description: "有些困擾"}, {value: 3, description: "有很大的困擾"} ]
const selection9 =  [{value: 0, description: "非常好"}, {value: 1, description: "好"}, {value: 2, description: "不好"}, {value: 3, description: "非常不好"} ]
const selection10 = [{value: 0, description:"沒有睡伴或室友"}, {value: 0, description: "睡伴同室友不同床"}, {value: 0, description: "睡伴或室友不同臥房"}, {value: 0, description: "睡伴或室友同床"}]

const questionsPerPage = 15


const PSQIndex: React.FC = () => {
  const {
    answers,
    currentPage,
    handleSelectChange,
    handleSubmit,
    nextPage,
    prevPage,
    validationMessage,
    allQuestionsAnswered,
    formSubmitted,
    setFormSubmitted,
  } = useQuestionnaireForm<string>(questions.length, questionsPerPage); 


  //calculate the index of the first and last question on the current page
  const firstQuestionIndex = currentPage * questionsPerPage;
  const questionsToShow = questions.slice(firstQuestionIndex, firstQuestionIndex + questionsPerPage);

  //should revise for text account
  const currentPageQuestionsAnswered = questionsToShow.every((_, index) => {
    const questionIndex = firstQuestionIndex + index;
    return answers[questionIndex] !== null && answers[questionIndex] !== '';
  });

  const canGoForward = currentPage < Math.ceil(questions.length / questionsPerPage  ) - 1;
  const canGoBack = currentPage > 0;

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

  return globalScore;
};
const calculateSleepEfficiency = (q1Answer: string, q3Answer: string, q4Answer: string): number => {
  // Parse the answers to get hours. This is a simplified example and might need adjustment based on your input format.
  const bedTime = parseInt(q1Answer, 10); // Assuming answers are like "22" for 10 PM
  const wakeTime = parseInt(q3Answer, 10); // Assuming answers are like "7" for 7 AM
  const hoursSlept = parseInt(q4Answer, 10); // Assuming answers are direct hours

  let hoursInBed;
  if (wakeTime > bedTime) {
    // Simple case: sleeping and waking up on the same day
    hoursInBed = wakeTime - bedTime;
  } else {
    // Handling the case of going to bed before midnight and waking up the next day
    hoursInBed = (24 - bedTime) + wakeTime;
  }

  const sleepEfficiency = (hoursSlept / hoursInBed) * 100;

  // Map sleep efficiency to the component 4 score
  if (sleepEfficiency > 85) return 0;
  if (sleepEfficiency >= 75) return 1;
  if (sleepEfficiency >= 65) return 2;
  return 3;
};


// Modify handleSubmit to use calculateScores
const customHandleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (answers.every(answer => answer !== null && answer !== '')) {
    const totalScore = calculateScores(); // Use the new function to calculate scores
  } else {
  }
  setFormSubmitted(true);
};


  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8">
           PSQI 匹茲堡睡眠品質量表</h1>
      <p className="text-center mb-4">
      下列問題是要調查您過去這一個月來的睡眠習慣，請您以平均狀況回答。
      </p>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form onSubmit={customHandleSubmit} className="bg-white p-6 rounded shadow">
        {questionsToShow.map((question, index) => {
          const isUnanswered =
            answers[firstQuestionIndex + index] === null ||
            answers[firstQuestionIndex + index] === "";

          const isTitle = question.id === 5 || question.id === 11;

          let selectionType;
          if (
            typeof question.id === "number" &&
            question.id >= 1 &&
            question.id <= 4
          ) {
            selectionType = "text";
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
          } else if (question.id === 10) {
            selectionType = "selection10";
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
              {selectionType === "text" ? (
                <input
                  type="text"
                  name={`question-${question.id}`}
                  value={answers[firstQuestionIndex + index] || ""}
                  onChange={(e) =>
                    handleSelectChange(
                      firstQuestionIndex + index,
                      e.target.value
                    )
                  }
                  className="form-input mt-1 block w-3/4 border-2 border-gray-300"
                  style={{ maxWidth: "600px" }}
                />
              ) : (
                <div className="flex space-x-2">
                  {(selectionType === "selectionA"
                    ? selectionA
                    : selectionType === "selection8"
                    ? selection8
                    : selectionType === "selection9"
                    ? selection9
                    : selection10
                  ).map((option) => (
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
          className="my-4"
        />
        {currentPage === Math.ceil(questions.length / 9) - 1 &&
          allQuestionsAnswered() && (
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
        </div>
      )}
    <p className='text-center mt-8 text-sm'>Buysse, DJ, Reynolds CF, Monk TH, Berman SR, Kupfer DJ: The Pittsburgh
Sleep Quality Index (PSQI): A new instrument for psychiatric research and
practice. Psychiatry Research 28:193-213, 1989 </p>
    </div>
  );
};

export default PSQIndex;



