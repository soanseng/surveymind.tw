"use client"
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const optionLabels = ["完全沒有", "幾天", "超過一半的天數", "幾乎每天"];

const questions = [
  "覺得緊張、焦慮、心情不定",
  "覺得無法停止或控制焦慮",
  "對很多不同的事感到擔憂",
  "難以放鬆",
  "焦躁不安到難以安靜坐著",
  "容易心煩或易怒",
  "感到害怕，就像發生可怕的事情"
];

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score <= 4) return '無至最小焦慮';
  if (score <= 9) return '輕度焦慮';
  if (score <= 14) return '中度焦慮';
  return '重度焦慮';
};

const getInterpretation = (score: number | null) => {
  if (score == null) return "";
  if (score <= 4) {
    return "您目前的焦慮症狀輕微或不明顯。這是一個正面的結果，建議繼續保持良好的心理健康習慣和適當的壓力管理。";
  }
  if (score <= 9) {
    return "您可能有輕度焦慮症狀。建議關注您的壓力來源，嘗試放鬆技巧，若症狀持續或加重，請考慮諮詢專業人員。";
  }
  if (score <= 14) {
    return "您可能有中度焦慮症狀。建議尋求專業心理健康評估，學習焦慮管理技巧，並考慮適當的治療或支持。";
  }
  return "您可能有重度焦慮症狀。強烈建議立即尋求專業醫療協助，進行詳細評估和治療。焦慮症是可以有效治療的。";
};

const Page = () => {
  const {
    answers,
    formSubmitted,
    handleSelectChange,
    handleSubmit,
    score,
    validationMessage: hookValidationMessage,
  } = useQuestionnaireForm(questions.length);

  const [customValidationMessage, setCustomValidationMessage] = useState('');
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    answers.forEach((answer, index) => {
      if (answer === null || answer === '') {
        unanswered.push(index + 1);
      }
    });
    return unanswered;
  };

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unansweredQuestions = getUnansweredQuestions();
    
    if (unansweredQuestions.length > 0) {
      if (unansweredQuestions.length > 5) {
        setCustomValidationMessage(`還有 ${unansweredQuestions.length} 題尚未作答，請完成所有題目後再提交。`);
      } else {
        setCustomValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
      }
      return;
    }
    
    setCustomValidationMessage('');
    handleSubmit(e);
    setOpen(true);
  };

  const validationMessage = customValidationMessage || hookValidationMessage;

  const handleAnswerChange = (index: number, value: string) => {
    handleSelectChange(index, value);
    setCustomValidationMessage('');
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO.gad} path="/gad" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">GAD-7 廣泛性焦慮量表</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            <strong>題目：</strong>在過去兩個星期，以下症狀會多常困擾您？
          </p>
          <p className="mb-3">
            GAD-7 是廣泛使用的焦慮症篩檢工具，請根據您在過去兩週內的實際感受來回答每個問題。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師。
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">完成進度</span>
            <span className="text-sm text-gray-600">
              {answers.filter(answer => answer !== null && answer !== '').length} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(answers.filter(answer => answer !== null && answer !== '').length / questions.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <form onSubmit={customHandleSubmit} className="space-y-6">
          {questions.map((question, index) => {
            const isUnanswered = answers[index] === null || answers[index] === '';
            return (
              <div 
                key={index} 
                className={`bg-white p-4 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered && validationMessage 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <h3 className={`text-base font-medium mb-3 ${
                  isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                }`}>
                  {index + 1}. {question}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["0", "1", "2", "3"].map((value) => (
                    <label key={value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={value}
                        checked={answers[index] === value}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{optionLabels[parseInt(value)]}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          {validationMessage && (
            <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <span className="text-red-600 mr-2 text-lg">⚠️</span>
                <span className="font-medium">{validationMessage}</span>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              提交評估
            </button>
          </div>
        </form>

        <Content open={open} onOpenChange={setOpen}>
          <ContentComponent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
            <HeaderComponent>
              <TitleComponent>GAD-7 焦慮症篩檢結果</TitleComponent>
              <DescriptionComponent>
                您的焦慮症狀評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 21
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSeverity(score)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getInterpretation(score)}
                  </p>
                </div>

                <AnswerDetailList
                  items={questions.map<AnswerDetailItem>((q, i) => {
                    const v = answers[i];
                    const n = v !== null && v !== '' ? parseInt(v, 10) : null;
                    return {
                      question: q,
                      answerLabel: n !== null ? optionLabels[n] : '未作答',
                      score: n ?? 0,
                    };
                  })}
                  totalLabel={`總分 ${score ?? 0} / 21`}
                />

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為篩檢工具，不能作為診斷依據</li>
                    <li>• 得分10分或以上建議尋求專業評估</li>
                    <li>• GAD-7敏感度89%，特異度82%</li>
                    <li>• 如有嚴重焦慮症狀，請諮詢精神科專業醫師</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="GAD-7 廣泛性焦慮量表"
                    text={`我的得分是${score}分，結果為：${getSeverity(score)}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <CloseComponent className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded">
                關閉
              </CloseComponent>
            </FooterComponent>
          </ContentComponent>
        </Content>

        {/* Copyright and Citation Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與版權</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>原始版權：</strong>Robert L. Spitzer, MD, Kurt Kroenke, MD, 及 Janet B.W. Williams, DSW 開發
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006). 
                A brief measure for assessing generalized anxiety disorder: the GAD-7. 
                <em>Archives of Internal Medicine</em>, <em>166</em>(10), 1092-1097. 
                https://doi.org/10.1001/archinte.166.10.1092
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 本量表已獲得廣泛驗證，篩檢臨界值為10分，敏感度89%，特異度82%。
                GAD-7 是全球廣泛使用的焦慮症篩檢工具。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;