"use client"
import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import ShareButton from '@/components/ShareButton';

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
    validationMessage: hookValidationMessage,
  } = useQuestionnaireForm<ScoreType>(questions.length, questionsPerPage);

  const [customValidationMessage, setCustomValidationMessage] = useState('');
  const [open, setOpen] = useState(false);


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

  const getUnansweredQuestionsOnCurrentPage = () => {
    const unanswered: number[] = [];
    currentQuestions.forEach((_, index) => {
      const questionIndex = startIndex + index;
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

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unansweredQuestions = getUnansweredQuestionsOnCurrentPage();
    
    if (unansweredQuestions.length > 0) {
      if (unansweredQuestions.length > 5) {
        setCustomValidationMessage(`本頁還有 ${unansweredQuestions.length} 題尚未作答，請完成所有題目後再提交。`);
      } else {
        setCustomValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
      }
      return;
    }
    
    setCustomValidationMessage('');
    handleSubmit(e);
    setOpen(true);
  }
  let dimensionSummaries: string[] = [];
  const dimensionResults = Object.entries(score || {}).map(([dimension, scoreValue]) => {
    const dimensionIndexes = dimensions[dimension as keyof typeof dimensions];
    const maxScore = dimensionIndexes.length * 5; // Calculate max score based on number of questions per dimension
    const isHigher = scoreValue > maxScore / 2;
    const description = dimensionDescriptions[dimension as keyof typeof dimensionDescriptions];
    // Assuming descriptions are separated into higher and lower parts by a specific pattern
    const splitDescriptions = description.trim().split('\n- ');
    const resultDescription = isHigher ? splitDescriptions[0] : splitDescriptions[1];
    const dimensionName = dimensionNames[dimension as keyof typeof dimensionNames].split(":")[0].trim(); // Extracting the name without emojis for the summary
    const summaryText = `${dimensionName}: ${resultDescription.trim().split(":")[1].trim()}`; // Extracting the description part without the emoji
    
    // Add the summary text for the current dimension to the array
    dimensionSummaries.push(summaryText);
  
    return (
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
  });
  
  // Join the dimension summaries to create a single string for sharing
  const resultsSummary = dimensionSummaries.join("\n ");
  
  

  const validationMessage = customValidationMessage || hookValidationMessage;

  // Overall progress calculation
  const totalAnswered = answers.filter(answer => answer !== null && answer !== '').length;
  const overallProgress = (totalAnswered / questions.length) * 100;

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["big-5"]} path="/big-5" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">大五人格量表 (BFI)</h1>
        
        <div className="bg-indigo-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            <strong>題目數量：</strong>總共有44題，每題都有五個選項，請選擇最符合您的答案。
          </p>
          <p className="mb-3">
            <strong>評估面向：</strong>大五人格理論評估五個主要人格特質：外向性、友善性、嚴謹性、神經質、開放性。
          </p>
          <p className="mb-3">
            在回答時，請以「我認為我是(有)...」作為開頭，並根據您的實際情況進行評估。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供參考，不能取代專業評估。人格特質沒有好壞之分，都是您獨特個性的表現。
          </p>
        </div>

        {/* Overall Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">完成進度</span>
            <span className="text-sm text-gray-600">
              {totalAnswered} / {questions.length} 題
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            第 {currentPage + 1} 頁，共 {Math.ceil(questions.length / questionsPerPage)} 頁
          </div>
        </div>

        <form onSubmit={customHandleSubmit} className="space-y-6">
          {currentQuestions.map((question, index) => {
            const questionIndex = startIndex + index;
            const isUnanswered = answers[questionIndex] === null || answers[questionIndex] === '';
            const isReversed = reverseScoredItems.includes(questionIndex + 1);
            
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
                  {questionIndex + 1}. 我認為我是(有)...{question}
                  {isReversed && <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">反向題</span>}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {["1", "2", "3", "4", "5"].map((value) => {
                    const adjustedValue = isReversed
                      ? String(6 - parseInt(value))
                      : value;
                    const isChecked = answers[questionIndex] === adjustedValue;
                    const labels = ["完全不同意", "有點不同意", "不太同意也不否認", "有點同意", "完全同意"];
                    
                    return (
                      <label 
                        key={value} 
                        className={`flex items-center cursor-pointer p-2 rounded hover:bg-indigo-50 transition-colors ${
                          isChecked ? 'bg-indigo-100 border-indigo-300' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={value}
                          checked={isChecked}
                          onChange={(e) => handleAnswerChange(questionIndex, adjustedValue)}
                          className="mr-2 h-4 w-4 text-indigo-600"
                        />
                        <span className="text-sm text-center flex-1">{labels[parseInt(value) - 1]}</span>
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
              disabled={currentPage <= 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage > 0 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              上一頁
            </button>

            {currentPage < Math.ceil(questions.length / questionsPerPage) - 1 ? (
              <button
                type="button"
                onClick={handleNextPage}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
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
        {/* Results Modal */}
        {open && score && formSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-indigo-800">大五人格評估結果</h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      在我們的旅程中，每個人都展現出獨特的性格特質，這些特質塑造了我們與世界互動的方式。讓我們一起探索您的五大人格特質：
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(score).map(([dimension, scoreValue]) => {
                      const dimensionIndexes = dimensions[dimension as keyof typeof dimensions];
                      const maxScore = dimensionIndexes.length * 5;
                      const isHigher = scoreValue > maxScore / 2;
                      const description = dimensionDescriptions[dimension as keyof typeof dimensionDescriptions];
                      const splitDescriptions = description.trim().split('\n- ');
                      const resultDescription = isHigher ? splitDescriptions[0] : splitDescriptions[1];
                      
                      return (
                        <div key={dimension} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                          <h4 className="text-lg font-semibold mb-2 text-indigo-700">
                            {dimensionNames[dimension as keyof typeof dimensionNames]}
                          </h4>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>得分：{scoreValue}</span>
                              <span>最高：{maxScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${(scoreValue / maxScore) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {resultDescription.trim()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">重要提醒：</h4>
                    <p className="text-sm text-yellow-700">
                      每一種特質都有其獨特之處，無論您在哪一端，都代表著您獨特的個性和看待世界的方式。擁抱您的特質，讓它們引領您走向充滿豐富多彩經歷的人生旅程。🌈
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <ShareButton 
                      title="大五人格測驗"
                      text={`我的大五人格結果：外向性 ${score.extraversion}、友善性 ${score.agreeableness}、嚴謹性 ${score.conscientiousness}、神經質 ${score.neuroticism}、開放性 ${score.openness}`}
                      url={typeof window !== 'undefined' ? window.location.href : ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Copyright and Citation Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與版權</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>原始開發者：</strong>John, O. P., Donahue, E. M., & Kentle, R. L.
              </p>
              <p>
                <strong>量表名稱：</strong>Big Five Inventory (BFI)
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-indigo-500 font-mono text-xs leading-relaxed">
                John, O. P., Donahue, E. M., & Kentle, R. L. (1991). 
                The Big Five Inventory--Versions 4a and 54. 
                <em>Berkeley, CA: University of California, Berkeley, Institute of Personality and Social Research</em>.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 大五人格量表是廣泛使用的人格評估工具，測量五個主要人格維度。
                44題版本具有良好的信效度，適用於各種人群和文化背景。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;