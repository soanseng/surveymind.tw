"use client";

import { Button } from "@/components/ui/button";
import { printElement } from "@/lib/print";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export default function PrintButton({
  label = "下載 PDF 給醫師",
  className = "",
}: PrintButtonProps) {
  const handlePrint = (trigger: HTMLElement) => {
    if (typeof window !== "undefined") {
      const container = trigger.closest<HTMLElement>("[data-print-root]");

      if (container) {
        printElement(container);
        return;
      }

      window.print();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={(event) => handlePrint(event.currentTarget)}
      className={`print:hidden ${className}`}
      aria-label={label}
    >
      🖨 {label}
    </Button>
  );
}
