import { useState } from 'react';

const useQuestionnaireForm = (questionsLength: number, questionsPerPage: number = questionsLength) => {
  const [answers, setAnswers] = useState(Array(questionsLength).fill(null));
  const [currentPage, setCurrentPage] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');

  const handleSelectChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setValidationMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.every(answer => answer !== null && answer !== '')) {
        const totalScore = answers.reduce((acc, current) => acc + parseInt(current, 10), 0);
        setScore(totalScore);
        setValidationMessage('');
      } else {
        setValidationMessage('請回答所有問題。');
      }
      setFormSubmitted(true);
    };

  const allQuestionsAnswered = () => answers.every(answer => answer !== null && answer !== '');

  const nextPage = () => setCurrentPage(current => current + 1);
  const prevPage = () => setCurrentPage(current => current - 1);

  return {
    answers,
    currentPage,
    formSubmitted,
    handleSelectChange,
    handleSubmit,
    allQuestionsAnswered,
    nextPage,
    prevPage,
    questionsPerPage,
    score,
    validationMessage,
  };
};

export default useQuestionnaireForm;