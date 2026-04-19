// Pure data + scoring logic for the Fibromyalgia (ACR 2016 WPI+SSS) questionnaire.
// Kept in a sibling module because Next.js App Router disallows arbitrary
// named exports from page.tsx.

export type RegionKey = "LU" | "RU" | "LL" | "RL" | "AX";

export interface WpiPart {
  label: string;
  region: RegionKey;
}

export type BodyMapView = "front" | "back";

export interface BodyMapHotspot {
  partIndex: number;
  view: BodyMapView;
  x: number;
  y: number;
}

export const WPI_PARTS: WpiPart[] = [
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

export const REGION_LABELS: Record<RegionKey, string> = {
  LU: "左上區",
  RU: "右上區",
  LL: "左下區",
  RL: "右下區",
  AX: "中軸區 (含胸腹背)",
};

export const WPI_BODY_MAP_HOTSPOTS: BodyMapHotspot[] = [
  { partIndex: 0, view: "front", x: 36, y: 14 },
  { partIndex: 1, view: "front", x: 39, y: 20 },
  { partIndex: 2, view: "front", x: 32, y: 27 },
  { partIndex: 3, view: "front", x: 26, y: 39 },
  { partIndex: 4, view: "front", x: 22, y: 56 },
  { partIndex: 5, view: "front", x: 64, y: 14 },
  { partIndex: 6, view: "front", x: 61, y: 20 },
  { partIndex: 7, view: "front", x: 68, y: 27 },
  { partIndex: 8, view: "front", x: 74, y: 39 },
  { partIndex: 9, view: "front", x: 78, y: 56 },
  { partIndex: 10, view: "back", x: 38, y: 61 },
  { partIndex: 11, view: "front", x: 39, y: 76 },
  { partIndex: 12, view: "front", x: 39, y: 92 },
  { partIndex: 13, view: "back", x: 62, y: 61 },
  { partIndex: 14, view: "front", x: 61, y: 76 },
  { partIndex: 15, view: "front", x: 61, y: 92 },
  { partIndex: 16, view: "back", x: 50, y: 29 },
  { partIndex: 17, view: "back", x: 50, y: 49 },
  { partIndex: 18, view: "front", x: 50, y: 40 },
];

export const SSS_CORE_LABELS = ["無", "輕度", "中度", "重度"] as const;
export const SSS_CORE_ITEMS = [
  "疲勞 (Fatigue)",
  "醒來不清爽 (Waking unrefreshed)",
  "認知症狀 (Cognitive symptoms)",
];
export const SSS_SOMATIC_LABELS = ["無", "有"] as const;
export const SSS_SOMATIC_ITEMS = [
  "頭痛",
  "下腹痛或腹部絞痛",
  "憂鬱",
];

export interface FibroScore {
  wpi: number;
  sss: number;
  fs: number;
  nrs: number;
  regionsWithPain: number;
  durationMet: boolean;
  wpiSssMet: boolean;
  generalizedPain: boolean;
  meetsDx: boolean;
  meetsNhi: boolean;
  failedCriteria: string[];
}

export function computeScore(
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
