'use client'
import React from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';

const questions = [
"我常常覺得想哭",
"我覺得心情不好",
"我覺得比以前容易發脾氣",
"我睡不好",
"我覺得不想吃東西",
"我覺得胸口悶悶的(心肝頭或胸坎綁綁的) ",
"我覺得不輕鬆、不舒服(不爽快)",
"我覺得身體疲勞虛弱、無力(身體很虛、沒力氣、元氣及體力) ",
" 我覺得很煩",
"我覺得記憶力不好",
"我覺得做事時無法專心 ",
"我覺得想事情或做事時，比平常要緩慢",
"我覺得比以前沒信心",
"我覺得比較會往壞處想",
"我覺得想不開、甚至想死 ",
"我覺得對什麼事都失去興趣",
"我覺得身體不舒服(如頭痛、頭暈、心悸、肚子不舒服…等) ",
"我覺得自己很沒用"
]

const questionsPerPage = 9

const TdqForm: React.FC = () => {
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
  const lastQuestionIndex = Math.min(firstQuestionIndex + 9, questions.length);
  const questionsToShow = questions.slice(firstQuestionIndex, lastQuestionIndex);

  const currentPageQuestionsAnswered = questionsToShow.every((_, index) => {
    const questionIndex = firstQuestionIndex + index;
    return answers[questionIndex] !== null && answers[questionIndex] !== '';
  });

  const canGoForward = currentPage < Math.ceil(questions.length / questionsPerPage  ) - 1;
  const canGoBack = currentPage > 0;



// Determine depression likelihood based on scores and provide friendly advice
const getTdqLikelihood = (score: number) => {
    let message = "";
    if (score >= 29) {
      message = "🚨 29 分以上：看來你最近真的很辛苦。記得，心情不好就像是心靈感冒，需要適當的照顧和治療。找一位可信賴的醫生聊聊，讓專業的溫暖陪伴你走出陰霾，你並不孤單。";
    } else if (score >= 19) {
      message = "🌟 19~28 分：似乎你近期遇到了不少挑戰，讓笑容有點藏不住憂愁。這時候，尋求專業的協助，可以幫你找回失去的笑容。一起勇敢面對，明天會更好！";
    } else if (score >= 15) {
      message = "🍃 15~18 分：感覺最近的壓力讓你有點喘不過氣來？記得，向朋友開放心扉，分享你的負擔，可以讓心情變得更輕鬆。你不必獨自承擔一切，我們一起分擔。";
    } else if (score >= 9) {
      message = "🌻 9~14 分：或許最近有些小波動讓你感到不安？給自己一點空間和時間，關注自己的感受，找到情緒的根源。小步伐前進，也是進步哦。";
    } else {
      message = "💖 8 分以下：你的情緒管理做得很棒！繼續保持這份平衡和積極，你的正能量也許能照亮周圍的人。記得，幸福是一天天累積的。";
    }
    return message;
  };


  //calculate scores
  const calculateScores = () => {
    const totalScores = answers.reduce((acc, curr) => acc + Number(curr), 0);
    return { totalScores, message: getTdqLikelihood(totalScores) };
  };

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    setFormSubmitted(true);
  }

  const {totalScores, message} = calculateScores();



  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8">
      台灣人憂鬱症量表       
      </h1>
      <p className="text-center mb-4">
      請您根據最近一星期以來，身體與情緒的真正感覺，勾選最符合的一項！ 
      </p>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form onSubmit={customHandleSubmit} className="bg-white p-6 rounded shadow">
        {questionsToShow.map((question, index) => {
          const questionIndex = firstQuestionIndex + index;
          const isUnanswered =
            answers[firstQuestionIndex + index] === null ||
            answers[firstQuestionIndex + index] === "";
          return (
            <div className="mb-4" key={index}>
              <label className="block mb-2 text-lg">
                {isUnanswered && <span className="text-red-500">*</span>}
                {questionIndex + 1}. {question}:
              </label>
              <div className="flex space-x-2">
                {["0", "1", "2", "3" ].map((value) => (
                  <label key={value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`question-${firstQuestionIndex + index}`}
                      value={value}
                      checked={answers[firstQuestionIndex + index] === value}
                      onChange={(e) =>
                        handleSelectChange(
                          firstQuestionIndex + index,
                          e.target.value
                        )
                      }
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">
                      {value === "0" && "沒有或極少\n(1天以下) "}
                      {value === "1" && "有時\n(1-2天)"}
                      {value === "2" && "時常\n(3-4天)"}
                      {value === "3" && "常常或總是\n(5-7天)"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
        <Pagination
          canGoBack={canGoBack}
          canGoForward={currentPageQuestionsAnswered && canGoForward}
          onBack={prevPage}
          onForward={nextPage}
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
      {allQuestionsAnswered() && formSubmitted && (
        <div className="mt-8 bg-gray-100 p-4 rounded">
            <p className="text-lg font-bold mb-4">測量結果</p>
            <p>你的憂鬱指數是：{totalScores} 分</p>
            <p className="text-lg">{message}</p>
        </div>
      )}
    <p className='text-center mt-8 text-sm'>本量表引用自:行政院國家科學委員會93年11月17日台會綜三字第0930052121號函,台灣人憂鬱問卷之發展係由李昱、楊明仁、賴德仁、邱念陸、周騰達等五人進行;經董氏基金會進行大規模實測,建立具信效度之常模分數,由宋維村醫師、黃國彥教授、胡維顧問醫師、張本聖副教授審訂。  </p>  
    </div>
  );
};

export default TdqForm;


