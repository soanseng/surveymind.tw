"use client"
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';

const questions = [
  "您是否曾相當努力地避免真實的或想像中的被拋棄？(這不包括自殺或自傷行為)",
  "您是否存在一些讓您陷入麻煩的人際關係？",
  "您對自己的看法是否突然並戲劇性地改變？",
  "您是否在至少兩個可能對自己造成傷害的方面表現得很衝動？(如花錢、性行為、物質濫用、魯莽駕駛、暴飲暴食)",
  "您是否曾反覆嘗試自殺、自殺威脅或者自傷？",
  "您是否存在很多情緒起伏？",
  "您是否經常感到空虛？",
  "您是否經常發脾氣或無法控制您的脾氣？",
  "當您感到不愉快時，您是否會變得多疑或感到自己「失去現實感」？",
  "您是否會感覺身旁的人忽高忽低？前一秒把他們看得很好，下一秒又把他們看得很糟糕？"
];

const getSeverity = (score: number) => {
  if (score >= 7) return '達到臨床切分點 - 強烈建議專業評估';
  if (score >= 5) return '高敏感篩檢範圍 - 建議進一步評估';
  return '低於篩檢標準 - 症狀與BPD不一致';
};

const getInterpretation = (score: number) => {
  if (score >= 7) {
    return "您的得分達到臨床切分點（≥7分），這表示您報告的症狀模式與邊緣性人格障礙症高度一致。研究顯示此切分點具有81%的敏感度和89%的特異度。強烈建議您尋求專業的精神科醫師或臨床心理師進行全面評估。";
  }
  if (score >= 5) {
    return "您的得分處於高敏感篩檢範圍（5-6分），這個分數範圍被設計用來提高篩檢的敏感度（90%）。雖然您可能未達到典型的臨床切分點，但仍建議進行進一步的專業評估，以釐清您的症狀和需求。";
  }
  return "您的得分低於篩檢標準（0-4分），表示您目前報告的症狀與邊緣性人格障礙症的典型表現不一致。然而，如果您仍有情緒困擾或人際關係問題，建議諮詢專業人士以了解其他可能的原因。";
};

const Page = () => {
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
  const [score, setScore] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScore = () => {
    return answers.reduce((total, answer) => {
      return total + (answer === 'yes' ? 1 : 0);
    }, 0);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setValidationMessage('');
  };

  const getUnansweredQuestions = () => {
    const unanswered: number[] = [];
    answers.forEach((answer, index) => {
      if (answer === null || answer === '') {
        unanswered.push(index + 1);
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
    setFormSubmitted(true);
    setValidationMessage('');
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["msi-bpd"]} path="/msi-bpd" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">麥克連邊緣性人格障礙症篩檢量表 (MSI-BPD)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一個包含10個問題的簡短篩檢工具，用於評估邊緣性人格障礙症的可能性。
            請根據您<strong>平時的感受和行為模式</strong>來回答，而非僅考慮當前的狀態。
          </p>
          <p className="mb-3">
            每個問題請回答「是」或「否」。請誠實作答，沒有對錯之分。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師或臨床心理師。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <TitleComponent>MSI-BPD 評估結果</TitleComponent>
              <DescriptionComponent>
                您的邊緣性人格障礙症篩檢結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 10
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {getSeverity(score || 0)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getInterpretation(score || 0)}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">切分點說明：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>≥7分：</strong>臨床切分點（敏感度81%，特異度89%）</li>
                    <li>• <strong>5-6分：</strong>高敏感篩檢範圍（敏感度90%）</li>
                    <li>• <strong>0-4分：</strong>低於篩檢標準</li>
                  </ul>
                </div>

                {score !== null && score >= 5 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">建議下一步：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 尋求精神科醫師或臨床心理師的專業評估</li>
                      <li>• 進行更詳細的結構化診斷性會談</li>
                      <li>• 了解辯證行為治療(DBT)等專門治療方法</li>
                      <li>• 建立穩定的治療關係</li>
                    </ul>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為篩檢工具，不能作為診斷依據</li>
                    <li>• BPD的正式診斷需要專業的臨床評估</li>
                    <li>• 需考量症狀的持續時間和功能影響</li>
                    <li>• 如有自傷或自殺意念，請立即尋求協助</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="麥克連邊緣性人格障礙症篩檢量表 (MSI-BPD)"
                    text={`我的得分是${score}分，結果為：${getSeverity(score || 0)}`}
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

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">量表來源與引用</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>開發者：</strong>Mary C. Zanarini博士及其團隊
              </p>
              <p>
                <strong>開發單位：</strong>麥克連醫院（McLean Hospital），隸屬於哈佛醫學院
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Zanarini, M. C., Vujanovic, A. A., Parachini, E. A., Boulanger, J. L., 
                Frankenburg, F. R., & Hennen, J. (2003). A screening measure for BPD: 
                The McLean Screening Instrument for Borderline Personality Disorder (MSI-BPD). 
                <em>Journal of Personality Disorders</em>, 17(6), 568-573.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * MSI-BPD為公開領域的篩檢工具，已在多項研究中得到驗證，包括中文版的信效度研究。
                本量表的10個題項直接對應DSM診斷準則，具有良好的心理計量特性。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;