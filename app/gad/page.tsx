"use client"
import React from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import { Trigger } from '@radix-ui/react-menubar';
import ShareButton from '@/components/ShareButton';


  const questions = [
    "覺得緊張、焦慮、心情不定",
    "覺得無法停止或控制焦慮",
    "對很多不同的事感到擔憂",
    "難以放鬆",
    "焦躁不安到難以安靜坐著",
    "容易心煩或易怒",
    "感到害怕，就像發生可怕的事情"
  ]

const GAD7Form = () => {

  const {
    answers,
    formSubmitted,
    handleSelectChange,
    handleSubmit,
    score,
    validationMessage,
  } = useQuestionnaireForm(questions.length);


  const getSeverity = (score: number | null) => {
    if (score == null) return "請先提供分數";
    if (score <= 4) return '你沒有任何焦慮的狀況，或僅有一些輕微焦慮';
    if (score <= 9) return '輕度，需持續監測';
    if (score <= 14) return '中度，需要進一步的評估，如需要可進行治療 ';
    return '嚴重，需要立即治療';
  };

  const severity = getSeverity(score);
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();


  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    setOpen(true);
  }
  return (
    <div>
      <Head>
        <title>GAD-7 廣泛性焦慮量表</title>
      </Head>
      <h1 className="text-2xl font-bold text-center my-8">
        廣泛性焦慮量表
      </h1>
      <p className="text-center mb-4">在過去兩個星期，以下症狀會多常困擾你?</p>
      {validationMessage && (
        <p className="text-red-500 mt-4">{validationMessage}</p>
      )}
    <form onSubmit={customHandleSubmit} className="bg-white p-6 rounded shadow">
      {questions.map((question, qindex) => {
        const isUnanswered = answers[qindex] === null || answers[qindex] === "";
      return (
        <div key={qindex} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
              {formSubmitted && isUnanswered && <span className="text-red-500">*</span>}
              {qindex + 1}. {question}
          </label>
          <div className="flex space-x-2">
            {["0", "1", "2", "3"].map((value) => (
              <label key={value} className="form-radio-label">
                <input
                  type="radio"
                  name={`question-${qindex}`}
                  value={value}
                  checked={answers[qindex] === value}
                  onChange={(e) => handleSelectChange(qindex, e.target.value)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                  {value === "0" && "完全沒有"}
                  {value === "1" && "幾天"}
                  {value === "2" && "超過一半的天數"}
                  {value === "3" && "幾乎每天"}
              </label>
            ))}
          </div>
        </div>
      );
            })}

      <Content open={open} onOpenChange={setOpen}>
        <TriggerComponent asChild>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
      開始測量
      </button>
        </TriggerComponent>

      <ContentComponent>
        <HeaderComponent>
          量表結果
        </HeaderComponent>
        <DescriptionComponent>
      <p className="text-gray-700 mt-4">GAD-7的診斷效度良好，得分10分或以上的敏感度為89%，特異度為82%</p>
        </DescriptionComponent>
      {(score ?? 0) > 0 && (
        <>
      <p className="text-gray-700 mt-4">你的總分: {score}</p>
      {typeof score === 'number' && (
        <FooterComponent>
      <p className="text-gray-700 mt-4">焦慮程度: {getSeverity(score)}</p>

                <ShareButton
                  title="GAD-7 廣泛性焦慮量表"
                  text={`我剛剛做了GAD-7 廣泛性焦慮量表，得分是:${score}， 焦慮程度: ${getSeverity(score)}，你可以在https://surveymind.tw/gad-7`}
                />
        </FooterComponent>
    )}
        </>
      )}
      </ContentComponent>
      </Content>
    </form>
    </div>
  );
};
export default GAD7Form;
