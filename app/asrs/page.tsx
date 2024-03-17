"use client"
import React from 'react';
import Head from 'next/head';
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

  //calculate scores
  const calculateScores = () => {
    const partAScores = answers.slice(0, 9).reduce((acc, curr) => acc + Number(curr), 0);
    const partBScores = answers.slice(9, 18).reduce((acc, curr) => acc + Number(curr), 0);
    return { partAScores, partBScores };
  };

  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    setFormSubmitted(true);
    setOpen(true);
  }

  // Determine ADHD likelihood based on scores
  const getADHDLikelihood = (score: number) => {
    if (score >= 24) return "非常可能有ADHD 😲";
    if (score >= 17) return "很可能有ADHD 🤔";
    return "不太可能有ADHD 🙂";
  };

  const { partAScores, partBScores } = calculateScores();
  const resultA = getADHDLikelihood(partAScores);
  const resultB = getADHDLikelihood(partBScores);


  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8">
        ASRS 成人ADHD自我評估問卷
      </h1>
      <p className="text-center mb-4">
        請根據以下問題回答您過去六個月的感受與行為。
      </p>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form
        onSubmit={customHandleSubmit}
        className="bg-white p-6 rounded shadow"
      >
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
                {["0", "1", "2", "3", "4"].map((value) => (
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
                      {value === "0" && "從不"}
                      {value === "1" && "很少"}
                      {value === "2" && "有時"}
                      {value === "3" && "常常"}
                      {value === "4" && "非常頻繁"}
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
        <Content open={open} onOpenChange={setOpen}>
          {currentPage === Math.ceil(questions.length / 9) - 1 &&
            allQuestionsAnswered() && (
              <div className="text-center">
                <TriggerComponent asChild>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    開始測量
                  </button>
                </TriggerComponent>
              </div>
            )}
          <ContentComponent>
            <HeaderComponent>量表結果</HeaderComponent>
            <DescriptionComponent>
              <p>
                如果您在任一部分的得分指向「很可能有ADHD」或「非常可能有ADHD」，建議進行更完整的評估以了解損害和病史。
              </p>
              <p>
                即使得分顯示「不太可能有ADHD」，如果您仍有疑慮，也值得進一步探討，因為有時成年ADHD患者即使症狀輕微也可能遭受顯著損害。
              </p>
            </DescriptionComponent>
            <div className="mt-8 bg-gray-100 p-4 rounded">
              <ul>
                <li>
                  <p className="text-lg">
                    A部分（不專心）得分: {partAScores} - {resultA}
                  </p>
                </li>
                <li>
                  <p className="text-lg">
                    B部分（過動/衝動）得分: {partBScores} - {resultB}
                  </p>
                </li>
              </ul>
              <FooterComponent>
                <p>
                  如果您有任何問題，請聯絡我們的專業團隊，我們會為您提供協助。
                </p>
                <ShareButton
                  title="ASRS 成人ADHD自我評估問卷"
                  text={`A部分得分是:${partAScores} - ${resultA};  B部分得分是:${partBScores} - ${resultB}; `}
                  url="https://surveymind.tw"
                />
              </FooterComponent>
            </div>
          </ContentComponent>
        </Content>
      </form>
      <p className="text-center mt-8 text-sm">
        Kessler, R.C., AdlKessler, R.C., Adler, L., Ames, M., Demler, O.,
        Faraone, S., Hiripi, E., Howes, M.J., Jin, R., Secnik, K., Spencer, T.,
        Ustun, T.B., Walters, E.E. (2005). The World Health Organization Adult
        ADHD Self-Report Scale (ASRS). Psychological Medicine, 35(2), 245-256er,
        L., Ames, M., Demler, O., Faraone, S., Hiripi, E., Howes, M.J., Jin, R.,
        Secnik, K., Spencer, T., Ustun, T.B., Walters, E.E. (2005). The World
        Health Organization Adult ADHD Self-Report Scale (ASRS). Psychological
        Medicine, 35(2), 245-256
      </p>
    </div>
  );
};

export default ASRSForm;



