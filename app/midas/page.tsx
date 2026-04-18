"use client";

import React, { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { questionnaireSEO } from "@/lib/seo-config";
import { useResponsiveDialog } from "@/hooks/useResponsiveDialog";
import ShareButton from "@/components/ShareButton";
import PrintButton from "@/components/PrintButton";
import AnswerDetailList, { AnswerDetailItem } from "@/components/AnswerDetailList";
import { Button } from "@/components/ui/button";

const MIDAS_QUESTIONS = [
  "因頭痛而無法工作或上學的天數",
  "頭痛使工作或上學效率減半或以上的天數（不含第 1 題天數）",
  "因頭痛而無法做家事的天數",
  "頭痛使家事效率減半或以上的天數（不含第 3 題天數）",
  "因頭痛而無法參與家庭、社交或休閒活動的天數",
];

function cleanDays(input: string): number | null {
  if (input.trim() === "") return null;
  const n = Number(input);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 90) return 90;
  return Math.round(n);
}

function getGrade(total: number): { grade: string; label: string; tone: string } {
  if (total <= 5) return { grade: "I", label: "輕微或無失能", tone: "border-green-400" };
  if (total <= 10) return { grade: "II", label: "輕度失能", tone: "border-yellow-400" };
  if (total <= 20) return { grade: "III", label: "中度失能", tone: "border-amber-500" };
  return { grade: "IV", label: "重度失能", tone: "border-red-500" };
}

export default function MidasPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(MIDAS_QUESTIONS.length).fill(null),
  );
  const [headacheDays, setHeadacheDays] = useState<number | null>(null);
  const [nrs, setNrs] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const {
    open,
    setOpen,
    Content,
    HeaderComponent,
    TitleComponent,
    DescriptionComponent,
    FooterComponent,
    CloseComponent,
  } = useResponsiveDialog();

  const total = useMemo(
    () => answers.reduce<number>((s, v) => s + (v ?? 0), 0),
    [answers],
  );
  const gradeInfo = useMemo(() => getGrade(total), [total]);

  const setAnswer = (idx: number, raw: string) => {
    setAnswers((prev) => prev.map((v, i) => (i === idx ? cleanDays(raw) : v)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    answers.forEach((v, i) => {
      if (v === null) missing.push(`第 ${i + 1} 題`);
    });
    if (headacheDays === null) missing.push("Q A 頭痛總天數");
    if (nrs === null) missing.push("Q B 疼痛強度");

    if (missing.length) {
      setValidationMsg(`請完成：${missing.join("、")}。`);
      return;
    }
    setValidationMsg("");
    setSubmitted(true);
    setOpen(true);
  };

  const detailItems: AnswerDetailItem[] = MIDAS_QUESTIONS.map((q, i) => ({
    question: q,
    answerLabel: `${answers[i] ?? "-"} 天`,
    score: answers[i] ?? "-",
  }));

  const companionItems: AnswerDetailItem[] = [
    {
      question: "A. 過去 3 個月內有頭痛的總天數",
      answerLabel: `${headacheDays ?? "-"} 天`,
    },
    {
      question: "B. 頭痛時平均疼痛程度 (NRS 0–10)",
      answerLabel: `${nrs ?? "-"} / 10`,
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["midas"]} path="/midas" />

      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          MIDAS 偏頭痛失能評估量表
        </h1>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-3">使用說明</h2>
          <p className="mb-2">
            請回想<strong>過去 3 個月</strong>，因頭痛影響到生活的天數。每題以<strong>天數</strong>填寫（0–90）。
          </p>
          <p className="mb-2">
            第 2 題請勿重複計入第 1 題已答的天數；第 4 題請勿重複計入第 3 題已答的天數。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供篩檢參考，不能取代專業診斷。若不確定是否為偏頭痛，請參考{" "}
            <a
              href="https://www.taiwanheadache.org.tw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              台灣頭痛學會 ICHD-3 繁中版
            </a>
            。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {MIDAS_QUESTIONS.map((q, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <label className="block">
                <span className="font-medium">{i + 1}. {q}</span>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={90}
                    step={1}
                    value={answers[i] ?? ""}
                    onChange={(e) => setAnswer(i, e.target.value)}
                    className="w-24 border border-gray-300 rounded px-2 py-1"
                  />
                  <span className="text-sm text-gray-600">天（0–90）</span>
                </div>
              </label>
            </div>
          ))}

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block">
              <span className="font-medium">A. 過去 3 個月內有頭痛的總天數</span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={90}
                  step={1}
                  value={headacheDays ?? ""}
                  onChange={(e) => setHeadacheDays(cleanDays(e.target.value))}
                  className="w-24 border border-gray-300 rounded px-2 py-1"
                />
                <span className="text-sm text-gray-600">天（不計入總分）</span>
              </div>
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="font-medium mb-2">
              B. 頭痛時平均疼痛程度（NRS，0 = 無疼痛，10 = 最劇烈）
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 11 }, (_, i) => i).map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-1 text-sm border border-gray-200 rounded px-2 py-1 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="midas-nrs"
                    checked={nrs === val}
                    onChange={() => setNrs(val)}
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>

          {validationMsg && (
            <p className="text-red-600 text-sm">{validationMsg}</p>
          )}

          <div className="flex justify-center">
            <Button type="submit" size="lg">
              提交並查看結果
            </Button>
          </div>
        </form>

        {submitted && (
          <Content open={open} onOpenChange={setOpen}>
            <div data-print-root>
              <HeaderComponent>
                <TitleComponent>MIDAS 偏頭痛失能評估結果</TitleComponent>
                <DescriptionComponent>
                  第 1–5 題加總，Q A / Q B 為附帶記錄
                </DescriptionComponent>
              </HeaderComponent>

              <div className="print-header hidden print:block mb-6">
                <h1 className="text-lg font-bold">台中文心樂丞、理解身心診所</h1>
                <p className="text-sm">MIDAS 偏頭痛失能評估結果</p>
                <p className="text-xs text-gray-600">
                  作答日期：{new Date().toLocaleDateString("zh-TW")}
                </p>
                <span className="print-section-label">病患基本資料</span>
                <div className="text-xs leading-7">
                  <p>姓名：_______________ 病歷號：_______________</p>
                </div>
                <span className="print-section-label">量表結果</span>
              </div>

              <div className="space-y-4 p-2 sm:p-4">
                <div className={`border-4 ${gradeInfo.tone} rounded-lg p-4 text-center`}>
                  <p className="text-sm text-gray-600">MIDAS 總分</p>
                  <p className="text-4xl font-bold">{total}</p>
                  <p className="mt-2 font-semibold">
                    Grade {gradeInfo.grade} — {gradeInfo.label}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-200 rounded p-2 text-center">
                    <p className="text-xs text-gray-600">頭痛總天數 (A)</p>
                    <p className="font-bold">{headacheDays ?? "-"} 天</p>
                  </div>
                  <div className="border border-gray-200 rounded p-2 text-center">
                    <p className="text-xs text-gray-600">平均 NRS (B)</p>
                    <p className="font-bold">{nrs ?? "-"} / 10</p>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-1">臨床建議</p>
                  <p>
                    建議就診神經內科或頭痛門診。Grade III–IV 者建議與醫師討論預防性治療。若尚未確認是否為偏頭痛，參考{" "}
                    <a
                      href="https://www.taiwanheadache.org.tw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      台灣頭痛學會 ICHD-3 繁中版
                    </a>
                    。
                  </p>
                </div>

                <p className="text-xs text-gray-600">
                  本結果僅供臨床參考，不構成診斷。最終診斷請由專科醫師判斷。
                </p>

                <span className="print-section-label">各題作答明細</span>
                <AnswerDetailList
                  items={detailItems}
                  title="MIDAS 第 1–5 題"
                  totalLabel={`總分 ${total} 分`}
                />
                <AnswerDetailList items={companionItems} title="附帶記錄 (Q A / Q B)" />

                <FooterComponent>
                  <div className="flex flex-wrap gap-2 print:hidden">
                    <PrintButton />
                    <ShareButton
                      title="MIDAS 偏頭痛失能評估結果"
                      text={`MIDAS ${total} 分 (Grade ${gradeInfo.grade} ${gradeInfo.label})，頭痛 ${headacheDays ?? "-"} 天，NRS ${nrs ?? "-"}/10`}
                    />
                    <CloseComponent>關閉</CloseComponent>
                  </div>
                </FooterComponent>

                <div className="print-footer hidden print:block">
                  <strong>台中文心樂丞、理解身心診所</strong> · 陳璿丞醫師
                  <br />
                  報告由 surveymind.tw 產生 · anatomind.com · anxiety.com.tw
                  <br />
                  本結果僅供臨床參考，不構成診斷。最終診斷請由專科醫師判斷。
                </div>
              </div>
            </div>
          </Content>
        )}

        <div className="mt-12 text-xs text-gray-500 border-t pt-4 space-y-1">
          <p>
            <strong>引用：</strong>Stewart WF, Lipton RB, Dowson AJ, Sawyer J. Development and testing of the Migraine Disability Assessment (MIDAS) Questionnaire. <em>Neurology</em> 2001;56(Suppl 1):S20–28.
          </p>
          <p>
            Hung PH, Fuh JL, Wang SJ. Validity, reliability and application of the Taiwan version of the Migraine Disability Assessment Questionnaire. <em>Acta Neurol Taiwan</em> 2006;15:43–48.
          </p>
          <p className="italic">
            中文版驗證：Hung PH, Fuh JL, Wang SJ（台北榮總 / 陽明）。感謝王署君教授團隊。
          </p>
        </div>
      </div>
    </div>
  );
}
