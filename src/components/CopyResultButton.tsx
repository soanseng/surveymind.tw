"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  formatCopyText,
  type CopyGroup,
  type FormatCopyOptions,
} from "@/lib/format-copy";

type Status = "idle" | "copied" | "error";

interface CopyResultButtonProps {
  title: string;
  summary: string;
  groups?: CopyGroup[];
  url?: string;
  className?: string;
  label?: string;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy path
    }
  }
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

export default function CopyResultButton({
  title,
  summary,
  groups,
  url,
  className = "",
  label = "複製結果",
}: CopyResultButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const options: FormatCopyOptions = {
      title,
      summary,
      groups,
      url:
        url ??
        (typeof window !== "undefined" ? window.location.href : undefined),
    };
    const text = formatCopyText(options);
    const ok = await copyToClipboard(text);
    setStatus(ok ? "copied" : "error");
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus("idle"), 2000);
  }, [title, summary, groups, url]);

  const buttonLabel =
    status === "copied" ? "已複製 ✓" : status === "error" ? "複製失敗" : `📋 ${label}`;

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCopy}
      className={className}
      aria-label={label}
    >
      {buttonLabel}
    </Button>
  );
}
