"use client"
import React from 'react';
const GAD7Form = () => {
  const [score, setScore] = React.useState(0);
  const [severity, setSeverity] = React.useState("");
  
  const handleSubmit = (e: {
    target: any;
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    const inputs = Array.from(e.target.querySelectorAll("select"));
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



  return (
    <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">GAD-7 Anxiety</h1>
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <label
        htmlFor="feeling-nervous"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Feeling nervous, anxious, or on edge:
      </label>
      <select
        id="feeling-nervous"
        className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor="stop-worrying"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Not being able to stop or control worrying:
      </label>
      <select
        id="stop-worrying"
        className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor="worrying-too-much"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Worrying too much about different things:
      </label>
      <select
        id="worrying-too-much"
        className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor="trouble-relaxing"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Trouble relaxing:
      </label>
      <select
        id="trouble-relaxing"
        className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor="restless"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
       Being so restless that it is hard to sit still
      </label>
      <select
        id="restless"
        className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor="easily-annoyed"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Becoming easily annoyed or irritable   
      </label>
      <select
        id="easily-annoyed"
        className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor="feeling-afraid"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Feeling afraid, as if something awful might happen  
      </label>
      <select
        id="feeling-afraid"
        className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
