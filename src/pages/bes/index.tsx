"use client";
import React, { useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { questionnaireSEO } from '@/lib/seo-config';
import { useResponsiveDialog } from '@/hooks/useResponsiveDialog';
import ShareButton from '@/components/ShareButton';
import CopyResultButton from '@/components/CopyResultButton';
import AnswerDetailList, { AnswerDetailItem } from '@/components/AnswerDetailList';

// BES Questions with weighted options
const questions = [
  {
    id: 1,
    english: "Weight and body size consciousness when with others",
    chinese: "與他人在一起時對體重或身材的不自在感",
    options: [
      { value: 0, english: "I don't feel self-conscious about my weight or body size when I'm with others.", chinese: "我和他人在一起時，不會對自己的體重或身材感到不自在。" },
      { value: 1, english: "I feel concerned about how I look to others, but it normally does not make me feel disappointed with myself.", chinese: "我會在意別人怎麼看我，但通常不會因此對自己感到失望。" },
      { value: 2, english: "I do get self-conscious about my appearance and weight which makes me feel disappointed in myself.", chinese: "我確實會對自己的外表和體重感到不自在，這讓我對自己感到失望。" },
      { value: 3, english: "I feel very self-conscious about my weight and frequently, I feel intense shame and disgust for myself. I try to avoid social contacts because of my self-consciousness.", chinese: "我對自己的體重非常不自在，且經常對自己感到強烈的羞恥和厭惡。我會因為這種不自在而試圖避免社交。" }
    ]
  },
  {
    id: 2,
    english: "Eating pace and manner",
    chinese: "進食速度與方式",
    options: [
      { value: 0, english: "I don't have any difficulty eating slowly in the proper manner.", chinese: "我能用適當的方式從容地進食，沒有任何困難。" },
      { value: 1, english: "Although I seem to \"gobble down\" foods, I don't end up feeling stuffed because of eating too much.", chinese: "雖然我好像會狼吞虎嚥，但我不會因為吃太多而感到撐。" },
      { value: 2, english: "At times, I tend to eat quickly and then, I feel uncomfortably full afterwards.", chinese: "有時候我會吃得很快，然後感到不舒服的飽脹感。" },
      { value: 3, english: "I have the habit of bolting down my food, without really chewing it. When this happens I usually feel uncomfortably stuffed because I've eaten too much.", chinese: "我習慣狼吞虎嚥，沒怎麼咀嚼。發生這種情況時，我通常會因為吃太多而感到非常不舒服的飽脹感。" }
    ]
  },
  {
    id: 3,
    english: "Control over eating urges",
    chinese: "對進食衝動的控制",
    options: [
      { value: 0, english: "I feel capable to control my eating urges when I want to.", chinese: "當我想控制時，我覺得自己有能力控制進食的衝動。" },
      { value: 1, english: "I feel like I have failed to control my eating more than the average person.", chinese: "我覺得自己比一般人更無法控制飲食。" },
      { value: 2, english: "I feel utterly helpless when it comes to feeling in control of my eating urges.", chinese: "對於控制進食的衝動，我感到完全無助。" },
      { value: 3, english: "Because I feel so helpless about controlling my eating I have become very desperate about trying to get in control.", chinese: "因為對控制飲食感到無助，我變得非常渴望能重新掌控一切。" }
    ]
  },
  {
    id: 4,
    english: "Eating when bored",
    chinese: "無聊時進食",
    options: [
      { value: 0, english: "I don't have the habit of eating when I'm bored.", chinese: "我沒有在無聊時進食的習慣。" },
      { value: 1, english: "I sometimes eat when I'm bored, but often I'm able to \"get busy\" and get my mind off food.", chinese: "我有時在無聊時會吃東西，但通常我能讓自己忙起來，轉移對食物的注意力。" },
      { value: 2, english: "I have a regular habit of eating when I'm bored, but occasionally, I can use some other activity to get my mind off eating.", chinese: "我習慣在無聊時吃東西，但偶爾我能透過其他活動來轉移注意力。" },
      { value: 3, english: "I have a strong habit of eating when I'm bored. Nothing seems to help me break the habit.", chinese: "我有強烈的在無聊時進食的習慣，似乎沒有任何方法能幫我改掉。" }
    ]
  },
  {
    id: 5,
    english: "Physical vs psychological hunger",
    chinese: "身體與心理飢餓感",
    options: [
      { value: 0, english: "I'm usually physically hungry when I eat something.", chinese: "我通常是在身體感到飢餓時才吃東西。" },
      { value: 1, english: "Occasionally, I eat something on impulse even though I really am not hungry.", chinese: "偶爾，即使我並不真的餓，我也會衝動地吃東西。" },
      { value: 2, english: "I have the regular habit of eating foods, that I might not really enjoy, to satisfy a hungry feeling even though physically, I don't need the food.", chinese: "我習慣吃一些我可能並不真正喜歡的食物，來滿足一種飢餓感，即使我的身體並不需要食物。" },
      { value: 3, english: "Although I'm not physically hungry, I get a hungry feeling in my mouth that only seems to be satisfied when I eat a food, like a sandwich, that fills my mouth. Sometimes, when I eat the food to satisfy my mouth hunger, I then spit the food out so I won't gain weight.", chinese: "雖然身體不餓，但我的嘴巴會有一種飢餓感，似乎只有吃像三明治這種能塞滿嘴的食物才能滿足。有時為了滿足口腹之慾，我會把食物吐掉以免增重。" }
    ]
  },
  {
    id: 6,
    english: "Guilt after overeating",
    chinese: "過量進食後的罪惡感",
    options: [
      { value: 0, english: "I don't feel any guilt or self-hate after I overeat.", chinese: "我在過量進食後，不會感到任何罪惡感或自我憎恨。" },
      { value: 1, english: "After I overeat, occasionally I feel guilt or self-hate.", chinese: "在過量進食後，我偶爾會感到罪惡感或自我憎恨。" },
      { value: 2, english: "Almost all the time I experience strong guilt or self-hate after I overeat.", chinese: "我幾乎總是在過量進食後，感到強烈的罪惡感或自我憎恨。" }
    ]
  },
  {
    id: 7,
    english: "Dieting and loss of control",
    chinese: "節食與失控",
    options: [
      { value: 0, english: "I don't lose total control of my eating when dieting even after periods when I overeat.", chinese: "即使在過量進食後，我節食時也不會完全失控。" },
      { value: 1, english: "Sometimes when I eat a \"forbidden food\" on a diet, I feel like I \"blew it\" and eat even more.", chinese: "有時當我在節食期間吃了「禁忌食物」，我會覺得「毀了」，然後吃得更多。" },
      { value: 2, english: "Frequently, I have the habit of saying to myself, \"I've blown it now, why not go all the way\" when I overeat on a diet. When that happens I eat even more.", chinese: "當我在節食期間過量進食時，我經常對自己說：「既然已經毀了，何不乾脆吃個夠」，然後我就會吃得更多。" },
      { value: 3, english: "I have a regular habit of starting strict diets for myself, but I break the diets by going on an eating binge. My life seems to be either a \"feast\" or \"famine.\"", chinese: "我習慣為自己制定嚴格的飲食計畫，但卻會用暴食來打破它。我的生活似乎總是在「盛宴」與「飢荒」之間擺盪。" }
    ]
  },
  {
    id: 8,
    english: "Frequency of overeating",
    chinese: "過量進食的頻率",
    options: [
      { value: 0, english: "I rarely eat so much food that I feel uncomfortably stuffed afterwards.", chinese: "我很少會吃到讓自己感到不舒服的飽脹。" },
      { value: 1, english: "Usually about once a month, I eat such a quantity of food, I end up feeling very stuffed.", chinese: "通常大約一個月一次，我會吃下大量的食物，最後感到非常飽脹。" },
      { value: 2, english: "I have regular periods during the month when I eat large amounts of food, either at mealtime or at snacks.", chinese: "我每個月都有固定的時期會大量進食，無論是正餐或點心。" },
      { value: 3, english: "I eat so much food that I regularly feel quite uncomfortable after eating and sometimes a bit nauseous.", chinese: "我經常吃得太多，以至於飯後常感到非常不舒服，有時甚至有點噁心。" }
    ]
  },
  {
    id: 9,
    english: "Calorie intake patterns",
    chinese: "卡路里攝取模式",
    options: [
      { value: 0, english: "My level of calorie intake does not go up very high or go down very low on a regular basis.", chinese: "我的卡路里攝取量不會規律地忽高忽低。" },
      { value: 1, english: "Sometimes after I overeat, I will try to reduce my caloric intake to almost nothing to compensate for the excess calories I've eaten.", chinese: "有時在過量進食後，我會試圖將卡路里攝取量降至幾乎為零，以彌補多吃的熱量。" },
      { value: 2, english: "I have a regular habit of overeating during the night. It seems that my routine is not to be hungry in the morning but overeat in the evening.", chinese: "我有在夜間過量進食的習慣。我的常態似乎是早上不餓，但晚上會過量進食。" },
      { value: 3, english: "In my adult years, I have had week-long periods where I practically starve myself. This follows periods when I overeat. It seems I live a life of either \"feast or famine.\"", chinese: "在成年後，我曾有過長達一週幾乎不吃東西的時期，這通常發生在過量進食之後。我的生活似乎總是在「盛宴」與「飢荒」之間擺盪。" }
    ]
  },
  {
    id: 10,
    english: "Preoccupation with food",
    chinese: "對食物的專注",
    options: [
      { value: 0, english: "I am not preoccupied with the thought of food.", chinese: "我不會滿腦子想著食物。" },
      { value: 1, english: "I am preoccupied with the thought of food, but I am not driven to eat.", chinese: "我會想著食物，但不會被驅使去吃。" },
      { value: 2, english: "I feel that I am driven to eat and I am preoccupied with the thought of food.", chinese: "我覺得自己被驅使去吃，而且滿腦子想著食物。" },
      { value: 3, english: "Most of my days seem to be pre-occupied with thoughts about food. I feel like I live to eat.", chinese: "我的大部分時間似乎都想著食物。我覺得我活著就是為了吃。" }
    ]
  },
  {
    id: 11,
    english: "Eating in secret",
    chinese: "秘密進食",
    options: [
      { value: 0, english: "I don't have a problem with eating in secret.", chinese: "我沒有秘密進食的問題。" },
      { value: 1, english: "I am embarrassed about overeating and I prefer to eat alone.", chinese: "我對過量進食感到尷尬，所以我偏好獨自進食。" },
      { value: 2, english: "I feel so ashamed about overeating that I pick times to overeat when I know no one will see me. I feel like a \"closet eater.\"", chinese: "我對過量進食感到非常羞恥，所以我會挑沒人看見的時候才過量進食。我覺得自己像個「躲在衣櫃裡的進食者」。" }
    ]
  },
  {
    id: 12,
    english: "Eating patterns",
    chinese: "進食模式",
    options: [
      { value: 0, english: "I have three meals a day with an occasional planned snack.", chinese: "我一天三餐，偶爾有計畫地吃點心。" },
      { value: 1, english: "I eat moderately, that is, more than three times a day.", chinese: "我適量地吃，也就是一天超過三次。" },
      { value: 2, english: "There are regular periods when I seem to be continually eating, with no planned meals.", chinese: "我有固定的時期似乎會持續地進食，沒有計畫好的正餐。" }
    ]
  },
  {
    id: 13,
    english: "Ability to stop eating",
    chinese: "停止進食的能力",
    options: [
      { value: 0, english: "I am able to stop eating when I want to. I know when \"enough is enough\".", chinese: "我想停的時候就能停止進食。我知道「適可而止」。" },
      { value: 1, english: "I usually can stop eating when I want to but I overeat on occasion.", chinese: "我通常想停的時候就能停，但偶爾會過量進食。" },
      { value: 2, english: "I have a problem not being able to stop eating when I want to.", chinese: "我有無法在想停的時候停止進食的問題。" },
      { value: 3, english: "I feel incapable of controlling urges to eat. I have a fear of not being able to stop eating voluntarily.", chinese: "我覺得自己無法控制進食的衝動。我害怕無法自願地停止進食。" }
    ]
  },
  {
    id: 14,
    english: "Weight control preoccupation",
    chinese: "體重控制的專注",
    options: [
      { value: 0, english: "I don't think much about trying to control my weight.", chinese: "我不太想著要控制體重。" },
      { value: 1, english: "I am conscious of my weight and I try to control it by watching what I eat.", chinese: "我會注意自己的體重，並試圖透過注意飲食來控制它。" },
      { value: 2, english: "I am very preoccupied with my weight. I am constantly watching my weight by going on diets.", chinese: "我非常在意我的體重。我經常透過節食來注意體重。" },
      { value: 3, english: "It seems to me that most of my waking hours are pre-occupied by thoughts about eating or not eating. I feel like I'm constantly struggling not to eat.", chinese: "我的大部分清醒時間似乎都想著吃或不吃。我覺得自己一直在掙扎著不要吃東西。" }
    ]
  },
  {
    id: 15,
    english: "Binge eating problem",
    chinese: "暴食問題",
    options: [
      { value: 0, english: "I don't have any problem with binge-eating.", chinese: "我沒有任何暴食的問題。" },
      { value: 1, english: "I binge-eat on occasion.", chinese: "我偶爾會暴食。" },
      { value: 2, english: "I binge-eat on a regular basis.", chinese: "我會規律地暴食。" },
      { value: 3, english: "I have a serious problem with binge-eating.", chinese: "我有嚴重的暴食問題。" }
    ]
  },
  {
    id: 16,
    english: "Vomiting after binge eating",
    chinese: "暴食後嘔吐",
    options: [
      { value: 0, english: "I don't feel any need to vomit after I binge-eat.", chinese: "我在暴食後不覺得有任何需要嘔吐的感覺。" },
      { value: 1, english: "After I binge-eat, I have an impulse to vomit to get rid of the food.", chinese: "在暴食後，我有想嘔吐以擺脫食物的衝動。" },
      { value: 2, english: "After I binge-eat, I have a strong urge to vomit.", chinese: "在暴食後，我有強烈的嘔吐衝動。" },
      { value: 3, english: "Because I have a problem not being able to stop eating when I want, I sometimes have to induce vomiting to relieve my stuffed feeling.", chinese: "因為我有無法在想停的時候停止進食的問題，我有時必須催吐來緩解飽脹感。" }
    ]
  }
];

const getSeverity = (score: number) => {
  if (score >= 27) return '重度暴食問題';
  if (score >= 18) return '中度暴食問題';
  return '輕微或無暴食問題';
};

const getInterpretation = (score: number) => {
  if (score >= 27) {
    return "您的得分顯示有重度暴食問題（≥27分）。這表示您有頻繁且嚴重的暴食症狀，強烈建議立即尋求專業醫療評估與治療。暴食症是一種可治療的疾病，專業的心理治療和醫療支持能夠顯著改善症狀。";
  } else if (score >= 18) {
    return "您的得分顯示有中度暴食問題（18-26分）。這提示存在中等程度的暴食行為與困擾，值得關注並可能需要專業協助。建議您諮詢精神科醫師或臨床心理師，了解適當的治療選項。";
  } else {
    return "您的得分顯示輕微或無暴食問題（≤17分）。這表示您幾乎沒有或只有極輕微的暴食相關行為與困擾。如果您仍有飲食相關的困擾，建議諮詢專業人士以了解其他可能的原因。";
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
      <SEOHead config={questionnaireSEO["bes"]} path="/bes" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">暴食量表 (BES)</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">使用說明</h2>
          <p className="mb-3">
            這是一份包含16個題項的自陳式量表，專門用來評估與暴食行為相關的症狀嚴重程度。
            每個題項都提供多個描述不同嚴重程度的陳述句。
          </p>
          <p className="mb-3">
            請在每一組陳述句中，選擇最能描述您感受與行為的一句。請根據您平時的狀況誠實作答。
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

                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option.value} className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                        className="mr-3 mt-1 h-4 w-4 text-blue-600 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          ({option.value}) {option.chinese}
                        </div>
                        <div className="text-xs text-gray-600 italic">
                          {option.english}
                        </div>
                      </div>
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
              <TitleComponent>BES 評估結果</TitleComponent>
              <DescriptionComponent>
                您的暴食量表評估結果
              </DescriptionComponent>
            </HeaderComponent>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    總分：{score} / 46
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

                <AnswerDetailList
                  items={detailItems}
                  totalLabel={`總分 ${score ?? 0} / 46`}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">BES評分標準：</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>≥27分：</strong>重度暴食問題，建議立即專業治療</li>
                    <li>• <strong>18-26分：</strong>中度暴食問題，建議專業評估</li>
                    <li>• <strong>≤17分：</strong>輕微或無暴食問題</li>
                  </ul>
                </div>

                {score !== null && score >= 18 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">建議下一步：</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 尋求精神科醫師或臨床心理師的專業評估</li>
                      <li>• 考慮認知行為治療(CBT)等實證治療方法</li>
                      <li>• 諮詢營養師建立健康的飲食模式</li>
                      <li>• 如有需要，探討藥物治療選項</li>
                    </ul>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">重要說明：</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• BES專門評估暴食相關的主觀困擾程度</li>
                    <li>• 不僅評估行為，更關注情緒與認知層面</li>
                    <li>• 適合追蹤暴食問題的治療進展</li>
                    <li>• 如有疑慮請諮詢專業醫療人員</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <ShareButton 
                    title="暴食量表 (BES)"
                    text={`我的得分是${score}分，評估為：${getSeverity(score || 0)}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            </div>

            <FooterComponent>
              <div className="flex flex-wrap gap-2">
                <CopyResultButton
                  title="BES 暴食量表結果"
                  summary={[
                    `總分：${score ?? 0} / 46`,
                    `判讀：${getSeverity(score ?? 0)}`,
                    getInterpretation(score ?? 0),
                  ]
                    .filter(Boolean)
                    .join('\n')}
                  groups={[
                    { title: '各題作答明細', items: detailItems, totalLabel: `總分 ${score ?? 0} / 46` },
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
                <strong>開發者：</strong>Gormally 及其同事
              </p>
              <p>
                <strong>開發年份：</strong>1982年
              </p>
              <p>
                <strong>引用格式 (APA)：</strong>
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500 font-mono text-xs leading-relaxed">
                Gormally, J., Black, S., Daston, S., & Rardin, D. (1982). 
                The assessment of binge eating severity among obese persons. 
                <em>Addictive Behaviors</em>, 7(1), 47-55.
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * BES專門評估暴食相關症狀的嚴重程度，採用獨特的多選項陳述句格式，
                能夠捕捉比純粹頻率計算更為細膩的主觀痛苦程度。
                華人版本(SCBES)已通過驗證，適用於此文化脈絡。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;