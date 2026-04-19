import { useState } from 'react';
import { computeQuestionnaireScore } from '@/lib/questionnaire-scoring';

type DefaultScoreType = number;
function useQuestionnaireForm<TScoreType = DefaultScoreType>(questionsLength: number, questionsPerPage: number = questionsLength) {
  const [answers, setAnswers] = useState(Array(questionsLength).fill(null));
  const [currentPage, setCurrentPage] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [score, setScore] = useState<TScoreType | null>(null);
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
        const totalScore = computeQuestionnaireScore(answers);
        setScore(totalScore);
        setValidationMessage('');
      } else {
        setValidationMessage('請回答本頁所有問題。');
      }
      setFormSubmitted(true);
    };

  const allQuestionsAnswered = () => answers.every(answer => answer !== null && answer !== '');

  const nextPage = () => {
    setCurrentPage(current => current + 1);
    // Scroll to top of page smoothly (check for browser environment)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prevPage = () => {
    setCurrentPage(current => current - 1);
    // Scroll to top of page smoothly (check for browser environment)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    answers,
    currentPage,
    formSubmitted,
    setFormSubmitted,
    handleSelectChange,
    handleSubmit,
    allQuestionsAnswered,
    nextPage,
    prevPage,
    questionsPerPage,
    score,
    setScore,
    validationMessage,
  };
};

export default useQuestionnaireForm;
