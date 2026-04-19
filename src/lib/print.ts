const PRINT_MODE_ATTR = "data-print-mode";
const PRINT_HOST_ATTR = "data-print-host";

let cleanupTimer: number | null = null;

function clearPrintState() {
  document.body.removeAttribute(PRINT_MODE_ATTR);
  document
    .querySelectorAll<HTMLElement>(`[${PRINT_HOST_ATTR}="true"]`)
    .forEach((node) => node.remove());

  if (cleanupTimer !== null) {
    window.clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }
}

function buildPrintHost(element: HTMLElement) {
  const host = document.createElement("div");
  host.setAttribute(PRINT_HOST_ATTR, "true");
  host.appendChild(element.cloneNode(true));
  document.body.appendChild(host);
  return host;
}

export function printElement(element: HTMLElement) {
  clearPrintState();
  buildPrintHost(element);
  document.body.setAttribute(PRINT_MODE_ATTR, "true");

  const finishPrint = () => {
    clearPrintState();
    window.removeEventListener("afterprint", finishPrint);
    window.removeEventListener("focus", handleFocus);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

  const handleFocus = () => {
    window.setTimeout(finishPrint, 200);
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      window.setTimeout(finishPrint, 200);
    }
  };

  window.addEventListener("afterprint", finishPrint, { once: true });
  window.addEventListener("focus", handleFocus);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  cleanupTimer = window.setTimeout(finishPrint, 60_000);

  window.setTimeout(() => {
    window.print();
  }, 100);
}
