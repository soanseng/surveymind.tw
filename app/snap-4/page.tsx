"use client"
import React from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
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
    validationMessage,
    allQuestionsAnswered,
    formSubmitted,
    setFormSubmitted,
  } = useQuestionnaireForm<string>(questions.length, questionsPerPage);

  const firstQuestionIndex = currentPage * questionsPerPage;
  const lastQuestionIndex = Math.min(firstQuestionIndex + questionsPerPage, questions.length);
  const questionsToShow = questions.slice(firstQuestionIndex, lastQuestionIndex);

  const currentPageQuestionsAnswered = questionsToShow.every((_, index) => {
    const questionIndex = firstQuestionIndex + index;
    return answers[questionIndex] !== null && answers[questionIndex] !== '';
  });

  const canGoForward = currentPage < Math.ceil(questions.length / questionsPerPage) - 1;
  const canGoBack = currentPage > 0;

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
    handleSubmit(e);
    setFormSubmitted(true);
    setOpen(true);
  }

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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8">
        SNAP-IV 兒童ADHD自我評估問卷
      </h1>
      <p className='text-center mb-4 tesxt-sm'>      設計者：史瓦森(James M. Swanson, Ph.D)；翻譯：高淑芬
      </p>
      <p className="text-center mb-4">
        請根據以下問題回答您過去六個月觀察到的孩子行為。
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
            answers[questionIndex] === null || answers[questionIndex] === "";
          return (
            <div className="mb-4" key={index}>
              <label className="block mb-2 text-lg">
                {isUnanswered && <span className="text-red-500">*</span>}
                {questionIndex + 1}. {question}:
              </label>
              <div className="flex space-x-2">
                {["0", "1", "2", "3"].map((value) => (
                  <label key={value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={value}
                      checked={answers[questionIndex] === value}
                      onChange={(e) =>
                        handleSelectChange(questionIndex, e.target.value)
                      }
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">
                      {value === "0" && "完全沒有"}
                      {value === "1" && "有一點點"}
                      {value === "2" && "還算不少"}
                      {value === "3" && "非常的多"}
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
          {currentPage === Math.ceil(questions.length / questionsPerPage) - 1 &&
            allQuestionsAnswered() && (
              <div className="text-center">
                <TriggerComponent asChild>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    提交評估
                  </button>
                </TriggerComponent>
              </div>
            )}
          <ContentComponent>
            <HeaderComponent>評估結果</HeaderComponent>
            <DescriptionComponent>
              <p>根據您的回答，以下是孩子的症狀評估結果：</p>
            </DescriptionComponent>
            <div className="mt-8 bg-gray-100 p-4 rounded">
              <ul>
                <li>
                  <p className="text-lg">
                    注意力不足部分得分: {inattentionScores} - {inattentionResult}
                  </p>
                </li>
                <li>
                  <p className="text-lg">
                    過動/衝動部分得分:  {hyperactivityImpulsivityScores} -  {hyperactivityImpulsivityResult}
                  </p>
                </li>
                <li>
                  <p className="text-lg">
                    對立反抗的症狀部分得分: {oppositionalDefiantScores} - {oppositionalDefiantResult}
                  </p>
                </li>
              </ul>
              <FooterComponent>
                <p>
                  如果您對結果有疑問或孩子的症狀在中度到重度範圍內，建議尋求專業醫生進一步評估。
                </p>
              </FooterComponent>
            </div>
          </ContentComponent>
        </Content>
      </form>
      <Card className="border border-gray-500 w-2/3 mx-auto">
        <CardContent>
          <CardDescription className="text-sm text-gray-500 ">
            The SNAP-IV 26-item scale is an abbreviated version of the Swanson,
            Nolan, and Pelham(SNAP) Questionnaire (Swanson, 1992; Swanson et
            al., 1983). Items from the DSM-IV criteria for
            attention-deficit/hyperactivity disorder (ADHD) are included for the
            two subsets of symptoms: Inattention (items 1–9) and
            Hyperactivity/Impulsivity (items 10– 18). Also, items from the
            DSM-IV criteria for oppositional defiant disorder (ODD) are included
            (items 19–26) because ODD is often present in children with ADHD.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default SNAP4Form; 