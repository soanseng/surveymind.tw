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
  title: "文心樂丞診所量表",
  description: "心理健康自我評估平台",
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
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold md:text-xl warm-text-primary">
                    文心樂丞診所
                  </h1>
                  <span className="text-sm text-muted-foreground hidden md:inline">
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
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  © 2024 文心樂丞診所 - 專業心理健康評估服務
                </p>
                <p className="text-xs text-muted-foreground">
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
