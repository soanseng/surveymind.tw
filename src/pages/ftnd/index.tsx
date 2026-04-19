"use client";
import React, { useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import CopyResultButton from '@/components/CopyResultButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

// FTND Questions based on the research paper
const questions = [
  {
    id: 1,
    english: "How soon after you wake up do you smoke your first cigarette?",
    chinese: "您起床後多久抽第一支菸？",
    options: [
      { value: 3, chinese: "5分鐘內" },
      { value: 2, chinese: "6-30分鐘" },
      { value: 1, chinese: "31-60分鐘" },
      { value: 0, chinese: "60分鐘後" }
    ]
  },
  {
    id: 2,
    english: "Do you find it difficult to refrain from smoking in places where it is forbidden (e.g., church, library, cinema, etc.)?",
    chinese: "在禁菸區（如：教堂、圖書館、電影院等）您會覺得難以忍受不吸菸嗎？",
    options: [
      { value: 1, chinese: "是" },
      { value: 0, chinese: "否" }
    ]
  },
  {
    id: 3,
    english: "Which cigarette would you hate most to give up?",
    chinese: "您最不想放棄的是哪一支菸？",
    options: [
      { value: 1, chinese: "早上第一支菸" },
      { value: 0, chinese: "其他" }
    ]
  },
  {
    id: 4,
    english: "How many cigarettes per day do you smoke?",
    chinese: "您一天抽幾支菸？",
    options: [
      { value: 0, chinese: "10支或以下" },
      { value: 1, chinese: "11-20支" },
      { value: 2, chinese: "21-30支" },
      { value: 3, chinese: "31支或以上" }
    ]
  },
  {
    id: 5,
    english: "Do you smoke more frequently during the first hours after waking than during the rest of the day?",
    chinese: "起床後的第一個小時內，您吸菸的頻率是否比一天中其他時間更高？",
    options: [
      { value: 1, chinese: "是" },
      { value: 0, chinese: "否" }
    ]
  },
  {
    id: 6,
    english: "Do you smoke if you are so ill that you are in bed most of the day?",
    chinese: "即使您生病到幾乎整天臥床，您還是會吸菸嗎？",
    options: [
      { value: 1, chinese: "是" },
      { value: 0, chinese: "否" }
    ]
  }
];

const getDependenceLevel = (score: number) => {
  if (score >= 8) return "非常高度依賴";
  if (score >= 6) return "高度依賴";
  if (score === 5) return "中度依賴";
  if (score >= 3) return "低度依賴";
  return "非常低度依賴";
};

const getInterpretation = (score: number) => {
  if (score >= 8) {
    return "您有非常高度的尼古丁依賴（8-10分）。這表示您的身體對尼古丁有很強的生理依賴性。在嘗試戒菸時，您很可能會經歷強烈且難受的戒斷症狀。強烈建議尋求專業戒菸協助，包括考慮尼古丁替代療法、處方藥物或專業戒菸諮詢服務。";
  } else if (score >= 6) {
    return "您有高度的尼古丁依賴（6-7分）。您的身體對尼古丁有相當程度的生理依賴性。戒菸時可能會遇到顯著的戒斷症狀，建議尋求專業協助，考慮使用尼古丁替代療法或其他戒菸輔助方法來增加成功率。";
  } else if (score === 5) {
    return "您有中度的尼古丁依賴（5分）。雖然依賴程度處於中等水準，但戒菸時仍可能經歷一些戒斷症狀。建議與醫療專業人員討論戒菸策略，可能包括行為療法或藥物輔助。";
  } else if (score >= 3) {
    return "您有低度的尼古丁依賴（3-4分）。您的生理依賴程度相對較低，這是戒菸的有利因素。可嘗試行為改變策略，如避免吸菸觸發因子、尋找替代活動等。必要時仍可尋求專業支持。";
  } else {
    return "您有非常低度的尼古丁依賴（0-2分）。您的生理依賴程度很低，這對戒菸是非常有利的條件。主要挑戰可能來自心理依賴或習慣性行為，建議專注於行為改變和建立新的健康習慣。";
  }
};

const Page = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScore = () => {
    return Object.values(answers).reduce((total, value) => total + value, 0);
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setValidationMessage('');
  };

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    questions.forEach(q => {
      if (answers[q.id] === undefined) {
        unanswered.push(q.id);
      }
    });
    return unanswered;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const unansweredQuestions = getUnansweredQuestions();
    
    if (unansweredQuestions.length > 0) {
      setValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
      return;
    }
    
    const totalScore = calculateScore();
    setScore(totalScore);
    setValidationMessage('');
    setOpen(true);
  };

  const completedQuestions = Object.keys(answers).length;
  const totalQuestions = questions.length;

  const detailItems = useMemo<AnswerDetailItem[]>(
    () =>
      questions.map((q) => {
        const v = answers[q.id];
        const opt = v !== undefined ? q.options.find(o => o.value === v) : undefined;
        return {
          question: q.chinese,
          answerLabel: opt ? opt.chinese : '未作答',
          score: v ?? 0,
        };
      }),
    [answers],
  );

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["ftnd"]} path="/ftnd" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">法格史壯尼古丁依賴量表 (FTND)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一份包含6個問題的評估工具，專門測量您對尼古丁的<strong>生理性依賴強度</strong>。
            本量表主要評估身體對尼古丁的依賴程度，如無法忍耐不吸菸的衝動性，以及早晨醒來後對尼古丁的迫切需求。
          </p>
          <p className="mb-3">
            請根據您目前的吸菸狀況誠實回答每個問題。分數越高，代表生理依賴程度越高，
            在戒菸時可能會經歷更強烈的戒斷症狀。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表為篩檢工具，主要評估生理依賴。戒菸涉及生理與心理兩個層面，建議諮詢專業戒菸服務。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">完成進度</span>
              <span className="text-sm text-gray-600">
                {completedQuestions} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(completedQuestions / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {questions.map((question) => {
            const isUnanswered = answers[question.id] === undefined;
            return (
              <div 
                key={question.id} 
                className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered && validationMessage 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="mb-4">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                  }`}>
                    {question.id}. {question.chinese}
                    {isUnanswered && validationMessage && (
                      <span className="ml-2 text-red-600 text-sm">*未作答</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 italic mb-3">
                    {question.english}
                  </p>
                </div>

                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">
                        ({option.value}) {option.chinese}
                      </span>
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
              <TitleComponent>FTND 評估結果</TitleComponent>
              <DescriptionComponent>
                您的尼古丁依賴量表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 10
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {score !== null && getDependenceLevel(score)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {score !== null && getInterpretation(score)}
                  </p>
                </div>

                <AnswerDetailList
                  items={detailItems}
                  totalLabel={`總分 ${score ?? 0} / 10`}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">FTND評分標準：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>0-2分：</strong>非常低度依賴</li>
                    <li>• <strong>3-4分：</strong>低度依賴</li>
                    <li>• <strong>5分：</strong>中度依賴</li>
                    <li>• <strong>6-7分：</strong>高度依賴</li>
                    <li>• <strong>8-10分：</strong>非常高度依賴</li>
                  </ul>
                </div>

                {score !== null && score >= 5 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">戒菸建議：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 考慮尼古丁替代療法（貼片、口嚼錠等）</li>
                      <li>• 諮詢戒菸門診或戒菸專線</li>
                      <li>• 與醫師討論戒菸處方藥物</li>
                      <li>• 尋求行為治療或心理支持</li>
                      <li>• 加入戒菸支持團體</li>
                    </ul>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">戒菸資源：</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 免費戒菸專線：0800-636363</li>
                    <li>• 各大醫院戒菸門診</li>
                    <li>• 社區藥局戒菸諮詢服務</li>
                    <li>• 網路戒菸支持平台</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="法格史壯尼古丁依賴量表 (FTND)"
                    text={score !== null ? `我的得分是${score}分，評估為：${getDependenceLevel(score)}` : ''}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <div className="flex flex-wrap gap-2">
                <CopyResultButton
                  title="FTND 尼古丁依賴量表結果"
                  summary={[
                    `總分：${score ?? 0} / 10`,
                    score !== null ? `判讀：${getDependenceLevel(score)}` : '',
                    score !== null ? getInterpretation(score) : '',
                  ]
                    .filter(Boolean)
                    .join('\n')}
                  groups={[
                    { title: '各題作答明細', items: detailItems, totalLabel: `總分 ${score ?? 0} / 10` },
                  ]}
                />
                <CloseComponent className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded">
                  關閉
                </CloseComponent>
              </div>
            </FooterComponent>
          </ContentComponent>
        </Content>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與引用</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>開發者：</strong>Karl Fagerström
              </p>
              <p>
                <strong>版權：</strong>公共領域，可免費使用於臨床與研究
              </p>
              <p>
                <strong>適用對象：</strong>目前有吸菸習慣的成年人
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Heatherton, T. F., Kozlowski, L. T., Frecker, R. C., & Fagerström, K. O. (1991). 
                The Fagerström Test for Nicotine Dependence: a revision of the Fagerström Tolerance Questionnaire. 
                <em>British Journal of Addiction</em>, 86(9), 1119-1127.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * FTND是評估尼古丁生理依賴的國際標準工具，其簡潔的6題設計適合快速評估。
                分數與戒斷症狀嚴重程度及尼古丁替代療法需求具有良好的預測性。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;