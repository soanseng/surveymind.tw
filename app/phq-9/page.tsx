"use client"
import { useEffect, useState } from 'react';
import Head from 'next/head';

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

const Page = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSelectChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value, 10);
    setAnswers(newAnswers);
    setValidationMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.every((answer) => answer !== null)) {
      const totalScore = answers.reduce((acc, current) => acc + current, 0);
      setScore(totalScore);
      setValidationMessage('');
      setFormSubmitted(true);
    } else {
      setValidationMessage('請回答所有問題。');
      setFormSubmitted(true);
    }
  };

  useEffect(() => {
    // This effect is used to calculate the score dynamically if needed
  }, [answers]);

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
      <form onSubmit={handleSubmit}>
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
                    checked={answers[index] === parseInt(value, 10)}
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
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            提交
          </button>
        </div>
      </form>
      {score > 0 && (
        <div className="mt-8">
          <p className="text-lg">您的總分是: {score}</p>
          <p>得分10分或更高具有88%的敏感性和88%的特異性，用於主要憂鬱症的篩檢。</p>
         <p>根據您的得分，您可能的憂鬱症狀程度為：</p>
         <ul>
           <li>0-4分：無至最小憂鬱</li>
           <li>5-9分：輕度憂鬱</li>
           <li>10-14分：中度憂鬱</li>
           <li>15-19分：中重度憂鬱</li>
           <li>20-27分：重度憂鬱</li>
         </ul>
         <p>如果您的得分顯示您可能有憂鬱症，建議尋求專業醫療幫助。</p>
        </div>
      )}
    </div>
  );
};

export default Page;