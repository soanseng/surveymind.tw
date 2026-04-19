/**
 * Print flow for questionnaire result surfaces.
 *
 * Why clone instead of `window.print()` directly:
 * Result content lives inside a Radix Dialog or Vaul Drawer portal.
 * Those use `position: fixed` + `transform`, which iOS Safari's print
 * engine clips to the first page (multi-page output becomes blank).
 * We clone the result node as a static, flow-positioned child of <body>,
 * hide everything else in @media print, and print from there.
 *
 * Why only `afterprint` (no focus / visibilitychange):
 * On iOS Safari the system print sheet triggers `visibilitychange`
 * BEFORE printing starts. Listening to it tore the clone down too early
 * and produced blank pages. `afterprint` + a safety timer is enough.
 */

const PRINT_MODE_ATTR = "data-print-mode";
const PRINT_HOST_ATTR = "data-print-host";

const CLONE_REMOVE_SELECTORS = [
  "[data-radix-dialog-close]",
  "[data-radix-dialog-trigger]",
  "[data-vaul-drawer-trigger]",
  "[data-print-strip]",
  ".print\\:hidden",
].join(",");

let safetyTimer: number | null = null;
let active = false;

function teardown() {
  if (!active) return;
  active = false;
  document.body.removeAttribute(PRINT_MODE_ATTR);
  document
    .querySelectorAll<HTMLElement>(`[${PRINT_HOST_ATTR}="true"]`)
    .forEach((node) => node.remove());
  window.removeEventListener("afterprint", teardown);
  if (safetyTimer !== null) {
    window.clearTimeout(safetyTimer);
    safetyTimer = null;
  }
}

function sanitizeClone(root: HTMLElement) {
  root.querySelectorAll(CLONE_REMOVE_SELECTORS).forEach((node) => node.remove());
  root.querySelectorAll<HTMLElement>("[hidden]").forEach((node) => {
    node.removeAttribute("hidden");
  });
}

function buildHost(source: HTMLElement): HTMLElement {
  const host = document.createElement("div");
  host.setAttribute(PRINT_HOST_ATTR, "true");
  const clone = source.cloneNode(true) as HTMLElement;
  sanitizeClone(clone);
  host.appendChild(clone);
  document.body.appendChild(host);
  return host;
}

export function printElement(element: HTMLElement) {
  if (typeof window === "undefined") return;
  teardown();

  buildHost(element);
  document.body.setAttribute(PRINT_MODE_ATTR, "true");
  active = true;

  window.addEventListener("afterprint", teardown);
  safetyTimer = window.setTimeout(teardown, 60_000);

  // Wait one frame so @media print CSS has applied to the new host before
  // the browser snapshots the document for printing.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.print();
    });
  });
}
