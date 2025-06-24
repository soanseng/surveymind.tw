"use client"
import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
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
import { Button } from '@/components/ui/button';

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

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score <= 1) return '正常認知';
  return '可能存在認知障礙';
};

const getInterpretation = (score: number | null) => {
  if (score == null) return "";
  if (score <= 1) {
    return "您的得分在正常範圍內，目前沒有明顯的認知功能問題。建議持續保持健康的生活方式，包括規律運動、均衡飲食、充足睡眠，以及保持社交活動。";
  }
  return "您的得分顯示可能存在認知功能變化。建議尋求神經科或精神科專業醫師進行進一步評估。早期發現和干預對維護認知健康非常重要。請記住，這只是篩檢工具，不能作為最終診斷。";
};

const Page = () => {
  const {
    answers,
    formSubmitted,
    handleSelectChange,
    handleSubmit,
    score,
    allQuestionsAnswered,
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
      <SEOHead config={questionnaireSEO["ad-8"]} path="/ad-8" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">AD-8 極早期失智症篩檢量表</h1>
        
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4 text-red-800">重要評估說明</h2>
          <div className="space-y-3 text-sm text-red-700">
            <p>
              <strong>1. 評分標準：</strong>在計分時是以「是，有改變」當做計分的依準，若您以前無下列問題，但在過去幾年中有以下的「改變」，請勾選「是，有改變」；若無，請勾「不是，沒有改變」；若不確定，請勾「不知道」。
            </p>
            <p>
              <strong>2. 變化定義：</strong>「是，有改變」代表您認為過去幾年中因為認知功能（思考和記憶）問題而導致改變，若因為重大傷病或事故而導致的改變則不算。
            </p>
            <p>
              <strong>3. 比較基準：</strong>請依照自己或家人過去與現在改變狀況（可與約半年前做比較）來回答，而不是以目前的平常表現來回應。
            </p>
          </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["1", "0", "nil"].map((value) => {
                    const labels = ["是，有改變", "否，無改變", "不知道"];
                    const labelIndex = value === "1" ? 0 : value === "0" ? 1 : 2;
                    return (
                      <label key={value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={value}
                          checked={answers[index] === value}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{labels[labelIndex]}</span>
                      </label>
                    );
                  })}
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
          <ContentComponent className="sm:max-w-[425px]">
            <HeaderComponent>
              <TitleComponent>AD-8 認知功能篩檢結果</TitleComponent>
              <DescriptionComponent>
                您的認知功能評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 8
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

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 0-1分：正常認知範圍</li>
                    <li>• 2分或以上：建議進一步專業評估</li>
                    <li>• AD-8敏感度84%，特異度80%</li>
                    <li>• 如有疑慮請諮詢神經科或精神科醫師</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="AD-8 極早期失智症篩檢量表"
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
                <strong>台灣版權：</strong>楊淵韓醫師、劉景寬醫師 開發
              </p>
              <p>
                <strong>國際原版：</strong>Washington University AD-8 Dementia Screening Interview
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Galvin, J. E., Roe, C. M., Powlishta, K. K., Coats, M. A., Muich, S. J., Grant, E., ... & Morris, J. C. (2005). 
                The AD8: a brief informant interview to detect dementia. 
                <em>Neurology</em>, <em>65</em>(4), 559-564. 
                https://doi.org/10.1212/01.wnl.0000172958.95282.2a
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 台灣版本驗證研究：楊淵韓、劉景寬 (2009年世界阿茲海默氏失智症大會)。
                篩檢臨界值為2分，敏感度84%，特異度80%，正面預測值85%。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;