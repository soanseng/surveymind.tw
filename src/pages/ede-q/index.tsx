"use client";
import React, { useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import CopyResultButton from '@/components/CopyResultButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

// EDE-Q Questions with their types and Chinese translations
const questions = [
  { id: 1, type: 'days', english: "Have you been deliberately trying to limit the amount of food you eat to influence your shape or weight (whether or not you have succeeded)?", chinese: "您曾刻意地嘗試限制自己的食量，以影響您的體型或體重嗎（無論成功與否）？" },
  { id: 2, type: 'days', english: "Have you gone for long periods of time (8 waking hours or more) without eating anything at all in order to influence your shape or weight?", chinese: "您曾為了影響體型或體重，而長時間（清醒狀態達 8 小時或以上）完全不進食嗎？" },
  { id: 3, type: 'days', english: "Have you tried to exclude from your diet any foods that you like in order to influence your shape or weight (whether or not you have succeeded)?", chinese: "您曾為了影響體型或體重，而嘗試不吃任何您喜歡的食物嗎（無論成功與否）？" },
  { id: 4, type: 'days', english: "Have you tried to follow definite rules regarding your eating (for example, a calorie limit) in order to influence your shape or weight (whether or not you have succeeded)?", chinese: "您曾為了影響體型或體重，而嘗試遵守嚴格的飲食規則（例如：卡路里限制）嗎（無論成功與否）？" },
  { id: 5, type: 'days', english: "Have you had a definite desire to have an empty stomach with the aim of influencing your shape or weight?", chinese: "您曾為了影響體型或體重，而明確地渴望維持空腹的感覺嗎？" },
  { id: 6, type: 'days', english: "Have you had a definite desire to have a totally flat stomach?", chinese: "您曾明確地渴望擁有一個完全平坦的腹部嗎？" },
  { id: 7, type: 'days', english: "Has thinking about food, eating or calories made it very difficult to concentrate on things you are interested in (for example, working, following a conversation, or reading)?", chinese: "對於食物、飲食或卡路里的思緒，是否曾讓您難以專注於您感興趣的事物上（例如：工作、對話或閱讀）？" },
  { id: 8, type: 'days', english: "Has thinking about shape or weight made it very difficult to concentrate on things you are interested in (for example, working, following a conversation, or reading)?", chinese: "對於體型或體重的思緒，是否曾讓您難以專注於您感興趣的事物上（例如：工作、對話或閱讀）？" },
  { id: 9, type: 'days', english: "Have you had a definite fear of losing control over eating?", chinese: "您是否曾明確地害怕會對飲食失去控制？" },
  { id: 10, type: 'days', english: "Have you had a definite fear that you might gain weight?", chinese: "您是否曾明確地害怕體重可能會增加？" },
  { id: 11, type: 'days', english: "Have you felt fat?", chinese: "您是否曾感覺自己很胖？" },
  { id: 12, type: 'days', english: "Have you had a strong desire to lose weight?", chinese: "您是否曾有強烈的減重慾望？" },
  { id: 13, type: 'number', english: "Over the past 28 days, how many times have you eaten what other people would regard as an unusually large amount of food (given the circumstances)?", chinese: "在過去 28 天，您總共幾次吃下別人會認為是超乎尋常的大量食物？" },
  { id: 14, type: 'number', english: "On how many of these times did you have a sense of having lost control over your eating (at the time you were eating)?", chinese: "在上述暴食的經驗中，有幾次您感覺對自己的飲食失去控制（在進食的當下）？" },
  { id: 15, type: 'number', english: "Over the past 28 days, on how many DAYS have such episodes of overeating occurred (i.e., you have eaten an unusually large amount of food and have had a sense of loss of control at the time)?", chinese: "在過去 28 天，總共有幾天發生過這類「暴食且失控」的情況？" },
  { id: 16, type: 'number', english: "Over the past 28 days, how many times have you made yourself sick (vomit) as a means of controlling your shape or weight?", chinese: "在過去 28 天，您總共幾次為了控制體型或體重而催吐？" },
  { id: 17, type: 'number', english: "Over the past 28 days, how many times have you taken laxatives as a means of controlling your shape or weight?", chinese: "在過去 28 天，您總共幾次為了控制體型或體重而使用瀉藥？" },
  { id: 18, type: 'number', english: "Over the past 28 days, how many times have you exercised in a driven or compulsive way as a means of controlling your weight, shape or amount of fat, or to burn off calories?", chinese: "在過去 28 天，您總共幾次為了控制體重、體型、脂肪或燃燒卡路里，而進行「強迫性」的運動？" },
  { id: 19, type: 'days', english: "Over the past 28 days, on how many days have you eaten in secret (i.e., furtively)? Do not count episodes of binge eating.", chinese: "在過去 28 天，有幾天您曾秘密地進食？（不包含暴食發作）" },
  { id: 20, type: 'proportion', english: "On what proportion of the times that you have eaten have you felt guilty (felt that you've done wrong) because of its effect on your shape or weight? Do not count episodes of binge eating.", chinese: "在您進食的次數中，有多少比例您會因為食物對體型或體重的影響而感到罪惡感？（不包含暴食發作）" },
  { id: 21, type: 'severity', english: "Over the past 28 days, how concerned have you been about other people seeing you eat? Do not count episodes of binge eating.", chinese: "在過去 28 天，您對於被他人在您進食時看見，有多感到在意？（不包含暴食發作）" },
  { id: 22, type: 'severity', english: "Has your weight influenced how you think about (judge) yourself as a person?", chinese: "您的體重在多大程度上影響了您如何評價自己？" },
  { id: 23, type: 'severity', english: "Has your shape influenced how you think about (judge) yourself as a person?", chinese: "您的體型在多大程度上影響了您如何評價自己？" },
  { id: 24, type: 'severity', english: "How much would it have upset you if you had been asked to weigh yourself once a week (no more, or less, often) for the next four weeks?", chinese: "如果被要求在接下來的四週內每週量一次體重（不能多也不能少），這會讓您多感困擾？" },
  { id: 25, type: 'severity', english: "How dissatisfied have you been with your weight?", chinese: "您對自己的體重有多不滿意？" },
  { id: 26, type: 'severity', english: "How dissatisfied have you been with your shape?", chinese: "您對自己的體型有多不滿意？" },
  { id: 27, type: 'severity', english: "How uncomfortable have you felt seeing your body (for example, seeing your shape in the mirror, in a shop window reflection, while undressing or taking a bath or shower)?", chinese: "當看見自己的身體時（例如：在鏡中、櫥窗倒影、更衣或沐浴時），您有多感到不自在？" },
  { id: 28, type: 'severity', english: "How uncomfortable have you felt about others seeing your shape or figure (for example, in communal changing rooms, when swimming, or wearing tight clothes)?", chinese: "當您的身材或體型被他人看見時（例如：在公共更衣室、游泳、或穿緊身衣物時），您有多感到不自在？" }
];

// Subscale definitions
const subscales = {
  restraint: [1, 2, 3, 4, 5],
  eatingConcern: [7, 9, 19, 20, 21],
  shapeConcern: [6, 8, 10, 11, 23, 26, 27, 28],
  weightConcern: [8, 12, 22, 24, 25]
};

const getScaleOptions = (type: string) => {
  switch (type) {
    case 'days':
      return [
        { value: 0, label: '沒有一天' },
        { value: 1, label: '1-5天' },
        { value: 2, label: '6-12天' },
        { value: 3, label: '13-15天' },
        { value: 4, label: '16-22天' },
        { value: 5, label: '23-27天' },
        { value: 6, label: '每一天' }
      ];
    case 'proportion':
      return [
        { value: 0, label: '沒有一次' },
        { value: 1, label: '很少次' },
        { value: 2, label: '少於一半' },
        { value: 3, label: '一半次數' },
        { value: 4, label: '超過一半' },
        { value: 5, label: '大多數時候' },
        { value: 6, label: '每一次' }
      ];
    case 'severity':
      return [
        { value: 0, label: '完全沒有' },
        { value: 1, label: '輕微' },
        { value: 2, label: '中等' },
        { value: 3, label: '中等' },
        { value: 4, label: '顯著' },
        { value: 5, label: '顯著' },
        { value: 6, label: '極度' }
      ];
    default:
      return [];
  }
};

const Page = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<any>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const { open, setOpen, Content, ContentComponent, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = useResponsiveDialog();

  const calculateScores = () => {
    const subscaleScores: Record<string, number> = {};
    
    Object.keys(subscales).forEach(subscale => {
      const items = subscales[subscale as keyof typeof subscales];
      const validAnswers = items.filter(item => answers[item] !== undefined);
      
      if (validAnswers.length > 0) {
        const sum = validAnswers.reduce((total, item) => total + (answers[item] || 0), 0);
        subscaleScores[subscale] = sum / validAnswers.length;
      } else {
        subscaleScores[subscale] = 0;
      }
    });

    const globalScore = Object.values(subscaleScores).reduce((sum, score) => sum + score, 0) / 4;

    const behaviors = {
      bingeEpisodes: answers[13] || 0,
      lossOfControl: answers[14] || 0,
      bingeDays: answers[15] || 0,
      vomiting: answers[16] || 0,
      laxatives: answers[17] || 0,
      exercise: answers[18] || 0
    };

    return {
      restraint: subscaleScores.restraint,
      eatingConcern: subscaleScores.eatingConcern,
      shapeConcern: subscaleScores.shapeConcern,
      weightConcern: subscaleScores.weightConcern,
      globalScore,
      behaviors
    };
  };

  const getInterpretation = (scores: any) => {
    const { globalScore } = scores;
    
    if (globalScore >= 4) {
      return "您的總分達到臨床顯著水準（≥4分），表示您可能正經歷具有臨床意義的飲食障礙相關困擾。建議您尋求專業的精神科醫師或臨床心理師進行全面評估。";
    } else if (globalScore >= 2.5) {
      return "您的總分處於中等水準（2.5-3.9分），顯示存在一定程度的飲食相關困擾。建議您留意這些症狀的變化，並考慮尋求專業諮詢。";
    } else {
      return "您的總分相對較低（<2.5分），表示目前飲食障礙相關困擾較少。但如果您仍有相關擔憂，建議諮詢專業人士。";
    }
  };

  const getSeverityCategory = (globalScore: number) => {
    if (globalScore >= 4) return "臨床顯著水準";
    if (globalScore >= 2.5) return "中等困擾水準";
    if (globalScore >= 1) return "輕微困擾水準";
    return "最小困擾水準";
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setValidationMessage('');
  };

  const handleNumberChange = (questionId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setAnswers(prev => ({
      ...prev,
      [questionId]: Math.max(0, numValue)
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
    
    const calculatedScores = calculateScores();
    setScores(calculatedScores);
    setValidationMessage('');
    setOpen(true);
  };

  const completedQuestions = Object.keys(answers).length;
  const totalQuestions = questions.length;

  const detailItems = useMemo<AnswerDetailItem[]>(
    () =>
      questions.map((q) => {
        const v = answers[q.id];
        let label = '未作答';
        if (v !== undefined) {
          if (q.type === 'number') {
            label = `${v} 次/天`;
          } else {
            const opt = getScaleOptions(q.type).find(o => o.value === v);
            label = opt ? opt.label : String(v);
          }
        }
        return {
          question: q.chinese,
          answerLabel: label,
          score: v ?? 0,
        };
      }),
    [answers],
  );

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["ede-q"]} path="/ede-q" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">飲食障礙檢查問卷 (EDE-Q 6.0)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一份包含28個題項的自陳式量表，評估您在<strong>過去四週（28天）</strong>內與飲食障礙相關的思想、感受與行為。
          </p>
          <p className="mb-3">
            請仔細閱讀每個問題，並根據您的實際情況誠實回答。對於行為頻率問題，請填寫具體數字。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表為評估工具，不能取代專業診斷。如有疑慮請諮詢精神科醫師或臨床心理師。
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

                {question.type === 'number' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      請填寫次數（0或正整數）：
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleNumberChange(question.id, e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getScaleOptions(question.type).map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value}
                          onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{option.value}: {option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
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
              <TitleComponent>EDE-Q 評估結果</TitleComponent>
              <DescriptionComponent>
                您的飲食障礙檢查問卷結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{scores?.globalScore?.toFixed(2)} / 6.0
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {scores ? getSeverityCategory(scores.globalScore) : ''}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">四個分量表分數：</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>限制: {scores?.restraint?.toFixed(2)}</div>
                    <div>飲食擔憂: {scores?.eatingConcern?.toFixed(2)}</div>
                    <div>體型擔憂: {scores?.shapeConcern?.toFixed(2)}</div>
                    <div>體重擔憂: {scores?.weightConcern?.toFixed(2)}</div>
                  </div>
                </div>

                {scores?.behaviors && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">關鍵行為頻率（過去28天）：</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div>• 暴食發作次數: {scores.behaviors.bingeEpisodes}</div>
                      <div>• 失控暴食天數: {scores.behaviors.bingeDays}</div>
                      <div>• 催吐次數: {scores.behaviors.vomiting}</div>
                      <div>• 使用瀉藥次數: {scores.behaviors.laxatives}</div>
                      <div>• 強迫性運動次數: {scores.behaviors.exercise}</div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">結果解釋：</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {scores ? getInterpretation(scores) : ''}
                  </p>
                </div>

                <AnswerDetailList
                  items={detailItems}
                  totalLabel={`總分 ${scores?.globalScore?.toFixed(2) ?? '0.00'} / 6.0`}
                />

                <div className="pt-4">
                  <ShareButton
                    title="飲食障礙檢查問卷 (EDE-Q 6.0)"
                    text={scores ? `我的總分是${scores.globalScore.toFixed(2)}分，評估為：${getSeverityCategory(scores.globalScore)}` : ''}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <div className="flex flex-wrap gap-2">
                <CopyResultButton
                  title="EDE-Q 飲食障礙檢查問卷結果"
                  summary={[
                    scores ? `總分：${scores.globalScore.toFixed(2)} / 6.0` : '',
                    scores ? `判讀：${getSeverityCategory(scores.globalScore)}` : '',
                    scores ? `限制：${scores.restraint.toFixed(2)}` : '',
                    scores ? `飲食擔憂：${scores.eatingConcern.toFixed(2)}` : '',
                    scores ? `體型擔憂：${scores.shapeConcern.toFixed(2)}` : '',
                    scores ? `體重擔憂：${scores.weightConcern.toFixed(2)}` : '',
                    scores ? `暴食發作次數：${scores.behaviors.bingeEpisodes}` : '',
                    scores ? `失控暴食天數：${scores.behaviors.bingeDays}` : '',
                    scores ? `催吐次數：${scores.behaviors.vomiting}` : '',
                    scores ? `使用瀉藥次數：${scores.behaviors.laxatives}` : '',
                    scores ? `強迫性運動次數：${scores.behaviors.exercise}` : '',
                    scores ? getInterpretation(scores) : '',
                  ]
                    .filter(Boolean)
                    .join('\n')}
                  groups={[
                    { title: '各題作答明細', items: detailItems, totalLabel: `總分 ${scores?.globalScore?.toFixed(2) ?? '0.00'} / 6.0` },
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
                <strong>開發者：</strong>Christopher G. Fairburn 與 Sarah Beglin
              </p>
              <p>
                <strong>版權：</strong>© 2008，供非商業性臨床或研究免費使用
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Fairburn, C. G., & Beglin, S. J. (2008). 
                Eating Disorder Examination Questionnaire (EDE-Q 6.0). 
                In C. G. Fairburn (Ed.), <em>Cognitive behavior therapy and eating disorders</em> (pp. 309-313). 
                Guilford Press.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * EDE-Q是飲食障礙評估的黃金標準工具，源自結構化臨床會談EDE。
                適用於評估過去28天內飲食障礙相關的精神病理，包含四個分量表和關鍵行為頻率。
                中文版已在華人社群得到驗證。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;