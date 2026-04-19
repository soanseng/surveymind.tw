"use client"
import { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import CopyResultButton from '@/components/CopyResultButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const screeningQuestions = [
  "您是否曾做過關於該事件的惡夢，或在不願意的情況下想起該事件？",
  "您是否曾努力不去想該事件，或刻意避開會讓您想起該事件的情境？",
  "您是否曾持續處於警戒、提防的狀態，或容易被嚇到？",
  "您是否曾感覺與他人、活動或周遭環境變得麻木或疏離？",
  "您是否曾感到罪惡，或無法停止責備自己或他人該為事件的發生或其造成的任何問題負責？"
];

const getSeverity = (score: number | null, hasTrauma: boolean | null) => {
  if (!hasTrauma) return "未檢出創傷史 - 不適用PTSD篩檢";
  if (score == null) return "請先提供分數";
  if (score < 3) return '低風險 - 較不可能有PTSD症狀';
  if (score === 3) return '中等風險 - 建議進一步評估';
  return '高風險 - 強烈建議專業評估';
};

const getInterpretation = (score: number | null, hasTrauma: boolean | null) => {
  if (!hasTrauma) {
    return "根據您的回答，您未曾經歷符合創傷定義的重大事件。如果您仍有心理困擾，建議諮詢專業醫師了解其他可能的原因。";
  }
  if (score == null) return "";
  if (score < 3) {
    return "您的得分低於篩檢標準，顯示較不可能有創傷後壓力症候群的症狀。這個結果並不能完全排除PTSD的可能性，如果您仍有相關困擾，建議諮詢專業醫師。";
  }
  if (score === 3) {
    return "您的得分達到篩檢標準，顯示可能存在創傷後壓力相關症狀。建議您進行更詳細的評估（如PCL-5）或尋求專業的心理健康評估。";
  }
  return "您的得分明顯超過篩檢標準，強烈建議您尋求專業的心理健康評估。這表示您可能正在經歷創傷後壓力症候群的相關症狀，專業協助對您會很有幫助。";
};

const Page = () => {
  const [hasTrauma, setHasTrauma] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(screeningQuestions.length).fill(null));
  const [score, setScore] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScore = () => {
    return answers.reduce((total, answer) => {
      return total + (answer === 'yes' ? 1 : 0);
    }, 0);
  };

  const handleTraumaChange = (value: boolean) => {
    setHasTrauma(value);
    setValidationMessage('');
    // Reset screening answers if no trauma
    if (!value) {
      setAnswers(new Array(screeningQuestions.length).fill(null));
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setValidationMessage('');
  };

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    if (hasTrauma) {
      answers.forEach((answer, index) => {
        if (answer === null || answer === '') {
          unanswered.push(index + 1);
        }
      });
    }
    return unanswered;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasTrauma === null) {
      setValidationMessage('請先回答是否曾經歷創傷事件。');
      return;
    }

    if (hasTrauma) {
      const unansweredQuestions = getUnansweredQuestions();

      if (unansweredQuestions.length > 0) {
        setValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
        return;
      }
    }

    const totalScore = hasTrauma ? calculateScore() : 0;
    setScore(totalScore);
    setFormSubmitted(true);
    setValidationMessage('');
    setOpen(true);
  };

  const detailItems = useMemo<AnswerDetailItem[]>(
    () =>
      screeningQuestions.map((q, i) => {
        const v = answers[i];
        return {
          question: q,
          answerLabel: v === 'yes' ? '是' : v === 'no' ? '否' : '未作答',
          score: v === 'yes' ? 1 : 0,
        };
      }),
    [answers],
  );

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["pc-ptsd-5"]} path="/pc-ptsd-5" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">初級照護創傷後壓力症篩檢量表 (PC-PTSD-5)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一個快速的兩階段篩檢工具。首先會詢問您是否有創傷暴露史，
            如果有，再進行5個簡短的症狀篩檢問題。
          </p>
          <p className="mb-3">
            本量表評估的是您在「<strong>過去一個月</strong>」內的症狀經驗。
            這個工具主要用於初步篩檢，如果結果為陽性，建議進行更詳細的評估。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stage 1: Trauma Exposure */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <h3 className="text-lg font-semibold mb-4">第一部分：創傷暴露史</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                有時候，人們會經歷一些非常可怕、恐怖或令人極度不安的事件。例如：
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-4">
                <li>嚴重的意外事故或火災</li>
                <li>身體攻擊或性侵害/性虐待</li>
                <li>地震或洪水等天災</li>
                <li>戰爭</li>
                <li>親眼目睹他人被殺害或重傷</li>
                <li>得知親密的人因他殺或自殺而亡</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${
              hasTrauma === null && validationMessage ? 'bg-red-50 border-2 border-red-300' : 'bg-gray-50'
            }`}>
              <p className="font-medium mb-3">請問您一生中有沒有經歷過任何這類事件？</p>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="trauma-exposure"
                    value="yes"
                    onChange={() => handleTraumaChange(true)}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm">是</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="trauma-exposure"
                    value="no"
                    onChange={() => handleTraumaChange(false)}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm">否</span>
                </label>
              </div>
              {hasTrauma === null && validationMessage && (
                <p className="text-red-600 text-sm mt-2">*請選擇一個答案</p>
              )}
            </div>
          </div>

          {/* Stage 2: Symptom Screening (only if trauma exposure = yes) */}
          {hasTrauma === true && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4">第二部分：症狀篩檢</h3>
                <p className="text-sm text-gray-600 mb-4">
                  如果您經歷過上述任何事件，請回答以下關於<strong>過去一個月</strong>內您是否曾有以下困擾的問題：
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">完成進度</span>
                  <span className="text-sm text-gray-600">
                    {answers.filter(answer => answer !== null && answer !== '').length} / {screeningQuestions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${(answers.filter(answer => answer !== null && answer !== '').length / screeningQuestions.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {screeningQuestions.map((question, index) => {
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
                    <div className="flex space-x-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value="yes"
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">是</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value="no"
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">否</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {hasTrauma === false && (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">評估完成</h3>
              <p className="text-yellow-700">
                由於您未曾經歷創傷事件，因此不需要進行PTSD症狀篩檢。
                如果您有其他心理健康方面的困擾，建議諮詢專業醫師。
              </p>
            </div>
          )}

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
              <TitleComponent>PC-PTSD-5 評估結果</TitleComponent>
              <DescriptionComponent>
                您的初級照護PTSD篩檢結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 5
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSeverity(score, hasTrauma)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getInterpretation(score, hasTrauma)}
                  </p>
                </div>

                {hasTrauma && (
                  <AnswerDetailList
                    items={detailItems}
                    totalLabel={`總分 ${score ?? 0} / 5`}
                  />
                )}

                {hasTrauma && score !== null && score >= 3 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">建議下一步：</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 建議進行更詳細的PCL-5評估</li>
                      <li>• 考慮尋求精神科或心理師專業評估</li>
                      <li>• 了解創傷治療的相關資源</li>
                    </ul>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為快速篩檢工具，不能作為診斷依據</li>
                    <li>• 篩檢臨界值為3-4分（依性別和族群而異）</li>
                    <li>• 陽性結果建議進行詳細評估（如PCL-5）</li>
                    <li>• 如有疑慮請諮詢精神科或創傷專業醫師</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="初級照護創傷後壓力症篩檢量表 (PC-PTSD-5)"
                    text={`我的得分是${score}分，結果為：${getSeverity(score, hasTrauma)}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <div className="flex flex-wrap gap-2">
                <CopyResultButton
                  title="PC-PTSD-5 初級照護創傷後壓力症篩檢結果"
                  summary={[
                    `創傷暴露史：${hasTrauma === true ? '有' : hasTrauma === false ? '否' : '未作答'}`,
                    hasTrauma ? `總分：${score ?? 0} / 5` : '',
                    `判讀：${getSeverity(score, hasTrauma)}`,
                    getInterpretation(score, hasTrauma),
                  ]
                    .filter(Boolean)
                    .join('\n')}
                  groups={
                    hasTrauma
                      ? [{ title: '各題作答明細', items: detailItems, totalLabel: `總分 ${score ?? 0} / 5` }]
                      : undefined
                  }
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
                <strong>開發單位：</strong>美國退伍軍人事務部國家創傷後壓力症候群中心
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Prins, A., Bovin, M. J., Kimerling, R., et al. (2015). 
                The Primary Care PTSD Screen for DSM-5 (PC-PTSD-5). 
                <em>National Center for PTSD</em>. 
                Available from: https://www.ptsd.va.gov/professional/assessment/screens/pc-ptsd.asp
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * PC-PTSD-5為公開領域工具，設計用於基層醫療快速篩檢。
                本工具適合在時間有限的情況下進行初步評估，陽性結果建議進一步詳細評估。
                資料來源：研究論文第3、6項引用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;