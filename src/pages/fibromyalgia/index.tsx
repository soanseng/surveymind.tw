"use client";

import React, { useMemo, useState } from "react";
import SEOHead from "@/components/SEOHead";
import { questionnaireSEO } from "@/lib/seo-config";
import { useResponsiveDialog } from "@/hooks/useResponsiveDialog";
import ShareButton from "@/components/ShareButton";
import AnswerDetailList, { AnswerDetailItem } from "@/components/AnswerDetailList";
import { Button } from "@/components/ui/button";
import FibroBodyMap from "./body-map";
import {
  WPI_PARTS,
  REGION_LABELS,
  SSS_CORE_LABELS,
  SSS_CORE_ITEMS,
  SSS_SOMATIC_LABELS,
  SSS_SOMATIC_ITEMS,
  computeScore,
  type FibroScore,
} from "./logic";

export default function FibromyalgiaPage() {
  const [wpiChecked, setWpiChecked] = useState<boolean[]>(
    Array(WPI_PARTS.length).fill(false),
  );
  const [sssCore, setSssCore] = useState<(number | null)[]>(
    Array(SSS_CORE_ITEMS.length).fill(null),
  );
  const [sssSomatic, setSssSomatic] = useState<(number | null)[]>(
    Array(SSS_SOMATIC_ITEMS.length).fill(null),
  );
  const [durationMet, setDurationMet] = useState<boolean | null>(null);
  const [nrs, setNrs] = useState<number | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const {
    open,
    setOpen,
    TriggerComponent,
    Content,
    ContentComponent,
    HeaderComponent,
    TitleComponent,
    DescriptionComponent,
    FooterComponent,
    CloseComponent,
  } = useResponsiveDialog();

  const score = useMemo(
    () => computeScore(wpiChecked, sssCore, sssSomatic, durationMet ?? false, nrs),
    [wpiChecked, sssCore, sssSomatic, durationMet, nrs],
  );

  const toggleWpi = (idx: number) => {
    setWpiChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (sssCore.some((v) => v === null)) missing.push("SSS 核心症狀");
    if (sssSomatic.some((v) => v === null)) missing.push("SSS 身體症狀");
    if (durationMet === null) missing.push("症狀持續時間");
    if (nrs === null) missing.push("疼痛強度 NRS");

    if (missing.length) {
      setValidationMsg(`請完成：${missing.join("、")}。`);
      return;
    }
    setValidationMsg("");
    setSubmitted(true);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4">
      <SEOHead config={questionnaireSEO["fibromyalgia"]} path="/fibromyalgia" />

      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          纖維肌痛症 (ACR 2016 WPI+SSS)
        </h1>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-3">使用說明</h2>
          <p className="mb-2">
            本量表依據 <strong>ACR 2016 纖維肌痛症診斷準則</strong>（Wolfe 等人）計算 WPI（廣泛疼痛指數）、SSS（症狀嚴重度分數）、FS（纖維肌痛分數）。
          </p>
          <p className="mb-2">
            結果包含 NRS 疼痛強度，並對照台灣健保 pregabalin / duloxetine 給付之量表門檻（需符合診斷準則且 NRS ≥ 6）。
          </p>
          <p className="text-sm text-gray-600">
            <strong>重要提醒：</strong>本量表僅供臨床參考，診斷仍需醫師判斷。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Part 1 — WPI */}
          <section>
            <h2 className="text-xl font-bold mb-2">
              Part 1 — 廣泛疼痛指數 (WPI)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              請勾選過去 <strong>1 週內</strong>有疼痛的部位（可複選，共 19 部位）。
            </p>
            <FibroBodyMap selected={wpiChecked} onToggle={toggleWpi} />
            <p className="text-sm text-gray-700">
              已勾選：<strong>{score.wpi}</strong> / 19 部位，疼痛區域數：
              <strong>{score.regionsWithPain}</strong> / 5。
            </p>
          </section>

          {/* Part 2 — SSS core */}
          <section>
            <h2 className="text-xl font-bold mb-2">
              Part 2 — 症狀嚴重度 (SSS)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              請評估過去 <strong>1 週內</strong>下列三項症狀的嚴重程度。
            </p>
            {SSS_CORE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 mb-3"
              >
                <p className="font-medium mb-2">{item}</p>
                <div className="flex flex-wrap gap-3">
                  {SSS_CORE_LABELS.map((lbl, val) => (
                    <label
                      key={val}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name={`sss-core-${idx}`}
                        checked={sssCore[idx] === val}
                        onChange={() =>
                          setSssCore((prev) =>
                            prev.map((v, i) => (i === idx ? val : v)),
                          )
                        }
                      />
                      {val} — {lbl}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-sm text-gray-600 mt-4 mb-2">
              請回答過去 <strong>6 個月內</strong>是否出現下列症狀。
            </p>
            {SSS_SOMATIC_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 mb-3"
              >
                <p className="font-medium mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  {SSS_SOMATIC_LABELS.map((lbl, val) => (
                    <label
                      key={val}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name={`sss-somatic-${idx}`}
                        checked={sssSomatic[idx] === val}
                        onChange={() =>
                          setSssSomatic((prev) =>
                            prev.map((v, i) => (i === idx ? val : v)),
                          )
                        }
                      />
                      {val} — {lbl}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Part 3 — duration */}
          <section>
            <h2 className="text-xl font-bold mb-2">Part 3 — 症狀持續時間</h2>
            <p className="text-sm text-gray-600 mb-3">
              ACR 2016 診斷準則要求症狀需持續相似強度 3 個月以上。
            </p>
            <div className="border border-gray-200 rounded-lg p-4 flex flex-wrap gap-4">
              {[
                { val: true, lbl: "是，已持續 3 個月以上" },
                { val: false, lbl: "否，未達 3 個月" },
              ].map((opt) => (
                <label
                  key={String(opt.val)}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="duration"
                    checked={durationMet === opt.val}
                    onChange={() => setDurationMet(opt.val)}
                  />
                  {opt.lbl}
                </label>
              ))}
            </div>
          </section>

          {/* Part 4 — NRS */}
          <section>
            <h2 className="text-xl font-bold mb-2">Part 4 — 疼痛強度 (NRS)</h2>
            <p className="text-sm text-gray-600 mb-3">
              過去 1 週平均疼痛強度，0 = 無疼痛，10 = 最劇烈的疼痛。
            </p>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 11 }, (_, i) => i).map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-1 text-sm border border-gray-200 rounded px-2 py-1 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="nrs"
                      checked={nrs === val}
                      onChange={() => setNrs(val)}
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {validationMsg && (
            <p className="text-red-600 text-sm">{validationMsg}</p>
          )}

          <div className="flex justify-center">
            <Button type="submit" size="lg">
              提交並查看結果
            </Button>
          </div>
        </form>

        {/* Results — full UI added in Task 6 */}
        <FibroResult
          submitted={submitted}
          open={open}
          setOpen={setOpen}
          score={score}
          wpiChecked={wpiChecked}
          sssCore={sssCore}
          sssSomatic={sssSomatic}
          durationMet={durationMet}
          nrs={nrs}
          TriggerComponent={TriggerComponent}
          Content={Content}
          ContentComponent={ContentComponent}
          HeaderComponent={HeaderComponent}
          TitleComponent={TitleComponent}
          DescriptionComponent={DescriptionComponent}
          FooterComponent={FooterComponent}
          CloseComponent={CloseComponent}
        />

        {/* Citation */}
        <div className="mt-12 text-xs text-gray-500 border-t pt-4">
          <p className="mb-1">
            <strong>引用：</strong>Wolfe F, Clauw DJ, Fitzcharles M-A, et al. 2016 Revisions to the 2010/2011 Fibromyalgia Diagnostic Criteria. <em>Semin Arthritis Rheum</em> 2016;46:319–329.
          </p>
          <p>DOI: 10.1016/j.semarthrit.2016.08.012</p>
        </div>
      </div>
    </div>
  );
}

interface FibroResultProps {
  submitted: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  score: FibroScore;
  wpiChecked: boolean[];
  sssCore: (number | null)[];
  sssSomatic: (number | null)[];
  durationMet: boolean | null;
  nrs: number | null;
  TriggerComponent: any;
  Content: any;
  ContentComponent: any;
  HeaderComponent: any;
  TitleComponent: any;
  DescriptionComponent: any;
  FooterComponent: any;
  CloseComponent: any;
}

function FibroResult(props: FibroResultProps) {
  const {
    submitted,
    open,
    setOpen,
    score,
    Content,
    ContentComponent,
    HeaderComponent,
    TitleComponent,
    DescriptionComponent,
    FooterComponent,
    CloseComponent,
  } = props;

  if (!submitted) return null;

  const heroBorder =
    score.fs <= 12
      ? "border-green-400"
      : score.fs <= 20
      ? "border-amber-400"
      : "border-red-400";

  const nhiCallout = (() => {
    if (score.meetsNhi) {
      return {
        tone: "bg-green-50 border-green-300 text-green-900",
        title: "符合健保量表門檻",
        body: `本量表結果符合健保 pregabalin / duloxetine 給付申請之量表門檻（診斷準則成立且 NRS ${score.nrs} ≥ 6）。實際給付仍需醫師臨床判斷。`,
      };
    }
    if (score.meetsDx) {
      return {
        tone: "bg-amber-50 border-amber-300 text-amber-900",
        title: "符合診斷準則，但 NRS 未達健保門檻",
        body: `符合 ACR 2016 診斷準則，但 NRS (${score.nrs}) 未達健保給付門檻 (需 ≥ 6)。`,
      };
    }
    return {
      tone: "bg-gray-50 border-gray-300 text-gray-900",
      title: "未完全符合 ACR 2016 診斷準則",
      body: `尚未成立的準則：${score.failedCriteria.join("、")}。`,
    };
  })();

  const wpiItems: AnswerDetailItem[] = WPI_PARTS.map((p, i) => ({
    question: `${REGION_LABELS[p.region]} — ${p.label}`,
    answerLabel: props.wpiChecked[i] ? "有疼痛" : "無",
    score: props.wpiChecked[i] ? 1 : 0,
  }));

  const sssCoreItems: AnswerDetailItem[] = SSS_CORE_ITEMS.map((q, i) => ({
    question: q,
    answerLabel:
      props.sssCore[i] !== null
        ? `${props.sssCore[i]} — ${SSS_CORE_LABELS[props.sssCore[i] as number]}`
        : "未作答",
    score: props.sssCore[i] ?? "-",
  }));

  const sssSomaticItems: AnswerDetailItem[] = SSS_SOMATIC_ITEMS.map((q, i) => ({
    question: `${q}（過去 6 個月內）`,
    answerLabel:
      props.sssSomatic[i] !== null
        ? SSS_SOMATIC_LABELS[props.sssSomatic[i] as number]
        : "未作答",
    score: props.sssSomatic[i] ?? "-",
  }));

  const nrsItem: AnswerDetailItem[] = [
    {
      question: "過去 1 週平均疼痛強度 (NRS)",
      answerLabel: `${props.nrs ?? "-"} / 10`,
      score: props.nrs ?? "-",
    },
  ];

  const durationItem: AnswerDetailItem[] = [
    {
      question: "症狀是否持續 3 個月以上且強度相似",
      answerLabel:
        props.durationMet === true
          ? "是"
          : props.durationMet === false
          ? "否"
          : "未作答",
    },
  ];

  const sssCoreTotal = sssCoreItems.reduce(
    (s, it) => s + (typeof it.score === "number" ? it.score : 0),
    0,
  );
  const sssSomaticTotal = sssSomaticItems.reduce(
    (s, it) => s + (typeof it.score === "number" ? it.score : 0),
    0,
  );

  return (
    <Content open={open} onOpenChange={setOpen}>
      <ContentComponent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <HeaderComponent>
          <TitleComponent>纖維肌痛症 (ACR 2016) 結果</TitleComponent>
          <DescriptionComponent>FS = WPI + SSS，範圍 0–31</DescriptionComponent>
        </HeaderComponent>

        {/* Print-only clinic header */}
        <div className="print-header hidden print:block mb-6">
          <h1 className="text-lg font-bold">台中文心樂丞、理解身心診所</h1>
          <p className="text-sm">纖維肌痛症 (ACR 2016 WPI+SSS) 結果</p>
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
          {/* Hero card */}
          <div className={`border-4 ${heroBorder} rounded-lg p-4 text-center`}>
            <p className="text-sm text-gray-600">纖維肌痛分數 (FS)</p>
            <p className="text-4xl font-bold">
              {score.fs}
              <span className="text-lg font-normal text-gray-500"> / 31</span>
            </p>
            <p className="mt-2 font-semibold">
              {score.meetsDx
                ? "符合 ACR 2016 纖維肌痛症診斷準則"
                : "不符合 ACR 2016 纖維肌痛症診斷準則"}
            </p>
            {!score.meetsDx && score.failedCriteria.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                尚未成立：{score.failedCriteria.join("、")}
              </p>
            )}
          </div>

          {/* NHI callout */}
          <div className={`border ${nhiCallout.tone} rounded-lg p-4`}>
            <p className="font-semibold">{nhiCallout.title}</p>
            <p className="text-sm mt-1">{nhiCallout.body}</p>
          </div>

          {/* Sub-metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "WPI", value: `${score.wpi} / 19` },
              { label: "SSS", value: `${score.sss} / 12` },
              { label: "NRS", value: `${score.nrs} / 10` },
              { label: "疼痛區域數", value: `${score.regionsWithPain} / 5` },
            ].map((m) => (
              <div
                key={m.label}
                className="border border-gray-200 rounded p-2 text-center"
              >
                <p className="text-xs text-gray-600">{m.label}</p>
                <p className="font-bold">{m.value}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-600">
            本結果僅供臨床參考，不構成診斷。最終診斷請由專科醫師判斷。
          </p>

          {/* Answer details */}
          <span className="print-section-label">各題作答明細</span>
          <AnswerDetailList
            items={wpiItems}
            title="WPI 疼痛部位明細"
            totalLabel={`勾選 ${score.wpi} 項`}
          />
          <AnswerDetailList
            items={sssCoreItems}
            title="SSS 核心症狀 (過去 1 週)"
            totalLabel={`小計 ${sssCoreTotal} 分`}
          />
          <AnswerDetailList
            items={sssSomaticItems}
            title="SSS 身體症狀 (過去 6 個月)"
            totalLabel={`小計 ${sssSomaticTotal} 分`}
          />
          <AnswerDetailList items={durationItem} title="症狀持續時間" />
          <AnswerDetailList items={nrsItem} title="疼痛強度 (NRS)" />

          <FooterComponent>
            <div className="flex flex-wrap gap-2 print:hidden">
              <ShareButton
                title="纖維肌痛症 (ACR 2016) 評估結果"
                text={`FS ${score.fs}/31，WPI ${score.wpi}，SSS ${score.sss}，NRS ${score.nrs}`}
              />
              <CloseComponent>關閉</CloseComponent>
            </div>
          </FooterComponent>

          {/* Print-only footer */}
          <div className="print-footer hidden print:block">
            <strong>台中文心樂丞、理解身心診所</strong> · 陳璿丞醫師
            <br />
            報告由 surveymind.tw 產生 · anatomind.com · anxiety.com.tw
            <br />
            本結果僅供臨床參考，不構成診斷。最終診斷請由專科醫師判斷。
          </div>
        </div>
      </ContentComponent>
    </Content>
  );
}
