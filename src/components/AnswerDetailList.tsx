"use client";

import { useState } from "react";

export interface AnswerDetailItem {
  question: string;
  answerLabel: string;
  score?: number | string;
  note?: string;
}

interface AnswerDetailListProps {
  items: AnswerDetailItem[];
  title?: string;
  totalLabel?: string;
  defaultOpen?: boolean;
}

export default function AnswerDetailList({
  items,
  title = "各題作答明細",
  totalLabel,
  defaultOpen = false,
}: AnswerDetailListProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-3 py-3 sm:px-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
          {title}
          <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500 whitespace-nowrap">
            （{items.length} 題{totalLabel ? `，${totalLabel}` : ""}）
          </span>
        </span>
        <span className="text-gray-500 text-sm shrink-0">{open ? "收合 ▲" : "展開 ▼"}</span>
      </button>
      <div
        className={`answer-detail-print-expand px-3 pb-3 sm:px-4 divide-y divide-gray-100 ${open ? "block" : "hidden"}`}
      >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="answer-detail-item py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3"
            >
              <div className="flex-1 text-gray-900 text-sm sm:text-base leading-relaxed">
                <span className="inline-block w-7 sm:w-8 shrink-0 text-gray-500 font-medium">
                  {idx + 1}.
                </span>
                <span>{item.question}</span>
                {item.note && (
                  <div className="text-xs sm:text-sm text-gray-500 mt-1 ml-7 sm:ml-8">
                    {item.note}
                  </div>
                )}
              </div>
              <div className="ml-7 sm:ml-0 sm:shrink-0 sm:text-right sm:min-w-[84px]">
                <span className="inline-flex items-baseline gap-2 sm:gap-0 sm:flex-col sm:items-end">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    {item.answerLabel}
                  </span>
                  {item.score !== undefined && item.score !== "" && (
                    <span className="text-xs sm:text-sm text-gray-500 sm:mt-0.5">
                      {typeof item.score === "number" ? `${item.score} 分` : item.score}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
