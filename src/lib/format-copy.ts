import type { AnswerDetailItem } from "@/components/AnswerDetailList";

export interface CopyGroup {
  title: string;
  items: AnswerDetailItem[];
  totalLabel?: string;
}

export interface FormatCopyOptions {
  title: string;
  summary: string;
  groups?: CopyGroup[];
  url?: string;
}

function formatScore(score: AnswerDetailItem["score"]): string {
  if (score === undefined || score === "" || score === "-") return "";
  if (typeof score === "number") return `（${score} 分）`;
  return `（${score}）`;
}

export function formatCopyText({
  title,
  summary,
  groups = [],
  url,
}: FormatCopyOptions): string {
  const date = new Date().toLocaleDateString("zh-TW");
  const lines: string[] = [];

  lines.push(`【${title}】`);
  lines.push(`作答日期：${date}`);
  lines.push("");
  lines.push(summary.trim());

  for (const group of groups) {
    if (!group.items.length) continue;
    lines.push("");
    const header = group.totalLabel
      ? `—— ${group.title}（${group.totalLabel}）——`
      : `—— ${group.title} ——`;
    lines.push(header);
    group.items.forEach((item, index) => {
      const score = formatScore(item.score);
      lines.push(`${index + 1}. ${item.question}：${item.answerLabel}${score}`);
      if (item.note) lines.push(`   ${item.note}`);
    });
  }

  lines.push("");
  lines.push("本結果僅供臨床參考，不構成診斷。最終診斷請由專科醫師判斷。");
  lines.push(`來源：${url ?? "https://surveymind.tw"} · 台中文心樂丞、理解身心診所`);

  return lines.join("\n");
}
