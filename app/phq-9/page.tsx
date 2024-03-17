"use client"
import { useEffect, useState } from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

const questions = [
  "做事時提不起勁或沒有樂趣",
  "感到心情低落、沮喪或絕望",
  "入睡困難、睡不安穩或睡眠過多",
  "感覺疲倦或沒有活力",
  "食慾不振或吃太多",
  "覺得自己很糟、失敗，或讓自己或家人失望",
  "對事物專注有困難，例如閱讀報紙或看電視",
  "動作或說話速度緩慢，或煩躁或坐立不安",
  "有不如死掉或用某種方式傷害自己的念頭"
];


  const getSeverity = (score: number | null) => {
    if (score == null) return "請先提供分數";
    if (score <= 4) return '無至最小憂鬱';
    if (score <= 9) return '輕度憂鬱';
    if (score <= 14) return '中度憂鬱';
    if (score <= 19) return '中重度憂鬱';
    return '重度憂鬱';
  };


const Page = () => {
    const {
        answers,
        formSubmitted,
        handleSelectChange,
        handleSubmit,
        score,
        validationMessage,
    } = useQuestionnaireForm(questions.length);

  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    setOpen(true);
  }
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>PHQ-9 憂鬱症篩檢問卷</title>
      </Head>
      <h1 className="text-2xl font-bold text-center my-8">
        PHQ-9 憂鬱症篩檢問卷
      </h1>
      <p className="text-center mb-4">在過去兩個星期，有多少時候您受到以下任何問題所困擾？</p>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form onSubmit={customHandleSubmit} className="bg-white p-6 rounded shadow">
        {questions.map((question, index) => {
          const isUnanswered = answers[index] === null || answers[index] === '';
        return (
          <div key={index} className="mb-4">
            <label className="block mb-2 text-lg">
                {formSubmitted && isUnanswered && <span className="text-red-500">*</span>}
              {index + 1}. {question}
            </label>
            <div className="flex space-x-2">
              {["0", "1", "2", "3"].map((value) => (
                <label key={value} className="form-radio-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={value}
                    checked={answers[index] === value}
                    onChange={(e) => handleSelectChange(index, e.target.value)}
                    className="form-radio"
                  />
                  {value === "0" && "完全沒有"}
                  {value === "1" && "幾天"}
                  {value === "2" && "一半以上天數"}
                  {value === "3" && "幾乎每天"}
                </label>
              ))}
            </div>
          </div>
        );
              })}

      <Content open={open} onOpenChange={setOpen}>

        <TriggerComponent asChild>
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            開始測量
          </button>
        </div>
</TriggerComponent>
      {(score ?? 0) > 0 && (
      <ContentComponent>
        <HeaderComponent className="text-2xl font-bold">
          測量結果
        </HeaderComponent>
        <DescriptionComponent>

          <p>得分10分或更高具有88%的敏感性和88%的特異性，用於主要憂鬱症的篩檢。</p>
        </DescriptionComponent>
        <div className="mt-8">
          <p className="text-lg">您的總分是: {score}</p>
         <p>根據您的得分，您可能的憂鬱症狀程度為：</p>
         <p>{getSeverity(score)}</p>
         <FooterComponent>
         <p>如果您的得分顯示您可能有憂鬱症，建議尋求專業醫療幫助。</p>
         <p>如果您有自殺念頭，請立即尋求專業醫療幫助。</p>
         <ShareButton
         title="PHQ-9 憂鬱症篩檢問卷"
         text={`得分是:${score}！，目前嚴重程度是${getSeverity(score)}，你可以在https://surveymind.tw/phq-9 進行篩檢`}
         />
        </FooterComponent>
        </div>
    </ContentComponent>
      )}
    </Content>
    </form>

    </div>
  );
};

export default Page;