"use client"
import { useEffect, useState } from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import ShareButton from '@/components/ShareButton';


const questions = [
  "判斷力上的困難：例如落入圈套或騙局、財務上不好的決定、買了對受禮者不合宜的禮物。",
  "對活動和嗜好的興趣降低。",
  "重複相同問題、故事和陳述。",
  "在學習如何使用工具、設備和小器具上有困難。例如：電視、音響、冷氣機、洗衣機、熱水爐（器）、微波爐、遙控器。",
  "忘記正確的月份和年份。",
  "處理複雜的財物上有困難。例如：個人或家庭的收支平衡、所得稅、繳費單。",
  "記住約會的時間有困難。",
  "有持續的思考和記憶方面的問題。"
];

const Page = () => {
    const {
        answers,
        formSubmitted,
        handleSelectChange,
        handleSubmit,
        score,
        allQuestionsAnswered,
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
        <title>AD-8 極早期失智症篩檢量表</title>
      </Head>
      <h1 className="text-2xl font-bold text-center my-8">
        AD-8 極早期失智症篩檢量表
      </h1>
      <Card className="border border-red-500 w-full mx-auto">
        <CardContent className="text-sm text-gray-500">
          <p>
            1.
            在計分時是以「是，有改變」當做計分的依準，若您以前無下列問題，但在過去幾年中有以下的『改變』，請勾選「是，有改變」；若無，請勾「不是，沒有改變」；若不確定，請勾「不知道」。
          </p>
          <p>
            {" "}
            2.
            「是，有改變」代表您認為過去幾年中因為認知功能(思考和記憶)問題而導致改變，若因為重大傷病或事故而導致的改變則不算。
          </p>
          <p>
            {" "}
            3.
            請依照自己或家人過去與現在改變狀況(可與約半年前做比較)來回答，而不是以目前的平常表現來回應。
          </p>
        </CardContent>
      </Card>
      <p className="text-center mb-4">請根據最近的情況回答以下問題：</p>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form
        onSubmit={customHandleSubmit}
        className="bg-white p-6 rounded shadow"
      >
        {questions.map((question, index) => {
          const isUnanswered = answers[index] === null || answers[index] === "";
          return (
            <div key={index} className="mb-4">
              <label className="block mb-2 text-lg">
                {formSubmitted && isUnanswered && (
                  <span className="text-red-500">*</span>
                )}
                {index + 1}. {question}
              </label>
              <div className="flex space-x-2">
                {["1", "0", "nil"].map((value) => (
                  <label key={value} className="form-radio-label">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={value}
                      checked={answers[index] === value}
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      className="form-radio"
                    />
                    {value === "1" && "是，有改變"}
                    {value === "0" && "否，無改變"}
                    {value === "nil" && "不知道"}
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        <Content open={open} onOpenChange={setOpen}>
            {allQuestionsAnswered() && (
            <div className="text-center">
          <TriggerComponent asChild>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                提交問卷
              </button>
          </TriggerComponent>
            </div>
            )}

          {(score ?? 0) >= 0 && (
            <ContentComponent>
              <HeaderComponent className="text-2xl font-bold">
                篩檢結果
              </HeaderComponent>
              <DescriptionComponent>
                <p>根據995位參與開發和驗證樣本的臨床研究結果，提供以下切點：</p>
              </DescriptionComponent>
              <div className="mt-8">
                <p className="text-lg">您的總分是: {score}</p>
                <p>根據您的得分，您可能的認知障礙程度為：</p>
                <ul>
                  <li>0-1分：正常認知</li>
                  <li>2分或更高：可能存在認知障礙</li>
                </ul>
                <FooterComponent className="text-sm text-gray-500">
                  <p>
                    AD-8問卷具有超過84%的敏感性和80%的特異性，正面預測值超過85%，負面預測值超過70%，曲線下面積為0.908；95%CI：0.888-0.925。
                  </p>
                  <p>
                    如果您的得分顯示您可能有認知障礙，建議尋求專業醫療幫助。
                  </p>
                  <ShareButton title="AD-8 極早期失智症篩檢量表" 
                  text={`得分是:${score} 0-1分：正常認知； 2分或更高：可能存在認知障礙，歡迎在 https://surveymind.tw/ad-8 進行篩檢`} 
                  />
                </FooterComponent>
              </div>
            </ContentComponent>
          )}
        </Content>
      </form>
      <Card className="border border-gray-500">
        <CardContent>
          <CardDescription className="text-sm text-gray-500 w-2/3 mx-auto">
            1. 楊淵韓、劉景寬 2009年 世界阿茲海默氏失智症大會 2.
            台灣失智症協會網站
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;