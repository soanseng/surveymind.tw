"use client"
import { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import CopyResultButton from '@/components/CopyResultButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

const optionLabels = ['完全沒有', '有一點', '中等程度', '相當嚴重', '極度嚴重'];

const questions = [
  // B群集：闖入性症狀 (Intrusion Symptoms)
  "出現關於該壓力事件的重複、令人不安且不想要的回憶？",
  "重複夢到關於該壓力事件的、令人不安的夢？", 
  "突然感覺或表現得好像該壓力事件真的再次發生？（例如感覺身歷其境、看到不存在的影像、或在半夢半醒間感覺事件重演）",
  "當某些內部或外部的事物讓您想起該壓力事件時，會感到非常強烈的心理痛苦或情緒困擾？",
  "當某些內部或外部的事物讓您想起該壓力事件時，會出現強烈的生理反應？（例如心跳加速、呼吸困難、流汗、噁心）",
  
  // C群集：持續性逃避 (Persistent Avoidance)
  "努力逃避與該壓力事件相關的、令人不安的回憶、想法或感受？",
  "努力避開會讓您想起該壓力事件的外在事物？（例如：人、地點、對話、活動、物品或情境）",
  
  // D群集：認知與情緒的負向改變 (Negative Alterations in Cognitions and Mood)
  "無法回憶起該壓力事件的重要部分？（通常是因為解離性失憶，而非頭部受傷或藥物、酒精影響）",
  "對於自己、他人或這個世界，抱持持續且過度負面的看法或預期？（例如：「我很糟糕」、「沒有人可以信任」、「這個世界充滿危險」）",
  "對於該壓力事件的起因或後果，持續地扭曲認知，導致責怪自己或他人？",
  "持續地處於負面情緒狀態？（例如：恐懼、驚駭、憤怒、罪惡感或羞愧）",
  "對於過去曾參與的重要活動，顯著地失去興趣或減少參與？",
  "感覺到與他人疏離或疏遠？",
  "持續地無法體驗正面情緒？（例如：無法感受到快樂、滿足或愛的感覺）",
  
  // E群集：警覺性與反應性的顯著改變 (Marked Alterations in Arousal and Reactivity)
  "出現易怒行為或無端暴怒（在很少或沒有誘因下），並通常表現為對人或物的言語或肢體攻擊？",
  "從事魯莽或自我毀滅的行為？",
  "過度警覺（hypervigilance）？",
  "有過度的驚嚇反應（startle response）？",
  "難以集中注意力？",
  "有睡眠困擾？（例如：難以入睡、難以維持睡眠，或睡不安穩）"
];

const symptomClusters = {
  B: { name: "闖入性症狀", range: [0, 4], required: 1 },
  C: { name: "持續性逃避", range: [5, 6], required: 1 },
  D: { name: "認知與情緒負向改變", range: [7, 13], required: 2 },
  E: { name: "警覺性與反應性改變", range: [14, 19], required: 2 }
};

const getSeverity = (score: number | null) => {
  if (score == null) return "請先提供分數";
  if (score < 31) return '低風險 - 較不可能有PTSD症狀';
  if (score < 33) return '中等風險 - 建議進一步評估';
  return '高風險 - 強烈建議專業評估';
};

const getInterpretation = (score: number | null) => {
  if (score == null) return "";
  if (score < 31) {
    return "您的得分低於篩檢標準，顯示較不可能有創傷後壓力症候群的症狀。這個結果並不能完全排除PTSD的可能性，如果您仍有相關困擾，建議諮詢專業醫師。";
  }
  if (score < 33) {
    return "您的得分在篩檢臨界範圍內，顯示可能存在一些創傷後壓力相關症狀。建議您尋求專業的心理健康評估，以進一步了解您的狀況並獲得適當的協助。";
  }
  return "您的得分達到高風險範圍，強烈建議您尋求專業的心理健康評估。這並不代表確診，但表示您可能正在經歷創傷後壓力症候群的相關症狀，專業協助對您會很有幫助。";
};

const checkProvisionalDiagnosis = (answers: (string | null)[]) => {
  const clusters = { B: 0, C: 0, D: 0, E: 0 };
  
  Object.entries(symptomClusters).forEach(([cluster, info]) => {
    for (let i = info.range[0]; i <= info.range[1]; i++) {
      const score = parseInt(answers[i] || '0');
      if (score >= 2) { // 中等程度或以上視為症狀存在
        clusters[cluster as keyof typeof clusters]++;
      }
    }
  });
  
  const meetsB = clusters.B >= symptomClusters.B.required;
  const meetsC = clusters.C >= symptomClusters.C.required;
  const meetsD = clusters.D >= symptomClusters.D.required;
  const meetsE = clusters.E >= symptomClusters.E.required;
  
  return {
    meets: meetsB && meetsC && meetsD && meetsE,
    clusters,
    details: { meetsB, meetsC, meetsD, meetsE }
  };
};

const Page = () => {
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
  const [score, setScore] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, TriggerComponent, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScore = () => {
    return answers.reduce((total, answer) => {
      return total + (parseInt(answer || '0'));
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
      if (unansweredQuestions.length > 5) {
        setValidationMessage(`還有 ${unansweredQuestions.length} 題尚未作答，請完成所有題目後再提交。`);
      } else {
        setValidationMessage(`請回答第 ${unansweredQuestions.join('、')} 題後再提交。`);
      }
      return;
    }
    
    const totalScore = calculateScore();
    setScore(totalScore);
    setFormSubmitted(true);
    setValidationMessage('');
    setOpen(true);
  };

  const provisionalDiagnosis = formSubmitted ? checkProvisionalDiagnosis(answers) : null;

  const detailItems = useMemo<AnswerDetailItem[]>(
    () =>
      questions.map((q, i) => {
        const v = answers[i];
        const n = v !== null && v !== '' ? parseInt(v, 10) : null;
        const cluster = i <= 4 ? 'B 闖入' : i <= 6 ? 'C 逃避' : i <= 13 ? 'D 認知情緒' : 'E 警覺反應';
        return {
          question: q,
          answerLabel: n !== null ? optionLabels[n] : '未作答',
          score: n ?? 0,
          note: `群集：${cluster}`,
        };
      }),
    [answers],
  );

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["pcl-5"]} path="/pcl-5" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">創傷後壓力症候群檢核表 (PCL-5)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            在開始填寫前，請先在心中清楚地設定一個特定的「壓力事件」或「創傷經驗」。
            接下來的20個問題，都是圍繞這個特定事件對您造成的影響。
          </p>
          <p className="mb-3">
            本量表評估的是您在「<strong>過去一個月</strong>」內，被各項症狀困擾的嚴重程度。
            請根據您最真實的感受作答。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。如有疑慮請諮詢精神科醫師。
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => {
            const isUnanswered = answers[index] === null || answers[index] === '';
            let clusterInfo = '';
            if (index <= 4) clusterInfo = 'B群集：闖入性症狀';
            else if (index <= 6) clusterInfo = 'C群集：持續性逃避';
            else if (index <= 13) clusterInfo = 'D群集：認知與情緒負向改變';
            else clusterInfo = 'E群集：警覺性與反應性改變';
            
            return (
              <div 
                key={index} 
                className={`bg-white p-4 rounded-lg shadow-sm border-2 transition-colors ${
                  isUnanswered && validationMessage 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="mb-2">
                  <span className="text-xs text-blue-600 font-medium">{clusterInfo}</span>
                </div>
                <h3 className={`text-base font-medium mb-3 ${
                  isUnanswered && validationMessage ? 'text-red-800' : 'text-gray-900'
                }`}>
                  {index + 1}. {question}
                  {isUnanswered && validationMessage && (
                    <span className="ml-2 text-red-600 text-sm">*未作答</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: '0', label: '完全沒有' },
                    { value: '1', label: '有一點' },
                    { value: '2', label: '中等程度' },
                    { value: '3', label: '相當嚴重' },
                    { value: '4', label: '極度嚴重' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option.value}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{option.label}</span>
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
              <TitleComponent>PCL-5 評估結果</TitleComponent>
              <DescriptionComponent>
                您的創傷後壓力症候群評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 80
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
                  items={detailItems}
                  totalLabel={`總分 ${score ?? 0} / 80`}
                />

                {provisionalDiagnosis && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">症狀群集分析：</h4>
                    <div className="text-sm space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>B群集（闖入）: {provisionalDiagnosis.clusters.B}/{symptomClusters.B.required}</div>
                        <div>C群集（逃避）: {provisionalDiagnosis.clusters.C}/{symptomClusters.C.required}</div>
                        <div>D群集（認知情緒）: {provisionalDiagnosis.clusters.D}/{symptomClusters.D.required}</div>
                        <div>E群集（警覺反應）: {provisionalDiagnosis.clusters.E}/{symptomClusters.E.required}</div>
                      </div>
                      <p className="pt-2 font-medium">
                        DSM-5暫定標準：{provisionalDiagnosis.meets ? '符合' : '不符合'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 本量表為篩檢工具，不能作為診斷依據</li>
                    <li>• 篩檢臨界值為31-33分</li>
                    <li>• 症狀群集分析僅供參考，正式診斷需專業評估</li>
                    <li>• 如有疑慮請諮詢精神科或創傷專業醫師</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="創傷後壓力症候群檢核表 (PCL-5)"
                    text={`我的得分是${score}分，結果為：${getSeverity(score)}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <div className="flex flex-wrap gap-2">
                <CopyResultButton
                  title="PCL-5 創傷後壓力症候群檢核表結果"
                  summary={[
                    `總分：${score ?? 0} / 80`,
                    `判讀：${getSeverity(score)}`,
                    provisionalDiagnosis
                      ? `B 闖入 ${provisionalDiagnosis.clusters.B}/${symptomClusters.B.required}；C 逃避 ${provisionalDiagnosis.clusters.C}/${symptomClusters.C.required}；D 認知情緒 ${provisionalDiagnosis.clusters.D}/${symptomClusters.D.required}；E 警覺反應 ${provisionalDiagnosis.clusters.E}/${symptomClusters.E.required}`
                      : '',
                    provisionalDiagnosis
                      ? `DSM-5 暫定標準：${provisionalDiagnosis.meets ? '符合' : '不符合'}`
                      : '',
                    getInterpretation(score),
                  ]
                    .filter(Boolean)
                    .join('\n')}
                  groups={[
                    { title: '各題作答明細', items: detailItems, totalLabel: `總分 ${score ?? 0} / 80` },
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
                <strong>開發單位：</strong>美國退伍軍人事務部國家創傷後壓力症候群中心
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Weathers, F.W., Litz, B.T., Keane, T.M., Palmieri, P.A., Marx, B.P., & Schnurr, P.P. (2013). 
                The PTSD Checklist for DSM-5 (PCL-5). 
                <em>National Center for PTSD</em>. 
                Available from: https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * PCL-5為公開領域工具，可免費用於非商業目的。
                本量表完全對應DSM-5診斷標準，為PTSD自我評估的黃金標準。
                資料來源：研究論文第1-3項引用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;