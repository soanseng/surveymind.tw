"use client"
import { useState } from 'react';
import Head from 'next/head';

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

const reverseScoredItems = [5, 20, 30, 1, 11, 26, 36, 7, 17, 22, 42, 8, 23, 33, 34, 40]

const Page = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [scores, setScores] = useState(null);

  const handleSelectChange = (index: number, value: string) => {
    let adjustedValue = value;

    if (reverseScoredItems.includes(index)) {
         adjustedValue = String(6 - parseInt(value))
    }
    const newAnswers = [...answers];
    newAnswers[index] = adjustedValue;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

      setScores(newScores);
    });
  }

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>The Big Five Inventory (BFI)</title>
      </Head>
      <h1 className="text-2xl font-bold text-center my-8">The Big Five Inventory (BFI)</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2 text-lg">
              {index + 1}. I see myself as someone who {question}:
            </label>
            <select
              className="form-select mt-1 block w-full"
              value={answers[index] || ''}
              onChange={(e) => handleSelectChange(index, e.target.value)}
            >
              <option value="" disabled>Select your answer</option>
              <option value="1">Disagree Strongly</option>
              <option value="2">Disagree a Little</option>
              <option value="3">Neither Agree nor Disagree</option>
              <option value="4">Agree a Little</option>
              <option value="5">Agree Strongly</option>
            </select>
          </div>
        ))}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Submit</button>
      </form>
      {scores && (
        <div className="mt-8">
          {Object.entries(scores).map(([dimension, score]) => (
            <div key={dimension} className="mb-4">
              <label htmlFor={dimension} className="block mb-2 text-lg">{dimension.replace(/([A-Z])/g, ' $1').trim()}:</label>
               <input id={dimension} type="range" min="0" max="40" value={String(score)} disabled className="w-full" />
               </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Page;