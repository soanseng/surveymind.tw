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
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      const container =
        document.activeElement instanceof HTMLElement
          ? document.activeElement.closest<HTMLElement>("[data-print-root]")
          : null;

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
      onClick={handlePrint}
      className={`print:hidden ${className}`}
      aria-label={label}
    >
      🖨 {label}
    </Button>
  );
}
