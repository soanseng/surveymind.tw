"use client";

import { Button } from "@/components/ui/button";
import { printElement } from "@/lib/print";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

function resolvePrintTarget(trigger: HTMLElement): HTMLElement | null {
  // Walk up from the button to find the questionnaire result surface.
  // useResponsiveDialog tags DialogContent/DrawerContent with data-print-root.
  const host = trigger.closest<HTMLElement>("[data-print-root]");
  if (host) return host;

  // Fallback for pages that render a printable section outside the modal.
  const standalone = document.querySelector<HTMLElement>(
    "[data-print-root]",
  );
  if (standalone) return standalone;

  return document.querySelector<HTMLElement>("main") ?? document.body;
}

export default function PrintButton({
  label = "下載 PDF 給醫師",
  className = "",
}: PrintButtonProps) {
  const handlePrint = (trigger: HTMLElement) => {
    if (typeof window === "undefined") return;
    const target = resolvePrintTarget(trigger);
    if (target) {
      printElement(target);
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
