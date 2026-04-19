import { Link, Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";

export default function App() {
  return (
    <div className={cn("relative min-h-screen bg-background font-sans antialiased")}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-2 md:py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              aria-label="回到首頁"
              className="flex min-w-0 items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <h1 className="truncate text-base font-semibold warm-text-primary sm:text-lg md:text-xl">
                台中文心樂丞、理解身心診所
              </h1>
              <span className="hidden whitespace-nowrap text-sm text-muted-foreground lg:inline">
                心理健康評估平台
              </span>
            </Link>
            <Navbar />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 border-t bg-muted/30 px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-3 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()}{" "}
              <a
                href="https://anxiety.com.tw"
                target="_blank"
                rel="noopener noreferrer"
                className="warm-text-primary hover:underline"
              >
                台中文心樂丞、理解身心診所
              </a>{" "}
              — 專業心理健康評估服務
            </p>
            <p className="text-xs">
              平台由{" "}
              <a
                href="https://anatomind.com"
                target="_blank"
                rel="noopener noreferrer"
                className="warm-text-secondary hover:underline"
              >
                陳璿丞醫師（Anatomind）
              </a>{" "}
              設計與維護
            </p>
            <p className="text-xs">本平台提供的評估工具僅供參考，不能取代專業醫學診斷</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
