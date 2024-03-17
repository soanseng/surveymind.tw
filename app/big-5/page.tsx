"use client"
import { useEffect, useState } from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const questions = [
  "健談的",
  "傾向挑人毛病",
  "工作仔細",
  "情緒低落",
  "會創新、有新想法",
  "沉默寡言",
  "樂於助人且無私",
  "有點粗心",
  "放鬆的，善於處理壓力",
  "對很多事情都感到好奇",
  "充滿活力",
  "會開啟與他人的爭執",
  "可信賴的工作者",
  "緊張的",
  "聰明的、會深思的人",
  "有非常多熱情",
  "有寬容本質",
  "較沒有條理組織的",
  "擔心很多的",
   "具有生動想像力",
   "較安靜的",
   "通常容易信賴他人",
  "較懶散的",
  "情緒上穩定、不容易煩躁",
  "有創造力的",
  "有果決個性的",
  "對他人冷漠及疏離的",
  "會堅持到工作完成" ,
  "情緒不穩定的",
  "重視藝術及美學經驗",
  " 有時會害羞、退縮的",
  " 幾乎對所有人體貼且仁慈的",
  "做事有效率的",
  " 在緊張情境也能保持冷靜",
  "偏好例行性工作",
  " 喜歡外出、好社交的",
  "有時會粗魯對待他人",
  "會訂計畫並依計畫執行",
  "容易感到緊張的",
  "喜歡思考、常有想法",
  "對於藝術興趣很低",
  " 喜歡與他人合作",
  "易於分心的",
  "懂得藝術、音樂和文學"
];

type ScoreType = {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
};

const dimensionNames = {
  extraversion: "🌟 外向性 vs. 🌌 內向性",
  agreeableness: "💖 友善性 vs. 🏔 獨立性",
  conscientiousness: "📘 嚴謹性 vs. 🌬 靈活性",
  neuroticism: "🍃 神經質 vs. ☀️ 情緒穩定性",
  openness: "🌈 開放性 vs. 🏡 實用性",
};
const dimensionDescriptions = {
  extraversion: `
- 🌟 外向性: 您是生活的火花，以充滿活力的方式與社會和周遭的世界互動。您的社交性、活躍度、勇氣和正面情緒為您和周圍的人帶來光亮。
- 🌌 內向性: 您是深思熟慮的靈魂，享受獨立和內省的時刻。您的寧靜和深沉思考為您帶來智慧和內在的平靜。
`,
  agreeableness: `
- 💖 友善性: 您的心中充滿了對他人的關懷和愛。您以利他的態度和社群導向的心態面對世界，展現出溫柔、信任和謙遜的美德。
- 🏔 獨立性: 您展現出強烈的自我意識和獨立性。您的堅定和自信讓您能夠自主地走自己的路，追求個人目標。
`,
  conscientiousness: `
- 📘 嚴謹性: 您是計畫和組織的大師，擁有達成目標的堅定意志。您在行動前深思熟慮，以自律和責任感引導自己前進，為夢想鋪路。
- 🌬 靈活性: 您以開放和靈活的態度面對生活。您的適應性和即興能力讓您能夠自在地應對變化，享受當下。
`,
  neuroticism: `
- 🍃 神經質: 您擁有豐富的情感世界，即使面對挑戰也能保持情緒的平衡和恢復力。您的敏感是您同理和深度理解他人的橋樑。
-️ ☀情緒穩定性: 您展現出極高的情緒穩定性和恢復力。您的冷靜和樂觀態度幫助您輕鬆地面對生活的挑戰，保持平衡。
`,
  openness: `
- 🌈 開放性: 您的心胸開闊，對生活充滿好奇。您的創造力和想像力是探索未知、享受生活多樣性的關鍵。
- 🏡 實用性: 您著重於實際和實用性，以腳踏實地的方式與世界互動。您的專注和務實態度使您能夠有效地解決問題，實現具體成果。
`
};


const reverseScoredItems = [5, 20, 30, 1, 11, 26, 36, 7, 17, 22, 42, 8, 23, 33, 34, 40]

const questionsPerPage = 10;

const Page = () => {
  const {
    answers,
    currentPage,
    formSubmitted,
    handleSelectChange,
    handleSubmit,
    allQuestionsAnswered,
    nextPage,
    prevPage,
    score,
    setScore,
    validationMessage,
  } = useQuestionnaireForm<ScoreType>(questions.length, questionsPerPage);


    const dimensions = {
      extraversion: [0, 5, 10, 15, 20, 25, 30, 35],
      agreeableness: [1, 6, 11, 16, 21, 26, 31, 36, 41],
      conscientiousness: [2, 7, 12, 17, 22, 27, 32, 37, 42],
      neuroticism: [3, 8, 13, 18, 23, 28, 33, 38],
      openness: [4, 9, 14, 19, 24, 29, 34, 39, 40, 43],
    };

  useEffect(() => {
    if (formSubmitted) {

    let newScores = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0,
    };

    Object.entries(dimensions).forEach(([dimension, indexes]) => {
      indexes.forEach((index: number) => {
        newScores[dimension as keyof typeof newScores] += parseInt(
          answers[index] || "0", 10);
      });
    });

      setScore(newScores);
    }
  }, [formSubmitted, answers]);

  //calculate the range of questions to display
  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const currentPageQuestionsAnswered = currentQuestions.every((_, index) => {
    const questionIndex = startIndex + index;
    return answers[questionIndex] !== null && answers[questionIndex] !== '';
  });


  
  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  }

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>大五人格量表 (BFI)</title>
      </Head>
      <h1 className="text-2xl font-bold text-center my-8">
        大五人格量表 (BFI)
      </h1>
      <p className="mb-4 text-cneter"  >總共有44題，每題都有五個選項，請選擇最符合您的答案。</p>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form onSubmit={customHandleSubmit} className="bg-white p-6 rounded shadow">
        {currentQuestions.map((question, index) => {
          const questionIndex = startIndex + index;
          const isUnanswered =
            answers[startIndex + index] === null ||
            answers[startIndex + index] === "";
          return (
            <div key={index} className="mb-4">
              <label className="block mb-2 text-lg">
                {isUnanswered && <span className="text-red-500">*</span>}
                {questionIndex + 1}. 我認為我是(有)...{question}:
              </label>
              <div className="flex space-x-2">
                {["1", "2", "3", "4", "5"].map((value) => {
                  const adjustedValue = reverseScoredItems.includes(
                    questionIndex + 1
                  )
                    ? String(6 - parseInt(value))
                    : value;
                  const isChecked = answers[questionIndex] === adjustedValue;
                  return (
                    <label
                      key={value}
                      className={`form-radio-label ${
                        isChecked ? "text-red-500" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${startIndex + index}`}
                        value={value} // Keep the original value for correct form submission
                        checked={isChecked}
                        onChange={(e) =>
                          handleSelectChange(questionIndex, adjustedValue)
                        }
                        className="form-radio"
                      />
                      {value === "1" && "完全不同意"}
                      {value === "2" && "有點不同意"}
                      {value === "3" && "不太同意也不否認"}
                      {value === "4" && "有點同意"}
                      {value === "5" && "完全同意"}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
        <Pagination
          canGoBack={currentPage > 0}
          canGoForward={
            currentPageQuestionsAnswered &&
            currentPage < Math.ceil(questions.length / questionsPerPage) - 1
          }
          onBack={prevPage}
          onForward={nextPage}
          showSubmitButton={currentPage === Math.ceil(questions.length / questionsPerPage) - 1 && allQuestionsAnswered()}
          onSubmit={(e) => {
            e.preventDefault();
            customHandleSubmit(e);
          }}
        />

      </form>
      {/* score display logic here */}
      { score && formSubmitted && (

        <div className="mt-8 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-2xl mb-4">量表結果</h3>
            <p className="text-lg mb-4">在我們的旅程中，每個人都展現出獨特的性格特質，這些特質塑造了我們與世界互動的方式。讓我們一起探索您的五大人格特質，並以更溫暖和鼓舞人心的方式來看待它們：</p>
          {Object.entries(score).map(([dimension, scoreValue]) => {
            const dimensionIndexes = dimensions[dimension as keyof typeof dimensions];
            const maxScore = dimensionIndexes.length * 5; // Calculate max score based on number of questions per dimension
            const isHigher = scoreValue > maxScore / 2;
            const description = dimensionDescriptions[dimension as keyof typeof dimensionDescriptions];
            // Assuming descriptions are separated into higher and lower parts by a specific pattern
            const splitDescriptions = description.trim().split('\n- ');
            const resultDescription = isHigher ? splitDescriptions[0] : splitDescriptions[1];

            return(
            <div key={dimension} className="mb-4">
              <label htmlFor={dimension} className="block mb-2 text-lg">
                {dimensionNames[dimension as keyof typeof dimensionNames]}:
              </label>
              <p className="mb-2">{resultDescription.trim()}</p>
              <input
                id={dimension}
                type="range"
                min="0"
                max={String(maxScore)}
                value={String(scoreValue)}
                disabled
                className="w-full"
              />
            </div>
          );
          })}
          <p className="mb-4">每一種特質都有其獨特之處，無論您在哪一端，都代表著您獨特的個性和看待世界的方式。擁抱您的特質，讓它們引領您走向充滿豐富多彩經歷的人生旅程。🌈</p>
        </div>
      )}

    </div>
  );
};

export default Page;