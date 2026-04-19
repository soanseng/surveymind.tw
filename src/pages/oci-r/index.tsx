"use client"
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import useQuestionnaireForm from '@/hooks/useQuestionnaireForm';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const optionLabels = ["完全沒有", "有一點", "中度", "相當", "極度"];

const questions = [
  "我儲存了太多東西，多到妨礙了我的生活空間。",
  "我會過度頻繁地檢查事物，超出必要的程度。",
  "如果物品沒有被妥善地排列整齊，我就會感到心煩意亂。",
  "我在做事情的時候，會感到有股衝動必須計數。",
  "當我知道某個物體曾被陌生人或特定人士碰過，我就會覺得很難再去觸碰它。",
  "我發現很難控制自己的想法。",
  "我會收集一些我並不需要的東西。",
  "我會反覆檢查門、窗、抽屜等。",
  "如果別人改變了我安排事物的方式，我就會感到心煩。",
  "我覺得我必須重複某些特定的數字。",
  "有時候我只是因為覺得自己被污染了，就必須清洗自己。",
  "腦海中會不受控制地浮現一些不愉快的想法，這讓我感到很困擾。",
  "我會避免丟棄東西，因為我害怕以後可能會需要它們。",
  "在關掉瓦斯、水龍頭或電燈開關後，我會反覆檢查確認。",
  "我需要將物品按照特定的順序排列。",
  "我覺得世界上有好數字跟壞數字之分。",
  "我洗手的次數比一般人多，時間也更長。",
  "我經常會有一些不好的念頭，並且很難擺脫它們。"
];

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score >= 28) return '重度強迫症狀';
  if (score >= 21) return '臨床上強迫症的可能性高';
  if (score >= 16) return '中度強迫症狀';
  if (score >= 12) return '中度症狀/可能患有強迫症';
  if (score >= 5) return '輕度症狀';
  return '無明顯強迫症狀';
};

const getInterpretation = (score: number | null) => {
  if (score == null) return "";
  if (score >= 28) {
    return "您的分數顯示可能有重度強迫症狀。這表示症狀已對您的日常生活造成顯著影響。強烈建議您立即尋求專業的精神健康評估，以獲得適當的診斷和治療。";
  }
  if (score >= 21) {
    return "您的分數達到臨床上強迫症可能性高的水平。這是一個強烈的信號，建議您務必尋求專業精神健康評估，以釐清狀況並獲得適當的協助。";
  }
  if (score >= 16) {
    return "您的分數顯示中度強迫症狀。症狀很可能已對您造成有意義的困擾，建議與專業人士進行討論，以釐清狀況並考慮適當的治療方案。";
  }
  if (score >= 12) {
    return "您的分數顯示可能有中度症狀或患有強迫症。建議您與專業人士進行討論，以釐清狀況並評估是否需要進一步的專業協助。";
  }
  if (score >= 5) {
    return "您的分數顯示輕度症狀。建議您對此保持關注，並考慮在適當時機向醫師或心理師提及您的困擾。";
  }
  return "您目前沒有明顯的強迫症狀。這是一個正面的結果，請繼續保持良好的心理健康習慣。";
};

// 症狀分量表維度
const dimensions = {
  hoarding: [0, 6, 12], // 囤積
  obsessing: [5, 11, 17], // 強迫思考
  ordering: [2, 8, 14], // 排序/對稱
  checking: [1, 7, 13], // 檢查
  neutralizing: [3, 9, 15], // 抵銷/中和
  washing: [4, 10, 16] // 清洗
};

const dimensionNames = {
  hoarding: "囤積",
  obsessing: "強迫思考", 
  ordering: "排序/對稱",
  checking: "檢查",
  neutralizing: "抵銷/中和",
  washing: "清洗"
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

  // Calculate dimension scores
  const calculateDimensionScores = () => {
    const scores: Record<string, number> = {};
    Object.entries(dimensions).forEach(([dimension, indexes]) => {
      scores[dimension] = indexes.reduce((sum, index) => {
        return sum + (parseInt(answers[index] || "0", 10));
      }, 0);
    });
    return scores;
  };

  const dimensionScores = calculateDimensionScores();

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["oci-r"]} path="/oci-r" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">OCI-R 強迫症狀量表修訂版</h1>
        
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            <strong>評估期間：</strong>以下陳述描述了許多人日常生活中的經驗。請根據<strong>過去一個月</strong>的情況，選擇各項經驗對您造成<strong>困擾或煩惱</strong>的程度。
          </p>
          <p className="mb-3">
            <strong>量表簡介：</strong>OCI-R 是一份包含18個題項的簡短自評量表，涵蓋六個主要的強迫症狀向度：囤積、強迫思考、排序/對稱、檢查、抵銷/中和、清洗。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師或臨床心理師。
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
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["0", "1", "2", "3", "4"].map((value) => (
                    <label key={value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={value}
                        checked={answers[index] === value}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mr-2 h-4 w-4 text-purple-600"
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              提交評估
            </button>
          </div>
        </form>

        <Content open={open} onOpenChange={setOpen}>
          <ContentComponent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
            <HeaderComponent>
              <TitleComponent>OCI-R 強迫症狀評估結果</TitleComponent>
              <DescriptionComponent>
                您的強迫症狀評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    總分：{score} / 72
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
                  <h4 className="font-semibold text-yellow-800 mb-2">分數解釋：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 0-4分：無明顯強迫症狀</li>
                    <li>• 5-11分：輕度症狀</li>
                    <li>• 12-15分：中度症狀/可能患有強迫症</li>
                    <li>• 16-27分：中度強迫症狀</li>
                    <li>• ≥21分：臨床上強迫症的可能性高</li>
                    <li>• ≥28分：重度強迫症狀</li>
                  </ul>
                </div>

                <AnswerDetailList
                  items={questions.map<AnswerDetailItem>((q, i) => {
                    const v = answers[i];
                    const n = v !== null && v !== '' ? parseInt(v, 10) : null;
                    const dimKey = (Object.entries(dimensions).find(([, idxs]) => idxs.includes(i))?.[0]) as keyof typeof dimensionNames | undefined;
                    return {
                      question: q,
                      answerLabel: n !== null ? optionLabels[n] : '未作答',
                      score: n ?? 0,
                      note: dimKey ? `向度：${dimensionNames[dimKey]}` : undefined,
                    };
                  })}
                  totalLabel={`總分 ${score ?? 0} / 72`}
                />

                {/* Dimension Scores */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">各症狀向度分析：</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {Object.entries(dimensionScores).map(([dimension, dimensionScore]) => (
                      <div key={dimension} className="flex justify-between bg-white p-2 rounded">
                        <span>{dimensionNames[dimension as keyof typeof dimensionNames]}：</span>
                        <span className="font-medium">{dimensionScore}/12</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-purple-600 mt-2">
                    *各向度分數範圍0-12分，分數越高表示該類症狀困擾越大
                  </p>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="OCI-R 強迫症狀量表修訂版"
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
                <strong>原始開發者：</strong>Edna B. Foa, PhD 等學者開發
              </p>
              <p>
                <strong>量表性質：</strong>公共領域 (Public Domain) 工具，可免費使用
              </p>
              <p>
                <strong>中文版本：</strong>基於多項針對華語群體進行的跨文化研究成果編修
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-purple-500 font-mono text-xs leading-relaxed">
                Foa, E. B., Huppert, J. D., Leiberg, S., Langner, R., Kichic, R., Hajcak, G., & Salkovskis, P. M. (2002). 
                The Obsessive-Compulsive Inventory: Development and validation of a short version. 
                <em>Psychological Assessment</em>, <em>14</em>(4), 485-496. 
                https://doi.org/10.1037/1040-3590.14.4.485
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * OCI-R 經過嚴謹的科學驗證，具有良好的心理計量特性。
                中文版本遵循國際跨文化量表發展指引，對華語群體具有信效度。
                本量表涵蓋六個症狀向度：囤積、強迫思考、排序/對稱、檢查、抵銷/中和、清洗。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;