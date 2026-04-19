function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function collectStyles() {
  return Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((node) => node.outerHTML)
    .join("\n");
}

function buildPrintDocument(elementHtml: string, title: string) {
  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    ${collectStyles()}
    <style>
      @page {
        size: A4;
        margin: 15mm;
      }

      body {
        margin: 0;
        background: white;
        color: black;
        font-size: 11pt;
      }

      #print-root {
        width: 100%;
      }

      .print\\:hidden,
      [data-radix-dialog-overlay],
      [vaul-overlay],
      [data-vaul-overlay] {
        display: none !important;
      }

      .print-header,
      .print-footer,
      .print-section-label,
      .answer-detail-print-expand {
        display: block !important;
      }

      .print-footer {
        font-size: 9pt;
        color: #555;
        margin-top: 20mm;
        border-top: 1px solid #ccc;
        padding-top: 4mm;
      }

      .print-section-label {
        display: block !important;
        font-weight: bold;
        font-size: 10pt;
        border-bottom: 1px solid #999;
        margin-top: 8mm;
        margin-bottom: 3mm;
        padding-bottom: 1mm;
      }

      .answer-detail-item {
        break-inside: avoid;
      }
    </style>
  </head>
  <body class="${escapeHtml(document.body.className)}">
    <main id="print-root">${elementHtml}</main>
    <script>
      window.addEventListener("load", () => {
        setTimeout(() => {
          window.print();
          setTimeout(() => window.close(), 250);
        }, 150);
      });
    </script>
  </body>
</html>`;
}

export function printElement(element: HTMLElement, title?: string) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.open();
  printWindow.document.write(
    buildPrintDocument(
      element.outerHTML,
      title ?? document.title ?? "評估結果",
    ),
  );
  printWindow.document.close();
}
