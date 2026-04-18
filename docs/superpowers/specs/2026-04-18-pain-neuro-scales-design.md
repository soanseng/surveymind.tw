# 疼痛/神經量表 — Fibromyalgia (ACR 2016) + MIDAS

**Date:** 2026-04-18
**Branch:** feature/pain-neuro-scales
**Worktree:** .worktrees/pain-neuro-scales

## Goal

Add two new clinical questionnaires to surveymind.tw:

1. **Fibromyalgia** — ACR 2016 WPI + SSS, with 健保 給付條件提示 (NRS ≥ 6).
2. **MIDAS** — Migraine Disability Assessment, Taiwan validated version (MIDAS-T).

Both result pages gain a **「下載 PDF 給醫師」** print feature (browser native Save-as-PDF via `window.print()`).

## Scope

- Two new routes: `/fibromyalgia`, `/midas`.
- One new navbar category: **「疼痛/神經」** containing both.
- One new shared component: `PrintButton`.
- Print stylesheet additions to `app/globals.css`.
- Print feature is **scoped to these two scales only** in v1 — not retrofitted to the existing 24 scales.
- SVG body map for WPI is **deferred** — checkbox list grouped by body region is v1.
- 健保給付條件快查 panel is **deferred** — each scale shows its own inline 健保 note on the result page only.

## Routes and Files

| Path | Purpose | Pattern |
|---|---|---|
| `app/fibromyalgia/page.tsx` | ACR 2016 WPI + SSS | Pattern C (fully custom state — variable option counts across sub-sections) |
| `app/midas/page.tsx` | MIDAS (Taiwan version) | Pattern A (standard sum via `useQuestionnaireForm`) |
| `components/PrintButton.tsx` | `window.print()` trigger | new |
| `components/navbar.tsx` | add 「疼痛/神經」 category | edit |
| `app/page.tsx` | add category section | edit |
| `app/globals.css` | append `@media print` rules | edit |
| `lib/seo-config.ts` | add SEO metadata for two new routes | edit |
| `app/sitemap.ts` | include two new routes | edit (if not auto-derived) |

## Fibromyalgia (ACR 2016 WPI + SSS)

### Structure (single page, Pattern C — fully custom state)

Because the three sub-sections use different input types (checkbox, 0–3 Likert, 0–1 yes/no, 0–10 NRS), the page manages its own `useState` hooks rather than `useQuestionnaireForm`. Pattern C precedent: AUDIT, PSQI, ASRS, EDE-Q.

Three inline sub-sections in one form:

**Part 1 — WPI (過去 1 週有疼痛的部位):** 19-part checkbox list grouped into 5 region headers.

- 左上區: 左下顎、左頸、左肩、左上臂、左下臂
- 右上區: 右下顎、右頸、右肩、右上臂、右下臂
- 左下區: 左臀、左大腿、左小腿
- 右下區: 右臀、右大腿、右小腿
- 中軸區: 上背、下背、胸、腹

Score = number of boxes checked (0–19). Stored as `boolean[19]`.

**Part 2 — SSS (症狀嚴重度):**

- Three core symptoms past 1 week, each 0–3 (無 / 輕 / 中 / 重): 疲勞、醒來不清爽、認知症狀 → 0–9
- Three somatic symptoms past 6 months, each 0–1 (無 / 有): 頭痛、下腹痛/腹部絞痛、憂鬱 → 0–3

SSS total = 0–12.

**Part 3 — NRS 疼痛強度:** 0–10 radio row, past 1 week average. Not part of FS score but shown alongside and used for 健保 gating.

### Scoring

`handleSubmit` computes a structured result object held in local state:

```ts
type FibroScore = {
  wpi: number;        // 0–19
  sss: number;        // 0–12
  fs: number;         // wpi + sss, 0–31
  nrs: number;        // 0–10
  meetsDx: boolean;   // ACR 2016 criteria met
  meetsNhi: boolean;  // meetsDx && nrs >= 6
};

meetsDx = (wpi >= 7 && sss >= 5) || (wpi >= 4 && wpi <= 6 && sss >= 9);
meetsNhi = meetsDx && nrs >= 6;
```

### Result page

- Four metric cards: FS (0–31), WPI, SSS, NRS.
- Diagnostic line: 「符合 / 不符合 ACR 2016 纖維肌痛症診斷準則」.
- 健保提示 callout: if `meetsNhi` true, note that 量表門檻成立 for pregabalin/duloxetine 給付申請 (仍需醫師臨床判斷); if not, state which threshold is not yet met.
- Non-diagnostic disclaimer (standard language used on other scales).
- `AnswerDetailList` with every item's answer + score contribution.
- `PrintButton` + `ShareButton`.

### Citation

Wolfe F, Clauw DJ, Fitzcharles M-A, et al. 2016 Revisions to the 2010/2011 Fibromyalgia Diagnostic Criteria. *Semin Arthritis Rheum* 2016;46:319–329. DOI: 10.1016/j.semarthrit.2016.08.012

## MIDAS

### Structure (single page, Pattern A)

Five scored items + two unscored companion items, all past 3 months.

**Q1–Q5 (scored, days 0–90, numeric input):**

1. 因頭痛而無法工作或上學的天數。
2. 頭痛使工作或上學效率減半或以上的天數（不含 Q1 的天數）。
3. 因頭痛而無法做家事的天數。
4. 頭痛使家事效率減半或以上的天數（不含 Q3 的天數）。
5. 因頭痛而無法參與家庭、社交或休閒活動的天數。

**Q A / Q B (unscored companions):**

- A: 過去 3 個月內有頭痛的總天數 (0–90, numeric).
- B: 頭痛時平均疼痛程度 0–10 (NRS, radio row).

### Scoring

Total MIDAS = Q1 + Q2 + Q3 + Q4 + Q5.

| Grade | Score | Label |
|---|---|---|
| I | 0–5 | 輕微或無失能 |
| II | 6–10 | 輕度失能 |
| III | 11–20 | 中度失能 |
| IV | 21+ | 重度失能 |

### Result page

- Total score + Grade banner.
- Two side metrics: Q A (頭痛總天數), Q B (平均 NRS).
- Clinical guidance callout: 建議就診神經內科或頭痛門診；Grade III–IV 者與醫師討論預防性治療。
- Reference line linking to 台灣頭痛學會 ICHD-3 繁中版 (`https://www.taiwanheadache.org.tw`).
- `AnswerDetailList`.
- `PrintButton` + `ShareButton`.

### Attribution note on page

Visible credit: 「中文版驗證：Hung PH, Fuh JL, Wang SJ (榮總/陽明)。感謝王署君教授團隊。」
(Courtesy authorization email to Prof. 王署君 is to be sent separately — out of scope for this worktree.)

### Citations

- Stewart WF, Lipton RB, Dowson AJ, Sawyer J. Development and testing of the Migraine Disability Assessment (MIDAS) Questionnaire. *Neurology* 2001;56(Suppl 1):S20–28.
- Hung PH, Fuh JL, Wang SJ. Validity, reliability and application of the taiwan version of the migraine disability assessment questionnaire. *Acta Neurol Taiwan* 2006;15:43–48.

## PrintButton

`components/PrintButton.tsx`:

```tsx
'use client'
import { Button } from '@/components/ui/button';

export default function PrintButton() {
  return (
    <Button
      variant="outline"
      className="print:hidden"
      onClick={() => window.print()}
    >
      下載 PDF 給醫師
    </Button>
  );
}
```

## Print Stylesheet

Appended to `app/globals.css`:

```css
@media print {
  /* Chrome: hide header, footer, navigation, buttons */
  header, footer, nav, .print\:hidden { display: none !important; }

  /* Force dialog/drawer result surfaces to flow inline */
  [data-print-root] {
    display: block !important;
    position: static !important;
    max-height: none !important;
    overflow: visible !important;
    box-shadow: none !important;
    border: none !important;
    background: white !important;
  }

  @page { size: A4; margin: 15mm; }

  body { background: white !important; color: black !important; font-size: 11pt; }

  /* Each question item stays together */
  .answer-detail-item { break-inside: avoid; }

  /* Print-only header and footer blocks */
  .print-header { display: block !important; }
  .print-footer {
    display: block !important;
    font-size: 9pt;
    color: #555;
    margin-top: 20mm;
    border-top: 1px solid #ccc;
    padding-top: 4mm;
  }
}
```

## Print Header and Footer Blocks

Added inside the result surface on both new result pages:

```tsx
<div className="print-header hidden print:block mb-6">
  <h1 className="text-lg font-bold">台中文心樂丞、理解身心診所</h1>
  <p className="text-sm">{questionnaireTitle}</p>
  <p className="text-xs text-gray-600">作答日期：{new Date().toLocaleDateString('zh-TW')}</p>
  <div className="mt-4 text-xs">
    <p>姓名：_______________ 病歷號：_______________</p>
  </div>
</div>
```

```tsx
<div className="print-footer hidden print:block">
  本報告由 surveymind.tw 產生 · 台中文心樂丞、理解身心診所 · 陳璿丞醫師 · anxiety.com.tw
  <br />
  本結果僅供臨床參考，不構成診斷。最終診斷請由專科醫師判斷。
</div>
```

The result container also gets `data-print-root` so the `@media print` rules can un-style the Dialog/Drawer overlay without breaking the on-screen UI.

`AnswerDetailList` items receive the `answer-detail-item` class for page-break control.

## Navigation

`components/navbar.tsx` — add a new entry to the `categories` array after 成癮評估:

```ts
{ name: '疼痛/神經', questionnaire: [
  { name: 'Fibromyalgia 纖維肌痛症 (ACR 2016 WPI+SSS)', link: '/fibromyalgia' },
  { name: 'MIDAS 偏頭痛失能評估', link: '/midas' },
] },
```

Same entry added to the category list on `app/page.tsx` with time estimates and difficulty matching the existing style.

## SEO

`lib/seo-config.ts` — add two entries with `keywords`, `description`, `MedicalWebPage` JSON-LD fields covering: 纖維肌痛症, ACR 2016, WPI, SSS, FIQR, 台中身心科, 健保, pregabalin, duloxetine (for fibromyalgia); 偏頭痛, MIDAS, 失能評估, 頭痛門診, 預防性治療 (for MIDAS).

`app/sitemap.ts` — confirm the two new routes are included (extend the route array if it's hand-maintained).

## Testing / Verification

No unit test framework in the repo. Verification will rely on:

- `npm run build` to confirm both static routes export successfully.
- Manual browser check via dev server for: (a) all three form parts render and score correctly for fibromyalgia, (b) MIDAS numeric inputs accept 0–90 and sum correctly, (c) print preview (Ctrl+P / Cmd+P) shows the result content with clinic header, attribution footer, and no nav/buttons, (d) mobile drawer view of results works (regression check per recent drawer fix).

## Out of Scope (explicitly deferred)

- SVG 19-部位人體圖.
- 健保給付條件快查 aggregate panel.
- PrintButton retrofit to the other 24 scales.
- FIQR questionnaire.
- ICHD-3 diagnostic criteria interactive tool.
- HIT-6 (licensing incompatible).
- Courtesy authorization email to Prof. 王署君.
