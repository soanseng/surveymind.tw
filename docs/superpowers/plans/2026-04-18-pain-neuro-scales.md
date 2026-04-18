# Pain/Neuro Scales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two clinical questionnaires (Fibromyalgia ACR 2016 WPI+SSS, MIDAS) plus a print-to-PDF feature for both result pages.

**Architecture:** Fibromyalgia is Pattern C (fully custom state — three different input types in one form, ACR 2016 full criteria computation). MIDAS is Pattern A (numeric-input variant using `useQuestionnaireForm`). A shared `PrintButton` + print stylesheet additions to `app/globals.css` handle `window.print()`-driven PDF generation. Print CSS explicitly handles Radix Dialog + vaul Drawer portal DOM so content renders correctly when printed from either modal surface. No test framework in repo — verification is `npm run build` + manual browser checks.

**Tech Stack:** Next.js 14 App Router (static export), TypeScript, Tailwind CSS, shadcn/ui (Radix primitives), vaul Drawer.

---

## Spec

Source of truth: `docs/superpowers/specs/2026-04-18-pain-neuro-scales-design.md`.

## File Structure

**Create:**
- `components/PrintButton.tsx` — single-responsibility print button.
- `app/fibromyalgia/page.tsx` — Pattern C, Fibromyalgia ACR 2016.
- `app/midas/page.tsx` — Pattern A, MIDAS Taiwan version.

**Modify:**
- `app/globals.css` — append `@media print` block.
- `components/AnswerDetailList.tsx` — add `answer-detail-item` className to each row (one-line diff) for print page-break control.
- `components/navbar.tsx` — add 「疼痛/神經」 category.
- `app/page.tsx` — add category section with both new questionnaires.
- `lib/seo-config.ts` — add `fibromyalgia` and `midas` entries (sitemap auto-derives).

---

## Task 1: PrintButton component

**Files:**
- Create: `components/PrintButton.tsx`

- [ ] **Step 1: Create the component file**

```tsx
"use client";

import { Button } from "@/components/ui/button";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export default function PrintButton({
  label = "下載 PDF 給醫師",
  className = "",
}: PrintButtonProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePrint}
      className={`print:hidden ${className}`}
      aria-label={label}
    >
      🖨 {label}
    </Button>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds (component is not yet used, so tree-shaken but compiled).

- [ ] **Step 3: Commit**

```bash
git add components/PrintButton.tsx
git commit -m "feat: add PrintButton component for PDF printout feature"
```

---

## Task 2: Print stylesheet + AnswerDetailList print class

**Files:**
- Modify: `app/globals.css` (append to end of file)
- Modify: `components/AnswerDetailList.tsx` (one className addition)

- [ ] **Step 1: Append print rules to `app/globals.css`**

Add at the end of the file:

```css

/* =============================
   Print stylesheet — 下載 PDF 給醫師
   Used by /fibromyalgia and /midas result surfaces.
   ============================= */
@media print {
  /* Hide app chrome and any element marked print:hidden */
  header,
  footer,
  nav,
  .print\:hidden {
    display: none !important;
  }

  /* Radix Dialog + vaul Drawer portal content into document.body.
     Neutralize their overlays and fixed positioning so result content
     flows as a normal A4 document. */
  [data-radix-portal],
  [data-radix-dialog-portal],
  [vaul-drawer-wrapper] {
    all: unset !important;
    display: contents !important;
  }

  [data-radix-dialog-overlay],
  [vaul-overlay],
  [data-vaul-overlay] {
    display: none !important;
  }

  [data-print-root],
  [data-radix-dialog-content],
  [vaul-drawer] {
    all: unset !important;
    display: block !important;
    position: static !important;
    max-height: none !important;
    max-width: none !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    box-shadow: none !important;
    border: none !important;
    background: white !important;
    transform: none !important;
    inset: auto !important;
  }

  @page {
    size: A4;
    margin: 15mm;
  }

  body {
    background: white !important;
    color: black !important;
    font-size: 11pt;
  }

  /* Each answer item stays together on one page */
  .answer-detail-item {
    break-inside: avoid;
  }

  /* Always expand AnswerDetailList in print (override closed state) */
  .answer-detail-print-expand {
    display: block !important;
  }

  /* Print-only header/footer blocks (hidden on screen) */
  .print-header {
    display: block !important;
  }
  .print-footer {
    display: block !important;
    font-size: 9pt;
    color: #555;
    margin-top: 20mm;
    border-top: 1px solid #ccc;
    padding-top: 4mm;
  }

  /* Visual section dividers for doctor parseability */
  .print-section-label {
    display: block !important;
    font-weight: bold;
    font-size: 10pt;
    border-bottom: 1px solid #999;
    margin-top: 8mm;
    margin-bottom: 3mm;
    padding-bottom: 1mm;
  }
}
```

- [ ] **Step 2: Add `answer-detail-item` className to AnswerDetailList rows**

Edit `components/AnswerDetailList.tsx`. Find the existing row div (around line 46):

Old:
```tsx
<div
  key={idx}
  className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3"
>
```

New:
```tsx
<div
  key={idx}
  className="answer-detail-item py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3"
>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css components/AnswerDetailList.tsx
git commit -m "feat(print): add print stylesheet handling Radix/vaul portal DOM"
```

---

## Task 3: SEO config entries for fibromyalgia + MIDAS

**Files:**
- Modify: `lib/seo-config.ts`

- [ ] **Step 1: Add two entries to the `questionnaireSEO` object**

Locate the closing `};` of the `questionnaireSEO` object in `lib/seo-config.ts` and add the following two entries immediately before it (match surrounding formatting):

```ts
  // Fibromyalgia — ACR 2016 WPI + SSS
  fibromyalgia: {
    title: "纖維肌痛症量表 ACR 2016 | WPI+SSS 線上評估 | 健保給付參考 - 台中文心樂丞、理解身心診所",
    description:
      "ACR 2016 纖維肌痛症診斷準則線上評估工具，計算 WPI 廣泛疼痛指數、SSS 症狀嚴重度、FS 纖維肌痛分數，附 NRS 疼痛強度與健保給付參考。可列印結果交給醫師。",
    keywords: [
      "纖維肌痛症",
      "Fibromyalgia",
      "ACR 2016",
      "WPI",
      "SSS",
      "FS score",
      "廣泛疼痛指數",
      "症狀嚴重度",
      "健保",
      "pregabalin",
      "duloxetine",
      "慢性疼痛",
      "台中身心科",
      "風濕免疫",
    ],
    openGraph: {
      title: "纖維肌痛症線上評估 (ACR 2016 WPI+SSS)",
      description:
        "依據 Wolfe 2016 標準計算 WPI + SSS + FS 與健保給付參考，可列印交給醫師。",
      type: "website",
      locale: "zh_TW",
    },
    structuredData: {
      name: "纖維肌痛症 ACR 2016 診斷工具",
      description: "WPI + SSS + FS 計算，含 NRS 疼痛強度與健保給付門檻提示。",
      category: "MedicalTest",
      duration: "PT5M",
      difficulty: "intermediate",
    },
  },

  // MIDAS — Migraine Disability Assessment (Taiwan version)
  midas: {
    title: "MIDAS 偏頭痛失能評估量表 | Migraine Disability 線上測驗 - 台中文心樂丞、理解身心診所",
    description:
      "MIDAS 偏頭痛失能評估量表線上版（Taiwan-validated 中文版），評估過去 3 個月偏頭痛對工作、家事、社交的影響。附頭痛天數與疼痛強度記錄，可列印交給醫師。",
    keywords: [
      "MIDAS",
      "偏頭痛",
      "migraine",
      "頭痛失能",
      "Migraine Disability Assessment",
      "頭痛門診",
      "預防性治療",
      "ICHD-3",
      "慢性偏頭痛",
      "台中神經內科",
      "頭痛量表",
    ],
    openGraph: {
      title: "MIDAS 偏頭痛失能評估量表（中文版）",
      description:
        "評估過去 3 個月偏頭痛對生活的影響，分級參考與頭痛門診建議。可列印交給醫師。",
      type: "website",
      locale: "zh_TW",
    },
    structuredData: {
      name: "MIDAS 偏頭痛失能評估量表",
      description: "過去 3 個月偏頭痛失能評估，含頭痛天數與疼痛強度。",
      category: "MedicalTest",
      duration: "PT3M",
      difficulty: "basic",
    },
  },
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds; output shows `/fibromyalgia` and `/midas` entries in sitemap URL list (they will appear once the pages exist, but sitemap logic should already pick up the keys).

- [ ] **Step 3: Commit**

```bash
git add lib/seo-config.ts
git commit -m "feat(seo): add SEO config for fibromyalgia and MIDAS"
```

---

## Task 4: Fibromyalgia page — constants & types

**Files:**
- Create: `app/fibromyalgia/page.tsx` (partial — scaffold only)

This task creates the file with static data and the score type. Interactive form comes in Task 5, result panel in Task 6.

- [ ] **Step 1: Create `app/fibromyalgia/page.tsx` with constants**

```tsx
"use client";

import React, { useMemo, useState } from "react";
import SEOHead from "@/components/SEOHead";
import { questionnaireSEO } from "@/lib/seo-config";
import { useResponsiveDialog } from "@/hooks/useResponsiveDialog";
import ShareButton from "@/components/ShareButton";
import PrintButton from "@/components/PrintButton";
import AnswerDetailList, { AnswerDetailItem } from "@/components/AnswerDetailList";
import { Button } from "@/components/ui/button";

// ---------- WPI: 19 body parts grouped into 5 regions ----------
type RegionKey = "LU" | "RU" | "LL" | "RL" | "AX";

interface WpiPart {
  label: string;
  region: RegionKey;
}

const WPI_PARTS: WpiPart[] = [
  // 左上區 (LU)
  { label: "左下顎", region: "LU" },
  { label: "左頸", region: "LU" },
  { label: "左肩", region: "LU" },
  { label: "左上臂", region: "LU" },
  { label: "左下臂", region: "LU" },
  // 右上區 (RU)
  { label: "右下顎", region: "RU" },
  { label: "右頸", region: "RU" },
  { label: "右肩", region: "RU" },
  { label: "右上臂", region: "RU" },
  { label: "右下臂", region: "RU" },
  // 左下區 (LL)
  { label: "左臀", region: "LL" },
  { label: "左大腿", region: "LL" },
  { label: "左小腿", region: "LL" },
  // 右下區 (RL)
  { label: "右臀", region: "RL" },
  { label: "右大腿", region: "RL" },
  { label: "右小腿", region: "RL" },
  // 中軸區 (AX)
  { label: "上背", region: "AX" },
  { label: "下背", region: "AX" },
  { label: "胸/腹 (胸部或腹部)", region: "AX" },
];

const REGION_LABELS: Record<RegionKey, string> = {
  LU: "左上區",
  RU: "右上區",
  LL: "左下區",
  RL: "右下區",
  AX: "中軸區 (含胸腹背)",
};

// ---------- SSS: 3 core + 3 somatic ----------
const SSS_CORE_LABELS = ["無", "輕度", "中度", "重度"] as const;
const SSS_CORE_ITEMS = [
  "疲勞 (Fatigue)",
  "醒來不清爽 (Waking unrefreshed)",
  "認知症狀 (Cognitive symptoms)",
];
const SSS_SOMATIC_LABELS = ["無", "有"] as const;
const SSS_SOMATIC_ITEMS = [
  "頭痛",
  "下腹痛或腹部絞痛",
  "憂鬱",
];

// ---------- Score type ----------
interface FibroScore {
  wpi: number;              // 0–19
  sss: number;              // 0–12
  fs: number;               // wpi + sss
  nrs: number;              // 0–10
  regionsWithPain: number;  // 0–5
  durationMet: boolean;
  wpiSssMet: boolean;
  generalizedPain: boolean; // regionsWithPain >= 4
  meetsDx: boolean;
  meetsNhi: boolean;
  // Which criteria failed (for result page messaging)
  failedCriteria: string[];
}

function computeScore(
  wpiChecked: boolean[],
  sssCore: (number | null)[],
  sssSomatic: (number | null)[],
  durationMet: boolean,
  nrs: number | null,
): FibroScore {
  const wpi = wpiChecked.filter(Boolean).length;
  const core = sssCore.reduce<number>((s, v) => s + (v ?? 0), 0);
  const somatic = sssSomatic.reduce<number>((s, v) => s + (v ?? 0), 0);
  const sss = core + somatic;
  const fs = wpi + sss;

  const regionsSet = new Set<RegionKey>();
  wpiChecked.forEach((checked, i) => {
    if (checked) regionsSet.add(WPI_PARTS[i].region);
  });
  const regionsWithPain = regionsSet.size;

  const wpiSssMet = (wpi >= 7 && sss >= 5) || (wpi >= 4 && wpi <= 6 && sss >= 9);
  const generalizedPain = regionsWithPain >= 4;
  const meetsDx = wpiSssMet && generalizedPain && durationMet;
  const nrsVal = nrs ?? 0;
  const meetsNhi = meetsDx && nrsVal >= 6;

  const failedCriteria: string[] = [];
  if (!wpiSssMet) failedCriteria.push("WPI/SSS 門檻");
  if (!generalizedPain) failedCriteria.push("泛發性疼痛 (≥4/5 區)");
  if (!durationMet) failedCriteria.push("症狀持續 ≥3 個月");

  return {
    wpi,
    sss,
    fs,
    nrs: nrsVal,
    regionsWithPain,
    durationMet,
    wpiSssMet,
    generalizedPain,
    meetsDx,
    meetsNhi,
    failedCriteria,
  };
}

// Placeholder export — real UI added in Task 5 & 6
export default function FibromyalgiaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead config={questionnaireSEO["fibromyalgia"]} path="/fibromyalgia" />
      <h1 className="text-3xl font-bold text-center mb-6">
        纖維肌痛症 (ACR 2016 WPI+SSS)
      </h1>
      <p className="text-center text-gray-600">（建置中）</p>
    </div>
  );
}

// Export internals for Task 5/6 to import if needed.
export {
  WPI_PARTS,
  REGION_LABELS,
  SSS_CORE_LABELS,
  SSS_CORE_ITEMS,
  SSS_SOMATIC_LABELS,
  SSS_SOMATIC_ITEMS,
  computeScore,
};
export type { FibroScore, RegionKey };
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds, `/fibromyalgia` appears as a static route. Visiting it in dev shows the placeholder heading.

- [ ] **Step 3: Commit**

```bash
git add app/fibromyalgia/page.tsx
git commit -m "feat(fibromyalgia): scaffold page with ACR 2016 constants and score computation"
```

---

## Task 5: Fibromyalgia page — interactive form

**Files:**
- Modify: `app/fibromyalgia/page.tsx`

Replace the placeholder `FibromyalgiaPage` component with the full interactive form. The `export {}` block at the bottom of the file (from Task 4) stays unchanged.

- [ ] **Step 1: Replace `FibromyalgiaPage` component**

Replace the `export default function FibromyalgiaPage()` block with:

```tsx
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

  const RegionGroup = ({ region }: { region: RegionKey }) => (
    <fieldset className="border border-gray-200 rounded-lg p-4 mb-4">
      <legend className="text-sm font-semibold px-2">
        {REGION_LABELS[region]}
      </legend>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {WPI_PARTS.map((p, idx) =>
          p.region === region ? (
            <label
              key={idx}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={wpiChecked[idx]}
                onChange={() => toggleWpi(idx)}
                className="h-4 w-4"
              />
              <span>{p.label}</span>
            </label>
          ) : null,
        )}
      </div>
    </fieldset>
  );

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
            <RegionGroup region="LU" />
            <RegionGroup region="RU" />
            <RegionGroup region="LL" />
            <RegionGroup region="RL" />
            <RegionGroup region="AX" />
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

// Placeholder result component — full implementation in Task 6
function FibroResult(props: any) {
  if (!props.submitted) return null;
  return (
    <div className="mt-8 p-4 bg-gray-100 rounded">
      <p>結果 UI 建置中…FS = {props.score.fs}</p>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual browser check**

Run: `npm run dev`, visit `http://localhost:3000/fibromyalgia`. Fill in the form with sample inputs (WPI: 8 parts across 4 regions, SSS core all 2, SSS somatic all 1, duration yes, NRS 7). Submit. Placeholder result should show `FS = 16`.

- [ ] **Step 4: Commit**

```bash
git add app/fibromyalgia/page.tsx
git commit -m "feat(fibromyalgia): add interactive form for WPI, SSS, duration, NRS"
```

---

## Task 6: Fibromyalgia page — result panel with print support

**Files:**
- Modify: `app/fibromyalgia/page.tsx`

Replace the placeholder `FibroResult` component with the full result panel.

- [ ] **Step 1: Replace `FibroResult` component**

Replace the `function FibroResult(props: any)` block with:

```tsx
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
  const { submitted, open, setOpen, score, Content, HeaderComponent, TitleComponent, DescriptionComponent, FooterComponent, CloseComponent } = props;

  if (!submitted) return null;

  const heroBorder =
    score.fs <= 12 ? "border-green-400" : score.fs <= 20 ? "border-amber-400" : "border-red-400";

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

  // AnswerDetailList items
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
        props.durationMet === true ? "是" : props.durationMet === false ? "否" : "未作答",
    },
  ];

  return (
    <Content open={open} onOpenChange={setOpen}>
      <div data-print-root>
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
            {!score.meetsDx && (
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
            totalLabel={`小計 ${sssCoreItems.reduce((s, it) => s + (typeof it.score === "number" ? it.score : 0), 0)} 分`}
          />
          <AnswerDetailList
            items={sssSomaticItems}
            title="SSS 身體症狀 (過去 6 個月)"
            totalLabel={`小計 ${sssSomaticItems.reduce((s, it) => s + (typeof it.score === "number" ? it.score : 0), 0)} 分`}
          />
          <AnswerDetailList items={durationItem} title="症狀持續時間" />
          <AnswerDetailList items={nrsItem} title="疼痛強度 (NRS)" />

          <FooterComponent>
            <div className="flex flex-wrap gap-2 print:hidden">
              <PrintButton />
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
      </div>
    </Content>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual browser check**

Run: `npm run dev`. Go to `/fibromyalgia`. Complete form with: WPI (8 parts in 4 regions), SSS core all 2, SSS somatic all 1, duration yes, NRS 7. Submit. Verify:
- Hero shows `FS 16 / 31` with amber border
- NHI callout green: "符合健保量表門檻"
- Sub-metrics: WPI 8/19, SSS 9/12, NRS 7/10, 區域 4/5
- AnswerDetailLists expandable
- Print button triggers browser print dialog

Also test a failing case: WPI only in 2 regions (e.g., 5 parts in LU+RU), SSS core all 2, somatic 0, duration no, NRS 5. Expected: "未完全符合 ACR 2016 診斷準則 — 尚未成立：泛發性疼痛 (≥4/5 區)、症狀持續 ≥3 個月".

- [ ] **Step 4: Print preview check**

With the result dialog open, press Ctrl+P (or Cmd+P). Verify in print preview:
- No app header/footer/nav visible
- No gray overlay
- Clinic header at top with fill-in lines
- Hero + callout + metrics + all AnswerDetailList items visible (expanded)
- Footer with clinic attribution at bottom

- [ ] **Step 5: Commit**

```bash
git add app/fibromyalgia/page.tsx
git commit -m "feat(fibromyalgia): add result panel with NHI callout and print support"
```

---

## Task 7: MIDAS page (full)

**Files:**
- Create: `app/midas/page.tsx`

Pattern A using `useQuestionnaireForm` for the 5 scored items plus two extra state hooks for Q A and Q B (unscored companions).

- [ ] **Step 1: Create `app/midas/page.tsx`**

```tsx
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
  const [headacheDays, setHeadacheDays] = useState<number | null>(null); // Q A
  const [nrs, setNrs] = useState<number | null>(null); // Q B
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
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4"
            >
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
                  onChange={(e) =>
                    setHeadacheDays(cleanDays(e.target.value))
                  }
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
                <h1 className="text-lg font-bold">
                  台中文心樂丞、理解身心診所
                </h1>
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds; `/midas` appears as static route.

- [ ] **Step 3: Manual browser check**

Run: `npm run dev`, visit `/midas`. Enter: Q1=3, Q2=0, Q3=2, Q4=1, Q5=4 (sum = 10 → Grade II); Q A=20; Q B=7. Submit. Verify total 10, Grade II 輕度失能. Open print preview (Ctrl+P). Verify clinic header, no overlay, footer visible.

- [ ] **Step 4: Commit**

```bash
git add app/midas/page.tsx
git commit -m "feat(midas): add Taiwan-validated MIDAS questionnaire with print support"
```

---

## Task 8: Navbar category

**Files:**
- Modify: `components/navbar.tsx`

- [ ] **Step 1: Add 「疼痛/神經」 category**

Locate the `categories` array in `components/navbar.tsx` (around line 25). Immediately after the `成癮評估` entry (the last item), add:

```ts
    { name: '疼痛/神經', questionnaire: [
      { name: '纖維肌痛症 (ACR 2016)', link: '/fibromyalgia' },
      { name: 'MIDAS 偏頭痛失能評估', link: '/midas' },
    ] },
```

Make sure the comma after the `成癮評估` closing `}` is preserved.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual browser check**

Run: `npm run dev`. Check that 「疼痛/神經」 menu appears on desktop menubar and on mobile hamburger dropdown. Both items navigate to their routes.

- [ ] **Step 4: Commit**

```bash
git add components/navbar.tsx
git commit -m "feat(nav): add 疼痛/神經 category with fibromyalgia and MIDAS"
```

---

## Task 9: Home page category entry

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add category section**

Read `app/page.tsx` and locate the last existing category block (成癮評估 or the final category). Match its structure exactly and add a new `疼痛/神經` block immediately after. Use the time-estimate/difficulty metadata style already used by neighboring entries:

```tsx
{
  name: '疼痛/神經',
  description: '慢性疼痛與偏頭痛相關評估',
  items: [
    {
      name: '纖維肌痛症 (ACR 2016)',
      link: '/fibromyalgia',
      time: '5 分鐘',
      difficulty: '中等',
      description: 'WPI + SSS + FS 纖維肌痛分數，含健保給付參考。',
    },
    {
      name: 'MIDAS 偏頭痛失能評估',
      link: '/midas',
      time: '3 分鐘',
      difficulty: '簡單',
      description: '過去 3 個月偏頭痛對工作/家事/社交的影響。',
    },
  ],
},
```

**Note:** The exact property names (`items` vs `questionnaire`, `link` vs `href`, etc.) must match what `app/page.tsx` already uses. Inspect the existing structure first and adjust property names to match. If the home page uses a different data shape, adapt to that shape and still produce the same two entries.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual browser check**

Run: `npm run dev`. Home page shows 疼痛/神經 section with both cards. Each card links to its route.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): add 疼痛/神經 category with fibromyalgia and MIDAS"
```

---

## Task 10: End-to-end verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: build succeeds, route list includes `/fibromyalgia` and `/midas`, sitemap includes both URLs.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable if consistent with existing codebase style).

- [ ] **Step 3: Browser matrix check**

Run: `npm run dev`. For each scenario, verify:

| Scenario | Expected |
|---|---|
| Fibromyalgia — all criteria met (WPI 8 across 4 regions, SSS 9, duration yes, NRS 7) | Hero green/amber, NHI callout green |
| Fibromyalgia — duration no | NHI callout gray, "症狀持續 ≥3 個月" listed as failed |
| Fibromyalgia — pain in 2 regions only | NHI gray, "泛發性疼痛 (≥4/5 區)" listed as failed |
| MIDAS — sum 10 | Grade II 輕度失能 |
| MIDAS — sum 22 | Grade IV 重度失能 |
| MIDAS — entry of "abc" | Input rejects or coerces to 0 |
| Print preview on fibromyalgia result (desktop Chrome) | No nav/footer/overlay, clinic header visible, AnswerDetailLists expanded, attribution footer |
| Print preview on MIDAS result (desktop Chrome) | Same as above |
| Mobile viewport (resize to 375px) — fibromyalgia result | Drawer scrolls, health callout above fold |
| Mobile Save-as-PDF (Chrome mobile emulation) | Content renders (not blank) |
| Navbar "疼痛/神經" on desktop + mobile | Both entries visible |
| Home page category listing | Cards present and link correctly |

- [ ] **Step 4: Commit if any fixes were made**

If any issues surfaced and required tweaks, commit them as:

```bash
git add <files>
git commit -m "fix(pain-neuro): <specific fix>"
```

Otherwise skip.

---

## Rollout (out of scope here — handled after implementation)

- PR with branch `feature/pain-neuro-scales` into `main`.
- Deploy to Cloudflare Pages via existing `npm run build:cloudflare` workflow.
- Post-ship: send courtesy authorization email to Prof. 王署君 about MIDAS-T attribution.
