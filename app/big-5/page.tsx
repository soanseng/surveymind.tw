"use client"
import { useEffect, useState } from 'react';
import Head from 'next/head';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import Pagination from '@/hooks/Pagination';

const questions = [
  "Is talkative",
  "Tends to find fault with others",
  "Does a thorough job",
  "Is depressed, blue",
  "Is original, comes up with new ideas",
  "Is reserved",
  "Is helpful and unselfish with others",
  "Can be somewhat careless",
  "Is relaxed, handles stress well",
  "Is curious about many different things",
  "Is full of energy",
  "Starts quarrels with others ",
  "Is a reliable worker",
  "Can be tense ",
  "Is ingenious, a deep thinker",
  "Generates a lot of enthusiasm",
  " Has a forgiving nature",
  "Tends to be disorganized ",
  "Worries a lot ",
   "Has an active imagination",
   "Tends to be quiet ",
   " Is generally trusting",
  "Tends to be lazy ",
  "Is emotionally stable, not easily upset ",
  " Is inventive ",
  " Has an assertive personality ",
  "Can be cold and aloof ",
  " Perseveres until the task is finished " ,
  "Can be moody",
  "Values artistic, aesthetic experiences",
  " Is sometimes shy, inhibited ",
  " Is considerate and kind to almost everyone",
  "Does things efficiently",
  " Remains calm in tense situations ",
  "Prefers work that is routine ",
  " Is outgoing, sociable",
  "Is sometimes rude to others ",
  "Makes plans and follows through with them ",
  "Gets nervous easily ",
  "Likes to reflect, play with ideas ",
  "Has few artistic interests",
  " Likes to cooperate with others",
  "Is easily distracted ",
  "Is sophisticated in art, music, or  literature "
];

type ScoreType = {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
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



  useEffect(() => {
    if (formSubmitted) {
    const dimensions = {
      extraversion: [0, 5, 10, 15, 20, 25, 30, 35],
      agreeableness: [1, 6, 11, 16, 21, 26, 31, 36, 41],
      conscientiousness: [2, 7, 12, 17, 22, 27, 32, 37, 42],
      neuroticism: [3, 8, 13, 18, 23, 28, 33, 38],
      openness: [4, 9, 14, 19, 24, 29, 34, 39, 40, 43],
    };

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

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>The Big Five Inventory (BFI)</title>
      </Head>
      <h1 className="text-2xl font-bold text-center my-8">
        The Big Five Inventory (BFI)
      </h1>
      {validationMessage && (
        <p className="text-red-500 text-center">{validationMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {currentQuestions.map((question, index) => {
          const questionIndex = startIndex + index;
          const isUnanswered = answers[startIndex + index] === null || answers[startIndex + index] === '';
          return (
          <div key={index} className="mb-4">
            <label className="block mb-2 text-lg">
              { isUnanswered && <span className="text-red-500">*</span>}
              {questionIndex + 1}. I see myself as someone who {question}:
            </label>
            <div className="flex space-x-2">
              {["1", "2", "3", "4", "5"].map((value) => {
                const adjustedValue = reverseScoredItems.includes(questionIndex + 1) 
                ? String(6 - parseInt(value))
                : value; 
                const isChecked = answers[questionIndex] === adjustedValue;
                return (
                  <label key={value} className={`form-radio-label ${isChecked ? "text-red-500" : ""}`}>
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
                    {value === "1" && "Disagree Strongly"}
                    {value === "2" && "Disagree a Little"}
                    {value === "3" && "Neither Agree nor Disagree"}
                    {value === "4" && "Agree a Little"}
                    {value === "5" && "Agree Strongly"}
                  </label>
                );
              })}
            </div>
          </div>
          );
        })}
        <Pagination
          canGoBack={currentPage > 0}
          canGoForward={currentPageQuestionsAnswered && currentPage < Math.ceil(questions.length / questionsPerPage) - 1}
          onBack={prevPage}
          onForward={nextPage}
        />
      </form>
      {/* screos display logic here */}
      {formSubmitted && score && (
        <div className="mt-8">
          {Object.entries(score).map(([dimension, score]) => (
            <div key={dimension} className="mb-4">
              <label htmlFor={dimension} className="block mb-2 text-lg">
                {dimension.replace(/([A-Z])/g, " $1").trim()}:
              </label>
              <input
                id={dimension}
                type="range"
                min="0"
                max="40"
                value={String(score)}
                disabled
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;