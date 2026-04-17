import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import Navbar from "../components/navbar";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

export const metadata: Metadata = {
  title: "台中文心樂丞、理解身心診所 | 心理健康量表平台",
  description: "由台中文心樂丞、理解身心診所陳璿丞醫師提供的心理健康自我評估平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Cloudflare Web Analytics */}
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "51979ef5cfae49b4afac7518f3e38c73"}'></script>
        {/* End Cloudflare Web Analytics */}
      </head>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="relative min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-2 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <h1 className="text-base sm:text-lg md:text-xl font-semibold warm-text-primary truncate">
                    台中文心樂丞、理解身心診所
                  </h1>
                  <span className="text-sm text-muted-foreground hidden lg:inline whitespace-nowrap">
                    心理健康評估平台
                  </span>
                </div>
                <Navbar />
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t bg-muted/30 py-8 px-4 mt-16">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center space-y-3 text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()}{' '}
                  <a
                    href="https://anxiety.com.tw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="warm-text-primary hover:underline"
                  >
                    台中文心樂丞、理解身心診所
                  </a>
                  {' '}— 專業心理健康評估服務
                </p>
                <p className="text-xs">
                  平台由{' '}
                  <a
                    href="https://anatomind.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="warm-text-secondary hover:underline"
                  >
                    陳璿丞醫師（Anatomind）
                  </a>
                  {' '}設計與維護
                </p>
                <p className="text-xs">
                  本平台提供的評估工具僅供參考，不能取代專業醫學診斷
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
