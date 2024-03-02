"use client"
import React from 'react';
const GAD7Form = () => {
  const [score, setScore] = React.useState(0);
  const [severity, setSeverity] = React.useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const inputs = Array.from(form.elements).filter((el: any) => el.name.startsWith("question-"));
    const totalScore = inputs
      .map((el: any) => parseInt(el.value))
      .reduce((acc: number, n: number) => acc + n, 0);
    
    setScore(totalScore);
    setSeverity(getSeverity(totalScore));
  };

  const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
  ];
  
  const getSeverity = (score: number) => {
    if (score <= 4) return 'Minimal anxiety';
    if (score <= 9) return 'Mild anxiety';
    if (score <= 14) return 'Moderate anxiety';
    return 'Severe anxiety';
  };

  const questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen"
  ]



  return (
    <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">GAD-7 Anxiety</h1>
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      {questions.map((question, qindex) => (
        <div key={qindex} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {question}:
          </label>
          <div className="flex space-x-2">
            {options.map((option, oindex) => (
              <label key={oindex} className="form-radio-label">
                <input
                  type="radio"
                  name={`question-${qindex}`}
                  value={option.value}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
      <p className="text-gray-700 mt-4">Your total score is: {score}</p>
      <p className="text-gray-700 mt-4">Anxiety severity: {severity}</p>
    </form>
    </div>
  );
};
export default GAD7Form;
